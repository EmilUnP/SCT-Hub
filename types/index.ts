export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "accounting" | "tax" | "hr" | "audit" | "serp";
  features: string[];
  serpIntegrated?: boolean;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  trainer: string;
  price: string;
  date: string;
  image?: string;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  courseId: string;
  message?: string;
}

export interface SERPModule {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  role?: "teacher" | "staff" | "student" | "guest";
  // Personal Information
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  bio?: string;
  avatar_url?: string;
  // Professional Information
  position?: string;
  department?: string;
  specialization?: string;
  // Business Information
  business_name?: string;
  business_type?: string;
  business_registration?: string;
  tax_id?: string;
  // Social & Contact
  website?: string;
  linkedin?: string;
  // Status & Metadata
  status?: "active" | "inactive" | "suspended";
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  preferences?: Record<string, any>;
}

