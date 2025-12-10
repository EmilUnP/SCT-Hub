"use client";

import React from "react";
import Image from "next/image";
import { statistics, teamMembers } from "@/lib/data";
import { Target, Users, TrendingUp, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <React.Fragment>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("about.title")}</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-xl overflow-hidden shadow-xl h-96">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Professional team meeting"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/30 to-transparent"></div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t("about.mission.title")}</h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-8">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    {t("about.mission.description1")}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t("about.mission.description2")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("about.values.title")}</h2>
            <p className="text-lg text-gray-600">{t("about.values.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <CheckCircle className="w-8 h-8" />,
                key: "integrity",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                key: "excellence",
                color: "from-green-500 to-green-600",
              },
              {
                icon: <Users className="w-8 h-8" />,
                key: "partnership",
                color: "from-purple-500 to-purple-600",
              },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center group transform hover:-translate-y-2">
                <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`about.values.${value.key}.title`)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(`about.values.${value.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("about.achievements.title")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">{statistics.clients}+</div>
              <div className="text-gray-600">{t("home.statistics.happyClients")}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {statistics.yearsExperience}+
              </div>
              <div className="text-gray-600">{t("home.statistics.yearsExperience")}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">{statistics.services}+</div>
              <div className="text-gray-600">{t("home.statistics.services")}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">{statistics.trainings}+</div>
              <div className="text-gray-600">{t("home.statistics.trainingCourses")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("about.team.title")}</h2>
            <p className="text-lg text-gray-600">{t("about.team.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => {
              const teamImages = [
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
              ];
              return (
                <div key={member.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group">
                  <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image
                      src={teamImages[index % teamImages.length]}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/20 group-hover:from-primary-400/0 group-hover:to-primary-600/0 transition-all"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

