// Trích dữ liệu từ bản clone web cũ (noithatphome.com — nay là noithatphome.net) sang JSON + ảnh cho Next.js
//
// Cách chạy (từ thư mục nextjs-app):   npm run extract
// Cần thư mục bản clone ở ../raw-clone/raw-clone (cạnh nextjs-app) — không nằm trong git.
// Có thể chỉ định nơi khác:            RAW_CLONE_DIR="D:/duong/dan/noithatphome.com" npm run extract
//
// Kết quả: src/data/*.json và ảnh trong public/images/{sp,slider,banner,tin-tuc,chinh-sach,gioi-thieu}.
// Ảnh đã có sẽ không bị chép đè.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW = process.env.RAW_CLONE_DIR || path.resolve(APP, "../raw-clone/raw-clone/noithatphome.com");
if (!fs.existsSync(RAW)) {
  console.error(`Không tìm thấy bản clone web cũ tại: ${RAW}\nĐặt biến RAW_CLONE_DIR trỏ tới thư mục noithatphome.com.`);
  process.exit(1);
}
const DATA = path.join(APP, "src/data");
const PUB = path.join(APP, "public");
fs.mkdirSync(DATA, { recursive: true });

// ---------- tiện ích ----------
const NAMED = { nbsp: " ", amp: "&", quot: '"', lt: "<", gt: ">", apos: "'", ndash: "–", mdash: "—", hellip: "…", laquo: "«", raquo: "»", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", times: "×", deg: "°", bull: "•" };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
const clean = (s) => decode(s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/[ \t\u00a0]+/g, " ").replace(/ *\n */g, "\n").trim();
const read = (f) => fs.readFileSync(path.join(RAW, f), "utf8");
/** Lấy đoạn sau `a`, cắt ở dấu mốc kết thúc xuất hiện SỚM NHẤT trong `ends` */
const cutAt = (s, a, ends) => {
  const i = s.indexOf(a);
  if (i < 0) return "";
  const from = i + a.length;
  const stops = ends
    .map((e) => s.indexOf(e, from))
    .filter((j) => j >= 0)
    // mốc dạng class="..." nằm giữa thẻ → lùi về dấu "<" mở thẻ để không sót lại mẩu "<div"
    .map((j) => {
      const lt = s.lastIndexOf("<", j);
      return lt >= from && !s.slice(lt, j).includes(">") ? lt : j;
    });
  return s.slice(from, stops.length ? Math.min(...stops) : undefined);
};
const between = (s, a, b) => {
  const i = s.indexOf(a);
  if (i < 0) return "";
  const j = b ? s.indexOf(b, i + a.length) : -1;
  return s.slice(i + a.length, j < 0 ? undefined : j);
};
const meta = (html, prop) => {
  const m = html.match(new RegExp(`itemprop="${prop}" content="([^"]*)"`));
  return m ? decode(m[1]).trim() : "";
};

const skipped = []; // file "ảnh" bị bỏ qua vì không phải ảnh thật

// Ảnh: đường dẫn tương đối/tuyệt đối trong HTML -> file cục bộ -> copy vào public
function localFile(src) {
  if (!src || src.startsWith("data:")) return null;
  let p = src.split(/[?#]/)[0];
  p = p.replace(/^https?:\/\/bizweb\.dktcdn\.net\//, "../bizweb.dktcdn.net/").replace(/^\/\/bizweb\.dktcdn\.net\//, "../bizweb.dktcdn.net/");
  if (/^https?:/.test(p)) return null;
  const abs = path.resolve(RAW, p);
  return fs.existsSync(abs) && fs.statSync(abs).isFile() ? abs : null;
}
// Nhận diện ảnh theo vài byte đầu: bản clone đôi khi lưu ảnh lỗi thành trang HTML (.html)
// hoặc lưu ảnh thật với đuôi lạ (.del) → bỏ file không phải ảnh, dùng đuôi theo nội dung.
function imageExt(abs) {
  const fd = fs.openSync(abs, "r");
  const b = Buffer.alloc(12);
  fs.readSync(fd, b, 0, 12, 0);
  fs.closeSync(fd);
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ".jpg";
  if (b.toString("hex", 0, 4) === "89504e47") return ".png";
  if (b.toString("ascii", 0, 3) === "GIF") return ".gif";
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return ".webp";
  return null;
}

/** Chép ảnh vào public; trả về null nếu file nguồn không phải ảnh */
function copyImg(abs, destDir, name) {
  const ext = imageExt(abs);
  if (!ext) {
    skipped.push(path.relative(RAW, abs));
    return null;
  }
  const rel = `${destDir}/${name}${ext}`;
  const out = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (!fs.existsSync(out)) fs.copyFileSync(abs, out);
  return "/" + rel.replace(/\\/g, "/");
}

// HTML giàu định dạng -> HTML sạch (chỉ giữ thẻ cơ bản, bỏ toàn bộ style)
function sanitize(html, imgDir) {
  let n = 0;
  html = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->|<iframe[\s\S]*?<\/iframe>/gi, "");
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = (tag.match(/\ssrc="([^"]+)"/) || [])[1];
    const lazy = (tag.match(/data-(?:src|lazy)="([^"]+)"/) || [])[1];
    const w = +((tag.match(/original-width="(\d+)"/) || [])[1] || 999);
    if (w < 60) return ""; // icon điện thoại/email trang trí
    const abs = localFile(src) || localFile(lazy);
    if (!abs) return "";
    const alt = decode((tag.match(/alt="([^"]*)"/) || [])[1] || "");
    const src2 = copyImg(abs, imgDir, n + 1);
    if (!src2) return "";
    n++;
    return `<img src="${src2}" alt="${alt.replace(/"/g, "&quot;")}">`;
  });
  const MAP = { h1: "h2", h2: "h2", h3: "h3", h4: "h4", h5: "h4", h6: "h4", p: "p", ul: "ul", ol: "ol", li: "li", strong: "strong", b: "strong", em: "em", i: "em", br: "br", table: "table", thead: "thead", tbody: "tbody", tr: "tr", td: "td", th: "th", blockquote: "blockquote" };
  html = html.replace(/<(\/?)([a-z0-9]+)\b[^>]*?(\/?)>/gi, (m, close, tag) => {
    tag = tag.toLowerCase();
    if (tag === "img") return m;
    const t = MAP[tag];
    if (!t) return "";
    if (t === "br") return "<br>";
    return `<${close}${t}>`;
  });
  html = decode(html).replace(/&/g, "&amp;").replace(/&amp;(quot|amp|lt|gt);/g, "&$1;");
  // dọn thẻ rỗng và khoảng trắng
  for (let k = 0; k < 3; k++)
    html = html.replace(/<(p|li|strong|em|h2|h3|h4|ul|ol)>(?:\s|<br>)*<\/\1>/g, "").replace(/<strong>\s*<\/strong>/g, "");
  return html.replace(/[ \t\u00a0]+/g, " ").replace(/\n\s*\n+/g, "\n").replace(/(<br>\s*)+<\/(p|li)>/g, "</$2>").trim();
}

// ---------- danh mục ----------
const categories = [
  { slug: "ke-lo-vi-song-ke-may-giat", name: "Kệ lò vi sóng, kệ máy giặt", page: null, re: /lo-vi-song|ke-may-giat/, force: true },
  { slug: "ke-sat-trang-tri", name: "Kệ sắt trang trí", page: "ke-sat-trang-tri.html", re: /ke-trang-tri|ke-trung-bay|ke-tung-bay|khung-sat/ },
  { slug: "tu-ao", name: "Tủ áo", page: "tu-ao.html", re: /tu-ao|tu-quan-ao/ },
  { slug: "tu-bep", name: "Tủ bếp", page: "tu-bep-go-cong-nghiep.html", re: /tu-bep/ },
  { slug: "giuong-ngu", name: "Giường ngủ", page: "giuong-ngu.html", re: /giuong|^tab-|tab-dau/ },
  { slug: "tu-giay", name: "Tủ giày thông minh", page: "tu-giay-thong-minh.html", re: /giay|tu-gay|ke-tu-gay/ },
  { slug: "ban-hoc-ban-lam-viec", name: "Bàn học, bàn làm việc", page: "ban-hoc-ban-lam-viec.html", re: /ban-hoc|ban-lam-viec/ },
  { slug: "ke-tivi", name: "Kệ tivi", page: "ke-tivi.html", re: /ke-tivi|ke-tv|phktv/ },
  { slug: "ke-sach", name: "Kệ sách", page: "ke-sach-thong-minh.html", re: /ke-sach/ },
  { slug: "quay-le-tan", name: "Quầy lễ tân, quầy thu ngân", page: null, re: /quay-le-tan|quay-tinh-tien/ },
  { slug: "noi-that-can-ho", name: "Nội thất căn hộ", page: "noi-that-can-ho.html", re: /ban-trang-diem|sofa|ban-an|ghe|ke-do-choi/ },
  { slug: "phong-xong-hoi", name: "Phòng xông hơi & đá muối", page: null, re: /xong-hoi|da-muoi/ },
];
const pageCat = new Map(); // slug sản phẩm -> danh mục (từ trang danh mục cũ)
pageCat.set("__", "");
for (const [file, cat] of [["tab-dau-giuong.html", "giuong-ngu"]])
  if (fs.existsSync(path.join(RAW, file)))
    for (const m of read(file).matchAll(/class="pro-name">\s*<a href="([a-z0-9-]+)\.html"/g)) pageCat.set(m[1], cat);
for (const c of categories) {
  if (!c.page || !fs.existsSync(path.join(RAW, c.page))) continue;
  for (const m of read(c.page).matchAll(/class="pro-name">\s*<a href="([a-z0-9-]+)\.html"/g))
    if (!pageCat.has(m[1])) pageCat.set(m[1], c.slug);
}

// ---------- sản phẩm ----------
const files = fs.readdirSync(RAW).filter((f) => f.endsWith(".html"));
const products = [];
const warn = [];
for (const f of files) {
  const html = read(f);
  if (!html.includes('itemtype="http://schema.org/Product"')) continue;
  const slug = f.replace(/\.html$/, "");
  const name = meta(html, "name") || clean(between(html, '<h1 class="title-head">', "</h1>"));
  const sku = meta(html, "sku");
  const price = +meta(html, "price") || 0;

  const priceBox = between(html, 'class="price-box clearfix"', "inventory_quantity");
  const oldM = priceBox.match(/(?:old-price|compare-price)[\s\S]*?([\d.]+)₫/);
  const oldPrice = oldM ? +oldM[1].replace(/\./g, "") : 0;

  // ảnh gallery
  const slider = between(html, 'class="slider slider-for"', 'class="slider-has-video');
  const imgs = [];
  for (const m of slider.matchAll(/<a href="([^"]+)"[^>]*>\s*<img[^>]*data-lazy="([^"]+)"/g)) {
    const abs = localFile(m[1]) || localFile(m[2]);
    const out = abs && imgs.length < 8 ? copyImg(abs, `images/sp/${slug}`, imgs.length + 1) : null;
    if (out) imgs.push(out);
  }
  if (!imgs.length) {
    const og = (html.match(/og:image" content="([^"]+)"/) || [])[1];
    const abs = localFile(og) || localFile(og?.replace("/thumb/grande", ""));
    const out = abs ? copyImg(abs, `images/sp/${slug}`, 1) : null;
    if (out) imgs.push(out);
  }
  if (!imgs.length) { warn.push(`no image: ${slug}`); continue; }

  // thông số: tóm tắt + mục THÔNG SỐ KỸ THUẬT trong mô tả
  const specs = [];
  const addSpec = (t) => {
    const i = t.indexOf(":");
    if (i < 1 || i > 40) return false;
    const label = t.slice(0, i).trim().replace(/\s+/g, " ");
    const value = t.slice(i + 1).trim().replace(/\s+/g, " ");
    if (!value || /liên hệ|hotline|email|website|facebook|địa chỉ/i.test(label)) return false;
    if (!specs.some((s) => s.label.toLowerCase() === label.toLowerCase())) specs.push({ label: label.replace(/^Mã$/i, "Mã sản phẩm"), value });
    return true;
  };
  const summary = between(html, 'class="rte description rte-summary"', "</div>");
  for (const m of summary.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) addSpec(clean(m[1]));
  if (!specs.length) for (const line of clean(summary).split("\n")) addSpec(line);

  // mô tả: các đoạn văn trong tab-1, dừng ở phần liên hệ
  const tab = between(html, '<div id="tab-1"', '<div id="tab-2"');
  const description = [];
  let mode = "desc";
  for (const m of tab.matchAll(/<(p|li|h[1-4])[^>]*>([\s\S]*?)<\/\1>/g)) {
    const t = clean(m[2]);
    if (!t) continue;
    if (/LIÊN HỆ|ĐỊA CHỈ|HOTLINE/i.test(t) && t.length < 60) break;
    if (/THÔNG SỐ KỸ THUẬT/i.test(t)) { mode = "spec"; continue; }
    if (mode === "spec" && m[1] === "li") { addSpec(t); continue; }
    if (/^(hotline|email|website|facebook|zalo|địa chỉ)\s*:/i.test(t) || /noithatphome\.com|0934\s?787\s?123/.test(t)) continue;
    if (!description.includes(t)) description.push(t);
  }

  const cat =
    categories.find((c) => c.force && c.re.test(slug))?.slug ||
    pageCat.get(slug) ||
    categories.find((c) => c.re.test(slug))?.slug ||
    categories.find((c) => c.name.toLowerCase() === meta(html, "category").toLowerCase())?.slug ||
    "khac";
  products.push({ slug, name, sku, price, oldPrice: oldPrice > price ? oldPrice : 0, category: cat, images: imgs, specs, description: description.slice(0, 20) });
}
products.sort((a, b) => categories.findIndex((c) => c.slug === a.category) - categories.findIndex((c) => c.slug === b.category) || a.name.localeCompare(b.name, "vi"));

// ---------- bài viết ----------
const KEEP_POSTS = [
  "9-sai-lam-khi-lam-tu-bep-lan-dau-khien-nhieu-gia-dinh-tien-mat-tat-mang",
  "cach-chon-tu-bep-phu-hop-ngan-sach-goi-y-tu-kinh-nghiem-thuc-te",
  "50-mau-tu-bep-dep-duoc-ua-chuong-nhat-2025-1",
  "20-mau-thiet-ke-khuyen-khich-tinh-than-hoc-tap-cho-tre",
  "20-mau-giuong-tang-cho-be-co-cau-truot-dep",
  "cac-mau-giuong-ngu-o-to-dep-danh-cho-be-trai-hot-2023",
  "trang-tri-noi-that-tre-em-can-luu-y-nhung-gi",
];
const posts = [];
for (const slug of KEEP_POSTS) {
  const html = read(slug + ".html");
  const title = meta(html, "headline") || clean(between(html, '<h1 class="title-head">', "</h1>"));
  const [d, mo, y] = meta(html, "datePublished").split("-");
  // Một số bài không có tag_article → phải dừng ở thanh "Bạn đang xem"/footer,
  // nếu không sẽ kéo theo bình luận spam, sidebar, chân trang Sapo và popup giỏ hàng.
  let body = cutAt(html, 'class="article-details evo-toc-content">', ['class="tag_article"', 'class="evo-article-toolbar"', "<footer"]);
  body = sanitize(body, `images/tin-tuc/${slug}`);
  // bỏ thẻ h2 đầu nếu trùng tiêu đề
  body = body.replace(/^<h2>[^<]*<\/h2>/, (h) => (clean(h).length > 10 ? h : ""));
  const cover = (body.match(/<img src="([^"]+)"/) || [])[1] || null;
  const excerpt = clean(body.replace(/<h[234]>[\s\S]*?<\/h[234]>/g, "")).replace(/\n/g, " ").slice(0, 180).replace(/\s\S*$/, "") + "…";
  posts.push({ slug: slug.replace(/-1$/, ""), title, date: y ? `${y}-${mo}-${d}` : "", cover, excerpt, body });
}
posts.sort((a, b) => b.date.localeCompare(a.date));

// ---------- trang chính sách ----------
const POLICIES = [
  ["chinh-sach-ban-hang", "Chính sách bán hàng"],
  ["chinh-sach-giao-hang-lap-dat", "Chính sách giao hàng & lắp đặt"],
  ["chinh-sach-bao-hanh-bao-tri", "Chính sách bảo hành & bảo trì"],
  ["chinh-sach-doi-tra", "Chính sách đổi trả"],
  ["huong-dan", "Hướng dẫn mua hàng"],
  ["quy-dinh-thanh-toan", "Hướng dẫn thanh toán"],
  ["dieu-khoan", "Điều khoản dịch vụ"],
];
// Thay chuỗi và báo lỗi nếu không tìm thấy (tránh âm thầm bỏ qua khi web cũ đổi nội dung)
function mustReplace(body, from, to, label) {
  if (!body.includes(from)) throw new Error(`Không tìm thấy đoạn cần sửa (${label}): ${from.slice(0, 60)}`);
  return body.split(from).join(to);
}

// Chỉnh sửa nội dung chính sách theo yêu cầu của P-Home (áp dụng mỗi lần trích lại)
const POLICY_FIXES = {
  // Hướng dẫn cũ mô tả giỏ hàng/tài khoản của Sapo — web mới hiển thị quy trình đặt hàng
  // riêng (BUY_STEPS trong src/lib/site.ts), nên không giữ nội dung cũ.
  "huong-dan": () => "",
  "quy-dinh-thanh-toan": (b) => {
    // Mục 1: chỉ còn thanh toán khi nhận hàng hoặc chuyển khoản (web mới không có VNPAY/quẹt thẻ)
    const start = b.indexOf("<p>1. Chấp nhận các hình thức thanh toán</p>");
    const end = b.indexOf("<p>2. Qui định cho từng loại đơn hàng</p>");
    if (start < 0 || end < 0) throw new Error("Không tìm thấy mục 1 của trang Hướng dẫn thanh toán");
    b =
      b.slice(0, start) +
      "<p>1. Hình thức thanh toán</p>\n<p>P-home chấp nhận hai hình thức thanh toán:</p>\n<ul>\n<li>Thanh toán khi nhận hàng (tiền mặt).</li>\n<li>Chuyển khoản ngân hàng (thông tin tài khoản tại mục 3).</li></ul>\n" +
      b.slice(end);
    // bản gốc thiếu chữ "thanh": "Quý khách hàng toán bằng thẻ hoặc tiền mặt"
    b = mustReplace(b, "hàng toán bằng thẻ hoặc tiền mặt", "hàng thanh toán bằng tiền mặt hoặc chuyển khoản", "mục 2");
    b = mustReplace(b, "Gotrangtri.vn", "P-home", "tên công ty sai");
    b = mustReplace(b, "cho P-hme", "cho P-home", "lỗi gõ");
    return b;
  },
};

const policies = POLICIES.map(([slug, title]) => {
  const html = read(slug + ".html");
  let body = sanitize(between(html, 'class="content-page rte">', "<footer"), `images/chinh-sach/${slug}`);
  if (POLICY_FIXES[slug]) body = POLICY_FIXES[slug](body);
  return { slug, title, body };
});

// ---------- giới thiệu + bản đồ ----------
// Email liên hệ chính thức: kientruc.p.home@gmail.com
const about = sanitize(between(read("gioi-thieu.html"), 'class="content-page rte">', "<footer"), "images/gioi-thieu").replace(
  /cskh\.phome@gmail\.com/g,
  "kientruc.p.home@gmail.com",
);
const mapSrc = decode((read("lien-he.html").match(/<iframe[^>]*src="(https:\/\/www\.google\.com\/maps\/embed[^"]+)"/) || [])[1] || "");

const usedCats = categories.filter((c) => products.some((p) => p.category === c.slug)).map(({ slug, name }) => ({ slug, name }));
if (products.some((p) => p.category === "khac")) usedCats.push({ slug: "khac", name: "Sản phẩm khác" });

// ---------- làm sạch & kiểm tra trước khi ghi ----------
// Tên miền mới của web
const OLD_DOMAIN = /noithatphome\.com/g;
const NEW_DOMAIN = "noithatphome.net";
// Dấu vết nền tảng Sapo / giỏ hàng / bình luận không được phép lọt vào nội dung
const FORBIDDEN = [/sapo/i, /bizweb/i, /giỏ hàng/i, /thêm vào giỏ/i, /tổng tiền/i, /bình luận/i, /bạn đang xem/i, /đăng ký nhận bản tin/i];

const w = (f, d) => {
  const json = JSON.stringify(d, null, 1).replace(OLD_DOMAIN, NEW_DOMAIN);
  const bad = FORBIDDEN.filter((re) => re.test(json));
  if (bad.length) {
    const re = bad[0];
    const m = json.match(re);
    const at = json.indexOf(m[0]);
    throw new Error(`${f} còn nội dung thừa từ web cũ (${bad.join(", ")}): …${json.slice(Math.max(0, at - 80), at + 40)}…`);
  }
  fs.writeFileSync(path.join(DATA, f), json + "\n");
};
w("products.json", products);
w("categories.json", usedCats);
w("posts.json", posts);
w("policies.json", policies);
w("site.json", { aboutHtml: about, mapSrc });

// ảnh slider + banner của giao diện cũ
const BZ = path.resolve(RAW, "../bizweb.dktcdn.net");
for (let i = 1; i <= 5; i++) copyImg(path.join(BZ, `thumb/grande/100/480/923/themes/904049/assets/slider_${i}ddec.jpg`), "images/slider", i);
copyImg(path.join(BZ, "100/480/923/files/banner-ke-trang-tri-p-home-gia-xuong3d41.jpg"), "images/banner", "ke-trang-tri");
copyImg(path.join(BZ, "100/480/923/files/banner-he-tu-bep-p-home8722.jpg"), "images/banner", "tu-bep");
copyImg(path.join(BZ, "100/480/923/files/banner-cty-noi-that-p-homebded.png"), "images/banner", "cong-ty");
copyImg(path.join(BZ, "100/480/923/themes/904049/assets/faviconddec.png"), "images", "favicon");

// ---------- xoá ảnh cũ không còn dùng trong các thư mục do script tạo ----------
{
  const all = ["products.json", "posts.json", "policies.json", "site.json"].map((f) => fs.readFileSync(path.join(DATA, f), "utf8")).join("");
  let removed = 0;
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        walk(p);
        if (!fs.readdirSync(p).length) fs.rmdirSync(p);
      } else if (!all.includes("/" + path.relative(PUB, p).split(path.sep).join("/"))) {
        fs.unlinkSync(p);
        removed++;
      }
    }
  };
  for (const dir of ["sp", "tin-tuc", "chinh-sach", "gioi-thieu"]) walk(path.join(PUB, "images", dir));
  if (removed) console.log(`Đã xoá ${removed} ảnh cũ không còn dùng.`);
}

console.log("products", products.length, "| posts", posts.length, "| policies", policies.length);
console.log(Object.entries(products.reduce((a, p) => ((a[p.category] = (a[p.category] || 0) + 1), a), {})));
console.log("no specs:", products.filter((p) => !p.specs.length).length, "| no desc:", products.filter((p) => !p.description.length).length, "| contact price:", products.filter((p) => !p.price).length);
console.log("khac:", products.filter((p) => p.category === "khac").map((p) => p.slug).join(", "));
console.log("map:", mapSrc ? "ok" : "missing", "| about chars:", about.length);
console.log(warn.join("\n"));
if (skipped.length) console.log(`Bỏ qua ${skipped.length} file không phải ảnh (ảnh lỗi trong bản clone).`);
