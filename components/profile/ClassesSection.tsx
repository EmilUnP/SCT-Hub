"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Trash2, Edit2, Save, X, Users, BookOpen, Calendar } from "lucide-react";

export interface Class {
  id: string;
  name: string;
  subject: string;
  description: string;
  schedule: string;
  studentCount: number;
  createdAt: string;
}

export default function ClassesSection() {
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    schedule: "",
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    const stored = localStorage.getItem("teacher_classes");
    if (stored) {
      try {
        setClasses(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading classes:", error);
      }
    }
  };

  const saveClasses = (updatedClasses: Class[]) => {
    localStorage.setItem("teacher_classes", JSON.stringify(updatedClasses));
    setClasses(updatedClasses);
  };

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.subject.trim()) return;

    const newClass: Class = {
      id: Date.now().toString(),
      name: formData.name,
      subject: formData.subject,
      description: formData.description,
      schedule: formData.schedule,
      studentCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedClasses = [newClass, ...classes];
    saveClasses(updatedClasses);
    setFormData({ name: "", subject: "", description: "", schedule: "" });
    setIsCreating(false);
  };

  const handleUpdate = (id: string) => {
    if (!formData.name.trim() || !formData.subject.trim()) return;

    const updatedClasses = classes.map((cls) =>
      cls.id === id
        ? {
            ...cls,
            name: formData.name,
            subject: formData.subject,
            description: formData.description,
            schedule: formData.schedule,
          }
        : cls
    );

    saveClasses(updatedClasses);
    setFormData({ name: "", subject: "", description: "", schedule: "" });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("profile.classes.confirmDelete"))) {
      const updatedClasses = classes.filter((cls) => cls.id !== id);
      saveClasses(updatedClasses);
    }
  };

  const startEdit = (cls: Class) => {
    setFormData({
      name: cls.name,
      subject: cls.subject,
      description: cls.description,
      schedule: cls.schedule,
    });
    setEditingId(cls.id);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setFormData({ name: "", subject: "", description: "", schedule: "" });
    setEditingId(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-xl">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          {t("profile.classes.title")}
        </h3>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <Plus className="w-5 h-5" />
            {t("profile.classes.createClass")}
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern-lg p-6 border border-gray-200/50 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.classes.nameLabel")} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t("profile.classes.namePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.classes.subjectLabel")} *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t("profile.classes.subjectPlaceholder")}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.classes.scheduleLabel")}
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t("profile.classes.schedulePlaceholder")}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.classes.descriptionLabel")}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                placeholder={t("profile.classes.descriptionPlaceholder")}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => (editingId ? handleUpdate(editingId) : handleCreate())}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <Save className="w-4 h-4" />
              {t("common.save")}
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
            >
              <X className="w-4 h-4" />
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">{t("profile.classes.noClasses")}</p>
          </div>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern p-6 border border-gray-200/50 hover:shadow-modern-lg transition-all duration-500 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{cls.name}</h4>
                  <p className="text-primary-600 font-semibold">{cls.subject}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(cls)}
                    className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    title={t("common.edit")}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    title={t("common.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {cls.description && (
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{cls.description}</p>
              )}
              {cls.schedule && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 px-3 py-2 bg-gray-50 rounded-xl">
                  <Calendar className="w-4 h-4" />
                  <span>{cls.schedule}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-700 pt-4 border-t border-gray-200 font-semibold">
                <Users className="w-4 h-4 text-primary-600" />
                <span>
                  {cls.studentCount} {t("profile.classes.students")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

