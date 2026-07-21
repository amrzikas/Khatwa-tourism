import React from "react";
import { Destination } from "../types";
import { Compass, MapPin } from "lucide-react";
import { Language, translations, translateText } from "../utils/translations";

interface DestinationListProps {
  destinations: Destination[];
  selectedDestinationId: string | null;
  onSelectDestination: (id: string | null) => void;
  lang: Language;
}

export default function DestinationList({
  destinations,
  selectedDestinationId,
  onSelectDestination,
  lang,
}: DestinationListProps) {
  const t = translations[lang];

  return (
    <div className="py-10 bg-slate-50 border-y border-slate-200/60" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-8 ${lang === "ar" ? "text-right" : "text-left"}`}>
          <div>
            <span className="text-sky-600 text-xs sm:text-sm font-bold uppercase tracking-wider font-mono">{t.recommendedDestinations}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {t.chooseFavorite}
            </h2>
          </div>
          <p className="text-slate-500 text-sm mt-2 md:mt-0 max-w-md">
            {t.destinationClickTip}
          </p>
        </div>

        {/* Categories / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* "All" button card */}
          <div
            onClick={() => onSelectDestination(null)}
            className={`cursor-pointer rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 min-h-[140px] relative overflow-hidden group ${lang === "ar" ? "text-right" : "text-left"} ${
              selectedDestinationId === null
                ? "bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-lg shadow-sky-950/20 ring-2 ring-sky-500"
                : "bg-white text-slate-800 hover:bg-slate-100 border border-slate-200/60 shadow-sm"
            }`}
            id="destination-card-all"
          >
            <div className={`p-2.5 rounded-xl w-fit ${
              selectedDestinationId === null ? "bg-sky-500/20 text-white" : "bg-slate-100 text-sky-600"
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            
            <div className="mt-4">
              <h3 className="font-bold text-base sm:text-lg">{t.allDestinations}</h3>
              <p className={`text-xs mt-1 ${selectedDestinationId === null ? "text-sky-100" : "text-slate-400"}`}>
                {t.browseAllHotels}
              </p>
            </div>
          </div>

          {/* Destinations dynamic items */}
          {destinations.map((dest) => {
            const isSelected = selectedDestinationId === dest.id;
            const displayName = translateText(dest.name, lang);
            const displayCountry = translateText(dest.country, lang);
            const displayDesc = translateText(dest.description, lang);

            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest.id)}
                className={`cursor-pointer rounded-2xl overflow-hidden relative min-h-[140px] flex flex-col justify-end p-4 transition-all duration-300 group ${
                  isSelected
                    ? "ring-2 ring-sky-500 shadow-lg shadow-sky-950/20"
                    : "hover:scale-[1.02] shadow-sm"
                }`}
                id={`destination-card-${dest.id}`}
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={dest.image || "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=400&q=80"}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 ${
                    isSelected
                      ? "bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"
                      : "bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                  }`} />
                </div>

                {/* Content */}
                <div className={`relative z-10 text-white ${lang === "ar" ? "text-right" : "text-left"}`}>
                  <span className="inline-flex items-center gap-1 text-[10px] text-sky-300 bg-black/40 px-2 py-0.5 rounded-full mb-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {displayCountry}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg tracking-tight leading-tight">
                    {displayName}
                  </h3>
                  <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                    {displayDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
