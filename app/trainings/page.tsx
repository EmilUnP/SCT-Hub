"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getTrainings } from "@/lib/admin";
import TrainingCard from "@/components/cards/TrainingCard";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { Clock, User, Calendar, Coins, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Training } from "@/types";

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic';

export default function TrainingsPage() {
  const { t, language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrainings = useCallback(async () => {
    try {
      setLoading(true);
      // Remove timeout wrapper - getTrainings now handles errors gracefully
      const data = await getTrainings();
      
      console.log("Trainings loaded:", data?.length || 0, "items");
      setTrainings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to load trainings:", error);
      console.error("Error details:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  // Memoize course lookup
  const course = useMemo(() => {
    return selectedCourse ? trainings.find((t) => t.id === selectedCourse) : null;
  }, [trainings, selectedCourse]);

  return (
    <>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("trainings.title")}</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            {t("trainings.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading trainings...</p>
            </div>
          ) : !showRegistration ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("trainings.availableCourses.title")}</h2>
                <p className="text-lg text-gray-600">
                  {t("trainings.availableCourses.subtitle")}
                </p>
              </div>

              {trainings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">{t("trainings.noTrainings") || "No trainings available at the moment."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {trainings.map((training) => (
                  <div key={training.id} id={training.id}>
                    <TrainingCard
                      training={training}
                      onClick={(id) => {
                        setSelectedCourse(id);
                        // Scroll to course details
                        setTimeout(() => {
                          const element = document.getElementById(`details-${id}`);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }, 100);
                      }}
                    />
                  </div>
                ))}
                </div>
              )}

              {selectedCourse && course && (
                <div id={`details-${selectedCourse}`} className="mt-16 bg-gray-50 rounded-lg p-8 scroll-mt-24">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded mb-2">
                          {t(`trainings.categories.${course.category}`) || t(`trainings.courses.${course.id}.category`) || course.category}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          {t(`trainings.courses.${course.id}.title`) || course.title}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <p className="text-lg text-gray-600 mb-8">
                      {t(`trainings.courses.${course.id}.description`) || course.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{t("trainings.courseDetails.duration")}</div>
                          <div className="text-gray-600">{course.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{t("trainings.courseDetails.date")}</div>
                          <div className="text-gray-600">{formatDate(course.date, language)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{t("trainings.courseDetails.trainer")}</div>
                          <div className="text-gray-600">
                            {t(`trainings.courses.${course.id}.trainer`) || course.trainer}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Coins className="w-5 h-5 text-primary-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{t("trainings.courseDetails.price")}</div>
                          <div className="text-gray-600">{course.price}</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowRegistration(true)}
                      className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      {t("trainings.courseDetails.registerNow")}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : course ? (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => {
                  setShowRegistration(false);
                  setSelectedCourse(null);
                }}
                className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                {t("trainings.courseDetails.backToCourses")}
              </button>
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("trainings.registration.title")}</h2>
                <RegistrationForm 
                  courseId={course.id} 
                  courseTitle={t(`trainings.courses.${course.id}.title`) || course.title} 
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

