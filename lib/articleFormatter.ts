/**
 * Tiện ích làm đẹp và định dạng thông minh cho bài viết tuyên truyền
 * Tự động chuyển đổi văn bản thuần (plain text) thành khối giao diện Tạp chí đẹp mắt
 * nếu tác giả quên dùng Rich Text Editor hoặc bài viết cũ chưa có thẻ HTML.
 */

export function formatSmartArticleContent(rawContent: string): string {
  if (!rawContent || typeof rawContent !== "string") {
    return "";
  }

  const trimmed = rawContent.trim();

  // Kiểm tra xem nội dung đã chứa các thẻ HTML cơ bản hay chưa
  const hasHtmlTags = /<(p|div|h[1-6]|ul|ol|li|table|blockquote|section|article)[^>]*>/i.test(trimmed);

  if (hasHtmlTags) {
    // Đã có mã HTML chuẩn, trả về trực tiếp để render
    return trimmed;
  }

  // NẾU LÀ VĂN BẢN THUẦN (PLAIN TEXT): Tự động định dạng thành khối thẻ luận điểm tạp chí
  // Phân tách các phần theo cú pháp số: "1. ", "2. ", "3. ", "4. "
  const sections = trimmed.split(/(?=(?:^|\n)\s*\d+[\.\)]\s+)/);

  const formattedBlocks: string[] = [];

  for (const sec of sections) {
    const cleanSec = sec.trim();
    if (!cleanSec) continue;

    // Kiểm tra xem đoạn này có phải mở đầu bằng số luận điểm không (ví dụ: 1. Bẫy nghiện...)
    const numberMatch = cleanSec.match(/^(\d+)[\.\)]\s+([^\n\:]+)(?:\:|\n|$)([\s\S]*)$/);

    if (numberMatch) {
      const num = numberMatch[1];
      const heading = numberMatch[2].trim();
      const body = numberMatch[3].trim();

      // Bóc tách các ý con bên trong (dựa trên dấu hai chấm hoặc ngắt dòng)
      const subPoints = body
        .split(/(?=[A-ZĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯ][a-zđàáâãèéêìíòóôõùúăđĩũơư\s]+:)/)
        .map((p) => p.trim())
        .filter(Boolean);

      let subListHtml = "";
      if (subPoints.length > 0) {
        subListHtml = `<ul class="space-y-3 mt-3 text-slate-700">
          ${subPoints
            .map((pt) => {
              const colonIdx = pt.indexOf(":");
              if (colonIdx !== -1) {
                const label = pt.substring(0, colonIdx).trim();
                const rest = pt.substring(colonIdx + 1).trim();
                return `<li class="flex items-start gap-2">
                  <span class="text-rose-500 font-bold mt-1 text-sm shrink-0">•</span>
                  <div>
                    <strong class="text-slate-900 font-bold">${label}:</strong>
                    <span> ${rest}</span>
                  </div>
                </li>`;
              }
              return `<li class="flex items-start gap-2">
                <span class="text-rose-500 font-bold mt-1 text-sm shrink-0">•</span>
                <span>${pt}</span>
              </li>`;
            })
            .join("")}
        </ul>`;
      } else if (body) {
        subListHtml = `<p class="mt-2 text-slate-700 leading-relaxed">${body}</p>`;
      }

      // Màu sắc viền theo thứ tự số
      const colorSchemes = [
        "bg-red-50/70 border-red-500 text-red-700",
        "bg-amber-50/70 border-amber-500 text-amber-800",
        "bg-sky-50/70 border-sky-500 text-sky-800",
        "bg-purple-50/70 border-purple-500 text-purple-800",
      ];
      const chosenColor = colorSchemes[(parseInt(num, 10) - 1) % colorSchemes.length];

      formattedBlocks.push(`
        <div class="my-6 p-5 sm:p-6 rounded-2xl border-l-4 shadow-xs ${chosenColor}">
          <h3 class="text-base sm:text-lg font-black mb-2 flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-full bg-white shadow-xs border border-current flex items-center justify-center text-xs font-black shrink-0">
              ${num}
            </span>
            <span>${heading}</span>
          </h3>
          ${subListHtml}
        </div>
      `);
    } else {
      // Đoạn văn thông thường
      const paragraphs = cleanSec.split(/\n\s*\n/).filter(Boolean);
      for (const p of paragraphs) {
        formattedBlocks.push(`<p class="mb-4 leading-relaxed text-slate-700 text-base">${p.trim()}</p>`);
      }
    }
  }

  return formattedBlocks.join("\n");
}
