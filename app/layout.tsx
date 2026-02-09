import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import WebVitals from "@/components/WebVitals";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Better font loading performance
  preload: true,
});

export const metadata: Metadata = {
  title: "FinLogic Consulting & Training",
  description: "Professional accounting, HR, tax services and SERP system integration for businesses",
  openGraph: {
    title: "FinLogic Consulting & Training",
    description: "Professional accounting, HR, tax services and SERP system integration for businesses",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinLogic Consulting & Training",
    description: "Professional accounting, HR, tax services and SERP system integration for businesses",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <WebVitals />
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

