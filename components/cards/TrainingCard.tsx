"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import { Clock, User, Calendar, Coins } from "lucide-react";
import { Training } from "@/types";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrainingCardProps {
  training: Training;
  onClick?: (trainingId: string) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80";

function TrainingCard({ training, onClick }: TrainingCardProps) {
  const { t, language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(training.image || DEFAULT_IMAGE);
  
  // Memoize click handler
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(training.id);
    }
  }, [onClick, training.id]);

  // Handle image error with fallback
  const handleImageError = useCallback(() => {
    if (!imageError && imageSrc !== DEFAULT_IMAGE) {
      setImageError(true);
      setImageSrc(DEFAULT_IMAGE);
    }
  }, [imageError, imageSrc]);

  // Validate image URL
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  const finalImageSrc = isValidImageUrl(imageSrc) ? imageSrc : DEFAULT_IMAGE;

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-2xl shadow-modern hover:shadow-modern-lg transition-all duration-500 overflow-hidden border border-gray-100/50 h-full group card-hover ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={finalImageSrc}
          alt={training.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          onError={handleImageError}
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized={finalImageSrc.includes('tezbazar.az') || finalImageSrc.includes('sinam.net')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <span className="absolute top-4 left-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-glow backdrop-blur-sm">
          {t(`trainings.categories.${training.category}`) || training.category}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
          {training.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {training.description}
        </p>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{training.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(training.date, language)}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{training.trainer}</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4" />
          <span className="font-semibold text-gray-900">{training.price}</span>
        </div>
      </div>

        <button className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105">
          {t("common.viewDetails") || "View Details"}
        </button>
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(TrainingCard);
