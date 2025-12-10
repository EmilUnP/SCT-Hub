"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, Database, TrendingUp, Users, Package, BarChart, Link as LinkIcon } from "lucide-react";
import { serpModules } from "@/lib/data";
import InquiryModal from "@/components/forms/InquiryModal";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  Package: <Package className="w-8 h-8" />,
  BarChart: <BarChart className="w-8 h-8" />,
  Link: <LinkIcon className="w-8 h-8" />,
};

export default function SERPPage() {
  const { t } = useLanguage();
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <>
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80"
            alt="Business technology and analytics"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{t("serp.title")}</h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl">
            {t("serp.subtitle")}
          </p>
        </div>
      </section>

      {/* SERP Description */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("serp.whatIsSERP.title")}</h2>
              <p className="text-lg text-gray-600">
                {t("serp.whatIsSERP.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("serp.whatIsSERP.comprehensiveSolution.title")}</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {t("serp.whatIsSERP.comprehensiveSolution.description1")}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t("serp.whatIsSERP.comprehensiveSolution.description2")}
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl h-80">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="Business analytics dashboard"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERP Modules */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("serp.modules.title")}</h2>
            <p className="text-lg text-gray-600">
              {t("serp.modules.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serpModules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                  {iconMap[module.icon] || <Database className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{t(`serp.modules.${module.id}.title`)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(`serp.modules.${module.id}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERP Advantages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("serp.advantages.title")}</h2>
              <p className="text-lg text-gray-600">
                {t("serp.advantages.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { key: "unifiedPlatform" },
                { key: "realTimeData" },
                { key: "automatedWorkflows" },
                { key: "customizable" },
                { key: "scalable" },
                { key: "expertSupport" },
              ].map((advantage, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                      <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{t(`serp.advantages.${advantage.key}.title`)}</h3>
                      <p className="text-gray-600 leading-relaxed">{t(`serp.advantages.${advantage.key}.description`)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Request */}
      <section className="relative py-20 bg-primary-600 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80"
            alt="Technology dashboard"
            fill
            sizes="100vw"
            className="object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("serp.demo.title")}</h2>
            <p className="text-xl text-primary-100 mb-8">
              {t("serp.demo.description")}
            </p>
            <button
              onClick={() => setDemoModalOpen(true)}
              className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              {t("serp.demo.requestDemo")}
            </button>
          </div>
        </div>
      </section>

      <InquiryModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        initialService="serp-integration"
      />
    </>
  );
}

