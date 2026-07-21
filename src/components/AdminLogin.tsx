import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, LogIn, AlertCircle, X } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Language, translations } from "../utils/translations";

interface AdminLoginProps {
  onLoginSuccess: (email: string) => void;
  onClose: () => void;
  lang: Language;
}

export default function AdminLogin({ onLoginSuccess, onClose, lang }: AdminLoginProps) {
  const t = translations[lang];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!email || !password) {
      setError(lang === "ar" ? "الرجاء إدخال البريد الإلكتروني وكلمة المرور." : "Please enter email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError(lang === "ar" ? "الرجاء إدخال بريد إلكتروني صالح." : "Please enter a valid email address.");
      return;
    }

    // LOGIN MODE using Firebase Auth
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      if (userCredential.user) {
        onLoginSuccess(userCredential.user.email || "");
      }
    } catch (err: any) {
      console.error(err);
      setError(lang === "ar" ? "خطأ في البريد الإلكتروني أو كلمة المرور. يرجى المحاولة مجدداً." : "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 flex flex-col p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-all ${lang === "ar" ? "left-4" : "right-4"}`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-sky-50 text-sky-600 rounded-2xl mb-3 shadow-sm border border-sky-100">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.adminTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {t.adminSub}
          </p>
        </div>

        {/* Feedback Alert box */}
        {error && (
          <div className={`bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2 mb-4 ${lang === "ar" ? "text-right" : "text-left"}`}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className={`space-y-4 ${lang === "ar" ? "text-right" : "text-left"}`}>
          
          {/* Email input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.emailLabel}</label>
            <div className="relative">
              <span className={`absolute inset-y-0 flex items-center text-slate-400 ${lang === "ar" ? "right-0 pr-3.5" : "left-0 pl-3.5"}`}>
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@khatwa.com"
                className={`w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white font-mono ${
                  lang === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                }`}
                id="admin-email-input"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.passwordLabel}</label>
            <div className="relative">
              <span className={`absolute inset-y-0 flex items-center text-slate-400 ${lang === "ar" ? "right-0 pr-3.5" : "left-0 pl-3.5"}`}>
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className={`w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white ${
                  lang === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                }`}
                id="admin-password-input"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-md shadow-sky-600/10 flex items-center justify-center gap-2 mt-2"
            id="admin-submit-auth-btn"
          >
            <LogIn className="w-5 h-5 text-sky-200" />
            <span>{t.loginBtn}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
