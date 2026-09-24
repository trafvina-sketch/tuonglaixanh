"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import WebpCanvasConverter from "@/components/WebpCanvasConverter";
import YouTubeEmbed, { extractYouTubeId } from "@/components/YouTubeEmbed";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  Settings,
  FileText,
  Film,
  ShieldAlert,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  Lock,
  KeyRound,
  Sparkles,
  Image as ImageIcon,
  Edit3,
  RefreshCw,
  Eye,
  Award,
  Globe,
  Share2,
} from "lucide-react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-48 border border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center text-xs font-semibold text-slate-400">
      Đang khởi động trình soạn thảo văn bản TipTap...
    </div>
  ),
});

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [activeTab, setActiveTab] = useState<"banner" | "catalog" | "articles" | "videos" | "reports" | "quiz" | "keys" | "seo">("banner");

  // State cho Khóa Cố Vấn Trạng Tí (Bảo mật Zero-Leakage)
  const [maskedKeysList, setMaskedKeysList] = useState<{ index: number; masked: string; status: string }[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [keyRawInput, setKeyRawInput] = useState("");
  const [keyMode, setKeyMode] = useState<"append" | "replace">("append");
  const [isSavingKeys, setIsSavingKeys] = useState(false);
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{ success: boolean; message: string; results?: any[] } | null>(null);
  const [keySaveSuccess, setKeySaveSuccess] = useState<string | null>(null);

  // State cho Kịch Bản & Khoanh Vùng Kiến Thức Cố Vấn Trạng Tí
  const [promptSystemText, setPromptSystemText] = useState("");
  const [promptScopeText, setPromptScopeText] = useState("");
  const [promptStrictMode, setPromptStrictMode] = useState(true);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [promptSaveSuccess, setPromptSaveSuccess] = useState<string | null>(null);
  const [testPromptQuery, setTestPromptQuery] = useState("Hút thử pod chill một hơi thì có bị nghiện không Trạng Tí?");
  const [testPromptResult, setTestPromptResult] = useState<string | null>(null);
  const [isTestingPromptQuery, setIsTestingPromptQuery] = useState(false);

  // State cho Banner
  const [bannerImg, setBannerImg] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerProclamation, setBannerProclamation] = useState("");
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  // State cho Bách Thảo Trấn Ma (Catalog)
  const [catalogList, setCatalogList] = useState<any[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState("");
  const [newCatalogStreetNames, setNewCatalogStreetNames] = useState("");
  const [newCatalogDisguise, setNewCatalogDisguise] = useState("");
  const [newCatalogHarm, setNewCatalogHarm] = useState("");
  const [newCatalogThumb, setNewCatalogThumb] = useState("");
  const [newCatalogDanger, setNewCatalogDanger] = useState("extreme");
  const [isAddingCatalog, setIsAddingCatalog] = useState(false);
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);

  // State cho Ngân Hàng Khảo Thí (Quiz Questions)
  const [quizList, setQuizList] = useState<any[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizStory, setNewQuizStory] = useState("");
  const [newQuizImg, setNewQuizImg] = useState("");
  const [newQuizTip, setNewQuizTip] = useState("");
  const [newQuizCategory, setNewQuizCategory] = useState("refusal");
  const [optAText, setOptAText] = useState("");
  const [optAExp, setOptAExp] = useState("");
  const [optBText, setOptBText] = useState("");
  const [optBExp, setOptBExp] = useState("");
  const [optCText, setOptCText] = useState("");
  const [optCExp, setOptCExp] = useState("");
  const [correctOpt, setCorrectOpt] = useState("C");
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);

  // State cho Bài Viết
  const [articleList, setArticleList] = useState<any[]>([]);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleProclamation, setArticleProclamation] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleThumbnail, setArticleThumbnail] = useState("");
  const [articleSeal, setArticleSeal] = useState("canhbao");
  const [isPublishingArticle, setIsPublishingArticle] = useState(false);

  // State cho Video YouTube
  const [videoList, setVideoList] = useState<any[]>([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoCategory, setVideoCategory] = useState("canh_bao");
  const [isPublishingVideo, setIsPublishingVideo] = useState(false);

  // State cho Báo cáo ẩn danh
  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportFilter, setReportFilter] = useState<"all" | "pending" | "investigating" | "resolved">("all");

  // State cho Cài Đặt SEO & Mạng Xã Hội (Social Share Thumbnail) & Thương hiệu (Logo / Chân trang)
  const [seoTitle, setSeoTitle] = useState("Lá Chắn Học Đường - Phòng Chống Ma Túy Học Đường THCS");
  const [seoDescription, setSeoDescription] = useState("Cổng thông tin và Trợ lý Trạng Tí Cố Vấn phòng chống ma túy học đường, nhận diện ma túy ngụy trang thế hệ mới.");
  const [seoKeywords, setSeoKeywords] = useState("phòng chống ma túy, học đường, Trường học không ma túy, Trạng Tí AI, pod chill, nước vui, thuốc lá điện tử");
  const [seoOgImage, setSeoOgImage] = useState("/trolyai.png");
  const [seoSiteUrl, setSeoSiteUrl] = useState("https://phong-chong-ma-tuy-hoc-duong.vercel.app");
  const [siteLogoUrl, setSiteLogoUrl] = useState("");
  const [footerCopyrightText, setFooterCopyrightText] = useState("");
  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [seoSaveSuccess, setSeoSaveSuccess] = useState(false);

  // Kiểm tra mã truy cập Admin
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "lachanhocduong2026") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      alert("Mã truy cập không chính xác! Vui lòng nhập: lachanhocduong2026");
    }
  };

  useEffect(() => {
    loadSeoSettings();
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Tải cài đặt Banner
  const loadBannerSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    if (data) {
      data.forEach((item) => {
        if (item.key === "hero_banner_image") setBannerImg(item.value);
        if (item.key === "hero_title") setBannerTitle(item.value);
        if (item.key === "hero_subtitle") setBannerSubtitle(item.value);
        if (item.key === "hero_proclamation") setBannerProclamation(item.value);
      });
    }
  };

  // Tải danh mục ma túy ngụy trang
  const loadCatalog = async () => {
    setIsLoadingCatalog(true);
    const { data } = await supabase.from("narcotics_catalog").select("*").order("order_index", { ascending: true });
    if (data) setCatalogList(data);
    setIsLoadingCatalog(false);
  };

  // Tải danh sách bài viết
  const loadArticles = async () => {
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    if (data) setArticleList(data);
  };

  // Tải danh sách video
  const loadVideos = async () => {
    const { data } = await supabase.from("videos").select("*").order("order_index", { ascending: true });
    if (data) setVideoList(data);
  };

  // Tải danh sách báo cáo qua API Server bảo mật (Vượt qua rào cản RLS của Supabase)
  const loadReports = async () => {
    setIsLoadingReports(true);
    try {
      const res = await fetch("/api/admin/reports", {
        headers: { "x-admin-pin": "lachanhocduong2026" },
      });
      const data = await res.json();
      if (data && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else {
        const { data: directData } = await supabase
          .from("anonymous_reports")
          .select("*")
          .order("created_at", { ascending: false });
        if (directData) setReports(directData);
      }
    } catch (err: any) {
      console.error("Lỗi tải báo cáo:", err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  // Cập nhật trạng thái xử lý báo cáo tố giác (pending, investigating, resolved)
  const handleUpdateReportStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": "lachanhocduong2026",
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể cập nhật");
      loadReports();
    } catch (err: any) {
      alert("Lỗi cập nhật: " + err.message);
    }
  };

  // Xóa vĩnh viễn báo cáo tố giác
  const handleDeleteReport = async (id: string) => {
    if (!confirm("Thầy có chắc chắn muốn xóa vĩnh viễn tin phản ánh tố giác này?")) return;
    try {
      const res = await fetch(`/api/admin/reports?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-pin": "lachanhocduong2026" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể xóa");
      loadReports();
    } catch (err: any) {
      alert("Lỗi khi xóa báo cáo: " + err.message);
    }
  };

  // Tải danh sách câu hỏi khảo thí
  const loadQuizQuestions = async () => {
    setIsLoadingQuiz(true);
    const { data } = await supabase.from("quiz_questions").select("*").order("order_index", { ascending: true });
    if (data) setQuizList(data);
    setIsLoadingQuiz(false);
  };

  // Tải cài đặt SEO & Mạng Xã Hội
  const loadSeoSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    if (data) {
      data.forEach((item) => {
        if (item.key === "seo_title" && item.value) setSeoTitle(item.value);
        if (item.key === "seo_description" && item.value) setSeoDescription(item.value);
        if (item.key === "seo_keywords" && item.value) setSeoKeywords(item.value);
        if (item.key === "seo_og_image" && item.value) setSeoOgImage(item.value);
        if (item.key === "seo_site_url" && item.value) setSeoSiteUrl(item.value);
        if (item.key === "site_logo_url") setSiteLogoUrl(item.value ? item.value.trim() : "");
        if (item.key === "footer_copyright_text") setFooterCopyrightText(item.value ? item.value.trim() : "");
      });
    }
  };

  // Tải danh sách khóa Cố Vấn Trạng Tí (Chỉ nhận masked key, tuyệt đối không lộ raw key)
  const loadAdvisorKeys = async () => {
    setIsLoadingKeys(true);
    try {
      const res = await fetch("/api/admin/keys", {
        headers: { "x-admin-pin": "lachanhocduong2026" },
      });
      const data = await res.json();
      if (data && Array.isArray(data.maskedKeys)) {
        setMaskedKeysList(data.maskedKeys);
      }
    } catch (err: any) {
      console.error("Lỗi tải danh sách khóa:", err);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  // Thử nghiệm tính hợp lệ và đo độ trễ kết nối của các khóa
  const handleTestKeys = async (testIndex?: number) => {
    setIsTestingKeys(true);
    setTestFeedback(null);
    try {
      const payload: any = { pin: "lachanhocduong2026" };
      // Nếu có nhập trong ô textarea thì ưu tiên thử nghiệm ô textarea
      if (keyRawInput && keyRawInput.trim()) {
        payload.testKeys = keyRawInput.trim();
      } else if (typeof testIndex === "number") {
        payload.testIndex = testIndex;
      }

      const res = await fetch("/api/admin/keys/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setTestFeedback({
        success: data.success ?? false,
        message: data.message || data.error || "Hoàn thành kiểm tra",
        results: data.results,
      });
    } catch (err: any) {
      setTestFeedback({
        success: false,
        message: "Lỗi kết nối thử nghiệm: " + err.message,
      });
    } finally {
      setIsTestingKeys(false);
    }
  };

  // Lưu danh sách khóa bí mật (Xóa trắng raw input ngay lập tức sau khi lưu)
  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyRawInput.trim()) {
      alert("Vui lòng nhập ít nhất một khóa trước khi lưu!");
      return;
    }

    setIsSavingKeys(true);
    setKeySaveSuccess(null);
    try {
      const res = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: "lachanhocduong2026",
          rawText: keyRawInput.trim(),
          mode: keyMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể lưu khóa");

      // BẢO MẬT TUYỆT ĐỐI: Hủy ô nhập thô trên trình duyệt ngay lập tức
      setKeyRawInput("");
      setMaskedKeysList(data.maskedKeys || []);
      setKeySaveSuccess(`✅ Đã lưu và mã hóa an toàn ${data.addedCount || data.count} khóa vào hệ thống!`);
      setTestFeedback(null);
      alert("🎉 Đã lưu và mã hóa bảo mật danh sách khóa thành công!");
    } catch (err: any) {
      alert("Lỗi lưu khóa: " + err.message);
    } finally {
      setIsSavingKeys(false);
    }
  };

  // Xóa một khóa cụ thể
  const handleDeleteKey = async (index: number) => {
    if (!confirm(`Thầy có chắc chắn muốn xóa khóa vị trí số ${index + 1}?`)) return;
    try {
      const res = await fetch("/api/admin/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: "lachanhocduong2026",
          index,
        }),
      });
      const data = await res.json();
      if (data.maskedKeys) {
        setMaskedKeysList(data.maskedKeys);
      }
      alert("Đã xóa khóa thành công!");
    } catch (err: any) {
      alert("Lỗi xóa: " + err.message);
    }
  };

  // Xóa toàn bộ khóa trong hệ thống
  const handleClearAllKeys = async () => {
    if (!confirm("⚠️ CẢNH BÁO NGUY HIỂM: Thầy có chắc chắn muốn xóa TOÀN BỘ các khóa bí mật trong hệ thống?")) return;
    try {
      const res = await fetch("/api/admin/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: "lachanhocduong2026",
          action: "clear_all",
        }),
      });
      const data = await res.json();
      setMaskedKeysList([]);
      setTestFeedback(null);
      alert("Đã làm sạch toàn bộ khóa trong hệ thống!");
    } catch (err: any) {
      alert("Lỗi xóa toàn bộ: " + err.message);
    }
  };

  // Tải Kịch Bản & Cương Lĩnh Cố Vấn Trạng Tí
  const loadAdvisorPrompt = async () => {
    setIsLoadingPrompt(true);
    try {
      const res = await fetch("/api/admin/prompt", {
        headers: { "x-admin-pin": "lachanhocduong2026" },
      });
      const data = await res.json();
      if (data.success) {
        setPromptSystemText(data.systemPrompt || "");
        setPromptScopeText(data.knowledgeScope || "");
        setPromptStrictMode(data.strictMode ?? true);
      }
    } catch (err: any) {
      console.error("Lỗi tải kịch bản:", err);
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  // Lưu Kịch Bản & Quy Tắc Khoanh Vùng mới
  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrompt(true);
    setPromptSaveSuccess(null);
    try {
      const res = await fetch("/api/admin/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: "lachanhocduong2026",
          systemPrompt: promptSystemText,
          knowledgeScope: promptScopeText,
          strictMode: promptStrictMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể lưu kịch bản");
      setPromptSaveSuccess("🎉 Đã lưu kịch bản và quy tắc khoanh vùng kiến thức thành công!");
      alert("🎉 Đã lưu kịch bản và khoanh vùng kiến thức thành công!");
    } catch (err: any) {
      alert("Lỗi lưu kịch bản: " + err.message);
    } finally {
      setIsSavingPrompt(false);
    }
  };

  // Khôi phục kịch bản chuẩn mực dân gian
  const handleResetDefaultPrompt = async () => {
    if (!confirm("Thầy có chắc muốn khôi phục kịch bản chuẩn mực dân gian ban đầu? Mọi tùy chỉnh hiện tại sẽ được thay thế bằng bản mẫu chuẩn.")) return;
    setIsSavingPrompt(true);
    try {
      const res = await fetch("/api/admin/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: "lachanhocduong2026",
          resetToDefault: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPromptSystemText(data.systemPrompt);
        setPromptScopeText(data.knowledgeScope);
        setPromptStrictMode(data.strictMode);
        setPromptSaveSuccess("✅ Đã khôi phục kịch bản chuẩn mực dân gian!");
        alert("Đã khôi phục kịch bản chuẩn mực dân gian thành công!");
      }
    } catch (err: any) {
      alert("Lỗi khôi phục: " + err.message);
    } finally {
      setIsSavingPrompt(false);
    }
  };

  // Thử nghiệm câu hỏi giả định với kịch bản
  const handleTestPromptSimulation = async (queryText?: string) => {
    const q = queryText || testPromptQuery;
    if (!q.trim()) return;
    setIsTestingPromptQuery(true);
    setTestPromptResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: q.trim() }],
        }),
      });
      const data = await res.json();
      setTestPromptResult(data.reply || data.error || "Không có phản hồi");
    } catch (err: any) {
      setTestPromptResult("Lỗi gửi câu hỏi: " + err.message);
    } finally {
      setIsTestingPromptQuery(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadReports();
      if (activeTab === "banner") loadBannerSettings();
      if (activeTab === "catalog") loadCatalog();
      if (activeTab === "articles") loadArticles();
      if (activeTab === "videos") loadVideos();
      if (activeTab === "reports") loadReports();
      if (activeTab === "quiz") loadQuizQuestions();
      if (activeTab === "keys") {
        loadAdvisorKeys();
        loadAdvisorPrompt();
      }
      if (activeTab === "seo") loadSeoSettings();
    }
  }, [isAuthenticated, activeTab]);

  // Thêm câu hỏi khảo thí mới
  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim() || !newQuizStory.trim() || !optAText.trim() || !optBText.trim() || !optCText.trim() || !newQuizTip.trim()) {
      alert("Vui lòng điền đầy đủ tiêu đề, câu chuyện, 3 đáp án và lời khuyên của Trạng Tí!");
      return;
    }

    setIsAddingQuiz(true);
    const options = [
      { id: "A", text: optAText.trim(), is_correct: correctOpt === "A", explanation: optAExp.trim() },
      { id: "B", text: optBText.trim(), is_correct: correctOpt === "B", explanation: optBExp.trim() },
      { id: "C", text: optCText.trim(), is_correct: correctOpt === "C", explanation: optCExp.trim() },
    ];

    try {
      const { error } = await supabase.from("quiz_questions").insert([
        {
          scenario_title: newQuizTitle.trim(),
          scenario_story: newQuizStory.trim(),
          image_webp_url: newQuizImg || null,
          options: JSON.stringify(options),
          tip_trang_ti: newQuizTip.trim(),
          category: newQuizCategory,
          order_index: quizList.length + 1,
        },
      ]);

      if (error) throw error;
      alert("🎉 Thêm tình huống khảo thí thành công!");
      setNewQuizTitle("");
      setNewQuizStory("");
      setNewQuizImg("");
      setNewQuizTip("");
      setOptAText("");
      setOptAExp("");
      setOptBText("");
      setOptBExp("");
      setOptCText("");
      setOptCExp("");
      loadQuizQuestions();
    } catch (err: any) {
      alert("Lỗi khi thêm tình huống: " + err.message);
    } finally {
      setIsAddingQuiz(false);
    }
  };

  // Xóa câu hỏi tình huống khảo thí
  const handleDeleteQuiz = async (id: string) => {
    if (confirm("Thầy có chắc muốn xóa tình huống này khỏi kỳ khảo thí?")) {
      await supabase.from("quiz_questions").delete().eq("id", id);
      loadQuizQuestions();
    }
  };

  // Lưu cài đặt Banner (Thêm / Thay ảnh banner)
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBanner(true);
    try {
      const updates = [
        { key: "hero_banner_image", value: bannerImg },
        { key: "hero_title", value: bannerTitle },
        { key: "hero_subtitle", value: bannerSubtitle },
        { key: "hero_proclamation", value: bannerProclamation },
      ];

      for (const item of updates) {
        await supabase.from("site_settings").upsert(item, { onConflict: "key" });
      }

      alert("🎉 Cập nhật ảnh Banner và thông tin thành công!");
    } catch (err: any) {
      alert("Lỗi khi lưu banner: " + err.message);
    } finally {
      setIsSavingBanner(false);
    }
  };

  // Xóa ảnh banner (Đặt lại mặc định)
  const handleDeleteBannerImage = async () => {
    if (confirm("Thầy có muốn xóa ảnh banner này và đặt lại về mặc định?")) {
      const defaultImg = "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80";
      setBannerImg(defaultImg);
      await supabase.from("site_settings").upsert({ key: "hero_banner_image", value: defaultImg }, { onConflict: "key" });
      alert("Đã đặt lại ảnh banner thành công!");
    }
  };

  // Lưu cấu hình SEO & Thumbnail Mạng Xã Hội
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSeo(true);
    setSeoSaveSuccess(false);
    try {
      const updates = [
        { key: "seo_title", value: seoTitle.trim() },
        { key: "seo_description", value: seoDescription.trim() },
        { key: "seo_keywords", value: seoKeywords.trim() },
        { key: "seo_og_image", value: seoOgImage.trim() || "/trolyai.png" },
        { key: "seo_site_url", value: seoSiteUrl.trim() || "https://phong-chong-ma-tuy-hoc-duong.vercel.app" },
        { key: "site_logo_url", value: siteLogoUrl.trim() },
        { key: "footer_copyright_text", value: footerCopyrightText.trim() },
      ];
      for (const item of updates) {
        await supabase.from("site_settings").upsert(item, { onConflict: "key" });
      }
      setSeoSaveSuccess(true);
      setTimeout(() => setSeoSaveSuccess(false), 4000);
      alert("🎉 Đã lưu cấu hình SEO, Logo và Chân trang bản quyền thành công!");
    } catch (err: any) {
      alert("Lỗi khi lưu SEO: " + err.message);
    } finally {
      setIsSavingSeo(false);
    }
  };

  // Thêm mục Bách Thảo Trấn Ma mới
  const handleAddCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatalogName.trim() || !newCatalogDisguise.trim()) {
      alert("Vui lòng nhập tên và đặc điểm ngụy trang!");
      return;
    }

    setIsAddingCatalog(true);
    try {
      const { error } = await supabase.from("narcotics_catalog").insert([
        {
          name: newCatalogName.trim(),
          street_names: newCatalogStreetNames.trim(),
          disguise_type: newCatalogDisguise.trim(),
          harm_description: newCatalogHarm.trim(),
          image_webp_url: newCatalogThumb || null,
          danger_level: newCatalogDanger,
          order_index: catalogList.length + 1,
        },
      ]);

      if (error) throw error;
      alert("🎉 Thêm thẻ ma túy ngụy trang thành công!");
      setNewCatalogName("");
      setNewCatalogStreetNames("");
      setNewCatalogDisguise("");
      setNewCatalogHarm("");
      setNewCatalogThumb("");
      loadCatalog();
    } catch (err: any) {
      alert("Lỗi khi thêm: " + err.message);
    } finally {
      setIsAddingCatalog(false);
    }
  };

  // Thay đổi ảnh Thumbnail của mục ma túy ngụy trang
  const handleUpdateCatalogThumb = async (id: string, newUrl: string) => {
    const { error } = await supabase.from("narcotics_catalog").update({ image_webp_url: newUrl }).eq("id", id);
    if (!error) {
      alert("🎉 Đã thay đổi ảnh thumbnail WebP thành công!");
      loadCatalog();
      setEditingCatalogId(null);
    } else {
      alert("Lỗi cập nhật ảnh: " + error.message);
    }
  };

  // Xóa ảnh thumbnail của mục ma túy
  const handleDeleteCatalogThumb = async (id: string) => {
    if (confirm("Thầy có chắc muốn xóa ảnh thumbnail của mục này?")) {
      const { error } = await supabase.from("narcotics_catalog").update({ image_webp_url: null }).eq("id", id);
      if (!error) {
        alert("Đã xóa ảnh thumbnail!");
        loadCatalog();
      }
    }
  };

  // Xóa hẳn một mục ma túy khỏi danh mục
  const handleDeleteCatalogItem = async (id: string) => {
    if (confirm("Thầy có chắc muốn xóa vĩnh viễn thẻ ma túy ngụy trang này?")) {
      const { error } = await supabase.from("narcotics_catalog").delete().eq("id", id);
      if (!error) {
        alert("Đã xóa thành công!");
        loadCatalog();
      }
    }
  };

  // Đăng bài viết mới
  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung bài viết!");
      return;
    }

    setIsPublishingArticle(true);
    const slug = articleTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-") + "-" + Date.now();

    try {
      const { error } = await supabase.from("articles").insert([
        {
          title: articleTitle.trim(),
          slug,
          proclamation_text: articleProclamation.trim(),
          content_html: articleContent,
          thumbnail_webp_url: articleThumbnail || null,
          seal_type: articleSeal,
          is_published: true,
        },
      ]);

      if (error) throw error;
      alert("🎉 Đăng bài viết tuyên truyền thành công lên Supabase!");
      setArticleTitle("");
      setArticleProclamation("");
      setArticleContent("");
      setArticleThumbnail("");
      loadArticles();
    } catch (err: any) {
      alert("Lỗi khi đăng bài: " + err.message);
    } finally {
      setIsPublishingArticle(false);
    }
  };

  // Xóa bài viết
  const handleDeleteArticle = async (id: string) => {
    if (confirm("Thầy có muốn xóa bài viết này?")) {
      await supabase.from("articles").delete().eq("id", id);
      loadArticles();
    }
  };

  // Đăng Video YouTube mới
  const handlePublishVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYouTubeId(videoUrl);
    if (!videoTitle.trim() || !ytId) {
      alert("Vui lòng nhập tiêu đề và liên kết YouTube hợp lệ!");
      return;
    }

    setIsPublishingVideo(true);
    try {
      const { error } = await supabase.from("videos").insert([
        {
          title: videoTitle.trim(),
          youtube_url: videoUrl.trim(),
          youtube_id: ytId,
          description: videoDesc.trim(),
          category: videoCategory,
          order_index: videoList.length + 1,
        },
      ]);

      if (error) throw error;
      alert("🎉 Thêm Video YouTube thành công!");
      setVideoTitle("");
      setVideoUrl("");
      setVideoDesc("");
      loadVideos();
    } catch (err: any) {
      alert("Lỗi khi thêm video: " + err.message);
    } finally {
      setIsPublishingVideo(false);
    }
  };

  // Xóa Video YouTube
  const handleDeleteVideo = async (id: string) => {
    if (confirm("Thầy có muốn xóa video này?")) {
      await supabase.from("videos").delete().eq("id", id);
      loadVideos();
    }
  };

  // MÀN HÌNH ĐĂNG NHẬP HIỆN ĐẠI
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
          <div className="relative w-16 h-16 mx-auto">
            {siteLogoUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-white border-2 border-sky-300/80 shadow-md shadow-sky-500/20">
                <img
                  src={siteLogoUrl}
                  alt="Logo Hệ Thống"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-[#0284c7] text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Lock className="w-7 h-7 text-sky-200" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1e40af] text-white flex items-center justify-center border-2 border-white shadow-xs">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div>
            <h2 className="font-extrabold text-xl text-[#1e3a8a] tracking-tight">
              TRƯỜNG HỌC KHÔNG MA TÚY
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Cổng Điều Hành & Quản Trị Hệ Thống (Dành riêng cho Ban Giám Hiệu & Thầy Cô)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Nhập mã PIN quản trị..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-base font-mono tracking-widest text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                Mã mặc định: <code className="bg-slate-100 text-sky-700 px-1.5 py-0.5 rounded font-bold">lachanhocduong2026</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MÀN HÌNH QUẢN TRỊ ĐẦY ĐỦ
  return (
    <div className="space-y-6">
      
      {/* HEADER QUẢN TRỊ HIỆN ĐẠI */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#1e40af] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-[#1e3a8a] tracking-tight uppercase">
                Hệ Thống Quản Trị - Trường Học Không Ma Túy
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                TRỰC TUYẾN
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý Banner, Tin tức, Danh mục ma túy ngụy trang, Trắc nghiệm, Video và Khóa Trợ lý AI
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem("admin_auth");
            setIsAuthenticated(false);
          }}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-all"
        >
          Đăng xuất
        </button>
      </div>

      {/* TABS ĐIỀU HƯỚNG QUẢN TRỊ DẠNG PILLS */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "banner", label: "Ảnh Banner Trang Chủ", icon: ImageIcon },
          { id: "catalog", label: "Danh Mục Nhận Diện", icon: BookOpen },
          { id: "articles", label: "Bài Viết & Tin Tức", icon: FileText },
          { id: "videos", label: "Video YouTube", icon: Film },
          { id: "reports", label: "Hộp Thư Tố Giác", icon: ShieldAlert, count: reports.filter((r) => r.status === "pending" || !r.status).length },
          { id: "quiz", label: "Ngân Hàng Trắc Nghiệm", icon: Award },
          { id: "keys", label: "Trợ Lý AI & API Key", icon: KeyRound, count: maskedKeysList.length },
          { id: "seo", label: "Cài Đặt SEO & Thương Hiệu", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "keys") {
                  loadAdvisorKeys();
                  loadAdvisorPrompt();
                }
                if (tab.id === "seo") {
                  loadSeoSettings();
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#0284c7] text-white shadow-sm shadow-sky-500/30 border border-transparent"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-[#0284c7]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono ${isActive ? "bg-white/25 text-white" : "bg-sky-100 text-sky-800"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: QUẢN LÝ ẢNH BANNER TRANG CHỦ (THÊM / THAY / XÓA)
      ========================================================================= */}
      {activeTab === "banner" && (
        <form
          onSubmit={handleSaveBanner}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5"
        >
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-semibold font-bold text-base text-[#1e3a8a]">
                1. Quản Lý Ảnh Banner & Nội Dung Chiếu Thư Trang Chủ
              </h3>
              <p className="text-xs text-slate-500">
                Thay đổi ảnh minh họa banner bên phải và câu chữ tuyên truyền trên trang chủ.
              </p>
            </div>
            <span className="rounded-full text-[10px] font-bold px-2 py-0.5 border text-[10px] px-2 py-0.5 rounded font-semibold">
              HERO BANNER
            </span>
          </div>

          {/* XEM TRƯỚC ẢNH BANNER HIỆN TẠI */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900">
              Ảnh Banner hiện tại trên Trang Chủ:
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-200/80 bg-[#1E1B18] shrink-0">
                <ImageWithFallback
                  src={bannerImg}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-xs text-slate-600 break-all">
                  <strong>Đường dẫn ảnh:</strong> {bannerImg}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteBannerImage}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FBEAEB] text-[#1e3a8a] border border-[#FCA5A5] hover:bg-[#FEE2E2] flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa ảnh (về mặc định)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CHỌN VÀ NÉN ẢNH BANNER MỚI QUA WEBP CANVAS */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Thêm / Thay thế ảnh Banner mới (Tự động nén sang .WebP siêu nhẹ & Lưu ngay):
            </label>
            <WebpCanvasConverter
              folderPath="banners"
              label="Chọn ảnh banner mới từ máy tính (Tỷ lệ 4:3 hoặc 16:9)"
              maxDimension={1400}
              onUploadSuccess={async (url) => {
                setBannerImg(url);
                try {
                  const { error } = await supabase.from("site_settings").upsert(
                    { key: "hero_banner_image", value: url },
                    { onConflict: "key" }
                  );
                  if (error) throw error;
                  alert("🎉 Đã lưu và kích hoạt ảnh Banner mới lên Trang Chủ thành công!");
                } catch (err: any) {
                  alert("Đã tải ảnh lên storage nhưng có lỗi cập nhật DB: " + err.message);
                }
              }}
            />
          </div>

          {/* SỬA NỘI DUNG CHỮ BANNER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Tiêu đề hịch (Hàng chữ nhỏ trên cùng):
              </label>
              <input
                type="text"
                value={bannerProclamation}
                onChange={(e) => setBannerProclamation(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Tiêu đề chính của Banner:
              </label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Đoạn văn lời dẫn giải thích:
              </label>
              <textarea
                rows={3}
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingBanner}
            className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-semibold font-bold py-3.5 rounded-xl text-xs sm:text-sm border border-slate-200/80 shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSavingBanner ? "Đang lưu cài đặt banner..." : "Lưu Cài Đặt Banner Lên Trang Chủ"}</span>
          </button>
        </form>
      )}

      {/* =========================================================================
          TAB 2: QUẢN LÝ BÁCH THẢO TRẤN MA (THÊM / THAY / XÓA ẢNH THUMBNAIL)
      ========================================================================= */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          
          {/* DANH SÁCH CÁC MỤC MA TÚY HIỆN CÓ ĐỂ SỬA / THAY ẢNH */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold font-bold text-base text-[#0284c7]">
                  Danh Sách Thẻ Ma Túy Ngụy Trang (Quản Lý Ảnh Thumbnail Trực Quan)
                </h3>
                <p className="text-xs text-slate-500">
                  Thầy có thể bấm "Thay ảnh thumbnail" để upload ảnh mới dạng WebP trực tiếp cho từng thẻ.
                </p>
              </div>
              <button
                onClick={loadCatalog}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 text-slate-900 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Làm mới</span>
              </button>
            </div>

            {isLoadingCatalog ? (
              <p className="text-xs text-center py-6 text-slate-500">Đang tải danh mục...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* TIÊU ĐỀ */}
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <h4 className="font-semibold font-bold text-sm text-slate-900">{item.name}</h4>
                        <span className="rounded-full text-[10px] font-bold px-2 py-0.5 border text-[8px] px-1.5 py-0.2 rounded font-semibold bg-white">
                          {item.danger_level === "extreme" ? "CỰC ĐỘC" : "NGỤY TRANG"}
                        </span>
                      </div>

                      {/* ẢNH THUMBNAIL */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-white mb-2">
                        {item.image_webp_url ? (
                          <ImageWithFallback
                            src={item.image_webp_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                            <span className="text-2xl mb-0.5">📷</span>
                            <span>Chưa có ảnh thumbnail</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        <strong>Ngụy trang:</strong> {item.disguise_type}
                      </p>
                    </div>

                    {/* NÚT THAO TÁC VỚI ẢNH */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCatalogId(editingCatalogId === item.id ? null : item.id)}
                          className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-[#184E59] text-white hover:bg-[#123942] flex items-center justify-center gap-1 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{editingCatalogId === item.id ? "Đóng sửa ảnh" : "Thay ảnh WebP"}</span>
                        </button>

                        {item.image_webp_url && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCatalogThumb(item.id)}
                            className="py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-[#FBEAEB] text-[#1e3a8a] border border-[#FCA5A5] hover:bg-[#FEE2E2]"
                            title="Xóa ảnh thumbnail"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteCatalogItem(item.id)}
                          className="py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-white text-slate-600 border border-slate-300 hover:bg-rose-50 hover:text-rose-600"
                          title="Xóa hẳn mục này"
                        >
                          ✕
                        </button>
                      </div>

                      {/* KHUNG NÉN VÀ THAY ẢNH TRỰC TIẾP KHI BẤM NÚT */}
                      {editingCatalogId === item.id && (
                        <div className="p-3 bg-white rounded-xl border-2 border-dashed border-[#184E59] space-y-2">
                          <span className="text-[10px] font-bold text-[#0284c7] block">
                            Chọn ảnh mới từ máy để nén và thay thế cho "{item.name}":
                          </span>
                          <WebpCanvasConverter
                            folderPath="catalog"
                            label="Chọn ảnh (Canvas tự nén sang .webp)"
                            maxDimension={800}
                            onUploadSuccess={(url) => handleUpdateCatalogThumb(item.id, url)}
                          />
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FORM THÊM MỤC MỚI KÈM ẢNH THUMBNAIL WEBP */}
          <form
            onSubmit={handleAddCatalogItem}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
          >
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h3 className="font-semibold font-bold text-base text-[#1e3a8a]">
                Thêm Thẻ Ma Túy Ngụy Trang Mới (Kèm Ảnh Thumbnail)
              </h3>
              <span className="rounded-full text-[10px] font-bold px-2 py-0.5 border text-[9px] px-1.5 py-0.5 rounded font-semibold">
                BÁCH THẢO MỚI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Tên chất / loại ma túy: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatalogName}
                  onChange={(e) => setNewCatalogName(e.target.value)}
                  placeholder="Ví dụ: Cỏ Mỹ, Bánh Cần Sa..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Tên gọi đường phố / tiếng lóng:
                </label>
                <input
                  type="text"
                  value={newCatalogStreetNames}
                  onChange={(e) => setNewCatalogStreetNames(e.target.value)}
                  placeholder="Ví dụ: Cỏ, K2, Mặt cười..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Đặc điểm ngụy trang (Vỏ bọc bên ngoài): <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatalogDisguise}
                  onChange={(e) => setNewCatalogDisguise(e.target.value)}
                  placeholder="Ví dụ: Gói trà thảo mộc thơm, kẹo ngậm dâu..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Mức độ nguy hại:
                </label>
                <select
                  value={newCatalogDanger}
                  onChange={(e) => setNewCatalogDanger(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="extreme">CỰC ĐỘC - NGUY HIỂM TỨC THÌ</option>
                  <option value="danger">CẢNH BÁO CAO - GÂY NGHIỆN NẶNG</option>
                  <option value="warning">CẢNH GIÁC NGỤY TRANG</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Bản chất chất độc và tác hại thần kinh:
                </label>
                <textarea
                  rows={2}
                  value={newCatalogHarm}
                  onChange={(e) => setNewCatalogHarm(e.target.value)}
                  placeholder="Mô tả tác hại lên não bộ, tim mạch..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Tải ảnh thumbnail trực quan (Tự động nén WebP):
                </label>
                <WebpCanvasConverter
                  folderPath="catalog"
                  label="Chọn ảnh chụp ma túy từ máy tính (Canvas tự nén sang .webp)"
                  maxDimension={800}
                  onUploadSuccess={(url) => {
                    setNewCatalogThumb(url);
                    alert("Đã upload ảnh thumbnail WebP thành công!");
                  }}
                />
                {newCatalogThumb && (
                  <div className="flex items-center gap-3 p-3 bg-[#E8F3EB] rounded-xl border border-[#2E7D32] mt-2">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                      <ImageWithFallback
                        src={newCatalogThumb}
                        alt="Preview new thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#1B5E20]">✅ Đã gắn ảnh thumbnail WebP thành công!</p>
                      <button
                        type="button"
                        onClick={() => setNewCatalogThumb("")}
                        className="text-[11px] text-rose-600 underline font-bold mt-1"
                      >
                        Gỡ bỏ ảnh này
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isAddingCatalog}
              className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-semibold font-bold py-3 rounded-xl text-xs sm:text-sm border border-slate-200/80 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingCatalog ? "Đang thêm thẻ..." : "Lưu Thẻ Ma Túy Mới Lên Supabase"}</span>
            </button>
          </form>

        </div>
      )}

      {/* =========================================================================
          TAB 3: BÀI VIẾT TUYÊN TRUYỀN (ĐĂNG & QUẢN LÝ)
      ========================================================================= */}
      {activeTab === "articles" && (
        <div className="space-y-6">
          {/* FORM ĐĂNG BÀI */}
          <form
            onSubmit={handlePublishArticle}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
          >
            <div className="border-b border-slate-200 pb-2">
              <h3 className="font-semibold font-bold text-base text-[#1e3a8a]">
                Khởi Thảo Bài Tuyên Truyền Giáo Dục
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Tiêu đề bài viết: <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="Ví dụ: Cảnh giác với các loại bánh kẹo tẩm tinh dầu cần sa..."
                className="w-full bg-white border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Lời hịch ngắn:
              </label>
              <input
                type="text"
                value={articleProclamation}
                onChange={(e) => setArticleProclamation(e.target.value)}
                placeholder="Ví dụ: Tóm tắt bài học gửi các bạn nhỏ..."
                className="w-full bg-white border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Ảnh bìa bài viết (.WebP):
              </label>
              <WebpCanvasConverter
                folderPath="articles"
                label="Chọn ảnh bìa bài viết từ máy (Tự động nén WebP)"
                onUploadSuccess={(url) => setArticleThumbnail(url)}
              />
              {articleThumbnail && (
                <div className="flex items-center gap-3 p-3 bg-[#E8F3EB] rounded-xl border border-[#2E7D32] mt-2">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                    <ImageWithFallback
                      src={articleThumbnail}
                      alt="Preview article thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#1B5E20]">✅ Đã gắn ảnh bìa bài viết WebP thành công!</p>
                    <button
                      type="button"
                      onClick={() => setArticleThumbnail("")}
                      className="text-[11px] text-rose-600 underline font-bold mt-1"
                    >
                      Gỡ bỏ ảnh bìa này
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <label className="text-xs font-bold text-slate-900">
                  Nội dung chi tiết bài viết (Trình soạn thảo trực quan TipTap): <span className="text-red-600">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Đầy đủ H2, H3, In đậm, Danh sách, Khối cảnh báo đỏ/xanh, Chèn ảnh WebP
                </span>
              </div>
              <RichTextEditor
                value={articleContent}
                onChange={setArticleContent}
                thumbnailToInsert={articleThumbnail}
                placeholder="Nhập hoặc dán nội dung bài viết tuyên truyền phòng chống ma túy..."
              />
            </div>

            <button
              type="submit"
              disabled={isPublishingArticle}
              className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-semibold font-bold py-3 rounded-xl text-xs sm:text-sm border border-slate-200/80 shadow-xs transition-all"
            >
              {isPublishingArticle ? "Đang lưu bài viết..." : "Xuất Bản Bài Viết Lên Supabase"}
            </button>
          </form>

          {/* DANH SÁCH BÀI VIẾT ĐÃ ĐĂNG */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
            <h4 className="font-semibold font-bold text-sm text-slate-900 border-b pb-2">
              Các bài viết đã xuất bản ({articleList.length})
            </h4>
            <div className="space-y-2">
              {articleList.map((art) => (
                <div key={art.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{art.title}</h5>
                    <span className="text-[10px] text-slate-500">{new Date(art.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteArticle(art.id)}
                    className="text-xs text-[#1e3a8a] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: VIDEO YOUTUBE (ĐĂNG & QUẢN LÝ)
      ========================================================================= */}
      {activeTab === "videos" && (
        <div className="space-y-6">
          <form
            onSubmit={handlePublishVideo}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
          >
            <div className="border-b border-slate-200 pb-2">
              <h3 className="font-semibold font-bold text-base text-[#0284c7]">
                Nhúng Chiếu Thư Video (YouTube Link 0đ Bộ Nhớ)
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Tiêu đề video: <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Ví dụ: Phóng sự ANTV về ma túy ngụy trang đồ uống..."
                className="w-full bg-white border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm focus:outline-[#184E59]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Dán link YouTube (Hỗ trợ mọi link youtu.be, Shorts, watch?v=): <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-white border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm focus:outline-[#184E59]"
              />
            </div>

            {videoUrl && extractYouTubeId(videoUrl) && (
              <div className="space-y-1.5 max-w-md">
                <span className="text-xs font-bold text-[#0284c7]">Xem trước video:</span>
                <YouTubeEmbed urlOrId={videoUrl} title="Xem trước" />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Mô tả bài học trong video:
              </label>
              <textarea
                rows={2}
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                placeholder="Tóm tắt nội dung cảnh báo..."
                className="w-full bg-white border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm focus:outline-[#184E59]"
              />
            </div>

            <button
              type="submit"
              disabled={isPublishingVideo}
              className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-semibold font-bold py-3 rounded-xl text-xs sm:text-sm border border-slate-200/80 shadow-xs transition-all"
            >
              {isPublishingVideo ? "Đang lưu video..." : "Lưu Video Lên Supabase"}
            </button>
          </form>

          {/* DANH SÁCH VIDEO HIỆN CÓ */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
            <h4 className="font-semibold font-bold text-sm text-slate-900 border-b pb-2">
              Các video YouTube đã nhúng ({videoList.length})
            </h4>
            <div className="space-y-2">
              {videoList.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{v.title}</h5>
                    <span className="text-[10px] text-slate-500">ID: {v.youtube_id}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(v.id)}
                    className="text-xs text-[#1e3a8a] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: HỘP THƯ TỐ GIÁC ẨN DANH
      ========================================================================= */}
      {activeTab === "reports" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-semibold font-bold text-base text-[#B91C1C]">
                Danh Sách Phản Ánh & Tố Giác Từ Học Sinh
              </h3>
              <p className="text-xs text-slate-500">
                Bảo mật danh tính học sinh, phối hợp cùng Công an và Ban Giám Hiệu kiểm tra.
              </p>
            </div>
            <button
              onClick={loadReports}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-900 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm mới</span>
            </button>
          </div>

          {/* BỘ LỌC TRẠNG THÁI */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
            <button
              type="button"
              onClick={() => setReportFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reportFilter === "all"
                  ? "bg-[#1e3a8a] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Tất cả ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setReportFilter("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reportFilter === "pending"
                  ? "bg-rose-600 text-white shadow-sm shadow-rose-500/25"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              🔴 Chờ xác minh ({reports.filter((r) => r.status === "pending" || !r.status).length})
            </button>
            <button
              type="button"
              onClick={() => setReportFilter("investigating")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reportFilter === "investigating"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              🟡 Đang xác minh ({reports.filter((r) => r.status === "investigating").length})
            </button>
            <button
              type="button"
              onClick={() => setReportFilter("resolved")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reportFilter === "resolved"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              🟢 Đã xử lý ({reports.filter((r) => r.status === "resolved").length})
            </button>
          </div>

          {isLoadingReports ? (
            <p className="text-xs text-center py-6 text-slate-500">Đang tải danh sách báo cáo...</p>
          ) : reports.length === 0 ? (
            <p className="text-xs text-center py-8 text-slate-500">
              Hiện chưa có phản ánh tố giác nào từ học sinh.
            </p>
          ) : (
            <div className="space-y-3">
              {reports
                .filter((r) => {
                  if (reportFilter === "all") return true;
                  if (reportFilter === "pending") return r.status === "pending" || !r.status;
                  return r.status === reportFilter;
                })
                .map((r) => {
                  const status = r.status || "pending";
                  return (
                    <div
                      key={r.id}
                      className={`border rounded-2xl p-4 shadow-2xs space-y-3 transition-all ${
                        status === "resolved"
                          ? "bg-emerald-50/40 border-emerald-200/80"
                          : status === "investigating"
                          ? "bg-amber-50/40 border-amber-200/80"
                          : "bg-white border-slate-200/90"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#B91C1C] flex items-center gap-1">
                            📍 {r.location_text}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              status === "resolved"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : status === "investigating"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-rose-100 text-rose-800 border-rose-200"
                            }`}
                          >
                            {status === "resolved"
                              ? "🟢 Đã xử lý xong"
                              : status === "investigating"
                              ? "🟡 Đang xác minh"
                              : "🔴 Chờ xác minh"}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium font-mono">
                          {new Date(r.created_at).toLocaleString("vi-VN")}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        <strong className="text-slate-900">Nội dung phản ánh:</strong> {r.description}
                      </p>

                      {r.evidence_image_url && (
                        <div className="pt-1">
                          <span className="text-[11px] font-bold text-[#0284c7] block mb-1">
                            Ảnh bằng chứng đính kèm (.webp):
                          </span>
                          <a
                            href={r.evidence_image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block border border-slate-200 rounded-xl overflow-hidden max-w-xs hover:ring-2 hover:ring-sky-500/30 transition-all shadow-xs"
                          >
                            <img
                              src={r.evidence_image_url}
                              alt="Bằng chứng"
                              className="max-h-48 object-cover"
                            />
                          </a>
                        </div>
                      )}

                      {/* THANH ĐIỀU HƯỚNG XỬ LÝ DÀNH CHO THẦY CÔ */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-500 mr-1">Chuyển trạng thái:</span>
                          {status !== "pending" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateReportStatus(r.id, "pending")}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all"
                            >
                              Chờ xác minh
                            </button>
                          )}
                          {status !== "investigating" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateReportStatus(r.id, "investigating")}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-all"
                            >
                              Đang xác minh
                            </button>
                          )}
                          {status !== "resolved" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateReportStatus(r.id, "resolved")}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all"
                            >
                              ✓ Đã xử lý xong
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteReport(r.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-200 transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa tin này</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 6: QUẢN LÝ NGÂN HÀNG CÂU HỎI TÌNH HUỐNG KHẢO THÍ
      ========================================================================= */}
      {activeTab === "quiz" && (
        <div className="space-y-6">
          
          {/* DANH SÁCH TÌNH HUỐNG HIỆN CÓ */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold font-bold text-base text-[#1e3a8a]">
                  Danh Sách Tình Huống Khảo Thí Hiện Có ({quizList.length} Ải)
                </h3>
                <p className="text-xs text-slate-500">
                  Các tình huống thực tế giúp học sinh THCS rèn luyện phản xạ từ chối và nhận diện ma túy ngụy trang.
                </p>
              </div>
              <button
                onClick={loadQuizQuestions}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 text-slate-900 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Làm mới</span>
              </button>
            </div>

            {isLoadingQuiz ? (
              <p className="text-xs text-center py-6 text-slate-500">Đang tải ngân hàng câu hỏi...</p>
            ) : quizList.length === 0 ? (
              <p className="text-xs text-center py-6 text-slate-500">Chưa có câu hỏi nào. Thầy hãy thêm câu hỏi mới bên dưới.</p>
            ) : (
              <div className="space-y-4">
                {quizList.map((item, idx) => {
                  const opts = typeof item.options === "string" ? JSON.parse(item.options) : item.options;
                  return (
                    <div
                      key={item.id}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#9E2A2B] text-white flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="font-semibold font-bold text-sm text-slate-900">
                            {item.scenario_title}
                          </h4>
                          <span className="rounded-full text-[10px] font-bold px-2 py-0.5 border text-[9px] px-2 py-0.2 rounded font-semibold bg-white">
                            {item.category === "refusal" ? "TỪ CHỐI" : item.category === "identify" ? "NHẬN DIỆN" : "PHÁP LUẬT"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteQuiz(item.id)}
                          className="text-xs font-bold text-[#1e3a8a] hover:text-red-700 p-1 rounded hover:bg-rose-50 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-900 italic">
                        "{item.scenario_story}"
                      </p>

                      {/* DANH SÁCH ĐÁP ÁN */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {opts?.map((opt: any) => (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-xl border ${
                              opt.is_correct
                                ? "bg-[#E8F3EB] border-[#2E7D32] text-[#1B5E20] font-bold"
                                : "bg-white border-slate-200 text-slate-600"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span>Đáp án {opt.id}</span>
                              {opt.is_correct && <span className="text-[10px] bg-[#2E7D32] text-white px-1.5 py-0.2 rounded">ĐÚNG</span>}
                            </div>
                            <p className="text-[11px] leading-snug">{opt.text}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] font-bold text-[#1e3a8a]">
                        💡 Lời khuyên Trạng Tí: "{item.tip_trang_ti}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FORM THÊM TÌNH HUỐNG KHẢO THÍ MỚI */}
          <form
            onSubmit={handleAddQuiz}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
          >
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h3 className="font-semibold font-bold text-base text-[#1e3a8a]">
                Thêm Tình Huống Khảo Thí Mới Vào Ngân Hàng
              </h3>
              <span className="rounded-full text-[10px] font-bold px-2 py-0.5 border text-[9px] px-2 py-0.5 rounded font-semibold">
                KHẢO THÍ MỚI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Tiêu đề tình huống: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="Ví dụ: Bẫy kẹo sô-cô-la ở tiệc sinh nhật..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Phân loại kỹ năng:
                </label>
                <select
                  value={newQuizCategory}
                  onChange={(e) => setNewQuizCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="refusal">Kỹ năng từ chối (Refusal)</option>
                  <option value="identify">Nhận diện ngụy trang (Identify)</option>
                  <option value="law">Pháp luật & Trách nhiệm (Law)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Bối cảnh tình huống thực tế (Đoạn văn kịch tính): <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newQuizStory}
                  onChange={(e) => setNewQuizStory(e.target.value)}
                  placeholder="Mô tả hoàn cảnh học sinh bị rủ rê, lôi kéo hoặc phát hiện đồ lạ..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Ảnh minh họa tình huống (Tùy chọn, tự động nén WebP):
                </label>
                <WebpCanvasConverter
                  folderPath="quiz"
                  label="Chọn ảnh chụp tình huống từ máy (Canvas nén WebP)"
                  maxDimension={800}
                  onUploadSuccess={(url) => {
                    setNewQuizImg(url);
                    alert("Đã upload ảnh tình huống WebP thành công!");
                  }}
                />
                {newQuizImg && (
                  <p className="text-[11px] font-bold text-[#2E7D32] mt-1">
                    ✅ Đã gắn ảnh tình huống: {newQuizImg}
                  </p>
                )}
              </div>

              {/* 3 ĐÁP ÁN LỰA CHỌN */}
              <div className="sm:col-span-3 border-t border-slate-200 pt-3 space-y-3">
                <h4 className="font-semibold font-bold text-xs text-slate-900 uppercase">
                  3 Phương Án Lựa Chọn Hành Động:
                </h4>

                {/* Đáp án A */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Phương án A:</span>
                    <label className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOpt === "A"}
                        onChange={() => setCorrectOpt("A")}
                      />
                      <span>Đặt làm đáp án ĐÚNG</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={optAText}
                    onChange={(e) => setOptAText(e.target.value)}
                    placeholder="Nội dung hành động lựa chọn A..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={optAExp}
                    onChange={(e) => setOptAExp(e.target.value)}
                    placeholder="Lời giải thích vì sao đúng hoặc sai..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-[11px]"
                  />
                </div>

                {/* Đáp án B */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Phương án B:</span>
                    <label className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOpt === "B"}
                        onChange={() => setCorrectOpt("B")}
                      />
                      <span>Đặt làm đáp án ĐÚNG</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={optBText}
                    onChange={(e) => setOptBText(e.target.value)}
                    placeholder="Nội dung hành động lựa chọn B..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={optBExp}
                    onChange={(e) => setOptBExp(e.target.value)}
                    placeholder="Lời giải thích vì sao đúng hoặc sai..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-[11px]"
                  />
                </div>

                {/* Đáp án C */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Phương án C:</span>
                    <label className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOpt === "C"}
                        onChange={() => setCorrectOpt("C")}
                      />
                      <span>Đặt làm đáp án ĐÚNG</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={optCText}
                    onChange={(e) => setOptCText(e.target.value)}
                    placeholder="Nội dung hành động lựa chọn C..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={optCExp}
                    onChange={(e) => setOptCExp(e.target.value)}
                    placeholder="Lời giải thích vì sao đúng hoặc sai..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-[11px]"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-[#1e3a8a] mb-1">
                  Lời khuyên vàng của Trạng Tí: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newQuizTip}
                  onChange={(e) => setNewQuizTip(e.target.value)}
                  placeholder="Ví dụ: Bất kỳ đồ uống nào đã mở nắp ở chỗ đông người, tuyệt đối không đưa vào miệng!"
                  className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAddingQuiz}
              className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-semibold font-bold py-3.5 rounded-xl text-xs sm:text-sm border border-slate-200/80 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingQuiz ? "Đang lưu câu hỏi..." : "Thêm Tình Huống Vào Ngân Hàng Khảo Thí"}</span>
            </button>
          </form>

        </div>
      )}

      {/* =========================================================================
          TAB 7: CỐ VẤN TRẠNG TÍ (KỊCH BẢN & KHÓA KẾT NỐI BẢO MẬT)
      ========================================================================= */}
      {activeTab === "keys" && (
        <div className="space-y-6">
          {/* =========================================================================
              PHẦN 7.1: CÀI ĐẶT KỊCH BẢN & KHOANH VÙNG KIẾN THỨC (GUARDRAIL THÉP)
          ========================================================================= */}
          <form
            onSubmit={handleSavePrompt}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5"
          >
            <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#1e3a8a]" />
                  <h3 className="font-semibold font-bold text-base text-[#1e3a8a]">
                    7.1. Cài Đặt Kịch Bản & Khoanh Vùng Kiến Thức Cố Vấn
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Xác lập cương lĩnh chỉ đạo, giọng điệu dân gian và phạm vi kiến thức phòng chống ma túy học đường & cộng đồng.
                </p>
              </div>
              <span className="rounded-full text-[10px] font-bold px-2 py-0.5 border text-[10px] px-2.5 py-1 rounded font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#B45309]">
                KHOANH VÙNG PHẠM VI (GUARDRAIL THÉP)
              </span>
            </div>

            {/* HỘP CẢNH BÁO QUY TẮC PHẠM VI */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-900">
              <div className="font-semibold font-bold text-sm text-[#1e3a8a] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#1e3a8a]" />
                <span>Quy Tắc Khoanh Vùng Phạm Vi Nghiêm Ngặt:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#554A3B]">
                <li>
                  <strong className="text-slate-900">Chỉ trả lời trong phạm vi:</strong> Tác hại, nhận biết các loại ma túy (đặc biệt Pod chill, nước vui, bánh cần, bùa lưỡi LSD...), kỹ năng từ chối (4 bước vàng), tố giác an toàn, và pháp luật phòng chống ma túy học đường & xã hội.
                </li>
                <li>
                  <strong className="text-slate-900">Tuyệt đối không trả lời ngoài lề:</strong> Khi học sinh hỏi bài tập văn, toán, lý, hóa, lập trình, tử vi, chuyện phiếm đời tư... Trạng Tí sẽ khéo léo từ chối theo giọng điệu dân gian, khuyên các bạn tập trung việc học và hướng về kỹ năng tự bảo vệ mình.
                </li>
                <li>
                  <strong className="text-slate-900">Bảo mật danh tính:</strong> Tuyệt đối không để lộ bất kỳ tên mô hình hay nhà cung cấp công nghệ nào.
                </li>
              </ul>
            </div>

            {/* TOGGLE CHẾ ĐỘ NGHIÊM NGẶT */}
            <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl">
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Kích hoạt Chế độ Nghiêm ngặt (Strict Boundary Enforcement)
                </span>
                <span className="text-[11px] text-slate-500">
                  Bắt buộc Trạng Tí từ chối 100% các câu hỏi không liên quan đến ma túy và an toàn học đường.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={promptStrictMode}
                  onChange={(e) => setPromptStrictMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9E2A2B]"></div>
              </label>
            </div>

            {/* TEXTAREA NHẬP KỊCH BẢN CHỈ ĐẠO (SYSTEM PROMPT) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1e3a8a]">
                  Toàn văn Kịch Bản Chỉ Đạo (System Prompt): <span className="text-red-600">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {promptSystemText.length} ký tự
                </span>
              </div>
              <textarea
                rows={10}
                required
                value={promptSystemText}
                onChange={(e) => setPromptSystemText(e.target.value)}
                placeholder="Nhập cương lĩnh chỉ đạo và phong cách cho Trạng Tí Cố Vấn..."
                className="w-full bg-white border border-slate-200/80 rounded-2xl p-3.5 text-xs font-mono leading-relaxed placeholder:text-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#9E2A2B]"
              />
            </div>

            {/* TEXTAREA TÓM TẮT PHẠM VI KIẾN THỨC KHOANH VÙNG */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Tóm tắt Phạm vi Khoanh Vùng & Giới Hạn Cấm (Knowledge Boundaries):
              </label>
              <textarea
                rows={4}
                value={promptScopeText}
                onChange={(e) => setPromptScopeText(e.target.value)}
                placeholder="1. Tác hại các loại ma túy thế hệ mới... 2. Kỹ năng 4 bước từ chối... 3. KHÔNG trả lời giải bài tập, chuyện phiếm..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
              />
            </div>

            {/* HÀNG NÚT THAO TÁC KỊCH BẢN */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSavingPrompt || isLoadingPrompt}
                  className="px-6 py-3 rounded-xl text-xs font-bold border border-slate-200/80 bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white shadow-2xs transition-all flex items-center gap-2 disabled:opacity-50 font-semibold text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSavingPrompt ? "Đang lưu kịch bản..." : "Lưu Kịch Bản & Phạm Vi Kiến Thức"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaultPrompt}
                  disabled={isSavingPrompt}
                  className="px-4 py-3 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-[#EAE2D0] text-slate-900 shadow-2xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5892F]" />
                  <span>Khôi phục Kịch Bản Chuẩn Dân Gian</span>
                </button>
              </div>

              {promptSaveSuccess && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{promptSaveSuccess}</span>
                </span>
              )}
            </div>

            {/* KHUNG THỬ NGHIỆM PHẢN HỒI KỊCH BẢN TRỰC TIẾP */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5892F]" />
                  <span>Thử Nghiệm Phản Hồi Trực Tiếp Của Trạng Tí:</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  Kiểm tra xem Trạng Tí trả lời đúng phạm vi và từ chối câu hỏi ngoài lề ra sao
                </span>
              </div>

              {/* CÂU HỎI MẪU NHANH */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-500">Gợi ý câu hỏi thử:</span>
                <button
                  type="button"
                  onClick={() => {
                    const q = "Hút thử pod chill một hơi thì có bị nghiện không Trạng Tí?";
                    setTestPromptQuery(q);
                    handleTestPromptSimulation(q);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 transition-all"
                >
                  🎯 Test câu hỏi ma túy: "Pod chill có nghiện không?"
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const q = "Giải giúp em bài toán này: Tìm x biết 2x + 10 = 30?";
                    setTestPromptQuery(q);
                    handleTestPromptSimulation(q);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 transition-all font-bold"
                >
                  🛑 Test câu hỏi cấm ngoài lề: "Giải bài toán 2x + 10 = 30"
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPromptQuery}
                  onChange={(e) => setTestPromptQuery(e.target.value)}
                  placeholder="Nhập câu hỏi thử nghiệm để kiểm tra phản hồi..."
                  className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleTestPromptSimulation()}
                  disabled={isTestingPromptQuery || !testPromptQuery.trim()}
                  className="px-4 py-2 bg-[#1E1B18] hover:bg-black text-[#E1D4BB] font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isTestingPromptQuery ? "animate-spin" : ""}`} />
                  <span>{isTestingPromptQuery ? "Đang hỏi..." : "Thử Nghiệm Ngay"}</span>
                </button>
              </div>

              {testPromptResult && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-semibold font-bold text-xs text-[#1e3a8a]">
                      Phản hồi thực tế từ Trạng Tí Cố Vấn:
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-white border border-slate-200">
                      KẾT QUẢ KIỂM TRA
                    </span>
                  </div>
                  <p className="text-xs text-slate-900 whitespace-pre-line leading-relaxed">
                    {testPromptResult}
                  </p>
                </div>
              )}
            </div>
          </form>

          {/* =========================================================================
              PHẦN 7.2: QUẢN LÝ KHÓA KẾT NỐI BÍ MẬT & PHÂN TẢI (ZERO-LEAKAGE)
          ========================================================================= */}
          {/* KHUNG NẠP VÀ LƯU KHÓA BẢO MẬT */}
          <form
            onSubmit={handleSaveKeys}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5"
          >
            <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#1e3a8a]" />
                  <h3 className="font-semibold font-bold text-base text-[#1e3a8a]">
                    7.2. Quản Lý Khóa Cố Vấn Trạng Tí (Bí Thuật Khai Mở Trí Tuệ)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Nạp các khóa kết nối để kích hoạt năng lực đàm đạo và giải đáp thấu tình đạt lý cho Trạng Tí Cố Vấn.
                </p>
              </div>
              <span className="rounded-full text-[10px] font-bold px-2 py-0.5 border text-[10px] px-2.5 py-1 rounded font-semibold bg-[#FEE2E2] text-[#1e3a8a] border border-[#9E2A2B]">
                BẢO MẬT TUYỆT ĐỐI (ZERO-LEAKAGE)
              </span>
            </div>

            {/* THẺ GIẢI THÍCH NGUYÊN TẮC AN TOÀN */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-900">
              <div className="font-semibold font-bold text-sm text-[#1e3a8a] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C5892F]" />
                <span>Cơ Chế Bảo Vệ Nghiêm Ngặt Dành Cho Nhiều Quản Trị Viên:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#554A3B]">
                <li>
                  <strong className="text-slate-900">Nạp hàng loạt:</strong> Cho phép dán nhiều khóa cùng lúc (mỗi khóa 1 dòng hoặc cách nhau bởi dấu phẩy).
                </li>
                <li>
                  <strong className="text-slate-900">Thử nghiệm trước khi lưu:</strong> Kiểm tra tính thông suốt và độ trễ mạng (ms) của từng khóa.
                </li>
                <li>
                  <strong className="text-slate-900">Tự động tiêu hủy mã thô (Zero-Leakage):</strong> Ngay khi bấm "Lưu Khóa", khung nhập liệu sẽ bị xóa trắng hoàn toàn. Khóa được lưu vào hệ thống cơ sở dữ liệu có hàng rào Row Level Security (RLS) khóa kín.
                </li>
                <li>
                  <strong className="text-slate-900">Mã hóa hiển thị (Masked):</strong> Giao diện chỉ hiển thị dạng <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">••••••••cdef</code>, ngăn chặn hoàn toàn việc nhìn trộm hoặc sao chép giữa các quản trị viên.
                </li>
                <li>
                  <strong className="text-slate-900">Tự động xoay tua & Phân tải (Rotation & Failover):</strong> Khi học sinh gửi câu hỏi, hệ thống sẽ chia đều tải ngẫu nhiên và tự động chuyển sang khóa dự phòng nếu một khóa bị đầy tải.
                </li>
              </ul>
            </div>

            {/* CHỌN CHẾ ĐỘ NẠP */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-900">
              <span>Phương thức nạp:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="keyMode"
                  value="append"
                  checked={keyMode === "append"}
                  onChange={() => setKeyMode("append")}
                  className="accent-[#9E2A2B]"
                />
                <span>Thêm dồn vào danh sách hiện có (Khuyên dùng)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="keyMode"
                  value="replace"
                  checked={keyMode === "replace"}
                  onChange={() => setKeyMode("replace")}
                  className="accent-[#9E2A2B]"
                />
                <span className="text-red-700">Thay thế toàn bộ danh sách cũ</span>
              </label>
            </div>

            {/* TEXTAREA NHẬP NHIỀU KHÓA */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1e3a8a]">
                Nhập danh sách các khóa bí mật (Một hoặc nhiều khóa): <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={5}
                value={keyRawInput}
                onChange={(e) => setKeyRawInput(e.target.value)}
                placeholder="Dán các khóa kết nối vào đây, mỗi khóa một dòng hoặc cách nhau bởi dấu phẩy..."
                className="w-full bg-white border border-slate-200/80 rounded-2xl p-3.5 text-xs font-mono placeholder:text-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#9E2A2B]"
              />
              <p className="text-[11px] text-slate-500 italic">
                * Lưu ý: Khung này sẽ tự động xóa sạch dữ liệu ngay sau khi lưu để bảo mật tuyệt đối.
              </p>
            </div>

            {/* CÁC NÚT THAO TÁC */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleTestKeys()}
                disabled={isTestingKeys || !keyRawInput.trim()}
                className="px-5 py-3 rounded-xl text-xs font-bold border border-slate-200/80 bg-slate-50 hover:bg-[#EAE2D0] text-slate-900 shadow-2xs transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-[#C5892F]" />
                <span>{isTestingKeys ? "Đang thử nghiệm..." : "Thử Nghiệm Khóa Vừa Nhập"}</span>
              </button>

              <button
                type="submit"
                disabled={isSavingKeys || !keyRawInput.trim()}
                className="px-6 py-3 rounded-xl text-xs font-bold border border-slate-200/80 bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white shadow-2xs transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
              >
                <Lock className="w-4 h-4" />
                <span>{isSavingKeys ? "Đang mã hóa & lưu..." : "Lưu & Khóa Mã Bảo Mật"}</span>
              </button>
            </div>

            {/* THÔNG BÁO LƯU THÀNH CÔNG */}
            {keySaveSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{keySaveSuccess}</span>
              </div>
            )}

            {/* KẾT QUẢ THỬ NGHIỆM */}
            {testFeedback && (
              <div
                className={`p-4 rounded-2xl border ${
                  testFeedback.success
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-amber-50 border-amber-300 text-amber-900"
                } space-y-3 text-xs`}
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-4 h-4 ${testFeedback.success ? "text-emerald-600" : "text-amber-600"}`}
                    />
                    <span>{testFeedback.message}</span>
                  </div>
                </div>

                {testFeedback.results && testFeedback.results.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {testFeedback.results.map((res: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white/80 rounded-xl border border-slate-200 flex items-center justify-between font-mono text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              res.status === "valid" ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />
                          <span className="font-bold">Khóa #{res.index ?? idx + 1}:</span>
                          <span>{res.masked}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {res.latency && (
                            <span className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">
                              {res.latency}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              res.status === "valid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {res.status === "valid" ? "Sẵn sàng" : "Lỗi"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          {/* DANH SÁCH KHÓA ĐANG KÍCH HOẠT TRONG HỆ THỐNG */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-semibold font-bold text-sm text-[#1e3a8a]">
                  Danh Sách Khóa Đang Trực Tuyến Trong Hệ Thống ({maskedKeysList.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tất cả các khóa được mã hóa che giấu tự động, chỉ hiển thị 4 ký tự kiểm tra cuối cùng.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTestKeys()}
                  disabled={isTestingKeys || maskedKeysList.length === 0}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-[#EAE2D0] text-slate-900 transition-all flex items-center gap-1.5 disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingKeys ? "animate-spin" : ""}`} />
                  <span>Thử nghiệm toàn bộ</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAllKeys}
                  disabled={maskedKeysList.length === 0}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 transition-all flex items-center gap-1 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa tất cả</span>
                </button>
              </div>
            </div>

            {isLoadingKeys ? (
              <div className="text-center py-8 text-xs text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#C5892F]" />
                <span>Đang kiểm tra danh bạ khóa bảo mật...</span>
              </div>
            ) : maskedKeysList.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <KeyRound className="w-8 h-8 mx-auto mb-2 text-[#C5892F] opacity-50" />
                <p className="font-bold text-slate-900">Chưa có khóa nào được nạp vào hệ thống</p>
                <p className="text-[11px] mt-0.5">
                  Hãy dán danh sách khóa vào khung phía trên và bấm "Lưu & Khóa Mã Bảo Mật" để kích hoạt trí tuệ cho Trạng Tí.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {maskedKeysList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#1E1B18] text-[#E1D4BB] font-bold text-xs flex items-center justify-center font-mono">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs font-bold tracking-widest text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {item.masked}
                          </code>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Đã bảo vệ</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Sẵn sàng xoay tua đàm đạo cho học sinh
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTestKeys(idx)}
                        disabled={isTestingKeys}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 transition-all flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#C5892F]" />
                        <span>Thử khóa này</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteKey(idx)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: CẤU HÌNH SEO & ẢNH THUMBNAIL CHIA SẺ MẠNG XÃ HỘI */}
      {/* ======================================================== */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          {/* HEADER TAB */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-[#0284c7] mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Cấu hình Siêu Dữ Liệu & Mạng Xã Hội</span>
              </div>
              <h3 className="font-black text-lg sm:text-xl text-[#1e3a8a] tracking-tight">
                Cài Đặt SEO & Thumbnail Khi Gửi Link Zalo / Facebook
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Tùy chỉnh tiêu đề, mô tả và đặc biệt là <strong>ảnh đại diện thumbnail</strong> hiển thị tự động khi thầy cô và học sinh gửi link trang web qua Zalo, Facebook, Messenger hoặc Telegram.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSeoSettings}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tải lại</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveSeo} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CỘT TRÁI (7/12): CÁC Ô NHẬP LIỆU SEO */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span>📝 Thông Tin Thẻ Meta & Tìm Kiếm</span>
              </h4>

              {/* TIÊU ĐỀ SEO */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-900">
                    Tiêu đề trang (SEO Title): <span className="text-red-600">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${seoTitle.length > 70 ? "text-amber-600 font-bold" : "text-slate-400"}`}>
                    {seoTitle.length}/70 ký tự (chuẩn: 50-65)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Lá Chắn Học Đường - Phòng Chống Ma Túy Học Đường THCS"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* MÔ TẢ META */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-900">
                    Mô tả tóm tắt (Meta Description): <span className="text-red-600">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${seoDescription.length > 170 ? "text-amber-600 font-bold" : "text-slate-400"}`}>
                    {seoDescription.length}/170 ký tự (chuẩn: 120-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Cổng thông tin và Trợ lý Trạng Tí Cố Vấn phòng chống ma túy học đường, nhận diện ma túy ngụy trang thế hệ mới..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* TỪ KHÓA TÌM KIẾM */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Từ khóa tìm kiếm Google (Meta Keywords, cách nhau bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="phòng chống ma túy, học đường, THCS Nguyễn Hồng Ánh, Trạng Tí AI, pod chill, nước vui"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* SITE URL */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Địa chỉ trang web chính thức (Canonical URL):
                </label>
                <input
                  type="url"
                  value={seoSiteUrl}
                  onChange={(e) => setSeoSiteUrl(e.target.value)}
                  placeholder="https://phong-chong-ma-tuy-hoc-duong.vercel.app"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* KHỐI CẤU HÌNH NHẬN DIỆN THƯƠNG HIỆU: LOGO & CHÂN TRANG */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0284c7]" />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#1e3a8a]">
                    Nhận Diện Thương Hiệu: Logo Website & Bản Quyền Chân Trang
                  </h4>
                </div>

                {/* 1. LOGO WEBSITE */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>Ảnh Logo Website (Hiển thị tại Header & Footer):</span>
                    </label>
                    {siteLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setSiteLogoUrl("")}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-all"
                      >
                        ✕ Xóa logo (Ẩn logo trên toàn web)
                      </button>
                    )}
                  </div>

                  {/* PREVIEW LOGO HIỆN TẠI HOẶC TRẠNG THÁI ẨN */}
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center shrink-0">
                      {siteLogoUrl ? (
                        <img
                          src={siteLogoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <ShieldAlert className="w-7 h-7 text-slate-300" />
                      )}
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-800">
                        {siteLogoUrl ? "✅ Đang hiển thị Logo tùy chỉnh" : "🛡️ Hiện đang ẩn logo (Sử dụng biểu tượng lá chắn mặc định)"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Khi để trống hoặc xóa logo, thanh điều hướng và chân trang sẽ hiển thị biểu tượng lá chắn bảo vệ học đường trang nhã.
                      </p>
                    </div>
                  </div>

                  {/* TẢI LOGO MỚI */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      Tải Logo mới từ máy tính (Tự động nén WebP siêu nhẹ):
                    </span>
                    <WebpCanvasConverter
                      folderPath="branding"
                      label="Tải ảnh Logo lên Supabase"
                      onUploadSuccess={(url) => setSiteLogoUrl(url)}
                    />
                  </div>

                  {/* HOẶC NHẬP URL LOGO */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Hoặc dán trực tiếp đường dẫn URL ảnh Logo:
                    </label>
                    <input
                      type="text"
                      value={siteLogoUrl}
                      onChange={(e) => setSiteLogoUrl(e.target.value)}
                      placeholder="https://... hoặc /trolyai.png"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. NỘI DUNG CHÂN TRANG / BẢN QUYỀN (FOOTER COPYRIGHT) */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>Thông tin Chân trang & Bản quyền (Footer Text):</span>
                    </label>
                    {footerCopyrightText && (
                      <button
                        type="button"
                        onClick={() => setFooterCopyrightText("")}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-all"
                      >
                        ✕ Xóa trắng (Ẩn bản quyền)
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={footerCopyrightText}
                    onChange={(e) => setFooterCopyrightText(e.target.value)}
                    placeholder="Ví dụ: © 2026 Lá Chắn Học Đường. Mọi quyền được bảo lưu."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none"
                  />

                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    💡 <strong>Lưu ý quan trọng:</strong> Nếu Thầy <strong>để trống</strong> ô này, chân trang sẽ hoàn toàn không hiển thị thông tin bản quyền hay tên trường nào, mà chỉ hiển thị thông điệp chung: <em>"Chung tay xây dựng môi trường học đường an toàn, không ma túy"</em>.
                  </p>
                </div>
              </div>

              {/* CẤU HÌNH ẢNH THUMBNAIL (OG IMAGE) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900">
                  Ảnh Thumbnail khi chia sẻ Zalo / Facebook: <span className="text-red-600">*</span>
                </label>

                {/* CÁC NÚT CHỌN NHANH */}
                <div className="flex flex-wrap gap-2">
                  {siteLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setSeoOgImage(siteLogoUrl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        seoOgImage === siteLogoUrl
                          ? "bg-sky-50 text-[#0284c7] border-sky-300 ring-2 ring-sky-500/20"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      🏫 Dùng Logo Website Đã Tải Lên
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSeoOgImage("/trolyai.png")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      seoOgImage === "/trolyai.png" || seoOgImage.endsWith("/trolyai.png")
                        ? "bg-sky-50 text-[#0284c7] border-sky-300 ring-2 ring-sky-500/20"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    🤖 Dùng Avatar Trợ Lý AI (/trolyai.png)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSeoOgImage("/images/hero_school_banner.png")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      seoOgImage === "/images/hero_school_banner.png" || seoOgImage.endsWith("/hero_school_banner.png")
                        ? "bg-sky-50 text-[#0284c7] border-sky-300 ring-2 ring-sky-500/20"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    🎨 Dùng Banner Học Đường
                  </button>
                </div>

                {/* HOẶC TẢI ẢNH MỚI LÊN */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    Hoặc tải ảnh Thumbnail mới từ máy (Khuyến nghị tỷ lệ 1200x630 hoặc ảnh vuông):
                  </span>
                  <WebpCanvasConverter
                    folderPath="seo"
                    label="Tải ảnh Thumbnail lên Supabase (Tự động nén WebP)"
                    onUploadSuccess={(url) => setSeoOgImage(url)}
                  />
                </div>
              </div>

              {/* NÚT LƯU CÀI ĐẶT */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSavingSeo}
                  className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#1e40af] text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSavingSeo ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang lưu cài đặt SEO...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Lưu Cấu Hình SEO & Thumbnail Lên Supabase</span>
                    </>
                  )}
                </button>
              </div>

              {seoSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>✅ Đã lưu cấu hình SEO và Thumbnail chia sẻ thành công!</span>
                </div>
              )}
            </div>

            {/* CỘT PHẢI (5/12): MÔ PHỎNG XEM TRƯỚC TRÊN ZALO / FACEBOOK */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#0284c7]" />
                    <span>Mô Phỏng Xem Trước Khi Gửi Link</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-[#0284c7]">
                    Live Preview
                  </span>
                </div>

                {/* MOCKUP TIN NHẮN ZALO */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Xem trước bong bóng link trên Zalo / Facebook:</span>
                  </div>

                  <div className="bg-[#E7ECF3] p-4 rounded-2xl">
                    {/* KHUNG CARD CHIA SẺ */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md max-w-sm mx-auto">
                      {/* ẢNH THUMBNAIL */}
                      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden flex items-center justify-center">
                        <img
                          src={seoOgImage || "/logo.jpg"}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            e.target.src = "/logo.jpg";
                          }}
                        />
                        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                          Thumbnail Preview
                        </span>
                      </div>

                      {/* TEXT BÊN DƯỚI */}
                      <div className="p-3.5 space-y-1.5 bg-white">
                        <p className="text-[10px] text-blue-600 font-medium truncate">
                          {seoSiteUrl || "https://phong-chong-ma-tuy-hoc-duong.vercel.app"}
                        </p>
                        <h5 className="font-black text-xs text-slate-900 leading-snug line-clamp-2">
                          {seoTitle || "Lá Chắn Học Đường - Phòng Chống Ma Túy Học Đường THCS"}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {seoDescription || "Cổng thông tin và Trợ lý Trạng Tí Cố Vấn phòng chống ma túy học đường..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GỢI Ý CỦA SIÊU AGENT */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
                  <span className="font-black flex items-center gap-1">
                    💡 Mẹo quan trọng khi gửi link Zalo:
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Sau khi Thầy bấm <strong>Lưu Cấu Hình</strong>, nếu gửi link lên Zalo mà chưa thấy đổi ảnh ngay, đó là do Zalo lưu bộ nhớ đệm (cache) trong vài giờ. Thầy có thể dán link vào công cụ <strong>Zalo Debugger</strong> hoặc đổi đuôi link thành <code>?v=1</code> để Zalo lập tức tải ảnh thumbnail mới!
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
