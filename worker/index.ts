/**
 * Cloudflare Worker của noithatphome.net.
 * - Web vẫn là trang tĩnh trong out/ (phục vụ bởi Cloudflare Static Assets như trước).
 * - Worker chỉ chạy cho /api/* (xem run_worker_first trong wrangler.jsonc):
 *     POST /api/chat → hỏi Claude, trả lời tư vấn
 *     POST /api/lead → ghi thông tin khách (tên, SĐT, nhu cầu) vào Google Sheet
 *
 * Biến môi trường (Cloudflare → Workers → phome-website → Settings → Variables and Secrets):
 *   ANTHROPIC_API_KEY  (Secret, bắt buộc)
 *   SHEET_WEBHOOK_URL  (Secret, URL Web App của Google Apps Script)
 *   SHEET_SECRET       (Secret, chuỗi bí mật trùng với SECRET trong Apps Script)
 *   CHAT_MODEL         (tuỳ chọn, mặc định claude-sonnet-5-5)
 */
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, linkProducts } from "./prompt";

interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  ANTHROPIC_API_KEY?: string;
  SHEET_WEBHOOK_URL?: string;
  SHEET_SECRET?: string;
  CHAT_MODEL?: string;
  CHAT_LIMITER?: RateLimiter;
}

type ChatTurn = { role: "user" | "assistant"; content: string };

const DEFAULT_MODEL = "claude-sonnet-5-5";
const MAX_TURNS = 24; // số tin nhắn gần nhất gửi lên AI
const MAX_CHARS = 1500; // độ dài tối đa mỗi tin nhắn
const ALLOWED_HOSTS = ["noithatphome.net", "www.noithatphome.net", "localhost", "127.0.0.1"];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Chỉ nhận request gửi từ chính website (chặn trang khác dùng ké API) */
function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOSTS.includes(host) || host.endsWith(".workers.dev");
  } catch {
    return false;
  }
}

async function rateLimited(req: Request, env: Env, bucket: string) {
  if (!env.CHAT_LIMITER) return false;
  const ip = req.headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await env.CHAT_LIMITER.limit({ key: `${bucket}:${ip}` });
  return !success;
}

function cleanTurns(input: unknown): ChatTurn[] | null {
  if (!Array.isArray(input)) return null;
  const turns: ChatTurn[] = [];
  for (const m of input.slice(-MAX_TURNS)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (content) turns.push({ role: m.role, content });
  }
  // API yêu cầu tin đầu tiên là của khách
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return turns;
}

async function handleChat(req: Request, env: Env) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: "not_configured" }, 503);
  if (await rateLimited(req, env, "chat")) return json({ error: "rate_limited" }, 429);

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const messages = cleanTurns(body.messages);
  if (!messages) return json({ error: "bad_request" }, 400);

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 45_000 });
  try {
    const response = await client.beta.messages.create({
      model: env.CHAT_MODEL || DEFAULT_MODEL,
      max_tokens: 4000,
      output_config: { effort: "low" }, // trò chuyện tư vấn: trả lời nhanh, tiết kiệm
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default", // nếu model từ chối nhầm, API tự chạy lại bằng model dự phòng
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages,
    });

    if (response.stop_reason === "refusal") return json({ error: "refusal" }, 200);

    let reply = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    const wantsLead = reply.includes("[[LEAD]]");
    reply = linkProducts(reply.replaceAll("[[LEAD]]", "")).trim();
    if (!reply) return json({ error: "empty" }, 502);
    return json({ reply, lead: wantsLead });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 429);
    if (err instanceof Anthropic.APIError) {
      console.error("Claude API error", err.status, err.message);
      return json({ error: "ai_error" }, 502);
    }
    console.error("Chat error", err);
    return json({ error: "ai_error" }, 502);
  }
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/[\s.\-()]/g, "").replace(/^\+?84/, "0");
  return /^0[35789]\d{8}$/.test(digits) ? digits : null;
}

async function handleLead(req: Request, env: Env) {
  if (!env.SHEET_WEBHOOK_URL || !env.SHEET_SECRET) return json({ error: "not_configured" }, 503);
  if (await rateLimited(req, env, "lead")) return json({ error: "rate_limited" }, 429);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const phone = normalizePhone(str(body.phone, 20));
  if (!phone) return json({ error: "invalid_phone" }, 400);

  const lead = {
    secret: env.SHEET_SECRET,
    time: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    name: str(body.name, 100),
    phone,
    need: str(body.need, 500),
    page: str(body.page, 300),
    transcript: str(body.transcript, 8000),
  };

  try {
    const res = await fetch(env.SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
      redirect: "follow",
    });
    const text = await res.text();
    if (!res.ok || !text.includes('"ok":true')) {
      console.error("Sheet webhook failed", res.status, text.slice(0, 300));
      return json({ error: "sheet_error" }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("Sheet webhook error", err);
    return json({ error: "sheet_error" }, 502);
  }
}

const worker = {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(req.url);

    if (pathname === "/api/chat" || pathname === "/api/lead") {
      if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
      if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
      return pathname === "/api/chat" ? handleChat(req, env) : handleLead(req, env);
    }
    if (pathname.startsWith("/api/")) return json({ error: "not_found" }, 404);

    // Mọi đường dẫn khác: trả file tĩnh như cũ
    return env.ASSETS.fetch(req);
  },
};

export default worker;
