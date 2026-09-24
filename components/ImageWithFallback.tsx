"use client";

import React, { useState, useEffect } from "react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackSrc = "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80",
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  if (!imgSrc || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F8F4EA] border border-[#D6C8B2] text-[#7A6B58] p-4 text-center select-none ${className}`}
      >
        <span className="text-2xl mb-1">🛡️</span>
        <span className="font-heritage text-xs font-bold text-[#9E2A2B]">Lá Chắn Học Đường</span>
        <span className="text-[10px] text-[#7A6B58] mt-0.5 line-clamp-1">{alt || "Ảnh minh họa"}</span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}
