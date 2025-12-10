"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { updateUserProfile } from "@/lib/profile";
import { 
  User, Mail, Phone, Building2, MapPin, Globe, Linkedin, 
  Briefcase, GraduationCap, FileText, Save, X, Edit2,
  Calendar, Shield, Building
} from "lucide-react";

export default function ProfileInfoSection() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    company: user?.company || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    postal_code: user?.postal_code || "",
    bio: user?.bio || "",
    position: user?.position || "",
    department: user?.department || "",
    specialization: user?.specialization || "",
    business_name: user?.business_name || "",
    business_type: user?.business_type || "",
    business_registration: user?.business_registration || "",
    tax_id: user?.tax_id || "",
    website: user?.website || "",
    linkedin: user?.linkedin || "",
  });

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateUserProfile(user.id, formData);
      setIsEditing(false);
      window.location.reload(); // Refresh to get updated data
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      company: user?.company || "",
      address: user?.address || "",
      city: user?.city || "",
      country: user?.country || "",
      postal_code: user?.postal_code || "",
      bio: user?.bio || "",
      position: user?.position || "",
      department: user?.department || "",
      specialization: user?.specialization || "",
      business_name: user?.business_name || "",
      business_type: user?.business_type || "",
      business_registration: user?.business_registration || "",
      tax_id: user?.tax_id || "",
      website: user?.website || "",
      linkedin: user?.linkedin || "",
    });
    setIsEditing(false);
  };

  if (!user) return null;

  const InputField = ({ label, name, value, type = "text", placeholder = "", icon: Icon, disabled = false }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      {isEditing && !disabled ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      ) : (
        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
          {value || <span className="text-gray-400">Not provided</span>}
        </div>
      )}
    </div>
  );

  const TextAreaField = ({ label, name, value, placeholder = "", icon: Icon }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      {isEditing ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      ) : (
        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[100px]">
          {value || <span className="text-gray-400">Not provided</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6 text-primary-600" />
          {t("profile.personalInfo") || "Personal Information"}
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
          >
            <Edit2 className="w-4 h-4" />
            {t("profile.edit") || "Edit"}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : (t("profile.save") || "Save")}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <X className="w-4 h-4" />
              {t("common.cancel") || "Cancel"}
            </button>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Full Name" name="name" value={formData.name} icon={User} />
          <InputField label="Email" name="email" value={user.email} icon={Mail} disabled={true} />
          <InputField label="Phone" name="phone" value={formData.phone} type="tel" icon={Phone} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4 inline mr-2" />
              Role
            </label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.role === "teacher" 
                    ? "bg-purple-100 text-purple-700" 
                    : user.role === "staff"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {user.role === "teacher" ? "👨‍🏫 Teacher" : user.role === "staff" ? "👔 Staff" : "🎓 Student"}
                </span>
              </div>
              {user.role === "student" && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800 mb-2">
                    <strong>Want to access the admin panel?</strong>
                  </p>
                  <p className="text-xs text-blue-700 mb-2">
                    To change your role to <strong>Teacher</strong> or <strong>Staff</strong>, you need to:
                  </p>
                  <ol className="text-xs text-blue-700 list-decimal list-inside space-y-1 mb-2">
                    <li>Ask an existing admin to update your role in the admin panel</li>
                    <li>Or update it manually in Supabase Dashboard</li>
                  </ol>
                  <p className="text-xs text-blue-600">
                    See <strong>ADMIN_SETUP.md</strong> for detailed instructions.
                  </p>
                </div>
              )}
              {user.role === "teacher" && (
                <p className="text-xs text-gray-600 mt-2">
                  ✓ You have full admin access to manage content and users
                </p>
              )}
              {user.role === "staff" && (
                <p className="text-xs text-gray-600 mt-2">
                  ✓ You have staff access (limited admin privileges)
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <TextAreaField label="Bio" name="bio" value={formData.bio} placeholder="Tell us about yourself..." />
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-600" />
          Address Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <InputField label="Address" name="address" value={formData.address} icon={MapPin} />
          </div>
          <InputField label="City" name="city" value={formData.city} />
          <InputField label="Country" name="country" value={formData.country} />
          <InputField label="Postal Code" name="postal_code" value={formData.postal_code} />
        </div>
      </div>

      {/* Professional Information */}
      {(user.role === "teacher" || user.role === "staff") && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-600" />
            Professional Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Position" name="position" value={formData.position} icon={Briefcase} />
            <InputField label="Department" name="department" value={formData.department} icon={Building2} />
            <div className="md:col-span-2">
              <InputField label="Specialization" name="specialization" value={formData.specialization} icon={GraduationCap} />
            </div>
          </div>
        </div>
      )}

      {/* Business Information */}
      {(user.role === "student" || formData.business_name) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary-600" />
            Business Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Company/Business Name" name="company" value={formData.company} icon={Building} />
            <InputField label="Business Type" name="business_type" value={formData.business_type} placeholder="e.g., LLC, Corporation" />
            <InputField label="Business Registration" name="business_registration" value={formData.business_registration} icon={FileText} />
            <InputField label="Tax ID" name="tax_id" value={formData.tax_id} />
          </div>
        </div>
      )}

      {/* Social & Contact */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-600" />
          Social & Contact
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Website" name="website" value={formData.website} type="url" icon={Globe} placeholder="https://..." />
          <InputField label="LinkedIn" name="linkedin" value={formData.linkedin} type="url" icon={Linkedin} placeholder="https://linkedin.com/in/..." />
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Account Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
              {user.last_login ? new Date(user.last_login).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

