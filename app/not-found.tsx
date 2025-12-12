import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import azTranslations from "@/locales/az.json";

// Helper function to get translation safely
function getTranslation(key: string, translations: Record<string, any>): string {
  const keys = key.split(".");
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === "string" ? value : key;
}

// Use default translations for static generation
const defaultTranslations = azTranslations as Record<string, any>;
const translations = {
  title: getTranslation("notFound.title", defaultTranslations) || "Page Not Found",
  description: getTranslation("notFound.description", defaultTranslations) || "The page you're looking for doesn't exist or has been moved.",
  goHome: getTranslation("notFound.goHome", defaultTranslations) || "Go Home",
  goBack: getTranslation("notFound.goBack", defaultTranslations) || "Go Back",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {translations.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {translations.description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            {translations.goHome}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            {translations.goBack}
          </Link>
        </div>
      </div>
    </div>
  );
}

