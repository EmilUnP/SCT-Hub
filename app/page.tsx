"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, TrendingUp, Users, Award, Phone } from "lucide-react";
import { services } from "@/lib/data";
import { getTrainings, getNews } from "@/lib/admin";
import ServiceCard from "@/components/cards/ServiceCard";
import TrainingCard from "@/components/cards/TrainingCard";
import NewsCard from "@/components/cards/NewsCard";
import InquiryModal from "@/components/forms/InquiryModal";
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
      const [trainingsData, newsData] = await Promise.all([
        getTrainings(),
        getNews(),
      ]);

      setTrainings(trainingsData);
      setNews(newsData.slice(0, 3)); // Show only latest 3 on homepage
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from loaded data
  const statistics = {
    clients: 500, // Keep static for now, can be moved to database later
    yearsExperience: 15, // Keep static for now
    services: services.length, // Use static services count
    trainings: trainings.length,
  };

  const handleInquiry = (serviceId: string) => {
    setSelectedService(serviceId);
    setInquiryModalOpen(true);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-24 md:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
            alt="Professional business team"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-primary-800/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 animate-fade-in-delay">
              {t("home.hero.subtitle")}
            </p>
            <p className="text-lg text-primary-200 mb-10 max-w-2xl animate-fade-in-delay-2">
              {t("home.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-3">
              <button
                onClick={() => {
                  setSelectedService("");
                  setInquiryModalOpen(true);
                }}
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group"
              >
                {t("home.hero.getStarted")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href="/services"
                className="px-8 py-4 border-2 border-white/80 text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 text-center backdrop-blur-sm hover:border-white"
              >
                {t("home.hero.ourServices")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-600 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-modern-lg transition-all duration-500">
              <div className="text-4xl md:text-5xl font-bold gradient-text-primary mb-3 transition-transform group-hover:scale-110">
                {statistics.clients}+
              </div>
              <div className="text-gray-600 font-semibold">{t("home.statistics.happyClients")}</div>
            </div>
            <div className="text-center group p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-modern-lg transition-all duration-500">
              <div className="text-4xl md:text-5xl font-bold gradient-text-primary mb-3 transition-transform group-hover:scale-110">
                {statistics.yearsExperience}+
              </div>
              <div className="text-gray-600 font-semibold">{t("home.statistics.yearsExperience")}</div>
            </div>
            <div className="text-center group p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-modern-lg transition-all duration-500">
              <div className="text-4xl md:text-5xl font-bold gradient-text-primary mb-3 transition-transform group-hover:scale-110">
                {statistics.services}+
              </div>
              <div className="text-gray-600 font-semibold">{t("home.statistics.services")}</div>
            </div>
            <div className="text-center group p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-modern-lg transition-all duration-500">
              <div className="text-4xl md:text-5xl font-bold gradient-text-primary mb-3 transition-transform group-hover:scale-110">
                {statistics.trainings}+
              </div>
              <div className="text-gray-600 font-semibold">{t("home.statistics.trainingCourses")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.services.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("home.services.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} onInquiry={handleInquiry} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold group"
            >
              {t("home.services.viewAllServices")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERP Integration Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t("home.serp.title")}
              </h2>
              <p className="text-xl text-gray-600">
                {t("home.serp.subtitle")}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 mb-8 overflow-hidden">
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold group"
                  >
                    {t("home.serp.learnMore")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="relative rounded-xl overflow-hidden h-80 md:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    alt="Business analytics and data management"
                    fill
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.trainings.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("home.trainings.subtitle")}
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading trainings...</p>
            </div>
          ) : trainings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {trainings.slice(0, 4).map((training) => (
                  <TrainingCard key={training.id} training={training} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No trainings available at the moment.</p>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/trainings"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold group"
            >
              {t("home.trainings.viewAllTrainings")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.news.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold group"
            >
              {t("home.news.viewAllNews")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.about.title")}</h2>
            <p className="text-xl text-gray-600 mb-8">
              {t("home.about.description")}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold group"
            >
              {t("home.about.learnMore")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            className="object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("home.contact.title")}</h2>
            <p className="text-xl text-primary-100 mb-8">
              {t("home.contact.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                {t("home.contact.contactUs")}
              </Link>
              <a
                href="tel:+1234567890"
                className="px-8 py-4 border-2 border-white/80 text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm hover:border-white"
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

