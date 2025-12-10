"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getUsers, updateUserRole } from "@/lib/admin";
import { Users, Shield, UserCheck, GraduationCap, Search } from "lucide-react";
import type { UserRole } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  phone?: string;
  company?: string;
  created_at?: string;
  last_login?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Debounce search term to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      // Add timeout wrapper
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const data = await Promise.race([
        getUsers(),
        timeoutPromise
      ]);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRoleChange = useCallback(async (userId: string, newRole: UserRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      await updateUserRole(userId, newRole);
      // Update local state instead of reloading
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      alert(`User role updated to ${newRole} successfully!`);
    } catch (err: any) {
      alert("Failed to update role: " + (err.message || "Unknown error"));
      // Reload on error to ensure consistency
      await loadUsers();
    } finally {
      setUpdatingUserId(null);
    }
  }, [loadUsers]);

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case "teacher":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "staff":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "student":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role?: UserRole) => {
    switch (role) {
      case "teacher":
        return <Shield className="w-4 h-4" />;
      case "staff":
        return <UserCheck className="w-4 h-4" />;
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  // Memoize filtered users to prevent recalculation on every render
  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm && roleFilter === "all") return users;
    
    return users.filter((user) => {
      const matchesSearch = !debouncedSearchTerm || 
        user.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, debouncedSearchTerm, roleFilter]);

  // Memoize role counts
  const roleCounts = useMemo(() => ({
    all: users.length,
    teacher: users.filter((u) => u.role === "teacher").length,
    staff: users.filter((u) => u.role === "staff").length,
    student: users.filter((u) => u.role === "student").length,
  }), [users]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            User Management
          </h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{roleCounts.all}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Teachers</div>
            <div className="text-2xl font-bold text-purple-600">{roleCounts.teacher}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Staff</div>
            <div className="text-2xl font-bold text-blue-600">{roleCounts.staff}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Students</div>
            <div className="text-2xl font-bold text-green-600">{roleCounts.student}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRoleFilter("all")}
                className={`px-4 py-2 rounded-lg transition ${
                  roleFilter === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRoleFilter("teacher")}
                className={`px-4 py-2 rounded-lg transition ${
                  roleFilter === "teacher"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Teachers
              </button>
              <button
                onClick={() => setRoleFilter("staff")}
                className={`px-4 py-2 rounded-lg transition ${
                  roleFilter === "staff"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setRoleFilter("student")}
                className={`px-4 py-2 rounded-lg transition ${
                  roleFilter === "student"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Students
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading users...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || "No name"}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {getRoleIcon(user.role)}
                            {user.role || "student"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{user.phone || "—"}</div>
                          <div className="text-xs">{user.company || "—"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={user.role || "student"}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value as UserRole)
                            }
                            disabled={updatingUserId === user.id}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="teacher">Teacher</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

