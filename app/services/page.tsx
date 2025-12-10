"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import InquiryModal from "@/components/forms/InquiryModal";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const handleInquiry = (serviceId: string) => {
    setSelectedService(serviceId);
    setInquiryModalOpen(true);
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("services.title")}</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            {t("services.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-3xl font-bold text-gray-900">{t(`services.${service.id}.title`)}</h2>
                    {service.serpIntegrated && (
                      <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded">
                        {t("services.serpIntegrated")}
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-gray-600 mb-6">{t(`services.${service.id}.description`)}</p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => {
                      const featureKeys: Record<string, string[]> = {
                        accounting: ["bookkeeping", "financialReporting", "accountsPayable", "bankReconciliation", "monthEndClosing"],
                        tax: ["taxPlanning", "taxReturn", "taxCompliance", "taxConsulting", "auditSupport"],
                        hr: ["payroll", "employeeRecords", "hrDocumentation", "complianceManagement", "performanceManagement"],
                        audit: ["financialAudits", "internalAudits", "complianceAudits", "riskAssessment", "auditReports"],
                        "serp-integration": ["systemIntegration", "dataMigration", "customWorkflows", "trainingSupport", "ongoingMaintenance"]
                      };
                      const key = featureKeys[service.id]?.[idx] || `feature${idx}`;
                      return (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{t(`services.${service.id}.features.${key}`) || feature}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    onClick={() => handleInquiry(service.id)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    {t("services.requestInquiry")}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 relative rounded-xl overflow-hidden h-80 shadow-lg">
                  <Image
                    src={
                      service.id.toLowerCase().includes("accounting")
                        ? "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
                        : service.id.toLowerCase().includes("hr") || service.id.toLowerCase().includes("human")
                        ? "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                        : service.id.toLowerCase().includes("tax")
                        ? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                        : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    }
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("services.customizedSolutions.title")}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t("services.customizedSolutions.description")}
            </p>
            <button
              onClick={() => {
                setSelectedService("");
                setInquiryModalOpen(true);
              }}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              {t("services.customizedSolutions.contactUs")}
            </button>
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

