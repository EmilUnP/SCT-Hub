"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const [logoError, setLogoError] = useState(false);
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {!logoError && (
                <Image 
                  src="/logo_white.png" 
                  alt="FInLogic Logo" 
                  width={72}
                  height={72}
                  className="h-14"
                  style={{ width: 'auto', height: 'auto' }}
                  onError={() => setLogoError(true)}
                />
              )}
              <h3 className="text-xl font-bold text-white">{t("footer.company")}</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 rounded-lg bg-white/10 hover:bg-primary-600 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 backdrop-blur-sm">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-white/10 hover:bg-primary-600 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 backdrop-blur-sm">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-white/10 hover:bg-primary-600 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 backdrop-blur-sm">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("common.home")}</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("common.services")}</span>
                </Link>
              </li>
              <li>
                <Link href="/serp" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("common.serp")}</span>
                </Link>
              </li>
              <li>
                <Link href="/trainings" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("common.trainings")}</span>
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("common.news")}</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("common.about")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">{t("footer.services")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services#accounting" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("services.accounting.title")}</span>
                </Link>
              </li>
              <li>
                <Link href="/services#tax" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("services.tax.title")}</span>
                </Link>
              </li>
              <li>
                <Link href="/services#hr" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("services.hr.title")}</span>
                </Link>
              </li>
              <li>
                <Link href="/services#audit" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{t("services.audit.title")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">{t("footer.contact")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-primary-600 transition-all duration-300 mt-0.5">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                  Baku, Azerbaijan
                </span>
              </li>
              <li>
                <a href="tel:+994501234567" className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 group">
                  <div className="p-2 rounded-lg bg-white/10 group-hover:bg-primary-600 transition-all duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">+994 (50) 1234567</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@finlogic.az" className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 group">
                  <div className="p-2 rounded-lg bg-white/10 group-hover:bg-primary-600 transition-all duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">info@finlogic.az</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-400">&copy; {currentYear} {t("footer.company")}. {t("footer.allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}

