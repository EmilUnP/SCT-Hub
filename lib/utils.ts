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
    // Parse the date string - handle both ISO format and other formats
    let dateObj: Date;
    
    // If date is in ISO format (YYYY-MM-DD), parse it explicitly
    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      const [year, month, day] = date.split('-').map(Number);
      dateObj = new Date(year, month - 1, day); // month is 0-indexed
    } else {
      dateObj = new Date(date);
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn(`Invalid date string: ${date}`);
      return date; // Return original string if invalid
    }

    // Format the date with proper locale
    const formatted = dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Validate the formatted output doesn't contain malformed month (like "M12")
    if (/M\d+/.test(formatted)) {
      // Fallback to a more reliable format
      const monthNames: Record<string, string[]> = {
        "en-US": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "az-AZ": ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
        "ru-RU": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      };
      
      const months = monthNames[locale] || monthNames["en-US"];
      const month = months[dateObj.getMonth()];
      const day = dateObj.getDate();
      const year = dateObj.getFullYear();
      
      return `${month} ${day}, ${year}`;
    }

    return formatted;
  } catch (error) {
    console.error(`Error formatting date: ${date}`, error);
    return date; // Return original string on error
  }
}

