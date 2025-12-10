"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { createTraining } from "@/lib/admin";
import type { Training } from "@/types";
import { AlertCircle, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const TRAINING_CATEGORIES = [
  "SERP Training",
  "Tax Training",
  "HR Training",
  "Accounting Training",
  "General Training"
];

export default function NewTrainingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Omit<Training, "id">>({
    title: "",
    description: "",
    category: "",
    duration: "",
    trainer: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
  });

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
      return false;
    }
    if (!formData.duration.trim()) {
      setError("Duration is required");
      return false;
    }
    if (!formData.trainer.trim()) {
      setError("Trainer name is required");
      return false;
    }
    if (!formData.price.trim()) {
      setError("Price is required");
      return false;
    }
    if (!formData.date) {
      setError("Date is required");
      return false;
    }
    if (formData.image && !isValidUrl(formData.image)) {
      setError("Please enter a valid image URL");
      return false;
    }
    return true;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const trainingData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: formData.duration.trim(),
        trainer: formData.trainer.trim(),
        price: formData.price.trim(),
        image: formData.image?.trim() || undefined,
      };

      await createTraining(trainingData);
      setSuccess(true);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push("/admin/trainings");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating training:", error);
      setError(
        error.message || 
        error.details || 
        "Failed to create training. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/trainings"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trainings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Training</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to create a new training course</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Success!</p>
              <p className="text-sm text-green-700 mt-1">Training created successfully. Redirecting...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="Enter training course title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none"
              placeholder="Describe the training course, what participants will learn, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white"
              >
                <option value="">Select a category</option>
                {TRAINING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => {
                  setFormData({ ...formData, duration: e.target.value });
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="e.g., 2 days, 3 hours, 1 week"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trainer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.trainer}
                onChange={(e) => {
                  setFormData({ ...formData, trainer: e.target.value });
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="Trainer name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="e.g., $299, Free, Contact for pricing"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.image || ""}
              onChange={(e) => {
                setFormData({ ...formData, image: e.target.value });
                setError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && isValidUrl(formData.image) && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Created!
                </>
              ) : (
                "Create Training"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
