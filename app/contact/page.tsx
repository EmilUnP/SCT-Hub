"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.title")}</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{t("contact.getInTouch.title")}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {t("contact.getInTouch.description")}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t("contact.address")}</h3>
                    <p className="text-gray-600">
                      123 Business Street<br />
                      City, State 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t("contact.phone")}</h3>
                    <a
                      href="tel:+1234567890"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t("contact.email")}</h3>
                    <a
                      href="mailto:info@stchub.com"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      info@stchub.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">{t("contact.businessHours.title")}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>{t("contact.businessHours.mondayFriday")}</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("contact.businessHours.saturday")}</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("contact.businessHours.sunday")}</span>
                    <span>{t("contact.businessHours.closed")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{t("contact.sendMessage.title")}</h2>
              <div className="bg-white rounded-lg shadow-md p-8">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12 bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t("contact.map.placeholder")}</p>
              <p className="text-sm text-gray-500 mt-2">
                123 Business Street, City, State 12345
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

