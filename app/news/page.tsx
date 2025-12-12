"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { getNews } from "@/lib/admin";
import NewsCard from "@/components/cards/NewsCard";
import { formatDate } from "@/lib/utils";
import { Calendar, Filter, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { News } from "@/types";

export default function NewsPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      // getNews now handles errors gracefully and returns empty array
      const data = await getNews();
      console.log("News loaded:", data?.length || 0, "items");
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Map category names to translation keys - memoized
  const categoryToKey = useCallback((category: string): string => {
    const mapping: Record<string, string> = {
      "Product Updates": "productUpdates",
      "Tax Updates": "taxUpdates",
      "Events": "events",
      "Announcements": "announcements",
      "Industry News": "industryNews",
      "General": "general",
    };
    return mapping[category] || category.toLowerCase().replace(/\s+/g, "");
  }, []);

  // Memoize categories to prevent recalculation
  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(news.map((item) => item.category)))];
  }, [news]);

  // Memoize filtered news
  const filteredNews = useMemo(() => {
    return selectedCategory === "all"
      ? news
      : news.filter((item) => item.category === selectedCategory);
  }, [news, selectedCategory]);

  // Memoize current news
  const currentNews = useMemo(() => {
    return selectedNews ? news.find((n) => n.id === selectedNews) : null;
  }, [news, selectedNews]);

  if (loading) {
    return (
      <>
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("news.title")}</h1>
            <p className="text-xl text-primary-100 max-w-3xl">
              {t("news.subtitle")}
            </p>
          </div>
        </section>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">Loading news...</p>
          </div>
        </section>
      </>
    );
  }

  if (currentNews) {
    const newsImage = currentNews.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80";
    const newsTitle = t(`news.items.${currentNews.id}.title`) || currentNews.title;
    const newsExcerpt = t(`news.items.${currentNews.id}.excerpt`) || currentNews.excerpt;
    const newsContent = t(`news.items.${currentNews.id}.content`) || currentNews.content;

    return (
      <article className="min-h-screen bg-gray-50">
        {/* Hero Section with Image */}
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
          <Image
            src={newsImage}
            alt={newsTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <div className="container mx-auto max-w-4xl">
              <span className="inline-block bg-primary-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {t(`news.categories.${categoryToKey(currentNews.category)}`) || currentNews.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {newsTitle}
              </h1>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(currentNews.date, language)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <button
            onClick={() => setSelectedNews(null)}
            className="mb-8 text-primary-600 hover:text-primary-700 flex items-center gap-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("news.backToNews")}
          </button>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              {/* Excerpt */}
              {newsExcerpt && (
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <p className="text-xl text-gray-700 leading-relaxed font-medium">
                    {newsExcerpt}
                  </p>
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {newsContent.includes('\n') ? (
                    newsContent.split('\n').map((paragraph, index) => 
                      paragraph.trim() ? (
                        <p key={index} className="mb-6 text-lg">
                          {paragraph}
                        </p>
                      ) : null
                    )
                  ) : (
                    <p className="mb-6 text-lg">
                      {newsContent}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("news.title")}</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            {t("news.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Filter */}
          <div className="mb-8 flex flex-wrap gap-4 items-center">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">{t("news.filterByCategory")}:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category === "all" 
                  ? t("news.all") 
                  : t(`news.categories.${categoryToKey(category)}`) || category}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} onClick={(id) => setSelectedNews(id)} />
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">{t("news.noNewsFound")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

