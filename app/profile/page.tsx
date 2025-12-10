"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Mail, LogOut, Edit2, Save, X, FileText, File, BookOpen, GraduationCap, Settings } from "lucide-react";
import NotesSection from "@/components/profile/NotesSection";
import DocumentsSection from "@/components/profile/DocumentsSection";
import ClassesSection from "@/components/profile/ClassesSection";
import StudentsSection from "@/components/profile/StudentsSection";
import ProfileInfoSection from "@/components/profile/ProfileInfoSection";

type TabType = "overview" | "info" | "notes" | "documents" | "classes" | "students";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [stats, setStats] = useState({
    notes: 0,
    documents: 0,
    classes: 0,
    students: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && (user?.role === "teacher" || user?.role === "staff")) {
      const notes = JSON.parse(localStorage.getItem("teacher_notes") || "[]");
      const documents = JSON.parse(localStorage.getItem("teacher_documents") || "[]");
      const classes = JSON.parse(localStorage.getItem("teacher_classes") || "[]");
      const students = JSON.parse(localStorage.getItem("teacher_students") || "[]");
      
      setStats({
        notes: notes.length,
        documents: documents.length,
        classes: classes.length,
        students: students.length,
      });
    } else {
      // For students, set all stats to 0
      setStats({
        notes: 0,
        documents: 0,
        classes: 0,
        students: 0,
      });
    }
  }, [activeTab, user?.role]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSave = () => {
    setIsEditing(false);
    if (user) {
      const updatedUser = { ...user, name: editedName };
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      window.location.reload();
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || "");
    setIsEditing(false);
  };

  if (!user) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-modern-lg p-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <p className="text-gray-600 mb-6 text-lg">{t("profile.notLoggedIn")}</p>
            <button
              onClick={() => router.push("/login")}
              className="btn-modern"
            >
              {t("common.login")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Block guest users from accessing profile
  if (user.role === "guest") {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-modern-lg p-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("profile.guest.title") || "Guest Account"}</h2>
            <p className="text-gray-600 mb-6 text-lg">
              {t("profile.guest.message") || "Your account is pending approval. An administrator needs to assign you a role (Student, Staff, or Teacher) before you can access your profile."}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t("profile.guest.contact") || "Please contact an administrator to get your role assigned."}
            </p>
            <button
              onClick={handleLogout}
              className="btn-modern"
            >
              {t("profile.logout")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Define tabs based on user role
  const allTabs = [
    { id: "overview" as TabType, label: t("profile.tabs.overview") || "Overview", icon: User, roles: ["teacher", "staff", "student"] },
    { id: "info" as TabType, label: t("profile.tabs.info") || "Profile Info", icon: Settings, roles: ["teacher", "staff", "student"] },
    { id: "notes" as TabType, label: t("profile.tabs.notes") || "Notes", icon: FileText, roles: ["teacher", "staff"] },
    { id: "documents" as TabType, label: t("profile.tabs.documents") || "Documents", icon: File, roles: ["teacher", "staff"] },
    { id: "classes" as TabType, label: t("profile.tabs.classes") || "Classes", icon: BookOpen, roles: ["teacher", "staff"] },
    { id: "students" as TabType, label: t("profile.tabs.students") || "Students", icon: GraduationCap, roles: ["teacher"] },
  ];

  // Filter tabs based on user role (exclude guest)
  const tabs = allTabs.filter(tab => 
    user?.role && tab.roles.includes(user.role)
  );

  return (
    <>
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            {user?.role === "teacher" 
              ? t("profile.titleTeacher") 
              : user?.role === "staff" 
              ? t("profile.titleStaff") 
              : user?.role === "student"
              ? t("profile.titleStudent")
              : t("profile.title")}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 animate-fade-in-delay">
            {user?.role === "student" 
              ? t("profile.subtitleStudent") 
              : user?.role === "guest"
              ? t("profile.guest.subtitle") || ""
              : t("profile.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern-lg p-8 mb-6 border border-gray-100/50">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="px-4 py-2 border-2 border-primary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                          placeholder={t("profile.namePlaceholder")}
                        />
                      ) : (
                        user.name || t("profile.user")
                      )}
                    </h2>
                    <p className="text-gray-600 flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                    {user.role && (
                      <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200">
                        {t(`profile.roles.${user.role}`)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-3 text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                      title={t("profile.edit")}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={handleSave}
                        className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                        title={t("profile.save")}
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                        title={t("common.cancel")}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    {t("profile.logout")}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern mb-6 border border-gray-100/50 overflow-hidden">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap relative ${
                        activeTab === tab.id
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-600 hover:text-primary-600 hover:bg-primary-50/50"
                      }`}
                    >
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-primary-700"></span>
                      )}
                      <Icon className={`w-5 h-5 transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modern-lg p-8 border border-gray-100/50">
              {activeTab === "info" && (
                <ProfileInfoSection />
              )}

              {activeTab === "overview" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{t("profile.overview.title")}</h3>
                    <p className="text-gray-600">
                      {user?.role === "student" 
                        ? "Welcome to your student dashboard" 
                        : "Welcome to your dashboard overview"}
                    </p>
                  </div>
                  {(user?.role === "teacher" || user?.role === "staff") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50 hover:shadow-modern-lg transition-all duration-500 group card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-4xl font-bold gradient-text-primary mb-2">{stats.notes}</div>
                      <p className="text-gray-700 font-semibold">{t("profile.overview.notes")}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/50 hover:shadow-modern-lg transition-all duration-500 group card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                          <File className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-4xl font-bold gradient-text-primary mb-2">{stats.documents}</div>
                      <p className="text-gray-700 font-semibold">{t("profile.overview.documents")}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/50 hover:shadow-modern-lg transition-all duration-500 group card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                          <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <div className="text-4xl font-bold gradient-text-primary mb-2">{stats.classes}</div>
                      <p className="text-gray-700 font-semibold">{t("profile.overview.classes")}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200/50 hover:shadow-modern-lg transition-all duration-500 group card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                          <GraduationCap className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-4xl font-bold gradient-text-primary mb-2">{stats.students}</div>
                      <p className="text-gray-700 font-semibold">{t("profile.overview.students")}</p>
                    </div>
                  </div>
                  )}
                  {user?.role === "student" && (
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-8 border border-primary-200/50 text-center">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">{t("profile.welcomeStudent") || "Welcome, Student!"}</h4>
                      <p className="text-gray-700 mb-6">
                        {t("profile.studentMessage") || "You are registered as a student. Use the Profile Info tab to update your information."}
                      </p>
                    </div>
                  )}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary-600" />
                      {t("profile.accountInfo") || "Account Information"}
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                        <span className="text-gray-600 font-medium">{t("profile.email") || "Email"}</span>
                        <span className="text-gray-900 font-semibold">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                          <span className="text-gray-600 font-medium">Phone</span>
                          <span className="text-gray-900 font-semibold">{user.phone}</span>
                        </div>
                      )}
                      {user.company && (
                        <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                          <span className="text-gray-600 font-medium">Company</span>
                          <span className="text-gray-900 font-semibold">{user.company}</span>
                        </div>
                      )}
                      {user.position && (
                        <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                          <span className="text-gray-600 font-medium">Position</span>
                          <span className="text-gray-900 font-semibold">{user.position}</span>
                        </div>
                      )}
                      {user.city && user.country && (
                        <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                          <span className="text-gray-600 font-medium">Location</span>
                          <span className="text-gray-900 font-semibold">{user.city}, {user.country}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                        <span className="text-gray-600 font-medium">{t("profile.memberSince") || "Member Since"}</span>
                        <span className="text-gray-900 font-semibold">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                        </span>
                      </div>
                      {user.last_login && (
                        <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                          <span className="text-gray-600 font-medium">Last Login</span>
                          <span className="text-gray-900 font-semibold">
                            {new Date(user.last_login).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (user?.role === "teacher" || user?.role === "staff") && <NotesSection />}
              {activeTab === "documents" && (user?.role === "teacher" || user?.role === "staff") && <DocumentsSection />}
              {activeTab === "classes" && (user?.role === "teacher" || user?.role === "staff") && <ClassesSection />}
              {activeTab === "students" && user?.role === "teacher" && <StudentsSection />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
