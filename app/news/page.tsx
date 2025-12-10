"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getNews } from "@/lib/admin";
import NewsCard from "@/components/cards/NewsCard";
import { formatDate } from "@/lib/utils";
import { Calendar, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { News } from "@/types";

export default function NewsPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      // Add timeout wrapper
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const data = await Promise.race([
        getNews(),
        timeoutPromise
      ]);
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Map category names to translation keys - memoized
  const categoryToKey = useCallback((category: string): string => {
    const mapping: Record<string, string> = {
      "Product Updates": "productUpdates",
      "Tax Updates": "taxUpdates",
      "Events": "events",
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
    return (
      <article className="py-20">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setSelectedNews(null)}
            className="mb-8 text-primary-600 hover:text-primary-700 flex items-center gap-2"
          >
            ← {t("news.backToNews")}
          </button>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
              <div className="mb-6">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded mb-4">
                  {t(`news.categories.${categoryToKey(currentNews.category)}`) || currentNews.category}
                </span>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(currentNews.date)}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {t(`news.items.${currentNews.id}.title`) || currentNews.title}
                </h1>
              </div>
              <div className="bg-gray-100 rounded-lg h-64 mb-8 flex items-center justify-center">
                <span className="text-6xl">📰</span>
              </div>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t(`news.items.${currentNews.id}.excerpt`) || currentNews.excerpt}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t(`news.items.${currentNews.id}.content`) || currentNews.content}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
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

