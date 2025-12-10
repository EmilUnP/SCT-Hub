"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Service } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceCardProps {
  service: Service;
  onInquiry?: (serviceId: string) => void;
}

const serviceImages: Record<string, string> = {
  accounting: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  hr: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
  tax: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  default: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
};

export default function ServiceCard({ service, onInquiry }: ServiceCardProps) {
  const { t } = useLanguage();
  const getServiceImage = () => {
    const serviceId = service.id.toLowerCase();
    if (serviceId.includes("accounting")) return serviceImages.accounting;
    if (serviceId.includes("hr") || serviceId.includes("human")) return serviceImages.hr;
    if (serviceId.includes("tax")) return serviceImages.tax;
    return serviceImages.default;
  };

  return (
    <div className="bg-white rounded-2xl shadow-modern hover:shadow-modern-lg transition-all duration-500 overflow-hidden border border-gray-100/50 group card-hover">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getServiceImage()}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        {service.serpIntegrated && (
          <span className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-glow backdrop-blur-sm">
            {t("services.serpIntegrated")}
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
          {t(`services.${service.id}.title`)}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{t(`services.${service.id}.description`)}</p>

        <ul className="space-y-2 mb-6">
          {service.features.slice(0, 3).map((feature, index) => {
            // Map service features to translation keys
            const featureKeys: Record<string, string[]> = {
              accounting: ["bookkeeping", "financialReporting", "accountsPayable", "bankReconciliation", "monthEndClosing"],
              tax: ["taxPlanning", "taxReturn", "taxCompliance", "taxConsulting", "auditSupport"],
              hr: ["payroll", "employeeRecords", "hrDocumentation", "complianceManagement", "performanceManagement"],
              audit: ["financialAudits", "internalAudits", "complianceAudits", "riskAssessment", "auditReports"],
              "serp-integration": ["systemIntegration", "dataMigration", "customWorkflows", "trainingSupport", "ongoingMaintenance"]
            };
            const key = featureKeys[service.id]?.[index] || `feature${index}`;
            const translatedFeature = t(`services.${service.id}.features.${key}`) || feature;
            
            return (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{translatedFeature}</span>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-3">
          <Link
            href={`/services#${service.id}`}
            className="flex-1 text-center px-4 py-2.5 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {t("common.learnMore")}
          </Link>
          {onInquiry && (
            <button
              onClick={() => onInquiry(service.id)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t("common.inquiry") || "Inquiry"}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

