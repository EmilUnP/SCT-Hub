"use client";

import { ReactNode, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Newspaper, 
  GraduationCap, 
  LogOut,
  Shield,
  Users
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/login");
  }, [logout, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">{user?.name || user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/news"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition"
            >
              <Newspaper className="w-5 h-5" />
              <span>News</span>
            </Link>
            <Link
              href="/admin/trainings"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Trainings</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition"
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

export default memo(AdminLayout);

