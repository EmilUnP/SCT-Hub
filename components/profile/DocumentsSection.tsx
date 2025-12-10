"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Trash2, Download, File, Upload, X } from "lucide-react";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url?: string;
  description?: string;
}

export default function DocumentsSection() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ name: "", description: "" });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const stored = localStorage.getItem("teacher_documents");
    if (stored) {
      try {
        setDocuments(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading documents:", error);
      }
    }
  };

  const saveDocuments = (updatedDocs: Document[]) => {
    localStorage.setItem("teacher_documents", JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!uploadData.name.trim()) {
      setUploadData({ ...uploadData, name: file.name });
    }

    // In a real app, this would upload to a server
    // For now, we'll create a mock document
    const newDocument: Document = {
      id: Date.now().toString(),
      name: uploadData.name || file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      description: uploadData.description,
      url: URL.createObjectURL(file), // In production, this would be a server URL
    };

    const updatedDocs = [newDocument, ...documents];
    saveDocuments(updatedDocs);
    setUploadData({ name: "", description: "" });
    setIsUploading(false);
    e.target.value = ""; // Reset input
  };

  const handleDelete = (id: string) => {
    if (confirm(t("profile.documents.confirmDelete"))) {
      const updatedDocs = documents.filter((doc) => doc.id !== id);
      saveDocuments(updatedDocs);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <File className="w-6 h-6 text-purple-600" />
          </div>
          {t("profile.documents.title")}
        </h3>
        <button
          onClick={() => setIsUploading(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          <Plus className="w-5 h-5" />
          {t("profile.documents.upload")}
        </button>
      </div>

      {isUploading && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern-lg p-6 border border-gray-200/50 animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.documents.nameLabel")}
              </label>
              <input
                type="text"
                value={uploadData.name}
                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t("profile.documents.namePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.documents.descriptionLabel")}
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                placeholder={t("profile.documents.descriptionPlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("profile.documents.selectFile")}
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
            <button
              onClick={() => {
                setIsUploading(false);
                setUploadData({ name: "", description: "" });
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
            >
              <X className="w-4 h-4" />
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-5">
        {documents.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <File className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">{t("profile.documents.noDocuments")}</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern p-6 border border-gray-200/50 hover:shadow-modern-lg transition-all duration-500 card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <File className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{doc.name}</h4>
                  </div>
                  {doc.description && (
                    <p className="text-gray-600 mb-2">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg font-medium">{formatFileSize(doc.size)}</span>
                    <span className="text-gray-300">•</span>
                    <span>{new Date(doc.uploadedAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {doc.url && (
                    <a
                      href={doc.url}
                      download={doc.name}
                      className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                      title={t("common.download")}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    title={t("common.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

