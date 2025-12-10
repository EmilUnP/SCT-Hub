import Image from "next/image";
import { Calendar } from "lucide-react";
import { News } from "@/types";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewsCardProps {
  news: News;
  onClick?: (newsId: string) => void;
}

// Map category names to translation keys
const categoryToKey = (category: string): string => {
  const mapping: Record<string, string> = {
    "Product Updates": "productUpdates",
    "Tax Updates": "taxUpdates",
    "Events": "events",
  };
  return mapping[category] || category.toLowerCase().replace(/\s+/g, "");
};

export default function NewsCard({ news, onClick }: NewsCardProps) {
  const { t } = useLanguage();
  const handleClick = () => {
    if (onClick) {
      onClick(news.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={news.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"}
          alt={news.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          {t(`news.categories.${categoryToKey(news.category)}`) || news.category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {news.excerpt}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(news.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
