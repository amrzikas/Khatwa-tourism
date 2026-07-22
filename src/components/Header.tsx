import React from "react";
import { ShieldCheck, User, LogOut, LayoutDashboard, Home, Globe } from "lucide-react";
import { Language, translations } from "../utils/translations";
import khatwaLogo from "../assets/khatwa_logo.jpg";

interface HeaderProps {
  currentView: "client" | "admin";
  onViewChange: (view: "client" | "admin") => void;
  adminEmail: string | null;
  onLogout: () => void;
  onOpenLoginModal: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({
  currentView,
  onViewChange,
  adminEmail,
  onLogout,
  onOpenLoginModal,
  lang,
  onLanguageChange,
}: HeaderProps) {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Brand Image */}
        <div 
          onClick={() => onViewChange("client")}
          className="flex items-center cursor-pointer group py-1"
          id="logo-container"
        >
          <img 
            src={khatwaLogo} 
            alt="Khatwa Travel - خطوة للسياحة" 
            className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(lang === "en" ? "ar" : "en")}
            className="flex items-center gap-1 px-2 sm:px-3 h-9 sm:h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            id="lang-toggle-btn"
            title={lang === "en" ? "تغيير اللغة إلى العربية" : "Change language to English"}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden xxs:inline">{lang === "en" ? "العربية" : "English"}</span>
          </button>

          {/* Quick toggle or link depending on view */}
          {currentView === "admin" ? (
            <button
              onClick={() => onViewChange("client")}
              className="flex items-center gap-1 px-2 sm:px-3 h-9 sm:h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-all cursor-pointer"
              id="view-home-btn"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.home}</span>
            </button>
          ) : (
            <button
              onClick={() => onViewChange("admin")}
              className="flex items-center gap-1 px-2 sm:px-3 h-9 sm:h-10 bg-sky-50 hover:bg-sky-100 text-sky-950 rounded-lg text-xs font-medium transition-all cursor-pointer"
              id="view-dashboard-btn"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden xs:inline">{t.adminDashboard}</span>
            </button>
          )}

          {/* User / Admin Authentication display */}
          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

          {adminEmail ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-[9px] text-slate-400 leading-none">{t.welcomeAdmin}</span>
                <span className="text-[11px] font-semibold text-slate-800 font-mono leading-none mt-1">{adminEmail}</span>
              </div>
              <div className="p-1.5 bg-sky-100 text-sky-800 rounded-full" title={adminEmail}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 sm:p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                title={t.logout}
                id="logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1 px-2 sm:px-3.5 h-9 sm:h-10 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
              id="login-trigger-btn"
            >
              <User className="w-3.5 h-3.5 text-sky-300" />
              <span>{t.adminLogin}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
