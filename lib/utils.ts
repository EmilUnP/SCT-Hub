import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, language: string = "en"): string {
  // Map language codes to locale codes
  const localeMap: Record<string, string> = {
    az: "az-AZ",
    en: "en-US",
    ru: "ru-RU",
  };

  const locale = localeMap[language] || localeMap.en;

  try {
    // Parse the date string
    const dateObj = new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn(`Invalid date string: ${date}`);
      return date; // Return original string if invalid
    }

    // Format the date with proper locale
    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error(`Error formatting date: ${date}`, error);
    return date; // Return original string on error
  }
}

