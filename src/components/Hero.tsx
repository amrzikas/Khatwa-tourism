import React from "react";
import { Search, MapPin, Sparkles, Building2 } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface HeroProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  destinationsCount: number;
  hotelsCount: number;
  lang: Language;
  heroBgUrl?: string;
}

export default function Hero({ searchTerm, onSearchChange, destinationsCount, hotelsCount, lang, heroBgUrl }: HeroProps) {
  const t = translations[lang];

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-16 sm:py-20" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Absolute background image with premium dark overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBgUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80"} 
          alt="Khatwa Sinai Sea and Mountains" 
          className="w-full h-full object-cover object-center opacity-65 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/45 to-slate-950/85"></div>
        {/* Decorative ambient patterns */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.exclusiveBadge}</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mx-auto mb-6">
          {t.heroHeading} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-sky-100">{t.heroSub}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          {t.heroSubtitle}
        </p>

        {/* Live Statistics */}
        <div className="flex justify-center items-center gap-6 sm:gap-12 mb-10 text-slate-300">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-sky-400" />
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <div className="text-2xl font-bold font-mono text-white">{destinationsCount}</div>
              <div className="text-xs text-slate-400">{t.statsDestinations}</div>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-sky-400" />
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <div className="text-2xl font-bold font-mono text-white">{hotelsCount}</div>
              <div className="text-xs text-slate-400">{t.statsHotels}</div>
            </div>
          </div>
        </div>

        {/* Search Input bar */}
        <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-950/40 border border-slate-800/20 flex items-center mb-2">
          <div className="p-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full bg-transparent border-none text-slate-900 focus:outline-none placeholder-slate-400 text-sm sm:text-base font-medium px-2 py-3 ${lang === "ar" ? "text-right" : "text-left"}`}
            dir={lang === "ar" ? "rtl" : "ltr"}
            id="search-input"
          />
          <button className="hidden sm:block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-sky-600/10 hover:shadow-sky-600/25 shrink-0">
            {t.searchBtn}
          </button>
        </div>

      </div>
    </section>
  );
}
