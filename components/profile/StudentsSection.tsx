"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Trash2, Edit2, Save, X, User, Mail, Phone, GraduationCap } from "lucide-react";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  classId?: string;
  className?: string;
  notes?: string;
  enrolledAt: string;
}

export default function StudentsSection() {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    classId: "",
    notes: "",
  });

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const loadStudents = () => {
    const stored = localStorage.getItem("teacher_students");
    if (stored) {
      try {
        setStudents(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading students:", error);
      }
    }
  };

  const loadClasses = () => {
    const stored = localStorage.getItem("teacher_classes");
    if (stored) {
      try {
        const classData = JSON.parse(stored);
        setClasses(classData.map((cls: { id: string; name: string }) => ({ id: cls.id, name: cls.name })));
      } catch (error) {
        console.error("Error loading classes:", error);
      }
    }
  };

  const saveStudents = (updatedStudents: Student[]) => {
    localStorage.setItem("teacher_students", JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
  };

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    const selectedClass = classes.find((c) => c.id === formData.classId);

    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      classId: formData.classId || undefined,
      className: selectedClass?.name,
      notes: formData.notes,
      enrolledAt: new Date().toISOString(),
    };

    const updatedStudents = [newStudent, ...students];
    saveStudents(updatedStudents);
    setFormData({ name: "", email: "", phone: "", classId: "", notes: "" });
    setIsCreating(false);
  };

  const handleUpdate = (id: string) => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    const selectedClass = classes.find((c) => c.id === formData.classId);

    const updatedStudents = students.map((student) =>
      student.id === id
        ? {
            ...student,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            classId: formData.classId || undefined,
            className: selectedClass?.name,
            notes: formData.notes,
          }
        : student
    );

    saveStudents(updatedStudents);
    setFormData({ name: "", email: "", phone: "", classId: "", notes: "" });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("profile.students.confirmDelete"))) {
      const updatedStudents = students.filter((student) => student.id !== id);
      saveStudents(updatedStudents);
    }
  };

  const startEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      classId: student.classId || "",
      notes: student.notes || "",
    });
    setEditingId(student.id);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setFormData({ name: "", email: "", phone: "", classId: "", notes: "" });
    setEditingId(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <GraduationCap className="w-6 h-6 text-orange-600" />
          </div>
          {t("profile.students.title")}
        </h3>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <Plus className="w-5 h-5" />
            {t("profile.students.addStudent")}
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern-lg p-6 border border-gray-200/50 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.students.nameLabel")} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t("profile.students.namePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.students.emailLabel")} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t("profile.students.emailPlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.students.phoneLabel")}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t("profile.students.phonePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.students.classLabel")}
              </label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">{t("profile.students.selectClass")}</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.students.notesLabel")}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                placeholder={t("profile.students.notesPlaceholder")}
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
        {students.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">{t("profile.students.noStudents")}</p>
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern p-6 border border-gray-200/50 hover:shadow-modern-lg transition-all duration-500 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{student.name}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{student.email}</span>
                    </div>
                    {student.phone && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{student.phone}</span>
                      </div>
                    )}
                    {student.className && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-primary-600" />
                        <span className="text-primary-700 font-semibold">{student.className}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(student)}
                    className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    title={t("common.edit")}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    title={t("common.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {student.notes && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed px-3 py-2 bg-gray-50 rounded-xl">{student.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

