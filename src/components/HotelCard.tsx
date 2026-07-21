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
  Utensils,
  Baby,
  Truck,
  Calculator
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

  // Price Estimator state inside the details modal with Date selection From and To
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getFutureDateString(3));
  const [selectedRoomId, setSelectedRoomId] = useState(hotel.roomTypes[0]?.id || "");
  const [selectedAccId, setSelectedAccId] = useState(hotel.accommodationTypes[0]?.id || "");
  const [includeTransfers, setIncludeTransfers] = useState(false);
  const [guestsCount, setGuestsCount] = useState(2);

  // Dynamic Nights calculation
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  const diffTime = eDate.getTime() - sDate.getTime();
  const nightsCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Overlapping period search
  const activePeriod = hotel.availabilityPeriods?.find(p => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const pStart = new Date(p.startDate);
    const pEnd = new Date(p.endDate);
    return s <= pEnd && e >= pStart;
  });

  // Fetch prices and availability for the 3 main room types
  const getRoomPriceAndAvailability = (roomName: string) => {
    const norm = roomName.toLowerCase();
    const isSingle = norm.includes("فردي") || norm.includes("single");
    const isDouble = norm.includes("ثنائية") || norm.includes("double");
    const isTriple = norm.includes("ثلاثية") || norm.includes("triple");

    // find room object from hotel
    const defaultRoom = hotel.roomTypes.find(r => {
      const rn = r.name.toLowerCase();
      if (isSingle) return rn.includes("فردي") || rn.includes("single");
      if (isDouble) return rn.includes("ثنائية") || rn.includes("double");
      if (isTriple) return rn.includes("ثلاثية") || rn.includes("triple");
      return false;
    }) || hotel.roomTypes[0];

    let price = defaultRoom ? defaultRoom.pricePerNight : 0;
    let available = true;

    if (activePeriod) {
      if (isSingle) {
        price = activePeriod.singlePrice;
        available = activePeriod.singleAvailable;
      } else if (isDouble) {
        price = activePeriod.doublePrice;
        available = activePeriod.doubleAvailable;
      } else if (isTriple) {
        price = activePeriod.triplePrice;
        available = activePeriod.tripleAvailable;
      }
    } else {
      if (isSingle && hotel.singlePrice !== undefined) price = hotel.singlePrice;
      if (isDouble && hotel.doublePrice !== undefined) price = hotel.doublePrice;
      if (isTriple && hotel.triplePrice !== undefined) price = hotel.triplePrice;
    }

    return { price, available, id: defaultRoom?.id || roomName };
  };

  // Calculate active selected room price and availability
  const selectedRoom = hotel.roomTypes.find(r => r.id === selectedRoomId);
  const roomMeta = selectedRoom ? getRoomPriceAndAvailability(selectedRoom.name) : { price: 0, available: true };

  const roomPrice = roomMeta.price;
  const isRoomAvailable = roomMeta.available;

  const selectedAcc = hotel.accommodationTypes.find(a => a.id === selectedAccId);
  const accPriceAddition = selectedAcc ? selectedAcc.priceAddition : 0;
  const transferPrice = (includeTransfers && hotel.transfers.isAvailable) ? (hotel.transfers.price * guestsCount) : 0;
  const totalEstimate = isRoomAvailable ? ((roomPrice + accPriceAddition) * nightsCount + transferPrice) : 0;

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
              
              {/* Date selection row (From / To) */}
              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-600" />
                  <span className="text-xs font-bold text-slate-800">
                    {lang === "ar" ? "اختر فترة الإقامة لتحديث الأسعار وتوافر الغرف تلقائياً:" : "Choose your stay period to update rates and availability automatically:"}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">{t.startDateLabel}</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold font-mono"
                    />
                  </div>
                  <span className="text-slate-400 text-xs mt-4">➔</span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">{t.endDateLabel}</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Grid: Left/Right Column depends on language */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Data Tables (8 cols) */}
                <div className={`lg:col-span-8 space-y-6 ${lang === "ar" ? "text-right" : "text-left"}`}>
                  
                  {/* 1. Room Types */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <h5 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-4">
                      <Compass className="w-5 h-5 text-sky-600" />
                      <span>{t.roomRatesTitle}</span>
                    </h5>
                    {hotel.roomTypes.length > 0 ? (
                      <div className="overflow-hidden border border-slate-100 rounded-xl">
                        <table className="w-full text-sm text-right">
                          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                            <tr>
                              <th className={`px-4 py-3 ${lang === "en" ? "text-left" : "text-right"}`}>{t.roomTypeHeader}</th>
                              <th className={`px-4 py-3 ${lang === "en" ? "text-left" : "text-right"}`}>{t.occupancyHeader}</th>
                              <th className={`px-4 py-3 ${lang === "en" ? "text-left" : "text-right"} text-sky-800`}>{t.priceNightHeader}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {hotel.roomTypes.map((room) => {
                              const meta = getRoomPriceAndAvailability(room.name);
                              return (
                                <tr key={room.id} className="hover:bg-slate-50/50">
                                  <td className={`px-4 py-3 font-semibold text-slate-800 ${lang === "en" ? "text-left" : "text-right"}`}>{translateText(room.name, lang)}</td>
                                  <td className={`px-4 py-3 text-xs text-slate-600 flex items-center gap-1.5 py-3.5 ${lang === "en" ? "text-left justify-start" : "text-right justify-start"}`}>
                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{translateText(room.maxOccupancy, lang)}</span>
                                  </td>
                                  <td className={`px-4 py-3 font-mono font-bold ${lang === "en" ? "text-left" : "text-right"}`}>
                                    {meta.available ? (
                                      <span className="text-emerald-600">{meta.price} {t.currencySymbol}</span>
                                    ) : (
                                      <span className="text-red-500 text-xs font-sans font-normal">{lang === "ar" ? "غير متوفر للفترة المحددة" : "Unavailable for selected period"}</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs">{t.noRooms}</p>
                    )}
                  </div>

                  {/* 2. Accommodation Options */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <h5 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-4">
                      <Utensils className="w-5 h-5 text-sky-600" />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    {/* Transfer Policy */}
                    <div className="bg-sky-50/40 border border-sky-100 p-5 rounded-2xl">
                      <h5 className="font-bold text-sky-950 text-sm sm:text-base flex items-center gap-2 mb-3">
                        <Truck className="w-5 h-5 text-sky-600" />
                        <span>{t.transfersTitle}</span>
                      </h5>
                      <p className="text-xs sm:text-sm text-sky-900 leading-relaxed mb-3">
                        {displayTransferPolicy || t.noTransfers}
                      </p>
                      {hotel.transfers.isAvailable ? (
                        <div className={`flex items-center justify-between bg-white p-2 rounded-xl border border-sky-100 ${lang === "en" ? "flex-row-reverse" : ""}`}>
                          <span className="text-xs sm:text-sm font-bold text-sky-700 font-mono">{hotel.transfers.price} {t.currencySymbol}</span>
                          <span className="text-xs text-slate-500">{t.transferPricePerPerson}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-red-600 font-semibold">{t.transferUnavailable}</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Interactive Estimator (4 cols) */}
                <div className={`lg:col-span-4 bg-slate-100 p-5 rounded-2xl border border-slate-200/60 flex flex-col justify-between ${lang === "ar" ? "text-right" : "text-left"}`}>
                  <div>
                    <h5 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-4">
                      <Calculator className="w-5 h-5 text-sky-600" />
                      <span>{t.calculatorTitle}</span>
                    </h5>

                    {/* Room select */}
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.selectRoomLabel}</label>
                      <select
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-600 font-sans"
                      >
                        {hotel.roomTypes.map(r => {
                          const meta = getRoomPriceAndAvailability(r.name);
                          return (
                            <option key={r.id} value={r.id} disabled={!meta.available}>
                              {translateText(r.name, lang)} ({meta.price} {t.currencySymbol}) {!meta.available ? `(${lang === "ar" ? "غير متوفر" : "Unavailable"})` : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Acc select */}
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.selectDiningLabel}</label>
                      <select
                        value={selectedAccId}
                        onChange={(e) => setSelectedAccId(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-600 font-sans"
                      >
                        {hotel.accommodationTypes.map(a => (
                          <option key={a.id} value={a.id}>{translateText(a.name, lang)} ({a.priceAddition >= 0 ? `+${a.priceAddition} ${t.currencySymbol}` : `-${Math.abs(a.priceAddition)} ${t.currencySymbol}`})</option>
                        ))}
                      </select>
                    </div>

                    {/* Nights and guests */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">{t.nightsCountLabel}</label>
                        <div className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold text-center text-slate-700 font-mono">
                          {nightsCount} {lang === "ar" ? "ليالي" : "nights"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">{t.guestsCountLabel}</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={guestsCount}
                          disabled={!includeTransfers}
                          onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold text-center disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Toggle transfers */}
                    {hotel.transfers.isAvailable && (
                      <label className={`flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200/45 select-none mb-4 ${lang === "en" ? "flex-row" : ""}`}>
                        <input
                          type="checkbox"
                          checked={includeTransfers}
                          onChange={(e) => setIncludeTransfers(e.target.checked)}
                          className="w-4 h-4 text-sky-600 accent-sky-600 rounded focus:ring-0"
                        />
                        <span className="text-xs font-semibold text-slate-700">{t.includeTransfersLabel}</span>
                      </label>
                    )}
                  </div>

                  {/* Estimation summary */}
                  {!isRoomAvailable ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs text-center font-bold">
                      {lang === "ar" 
                        ? "هذه الغرفة غير متاحة للفترة المحددة، يرجى اختيار نوع غرفة آخر أو تغيير تواريخ الإقامة." 
                        : "This room type is unavailable for the selected dates. Please choose another room type or modify your stay period."}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-sky-600 to-indigo-700 text-white p-4 rounded-xl border border-sky-500/20 mt-4 shadow-md">
                      <div className="flex justify-between text-xs text-sky-100 mb-1">
                        <span>{t.totalEstimateLabel.replace("{nights}", String(nightsCount))}</span>
                      </div>
                      <div className={`flex items-baseline justify-between ${lang === "en" ? "flex-row-reverse" : ""}`}>
                        <span className="text-2xl font-extrabold font-mono text-white">{totalEstimate.toLocaleString()} {t.currencySymbol}</span>
                      </div>
                      <p className="text-[9px] text-sky-200/75 mt-2 leading-tight">
                        {t.approxDisclaimer}
                      </p>
                    </div>
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
