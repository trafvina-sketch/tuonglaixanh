# 📋 BẢNG THEO DÕI TIẾN ĐỘ DỰ ÁN: LÁ CHẮN HỌC ĐƯỜNG
**Cổng thông tin & Trợ lý AI Phòng Chống Ma Túy Học Đường (THCS)**  
*Phong cách: Dân Gian Việt Nam (Mộc Bản, Giấy Dó, Đỏ Son, Trạng Tí Cố Vấn)*  
*Hạ tầng: Next.js 14 + Vercel + Supabase Free + Agnes AI (agnes-2.5-flash)*

---

## 📌 LỊCH SỬ THỰC HIỆN & TIẾN TRÌNH CÔNG VIỆC

| Ngày & Giờ | Hạng mục | Chi tiết thực hiện | Trạng thái |
|---|---|---|---|
| 2026-09-22 15:00 | Khởi tạo ý tưởng & Đề xuất kiến trúc | Phân tích bài toán học sinh THCS, ma túy ngụy trang, tích hợp Agnes AI | ✅ Hoàn thành |
| 2026-09-22 15:10 | Thống nhất yêu cầu kỹ thuật 0đ | Supabase DB Free + Vercel + Convert WebP trình duyệt + Link YouTube | ✅ Hoàn thành |
| 2026-09-22 15:25 | Đổi mới phong cách UI/UX | Chuyển sang phong cách Dân Gian Việt Nam (Giấy Dó, Đỏ Son, Trạng Tí) | ✅ Hoàn thành |
| 2026-09-22 15:30 | Kết nối Supabase & Quét tìm Region | Phát hiện đúng Pooler Region `ap-northeast-2` (Seoul, Korea) cho dự án | ✅ Hoàn thành |
| 2026-09-22 15:34 | Khởi tạo Database Schema & Storage | Chạy migration tạo 4 bảng, RLS policies và Storage Bucket `app-assets` | ✅ Hoàn thành |
| 2026-09-22 15:36 | Nạp dữ liệu mộc bản mẫu (Seed Data) | Đã nạp 5 loại ma túy ngụy trang, 3 video YouTube, 2 bài viết tuyên truyền | ✅ Hoàn thành |
| 2026-09-22 15:37 | Xây dựng toàn bộ giao diện & tính năng | Code xong Navbar, Footer, Trang chủ, Nhận diện, Video, Agnes AI, Admin | ✅ Hoàn thành |
| 2026-09-22 15:48 | Nâng cấp quản lý Ảnh Banner & Thumbnail | Bổ sung tính năng Thêm - Thay - Xóa ảnh Banner & Thumbnail ma túy ngụy trang | ✅ Hoàn thành |
| 2026-09-22 15:56 | Sửa lỗi Storage RLS & Đồng bộ Upload | Cấp quyền RLS `storage.objects` + Xây dựng API Route `/api/upload` (Service Role) đồng bộ toàn diện | ✅ Hoàn thành |
| 2026-09-22 16:12 | Khắc phục triệt để lỗi không hiện ảnh | Tự động lưu tức thì vào Database (`site_settings`) khi upload, tạo `ImageWithFallback` chống vỡ ảnh | ✅ Hoàn thành |
| 2026-09-22 17:18 | Ra mắt Hệ Thống Khảo Thí Trạng Nguyên | Tạo bảng `quiz_questions`, Widget Đấu Trí 60s trang chủ, Bằng Khen Triện Son, Tab Quản trị CMS | ✅ Hoàn thành |

---

## 🏗️ CHI TIẾT CÁC HẠNG MỤC THEO CHECKLIST

### PHA 1: HẠ TẦNG CỐT LÕI & CƠ SỞ DỮ LIỆU (FOUNDATION & DATABASE)
- [x] **1.1.** Kết nối & xác thực Supabase URL & API Keys (`pjegwrjxooaemxlpkwxy`).
- [x] **1.2.** Khởi tạo cấu trúc bảng Database trên Supabase (`articles`, `videos`, `narcotics_catalog`, `anonymous_reports`, `site_settings`, `quiz_questions`).
- [x] **1.3.** Thiết lập cấu trúc dự án Next.js 14 App Router + TypeScript + Tailwind CSS.
- [x] **1.4.** Cấu hình biến môi trường an toàn `.env.local` (Bảo mật Service Role & Agnes AI).
- [x] **1.5.** Tạo module kết nối Supabase Client (`lib/supabase.ts` và `lib/supabaseAdmin.ts`).
- [x] **1.6.** Thiết lập Supabase Storage Bucket `app-assets` & Cấp quyền RLS cho `storage.objects`.
- [x] **1.7.** Xây dựng API Route trung chuyển tải file an toàn `/api/upload` (Service Role).

### PHA 2: HỆ THỐNG GIAO DIỆN DÂN GIAN ĐẠI VIỆT (FOLK DESIGN SYSTEM)
- [x] **2.1.** Cấu hình bảng màu Di sản (Giấy Dó `#F8F4EA`, Mực Tàu `#1E1B18`, Đỏ Son `#9E2A2B`, Vàng Lúa `#C5892F`).
- [x] **2.2.** Khung viền mộc bản thủ công & Hiệu ứng con dấu Triện Son (`seal-stamp`).
- [x] **2.3.** Thanh điều hướng Header & Menu Responsive chuẩn chỉnh cho cả Smartphone và PC.
- [x] **2.4.** Nút Cứu Viện Khẩn Cấp (Đường dây nóng 111 & 113) luôn ghim sẵn sàng.

### PHA 3: TÍNH NĂNG DÀNH CHO HỌC SINH THCS (STUDENT EXPERIENCES)
- [x] **3.1.** **Trang Chủ Hịch Truyền:** Banner chiếu thư có ảnh minh họa sống động bên phải, Bảng tin nóng (`app/page.tsx`).
- [x] **3.2.** **Bí Kíp Tự Vệ:** Module 4 bước từ chối vàng (Lắc đầu - Cớ hoãn binh - Đổi trận - Rút lui).
- [x] **3.3.** **Bách Thảo Trấn Ma:** Thư viện lật thẻ nhận diện ma túy ngụy trang có ảnh Thumbnail trực quan (`app/nhan-dien/page.tsx`).
- [x] **3.4.** **Chiếu Thư Video:** Nhúng trình phát YouTube trực tiếp theo danh mục (`app/video/page.tsx`).
- [x] **3.5.** **Trạng Tí Cố Vấn (Agnes AI):** Khung chat ẩn danh 100%, tích hợp model `agnes-2.5-flash` (`app/hoi-trang-ti/page.tsx`).
- [x] **3.6.** **Hộp Thư Tố Giác Ẩn Danh:** Tiếp nhận báo cáo tố giác tụ điểm, người lôi kéo gửi về BGH (`app/to-giac/page.tsx`).

### PHA 4: HỆ THỐNG QUẢN TRỊ ADMIN CMS (ADMIN DASHBOARD)
- [x] **4.1.** Trang đăng nhập quản trị viên (Admin Login) bằng mã truy cập an toàn.
- [x] **4.2.** **Bộ nén & Convert WebP Client-side:** Nén ảnh trực tiếp tại trình duyệt bằng Canvas trước khi tải lên Supabase (`components/WebpCanvasConverter.tsx`).
- [x] **4.3.** **Quản lý Ảnh Banner Trang Chủ:** Cho phép Thêm ảnh mới, Thay thế ảnh hoặc Xóa ảnh đặt lại mặc định (Auto-save).
- [x] **4.4.** **Quản lý Thumbnail Bách Thảo Trấn Ma:** Thêm - Thay - Xóa ảnh thumbnail WebP cho từng loại ma túy ngụy trang.
- [x] **4.5.** **Soạn thảo bài viết (Editor):** Đăng bài tuyên truyền, chèn ảnh WebP.
- [x] **4.6.** **Quản lý Video YouTube:** Tự bóc tách Video ID từ link dán vào, hiển thị thumbnail xem trước (`components/YouTubeEmbed.tsx`).
- [x] **4.7.** **Quản lý Hộp thư Tố giác:** Xem danh sách các báo cáo ẩn danh từ học sinh để xử lý kịp thời (`app/admin/page.tsx`).

### PHA 5: HỆ THỐNG KHẢO THÍ TRẠNG NGUYÊN (GAMIFIED SCENARIO QUIZ)
- [x] **5.1.** Khởi tạo bảng `quiz_questions` và nạp sẵn 5 tình huống kịch tính có thật ở THCS.
- [x] **5.2.** **Widget Đấu Trí 60s Nổi Bật Trang Chủ:** Cho phép học sinh thử sức và nhận phản hồi trực tiếp ngay tại trang chủ (`components/MiniQuizWidget.tsx`).
- [x] **5.3.** **Đấu Trường 5 Ải Vượt Cạm Bẫy:** Giao diện lật thẻ mộc bản, bản đồ tiến trình 5 ải, luận giải của Trạng Tí (`app/khao-thi/page.tsx`).
- [x] **5.4.** **Bằng Khen Triện Son Cá Nhân Hóa:** Tự động xuất file ảnh PNG Bằng Khen mang tên học sinh để tải về máy khoe bạn bè (`components/CertificateModal.tsx`).
- [x] **5.5.** **Tab 6 Quản Trị Ngân Hàng Khảo Thí:** Giúp Ban giám hiệu / Admin dễ dàng thêm tình huống mới kèm ảnh nén WebP và 3 đáp án (`app/admin/page.tsx`).
- [x] **5.6.** Thêm mục "Khảo Thí" có huy hiệu HOT trên Navbar.

### PHA 6: KIỂM THỬ, TỐI ƯU HÓA & DEPLOY VERCEL (VERIFICATION & SHIP)
- [x] **6.1.** Kiểm tra Responsive mượt mà trên Mobile (390px), Tablet và PC.
- [x] **6.2.** Kiểm tra đồng bộ luồng upload ảnh WebP tại 100% vị trí (Banner, Thumbnail, Bài viết, Báo cáo, Khảo thí).
- [x] **6.3.** Kiểm tra kết nối Agnes AI `agnes-2.5-flash` và cơ chế phản hồi Trạng Tí an toàn.
- [x] **6.4.** Build thử nghiệm dự án (`npm run build`) thành công rực rỡ 12/12 routes!
- [ ] **6.5.** Hướng dẫn kết nối GitHub và Deploy 1-Click lên Vercel miễn phí.
