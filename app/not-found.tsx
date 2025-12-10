"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("notFound.title") || "Page Not Found"}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t("notFound.description") || "The page you're looking for doesn't exist or has been moved."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            {t("notFound.goHome") || "Go Home"}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("notFound.goBack") || "Go Back"}
          </button>
        </div>
      </div>
    </div>
  );
}

