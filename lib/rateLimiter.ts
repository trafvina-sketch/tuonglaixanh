/**
 * Bộ kiểm soát tần suất gọi (Rate Limiter) theo địa chỉ IP của người dùng
 * Thuật toán Sliding Window (Cửa sổ trượt) lưu trong bộ nhớ (In-memory)
 * Tối đa: 10 yêu cầu / 60 giây và 35 yêu cầu / 5 phút trên mỗi IP
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipHistoryMap = new Map<string, RateLimitRecord>();

// Định kỳ dọn dẹp các IP không còn hoạt động mỗi 5 phút để tránh rò rỉ bộ nhớ
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupOldRecords(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const threshold = now - 5 * 60 * 1000;
  ipHistoryMap.forEach((record, ip) => {
    record.timestamps = record.timestamps.filter((t) => t > threshold);
    if (record.timestamps.length === 0) {
      ipHistoryMap.delete(ip);
    }
  });
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  ip: string,
  limitPerMinute = 10,
  limitPerFiveMinutes = 35
): RateLimitResult {
  const now = Date.now();
  cleanupOldRecords(now);

  const normalizedIp = ip.trim() || "unknown";
  let record = ipHistoryMap.get(normalizedIp);

  if (!record) {
    record = { timestamps: [] };
    ipHistoryMap.set(normalizedIp, record);
  }

  // Lọc lấy các yêu cầu trong 1 phút qua và 5 phút qua
  const oneMinuteAgo = now - 60 * 1000;
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  // Giữ lại các timestamp trong 5 phút
  record.timestamps = record.timestamps.filter((t) => t > fiveMinutesAgo);

  const countLastMinute = record.timestamps.filter((t) => t > oneMinuteAgo).length;
  const countLastFiveMinutes = record.timestamps.length;

  // 1. Kiểm tra giới hạn 1 phút
  if (countLastMinute >= limitPerMinute) {
    const oldestInMinute = record.timestamps.find((t) => t > oneMinuteAgo) || now;
    const retryAfter = Math.ceil((oldestInMinute + 60 * 1000 - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  // 2. Kiểm tra giới hạn 5 phút
  if (countLastFiveMinutes >= limitPerFiveMinutes) {
    const oldestInFive = record.timestamps[0] || now;
    const retryAfter = Math.ceil((oldestInFive + 5 * 60 * 1000 - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  // Ghi nhận lần gọi hợp lệ
  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: Math.max(0, limitPerMinute - countLastMinute - 1),
    retryAfterSeconds: 0,
  };
}
