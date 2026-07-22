import React, { useState } from "react";
import { Hotel } from "../types";
import {
  Star,
  MapPin,
  CheckCircle2,
  Image as ImageIcon,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  Users,
  BedDouble,
  Baby,
  Truck,
  Calculator,
  Car
} from "lucide-react";
import { Language, translations, translateText } from "../utils/translations";

interface HotelCardProps {
  hotel: Hotel;
  destinationName: string;
  lang: Language;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, destinationName, lang }) => {
  const t = translations[lang];

  // Modal states
  const [activeModal, setActiveModal] = useState<"gallery" | "details" | "location" | null>(null);
  
  // Gallery slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper to format Date to YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getTodayDateString = () => {
    const today = new Date();
    return formatDate(today);
  };

  const getFutureDateString = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return formatDate(d);
  };

  // Handles for gallery slider
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  // Translated texts
  const displayHotelName = translateText(hotel.name, lang);
  const displayHotelDesc = translateText(hotel.description, lang);
  const displayDestName = translateText(destinationName, lang);
  const displayLocName = translateText(hotel.locationName, lang);
  const displayChildPolicy = translateText(hotel.childPolicy, lang);
  const displayTransferPolicy = translateText(hotel.transfers.policy, lang);

  return (
    <div 
      className={`bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group ${
        lang === "ar" ? "text-right" : "text-left"
      }`} 
      dir={lang === "ar" ? "rtl" : "ltr"} 
      id={`hotel-card-${hotel.id}`}
    >
      
      {/* Top Image & Stars overlay */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={hotel.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
          alt={displayHotelName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Rating and Destination Badges */}
        <div className={`absolute top-4 flex flex-col gap-2 ${lang === "ar" ? "right-4 items-end" : "left-4 items-start"}`}>
          <span className="bg-sky-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            {displayDestName}
          </span>
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < hotel.stars ? "text-amber-400 fill-amber-400" : "text-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Location Name bottom overlay */}
        <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between text-white ${lang === "ar" ? "flex-row-reverse" : ""}`}>
          <div className="flex items-center gap-1.5 text-xs bg-black/45 backdrop-blur-sm py-1 px-3 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="line-clamp-1">{displayLocName}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Hotel Name */}
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 mb-2">
            {displayHotelName}
          </h3>

          {/* Description */}
          <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 mb-5 leading-relaxed">
            {displayHotelDesc}
          </p>

          {/* Core Features list (limited to 4 for card density) */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {t.hotelAmenities}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {hotel.mainFeatures.slice(0, 4).map((feat, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="line-clamp-1">{translateText(feat, lang)}</span>
                </div>
              ))}
              {hotel.mainFeatures.length > 4 && (
                <div className="text-xs text-sky-600 font-medium col-span-2 mt-1">
                  + {hotel.mainFeatures.length - 4} {t.moreAmenities}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              setCurrentImageIndex(0);
              setActiveModal("gallery");
            }}
            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-all border border-slate-200/50"
            title={t.photos}
            id={`hotel-${hotel.id}-gallery-btn`}
          >
            <ImageIcon className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] font-semibold">{t.photos}</span>
          </button>

          <button
            onClick={() => setActiveModal("details")}
            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-sky-50 hover:bg-sky-100/80 text-sky-950 rounded-xl transition-all border border-sky-100/50"
            title={t.ratesDetails}
            id={`hotel-${hotel.id}-prices-btn`}
          >
            <Calendar className="w-5 h-5 text-sky-600" />
            <span className="text-[10px] font-bold">{t.ratesDetails}</span>
          </button>

          <button
            onClick={() => setActiveModal("location")}
            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-all border border-slate-200/50"
            title={t.location}
            id={`hotel-${hotel.id}-map-btn`}
          >
            <MapPin className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] font-semibold">{t.location}</span>
          </button>
        </div>
      </div>

      {/* --- MODAL 1: GALLERY SLIDESHOW --- */}
      {activeModal === "gallery" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800">
            {/* Modal Header */}
            <div className={`p-4 flex items-center justify-between border-b border-slate-800 text-white relative z-10 bg-gradient-to-b from-slate-900 to-transparent ${lang === "en" ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="font-bold text-lg line-clamp-1">{displayHotelName} - {t.photoAlbum}</h4>
            </div>

            {/* Slider Content */}
            <div className="relative flex-grow flex items-center justify-center bg-slate-950 aspect-video max-h-[60vh]">
              {hotel.images.length > 0 ? (
                <>
                  <img
                    src={hotel.images[currentImageIndex]}
                    alt={`Photo ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />

                  {/* Left & Right navigation buttons */}
                  {hotel.images.length > 1 && (
                    <>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-white text-xs font-mono">
                    {currentImageIndex + 1} / {hotel.images.length}
                  </div>
                </>
              ) : (
                <div className="text-slate-500 py-20 text-center">{t.noPhotos}</div>
              )}
            </div>

            {/* Thumbnails preview strip */}
            {hotel.images.length > 1 && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto justify-center">
                {hotel.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all ${
                      idx === currentImageIndex ? "ring-2 ring-sky-500 scale-105" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 2: DATES & PRICES DETAILS --- */}
      {activeModal === "details" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="relative max-w-4xl w-full bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8 max-h-[90vh]">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r from-sky-600 to-indigo-700 text-white flex items-center justify-between shadow-md ${lang === "en" ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 bg-sky-700 hover:bg-sky-800 text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className={`flex items-center gap-3 ${lang === "en" ? "text-left" : "text-right"}`}>
                <Calendar className="w-6 h-6 text-sky-200" />
                <div>
                  <h4 className="font-bold text-xl">{displayHotelName}</h4>
                  <p className="text-xs text-sky-100">{t.ratesSubtitle}</p>
                </div>
              </div>
            </div>

            {/* Modal body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* 1. Seasons & Room Rates Horizontal Table */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h5 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-4">
                  <Compass className="w-5 h-5 text-sky-600" />
                  <span>{lang === "ar" ? "جدول الفترات والأسعار للغرف" : "Room Rates & Periods Matrix"}</span>
                </h5>
                
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className={`px-4 py-3 ${lang === "en" ? "text-left" : "text-right"}`}>
                          {lang === "ar" ? "تاريخ الفترة" : "Period Dates"}
                        </th>
                        {(hotel.roomTypes && hotel.roomTypes.length > 0 ? hotel.roomTypes : [
                          { id: "single", name: lang === "ar" ? "فردي" : "Single", pricePerNight: 0, maxOccupancy: "" },
                          { id: "double", name: lang === "ar" ? "ثنائية" : "Double", pricePerNight: 0, maxOccupancy: "" },
                          { id: "triple", name: lang === "ar" ? "ثلاثية" : "Triple", pricePerNight: 0, maxOccupancy: "" }
                        ]).map((rt) => (
                          <th key={rt.id} className="px-4 py-3 text-center whitespace-nowrap">
                            {translateText(rt.name, lang)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Custom Periods */}
                      {hotel.availabilityPeriods && hotel.availabilityPeriods.map((period) => (
                        <tr key={period.id} className="hover:bg-slate-50/50">
                          <td className={`px-4 py-3.5 font-semibold text-slate-800 ${lang === "en" ? "text-left" : "text-right"}`}>
                            <div className="flex items-center gap-1.5 font-mono text-xs text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 w-fit">
                              <Calendar className="w-3.5 h-3.5 text-sky-600" />
                              <span>
                                {lang === "ar" 
                                  ? `من ${period.startDate} إلى ${period.endDate}` 
                                  : `From ${period.startDate} To ${period.endDate}`
                                }
                              </span>
                            </div>
                          </td>

                          {(hotel.roomTypes && hotel.roomTypes.length > 0 ? hotel.roomTypes : [
                            { id: "single", name: "فردي", pricePerNight: 0, maxOccupancy: "" },
                            { id: "double", name: "ثنائية", pricePerNight: 0, maxOccupancy: "" },
                            { id: "triple", name: "ثلاثية", pricePerNight: 0, maxOccupancy: "" }
                          ]).map((rt) => {
                            const rInfo = period.roomPrices?.[rt.id] || {
                              price: rt.id === "single" ? period.singlePrice : rt.id === "double" ? period.doublePrice : rt.id === "triple" ? period.triplePrice : 0,
                              isAvailable: rt.id === "single" ? period.singleAvailable : rt.id === "double" ? period.doubleAvailable : rt.id === "triple" ? period.tripleAvailable : true,
                              boardType: period.boardType
                            };

                            const boardText = rInfo.boardType || period.boardType;

                            return (
                              <td key={rt.id} className="px-4 py-3.5 text-center font-mono">
                                {rInfo.isAvailable !== false ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="font-bold text-emerald-600 text-sm">
                                      {(rInfo.price ?? 0).toLocaleString()} {t.currencySymbol}
                                    </span>
                                    {boardText && (
                                      <span className="text-[10px] font-semibold text-sky-900 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100/80 leading-tight">
                                        {translateText(boardText, lang)}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-red-500 font-sans font-normal text-xs">{lang === "ar" ? "غير متاح" : "Unavailable"}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Accommodation & Boarding Options */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h5 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-4">
                  <BedDouble className="w-5 h-5 text-sky-600" />
                  <span>{t.diningTitle}</span>
                </h5>
                {hotel.accommodationTypes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hotel.accommodationTypes.map((acc) => (
                      <div key={acc.id} className={`p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center ${lang === "en" ? "flex-row-reverse" : ""}`}>
                        <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-100 text-sky-700">
                          {acc.priceAddition >= 0 ? `+${acc.priceAddition} ${t.currencySymbol}` : `-${Math.abs(acc.priceAddition)} ${t.currencySymbol}`}
                        </span>
                        <span className="text-slate-800 text-xs sm:text-sm font-medium">{translateText(acc.name, lang)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">{t.noDining}</p>
                )}
              </div>

              {/* 3. Child Policy & Transfer Policy Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Child Policy */}
                <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                  <h5 className="font-bold text-slate-950 text-sm sm:text-base flex items-center gap-2 mb-3">
                    <Baby className="w-5 h-5 text-sky-600" />
                    <span>{t.childPolicyTitle}</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {displayChildPolicy || t.childPolicyDefault}
                  </p>
                </div>

                {/* Transfer Policy & Routes */}
                <div className="bg-sky-50/40 border border-sky-100 p-5 rounded-2xl space-y-3">
                  <h5 className="font-bold text-sky-950 text-sm sm:text-base flex items-center gap-2">
                    <Truck className="w-5 h-5 text-sky-600" />
                    <span>{t.transfersTitle}</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
                    {displayTransferPolicy || t.noTransfers}
                  </p>
                  
                  {hotel.transfers.isAvailable ? (
                    <div className="space-y-3">
                      {/* Transfer locations if present */}
                      {hotel.transfers.locations && hotel.transfers.locations.length > 0 && (
                        <div className="space-y-2 mt-2">
                          <h6 className="text-xs font-bold text-sky-900 flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-sky-600" />
                            <span>{t.transferLocationsTitle}</span>
                          </h6>
                          <div className="space-y-2">
                            {hotel.transfers.locations.map((loc) => (
                              <div key={loc.id} className="bg-white p-3 rounded-xl border border-sky-100 space-y-1.5 text-xs shadow-xs">
                                <div className="font-bold text-slate-800 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                  <span>{translateText(loc.locationName, lang)}</span>
                                </div>
                                {loc.vehicles && loc.vehicles.length > 0 && (
                                  <div className="grid grid-cols-1 gap-1 pt-1 border-t border-slate-50">
                                    {loc.vehicles.map((v) => (
                                      <div key={v.id} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded text-[11px]">
                                        <span className="text-slate-700 font-medium">{translateText(v.vehicleType, lang)}</span>
                                        <span className="font-mono font-bold text-emerald-600">
                                          {v.pricePerSeat} {t.currencySymbol} / {lang === "ar" ? "كرسي" : "seat"}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <span className="text-xs text-red-600 font-semibold">{t.transferUnavailable}</span>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 bg-slate-100 border-t border-slate-200 flex ${lang === "en" ? "justify-start" : "justify-end"}`}>
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: LOCATION MAP --- */}
      {activeModal === "location" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            {/* Modal Header */}
            <div className={`p-5 bg-slate-900 text-white flex items-center justify-between ${lang === "en" ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <div className={`flex items-center gap-2 ${lang === "en" ? "text-left" : "text-right"}`}>
                <MapPin className="w-5 h-5 text-sky-400" />
                <div>
                  <h4 className="font-bold text-lg">{displayHotelName} - {t.geographicLocation}</h4>
                  <p className="text-xs text-slate-300">{displayLocName}</p>
                </div>
              </div>
            </div>

            {/* Map iframe or simulated map info */}
            <div className="bg-slate-50 h-96 relative">
              {hotel.locationMapUrl ? (
                <iframe
                  title={`Map ${displayHotelName}`}
                  src={hotel.locationMapUrl}
                  className="w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MapPin className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-slate-800 font-bold mb-1">{displayLocName}</p>
                  <p className="text-xs text-slate-400 max-w-sm">{t.noMapLink}</p>
                </div>
              )}
            </div>

            {/* Info panel in Footer */}
            <div className={`p-5 bg-slate-50 border-t border-slate-100 ${lang === "ar" ? "text-right" : "text-left"}`}>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{t.howToGetThere}</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.getThereDescription.replace("{dest}", displayDestName)}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HotelCard;
