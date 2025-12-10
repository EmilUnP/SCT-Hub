"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getNews, getTrainings, getUsers } from "@/lib/admin";
import { Newspaper, GraduationCap, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    trainings: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [newsData, trainingsData, usersData] = await Promise.all([
          getNews(),
          getTrainings(),
          getUsers(),
        ]);

        setStats({
          news: newsData.length,
          trainings: trainingsData.length,
          users: usersData.length,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your content and users</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/admin/news">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Newspaper className="w-12 h-12 text-blue-600" />
                  <span className="text-3xl font-bold text-gray-900">{stats.news}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">News Articles</h3>
                <p className="text-sm text-gray-500">Manage news and updates</p>
              </div>
            </Link>

            <Link href="/admin/trainings">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <GraduationCap className="w-12 h-12 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">{stats.trainings}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Trainings</h3>
                <p className="text-sm text-gray-500">Manage training courses</p>
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-12 h-12 text-orange-600" />
                  <span className="text-3xl font-bold text-gray-900">{stats.users}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Users</h3>
                <p className="text-sm text-gray-500">Manage user roles</p>
              </div>
            </Link>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/news/new"
              className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-center"
            >
              Create New Article
            </Link>
            <Link
              href="/admin/trainings/new"
              className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-center"
            >
              Add Training Course
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

