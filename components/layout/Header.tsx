"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, User, Shield } from "lucide-react";
import { services } from "@/lib/data";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated, user, isAdmin } = useAuth();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleServicesDropdown = () => setServicesDropdownOpen(!servicesDropdownOpen);

  return (
    <header className="backdrop-blur-modern fixed top-0 left-0 right-0 w-full z-50 shadow-modern border-b border-gray-100/50">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-all duration-300 ease-out hover:opacity-90 active:opacity-95">
            {!logoError && (
              <Image
                src="/logo.png"
                alt="FInLogic Logo"
                width={175}
                height={42}
                className="h-10 w-auto transition-transform duration-300 ease-out hover:scale-[1.02]"
                quality={90}
                priority
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            <Link href="/" className="nav-link">
              {t("common.home")}
            </Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button 
                className="nav-link flex items-center gap-1"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                {t("common.services")}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-out ${servicesDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-scale-in">
                  <div className="relative bg-white/95 backdrop-blur-xl shadow-modern-lg rounded-2xl py-2 border border-gray-100/50 overflow-hidden shadow-xl ring-1 ring-black/5">
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-r-full opacity-80" aria-hidden />
                    {services.map((service, index) => (
                      <Link
                        key={service.id}
                        href={`/services#${service.id}`}
                        className="block px-5 py-3 pl-6 text-gray-700 hover:bg-primary-50/80 hover:text-primary-700 transition-all duration-200 font-medium border-l-2 border-transparent hover:border-primary-500"
                        onClick={() => setServicesDropdownOpen(false)}
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        {t(`services.${service.id}.title`)}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      href="/serp"
                      className="block px-5 py-3 pl-6 text-gray-700 hover:bg-primary-50/80 hover:text-primary-700 transition-all duration-200 font-semibold border-l-2 border-transparent hover:border-primary-500"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      {t("common.serp")}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/trainings" className="nav-link">
              {t("common.trainings")}
            </Link>
            <Link href="/news" className="nav-link">
              {t("common.news")}
            </Link>
            <Link href="/about" className="nav-link">
              {t("common.about")}
            </Link>
            <Link href="/contact" className="nav-link">
              {t("common.contact")}
            </Link>
            <LanguageSwitcher />
            {isAdmin && (
              <Link 
                href="/admin" 
                className="nav-link flex items-center gap-2"
                title="Admin Panel"
              >
                <Shield className="w-5 h-5" />
              </Link>
            )}
            {isAuthenticated ? (
              <Link 
                href="/profile" 
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm hidden sm:inline-block">
                  {user?.name || t("common.profile")}
                </span>
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="btn-modern"
              >
                {t("common.login")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 relative z-50 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div 
              className="lg:hidden fixed inset-0 top-[73px] bg-black/20 backdrop-blur-sm z-40 animate-fade-in" 
              aria-hidden 
              onClick={toggleMobileMenu}
            />
            <div className="lg:hidden pb-4 border-t border-gray-100/50 animate-slide-up bg-white/95 backdrop-blur-md relative z-50">
            <div className="flex flex-col gap-1 pt-4">
              <Link href="/" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium" onClick={toggleMobileMenu}>
                {t("common.home")}
              </Link>
              <div className="flex flex-col gap-2">
                <span className="px-4 py-2 text-gray-700 font-semibold text-sm uppercase tracking-wider">{t("common.services")}</span>
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services#${service.id}`}
                    className="px-4 py-3 pl-8 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                    onClick={toggleMobileMenu}
                  >
                    {t(`services.${service.id}.title`)}
                  </Link>
                ))}
                <Link
                  href="/serp"
                  className="px-4 py-3 pl-8 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-semibold"
                  onClick={toggleMobileMenu}
                >
                  {t("common.serp")}
                </Link>
              </div>
              <Link href="/trainings" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium" onClick={toggleMobileMenu}>
                {t("common.trainings")}
              </Link>
              <Link href="/news" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium" onClick={toggleMobileMenu}>
                {t("common.news")}
              </Link>
              <Link href="/about" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium" onClick={toggleMobileMenu}>
                {t("common.about")}
              </Link>
              <Link href="/contact" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium" onClick={toggleMobileMenu}>
                {t("common.contact")}
              </Link>
              <div className="px-4">
                <LanguageSwitcher />
              </div>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium"
                  onClick={toggleMobileMenu}
                >
                  <Shield className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
              {isAuthenticated ? (
                <Link 
                  href="/profile" 
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">
                    {user?.name || t("common.profile")}
                  </span>
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="btn-modern text-center"
                  onClick={toggleMobileMenu}
                >
                  {t("common.login")}
                </Link>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </header>
  );
}

