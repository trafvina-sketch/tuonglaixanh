import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingTrangTiChat from "@/components/FloatingTrangTiChat";
import { supabase } from "@/lib/supabase";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let title = "Lá Chắn Học Đường - Phòng Chống Ma Túy Học Đường THCS";
  let description =
    "Cổng thông tin và Trợ lý Trạng Tí Cố Vấn phòng chống ma túy học đường, nhận diện ma túy ngụy trang thế hệ mới dành cho học sinh, phụ huynh và nhà trường.";
  let keywords = [
    "phòng chống ma túy",
    "học đường",
    "Trường học không ma túy",
    "Trạng Tí AI",
    "pod chill",
    "nước vui",
    "thuốc lá điện tử",
    "kỹ năng thoát hiểm",
  ];
  let ogImage = "/trolyai.png";
  let siteUrl = "https://phong-chong-ma-tuy-hoc-duong.vercel.app";

  try {
    const { data } = await supabase.from("site_settings").select("key, value");
    if (data) {
      data.forEach((item) => {
        if (item.key === "seo_title" && item.value) title = item.value;
        if (item.key === "seo_description" && item.value) description = item.value;
        if (item.key === "seo_keywords" && item.value) {
          keywords = item.value
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean);
        }
        if (item.key === "seo_og_image" && item.value) ogImage = item.value;
        if (item.key === "seo_site_url" && item.value) siteUrl = item.value;
      });
    }
  } catch (err) {
    // fallback mặc định
  }

  const cleanSiteUrl = siteUrl.replace(/\/$/, "");
  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${cleanSiteUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;

  return {
    metadataBase: new URL(cleanSiteUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    authors: [{ name: "Lá Chắn Học Đường" }],
    creator: "Lá Chắn Học Đường",
    publisher: "Lá Chắn Học Đường",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: cleanSiteUrl,
      siteName: "Lá Chắn Học Đường",
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteOgImage],
    },
    icons: {
      icon: "/logo.jpg",
      shortcut: "/logo.jpg",
      apple: "/logo.jpg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
        <FloatingTrangTiChat />
      </body>
    </html>
  );
}
