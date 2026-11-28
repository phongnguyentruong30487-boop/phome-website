/**
 * Nhận thông tin khách từ chatbot P-Home và ghi vào Google Sheet.
 * Cách cài: xem tools/chatbot/HUONG-DAN.md
 *
 * ĐỔI chuỗi bên dưới thành một chuỗi bí mật của riêng bạn (dài, khó đoán),
 * và nhập đúng chuỗi đó vào biến SHEET_SECRET trên Cloudflare.
 */
const SECRET = "DOI-CHUOI-BI-MAT-NAY";
const SHEET_NAME = "Lead chatbot";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return reply({ ok: false, error: "forbidden" });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Thời gian", "Tên", "Số điện thoại", "Nhu cầu", "Trang", "Nội dung chat", "Trạng thái"]);
      sheet.setFrozenRows(1);
      sheet.getRange("A1:G1").setFontWeight("bold");
    }

    // Thêm dấu ' để Sheet giữ số 0 đầu SĐT; chặn công thức (=, +, -, @) do khách nhập
    const safe = (v) => {
      const s = String(v || "");
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };
    sheet.appendRow([
      safe(data.time),
      safe(data.name),
      "'" + String(data.phone || ""),
      safe(data.need),
      safe(data.page),
      safe(data.transcript),
      "Mới",
    ]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
