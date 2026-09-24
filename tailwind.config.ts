import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          primary: "#0284c7",      // Xanh Sky rực rỡ
          primaryDark: "#0369a1",  // Xanh Biển đậm
          secondary: "#2563eb",    // Xanh Royal Blue
          accent: "#06b6d4",       // Xanh Mint / Cyan tươi trẻ
          surface: "#f8fafc",      // Nền sáng sạch sẽ
          card: "#ffffff",         // Card trắng tinh khôi
          ink: "#0f172a",          // Chữ đen xanh đậm dễ đọc
          muted: "#64748b",        // Chữ phụ slate mềm mại
          highlight: "#f59e0b",    // Vàng cam năng động
        },
        folk: {
          paper: "#F8F4EA",       // Giấy Dó
          card: "#FFFDF9",        // Giấy Điệp
          ink: "#1E1B18",         // Mực Tàu
          vermilion: "#9E2A2B",   // Đỏ Son
          "vermilion-dark": "#7A1E1F", // Đỏ Huyết dụ
          gold: "#C5892F",        // Vàng Hoàng Thổ / Lúa chín
          indigo: "#184E59",      // Xanh Chàm Bát Tràng
          border: "#D6C8B2",      // Màu gỗ mộc
          muted: "#7A6B58",       // Màu chữ phụ trầm
        },
      },
      fontFamily: {
        sans: ["var(--font-vietnam)", "sans-serif"],
      },
      boxShadow: {
        school: "0 4px 20px -2px rgba(2, 132, 199, 0.12)",
        "school-lg": "0 10px 30px -4px rgba(2, 132, 199, 0.18)",
        folk: "3px 3px 0px #1E1B18",
        "folk-lg": "6px 6px 0px #1E1B18",
        "folk-sm": "1.5px 1.5px 0px #1E1B18",
      },
    },
  },
  plugins: [],
};
export default config;
