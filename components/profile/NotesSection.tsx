"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Trash2, Edit2, Save, X, FileText } from "lucide-react";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesSection() {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const stored = localStorage.getItem("teacher_notes");
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    }
  };

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem("teacher_notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreate = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setFormData({ title: "", content: "" });
    setIsCreating(false);
  };

  const handleUpdate = (id: string) => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const updatedNotes = notes.map((note) =>
      note.id === id
        ? {
            ...note,
            title: formData.title,
            content: formData.content,
            updatedAt: new Date().toISOString(),
          }
        : note
    );

    saveNotes(updatedNotes);
    setFormData({ title: "", content: "" });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("profile.notes.confirmDelete"))) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      saveNotes(updatedNotes);
    }
  };

  const startEdit = (note: Note) => {
    setFormData({ title: note.title, content: note.content });
    setEditingId(note.id);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setFormData({ title: "", content: "" });
    setEditingId(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          {t("profile.notes.title")}
        </h3>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <Plus className="w-5 h-5" />
            {t("profile.notes.addNote")}
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern-lg p-6 border border-gray-200/50 animate-fade-in">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.notes.titleLabel")}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t("profile.notes.titlePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.notes.contentLabel")}
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                placeholder={t("profile.notes.contentPlaceholder")}
              />
            </div>
            <div className="flex gap-3">
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
        </div>
      )}

      <div className="grid gap-5">
        {notes.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">{t("profile.notes.noNotes")}</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern p-6 border border-gray-200/50 hover:shadow-modern-lg transition-all duration-500 card-hover"
            >
              {editingId === note.id ? null : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-900 pr-4">{note.title}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                        title={t("common.edit")}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                        title={t("common.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">{note.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <span>
                      {t("profile.notes.created")}: {new Date(note.createdAt).toLocaleString()}
                    </span>
                    {note.updatedAt !== note.createdAt && (
                      <span className="text-primary-600">
                        {t("profile.notes.updated")}: {new Date(note.updatedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

