"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import { services, teamMembers } from "@/lib/data";
import { getTrainings, getNews } from "@/lib/admin";
import dynamic from "next/dynamic";

// Lazy load modal (doesn't need SSR)
const InquiryModal = dynamic(() => import("@/components/forms/InquiryModal"), {
  ssr: false,
});

// Lazy load card components (below-the-fold content)
const ServiceCard = dynamic(() => import("@/components/cards/ServiceCard"), {
  loading: () => <div className="bg-white rounded-2xl shadow-md h-96 animate-pulse" />,
});

const TrainingCard = dynamic(() => import("@/components/cards/TrainingCard"), {
  loading: () => <div className="bg-white rounded-2xl shadow-md h-96 animate-pulse" />,
});

const NewsCard = dynamic(() => import("@/components/cards/NewsCard"), {
  loading: () => <div className="bg-white rounded-xl shadow-md h-80 animate-pulse" />,
});

const TeamMemberCard = dynamic(() => import("@/components/cards/TeamMemberCard"), {
  loading: () => <div className="bg-white rounded-2xl shadow-md aspect-[3/4] animate-pulse" />,
});
import { useLanguage } from "@/contexts/LanguageContext";
import type { Training, News } from "@/types";

export default function Home() {
  const { t } = useLanguage();
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Add timeout wrapper to prevent hanging requests
      const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
          )
        ]);
      };
      
      // getTrainings and getNews now handle errors internally and return empty arrays
      const [trainingsData, newsData] = await Promise.all([
        getTrainings(),
        getNews(),
      ]);

      setTrainings(Array.isArray(trainingsData) ? trainingsData : []);
      setNews(Array.isArray(newsData) ? newsData.slice(0, 3) : []);
    } catch (error) {
      console.error("Failed to load data:", error);
      setTrainings([]);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Memoize statistics to prevent recalculation on every render
  const statistics = useMemo(() => ({
    clients: 500,
    yearsExperience: 15,
    services: services.length,
    trainings: trainings.length,
  }), [trainings.length]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleInquiry = useCallback((serviceId: string) => {
    setSelectedService(serviceId);
    setInquiryModalOpen(true);
  }, []);

  const handleOpenInquiry = useCallback(() => {
    setSelectedService("");
    setInquiryModalOpen(true);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden />
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
            alt="Professional business team"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-40 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700/85 via-primary-800/75 to-primary-900/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" aria-hidden />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl stagger-children">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 font-medium">
              {t("home.hero.subtitle")}
            </p>
            <p className="text-lg text-primary-200/95 mb-10 max-w-2xl leading-relaxed">
              {t("home.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleOpenInquiry}
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                {t("home.hero.getStarted")}
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/services"
                className="px-8 py-4 border-2 border-white/80 text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                {t("home.hero.ourServices")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 stagger-children">
            <div className="relative text-center p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-100 transition-all duration-500 ease-out overflow-hidden group/stat">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-3 tabular-nums">{statistics.clients}+</div>
              <div className="text-gray-600 font-semibold text-sm md:text-base">{t("home.statistics.happyClients")}</div>
            </div>
            <div className="relative text-center p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-100 transition-all duration-500 ease-out overflow-hidden group/stat">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-3 tabular-nums">{statistics.yearsExperience}+</div>
              <div className="text-gray-600 font-semibold text-sm md:text-base">{t("home.statistics.yearsExperience")}</div>
            </div>
            <div className="relative text-center p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-100 transition-all duration-500 ease-out overflow-hidden group/stat">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-3 tabular-nums">{statistics.services}+</div>
              <div className="text-gray-600 font-semibold text-sm md:text-base">{t("home.statistics.services")}</div>
            </div>
            <div className="relative text-center p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-100 transition-all duration-500 ease-out overflow-hidden group/stat">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-3 tabular-nums">{statistics.trainings}+</div>
              <div className="text-gray-600 font-semibold text-sm md:text-base">{t("home.statistics.trainingCourses")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 opacity-0 animate-section-reveal" style={{ animationDelay: "0.1s" }}>
            <h2 className="section-title section-title-center text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t("home.services.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("home.services.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {services.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} onInquiry={handleInquiry} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              {t("home.services.viewAllServices")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERP Integration Section */}
      <section className="py-20 bg-gray-50/90 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 opacity-0 animate-section-reveal" style={{ animationFillMode: "forwards", animationDelay: "0.05s" }}>
              <h2 className="section-title section-title-center text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                {t("home.serp.title")}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t("home.serp.subtitle")}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-100/50 p-8 md:p-12 mb-8 transition-shadow duration-300 hover:shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {t("home.serp.whatIsSERP")}
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">
                    {t("home.serp.description")}
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{t("home.serp.features.unifiedData")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{t("home.serp.features.realTimeReporting")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{t("home.serp.features.automatedWorkflows")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{t("home.serp.features.thirdPartyIntegrations")}</span>
                    </li>
                  </ul>
                  <Link
                    href="/serp"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                  >
                    {t("home.serp.learnMore")}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="relative rounded-xl overflow-hidden h-80 md:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    alt="Business analytics and data management"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Highlights */}
      <section className="py-20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 opacity-0 animate-section-reveal" style={{ animationFillMode: "forwards", animationDelay: "0.05s" }}>
            <h2 className="section-title section-title-center text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t("home.trainings.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("home.trainings.subtitle")}
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading trainings...</p>
            </div>
          ) : trainings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trainings.slice(0, 4).map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No trainings available at the moment.</p>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/trainings"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              {t("home.trainings.viewAllTrainings")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-gray-50/90 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 opacity-0 animate-section-reveal" style={{ animationFillMode: "forwards", animationDelay: "0.05s" }}>
            <h2 className="section-title section-title-center text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t("home.news.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("home.news.subtitle")}
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading news...</p>
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No news available at the moment.</p>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              {t("home.news.viewAllNews")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center opacity-0 animate-section-reveal" style={{ animationFillMode: "forwards", animationDelay: "0.05s" }}>
            <h2 className="section-title section-title-center text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t("home.about.title")}</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t("home.about.description")}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              {t("home.about.learnMore")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-gray-50/90 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 opacity-0 animate-section-reveal" style={{ animationFillMode: "forwards", animationDelay: "0.05s" }}>
            <h2 className="section-title section-title-center text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t("home.team.title")}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto mb-4" />
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("home.team.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} compact />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/about#team"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              {t("about.team.title")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="relative py-20 bg-primary-600 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
            alt="Professional consultation"
            fill
            sizes="100vw"
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-800/30 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center opacity-0 animate-section-reveal" style={{ animationFillMode: "forwards", animationDelay: "0.05s" }}>
            <h2 className="section-title section-title-center section-title-light text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t("home.contact.title")}</h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              {t("home.contact.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
              >
                {t("home.contact.contactUs")}
              </Link>
              <a
                href="tel:+1234567890"
                className="px-8 py-4 border-2 border-white/80 text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {t("home.contact.callUsNow")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        initialService={selectedService}
      />
    </>
  );
}
