import React from "react";
import { Waves, Mountain, Compass, Anchor } from "lucide-react";
import { Language } from "../utils/translations";

interface ActivitySectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  lang: Language;
}

export default function ActivitySection({ searchTerm, onSearchChange, lang }: ActivitySectionProps) {
  const activities = [
    {
      id: "sea",
      nameAr: "بحر وشواطئ",
      nameEn: "Sea & Beaches",
      descAr: "شواطئ فيروزية ساحرة",
      descEn: "Turquoise sandy shores",
      query: "بحر",
      enQuery: "sea",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      icon: Waves
    },
    {
      id: "mountains",
      nameAr: "مغامرات الجبال",
      nameEn: "Mountain Hikes",
      descAr: "سلاسل جبال سيناء المهيبة",
      descEn: "Majestic desert ranges",
      query: "جبل",
      enQuery: "mountain",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      icon: Mountain
    },
    {
      id: "safari",
      nameAr: "سفاري وتخييم",
      nameEn: "Desert Safari",
      descAr: "رحلات دبابات وسهر بدوي",
      descEn: "Quads & Bedouin nights",
      query: "سفاري",
      enQuery: "safari",
      image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=600&q=80",
      icon: Compass
    },
    {
      id: "diving",
      nameAr: "غطس وشعاب",
      nameEn: "Diving & Reefs",
      descAr: "أعماق البحر الأحمر الساحرة",
      descEn: "World-class coral reefs",
      query: "غطس",
      enQuery: "diving",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
      icon: Anchor
    }
  ];

  const handleActivityClick = (query: string) => {
    onSearchChange(query);
    // Smooth scroll back to hotels section so the user sees results
    const element = document.getElementById("hotels-display-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-slate-900 text-white py-14 border-t border-slate-800" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <p className="text-sm sm:text-base font-bold text-sky-400 mb-2 tracking-wider uppercase">
            {lang === "ar" ? "استكشف وجهتك أو فنادقنا حسب نوع النشاط المفضل:" : "Explore destinations or hotels by preferred activity:"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {activities.map((act) => {
            const activeQuery = lang === "ar" ? act.query : act.enQuery;
            const isActive = searchTerm.toLowerCase() === activeQuery.toLowerCase();
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => handleActivityClick(isActive ? "" : activeQuery)}
                className={`group relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-square flex flex-col justify-end p-4 text-right cursor-pointer transition-all duration-300 border ${
                  isActive 
                    ? "ring-2 ring-sky-400 border-sky-400 scale-[1.03] shadow-lg shadow-sky-500/20" 
                    : "border-slate-800 hover:border-sky-500/50 hover:scale-[1.02] shadow-md shadow-slate-950/20"
                }`}
              >
                {/* Background Image with Hover Zoom */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={act.image} 
                    alt={act.nameAr} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"
                  />
                  <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? "bg-sky-950/30" : "bg-slate-950/20 group-hover:bg-slate-950/30"}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                </div>

                {/* Icon & Label */}
                <div className={`relative z-10 flex flex-col ${lang === "ar" ? "items-start text-right" : "items-start text-left"} gap-1 w-full`}>
                  <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive ? "bg-sky-500 text-white" : "bg-white/10 text-sky-300 group-hover:bg-sky-500 group-hover:text-white"}`}>
                    <act.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide mt-1">
                    {lang === "ar" ? act.nameAr : act.nameEn}
                  </span>
                  <span className="text-[10px] text-slate-300 opacity-80 line-clamp-1">
                    {lang === "ar" ? act.descAr : act.descEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
