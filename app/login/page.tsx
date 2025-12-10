"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setLoginSuccess(false);

    try {
      const { error } = await login(formData.email, formData.password);

      if (error) {
        setErrorMessage(error.message || "Invalid email or password. Please try again.");
      } else {
        setLoginSuccess(true);
        // Redirect to profile page after 1 second
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("login.title")}</h1>
          <p className="text-xl text-primary-100">{t("login.subtitle")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("login.welcomeBack")}</h2>
              
              {loginSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium">Login Successful!</p>
                    <p className="text-green-700 text-sm">Redirecting you to your profile...</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{errorMessage}</p>
                </div>
              )}


              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("login.email")} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={loginSuccess || isSubmitting}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("login.password")} *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    disabled={loginSuccess || isSubmitting}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      disabled={loginSuccess || isSubmitting}
                      className="rounded border-gray-300 text-primary-600 disabled:cursor-not-allowed" 
                    />
                    <span className="ml-2 text-sm text-gray-600">{t("login.rememberMe")}</span>
                  </label>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                    {t("login.forgotPassword")}
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loginSuccess}
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginSuccess ? "Login Successful!" : isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {t("login.noAccount")}{" "}
                  <Link href="/register" className="text-primary-600 hover:text-primary-700">
                    {t("login.registerHere")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

