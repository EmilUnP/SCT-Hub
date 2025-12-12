"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { getTrainings, deleteTraining } from "@/lib/admin";
import type { Training } from "@/types";
import Link from "next/link";
import { Plus, Edit, Trash2, Calendar, GraduationCap, AlertCircle, Clock, Coins, User } from "lucide-react";

// Component for training image with error handling
function TrainingImage({ image, title }: { image?: string; title: string }) {
  const [imageError, setImageError] = useState(false);

  if (!image || imageError) {
    return (
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center border border-primary-200">
        <GraduationCap className="w-8 h-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
      <Image
        src={image}
        alt={title}
        fill
        sizes="64px"
        className="object-cover"
        unoptimized={image.includes('tezbazar.az') || image.includes('sinam.net')}
        onError={() => setImageError(true)}
      />
    </div>
  );
}

export default function AdminTrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadTrainings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      // getTrainings now handles errors gracefully and returns empty array
      const data = await getTrainings();
      setTrainings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load trainings");
      console.error("Error loading trainings:", err);
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this training? This action cannot be undone.")) return;

    try {
      setDeletingId(id);
      await deleteTraining(id);
      setTrainings(prev => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + (err.message || "Unknown error"));
      console.error("Error deleting training:", err);
    } finally {
      setDeletingId(null);
    }
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainings Management</h1>
            <p className="text-gray-600">Create, edit, and manage training courses</p>
          </div>
          <Link
            href="/admin/trainings/new"
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add New Training
          </Link>
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

        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading trainings...</p>
          </div>
        ) : trainings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2 text-lg font-medium">No trainings yet</p>
            <p className="text-gray-400 mb-6 text-sm">Get started by creating your first training course</p>
            <Link
              href="/admin/trainings/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create First Training
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Training
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <TrainingImage image={item.image} title={item.title} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-1">{item.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Coins className="w-3 h-3" />
                            {item.price}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            {item.trainer}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/trainings/${item.id}`}
                            className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === item.id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
