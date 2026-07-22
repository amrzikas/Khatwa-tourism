import React, { useState } from "react";
import { Destination, Hotel, RoomType, AccommodationType, TransferLocation, VehicleOption } from "../types";
import { Language, translations, translateText } from "../utils/translations";
import {
  MapPin,
  Building2,
  Plus,
  Trash2,
  PlusCircle,
  X,
  ListFilter,
  Layers,
  Image as ImageIcon,
  Compass,
  Star,
  Users,
  BedDouble,
  Baby,
  Truck,
  Check,
  AlertCircle,
  Edit,
  Car
} from "lucide-react";

interface AdminDashboardProps {
  destinations: Destination[];
  hotels: Hotel[];
  onAddDestination: (destination: Destination) => void;
  onDeleteDestination: (id: string) => void;
  onAddHotel: (hotel: Hotel) => void;
  onDeleteHotel: (id: string) => void;
  lang: Language;
}

export default function AdminDashboard({
  destinations,
  hotels,
  onAddDestination,
  onDeleteDestination,
  onAddHotel,
  onDeleteHotel,
  lang,
}: AdminDashboardProps) {
  const t = translations[lang];
  // Tabs: "destinations" | "hotels"
  const [activeTab, setActiveTab] = useState<"destinations" | "hotels">("destinations");

  // Destination Form State
  const [destName, setDestName] = useState("");
  const [destCountry, setDestCountry] = useState(lang === "ar" ? "مصر" : "Egypt");
  const [destDesc, setDestDesc] = useState("");
  const [destImage, setDestImage] = useState("");

  // Hotel Form State
  const [hotelDestId, setHotelDestId] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelStars, setHotelStars] = useState(5);
  const [hotelDesc, setHotelDesc] = useState("");
  const [hotelLocName, setHotelLocName] = useState("");
  const [hotelLocMapUrl, setHotelLocMapUrl] = useState("");
  const [hotelChildPolicy, setHotelChildPolicy] = useState("");
  
  // Hotel lists state (features, images, roomTypes, accTypes, transfer)
  const [newFeature, setNewFeature] = useState("");
  const [hotelFeatures, setHotelFeatures] = useState<string[]>(
    lang === "ar"
      ? ["واي فاي مجاني", "مسبح خارجي دافئ", "شاطئ خاص", "نادي صحي وسبا"]
      : ["Free Wi-Fi", "Heated Outdoor Pool", "Private Beach", "Health Club & Spa"]
  );
  
  // EXACTLY 5 Images
  const [hotelImages, setHotelImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
  ]);

  // Editing state for hotels
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

  // Room Types State & Default Fallback
  const defaultRoomTypes: RoomType[] = [
    { id: "single", name: lang === "ar" ? "فردي" : "Single", pricePerNight: 0, maxOccupancy: lang === "ar" ? "شخص واحد" : "1 Adult" },
    { id: "double", name: lang === "ar" ? "ثنائية" : "Double", pricePerNight: 0, maxOccupancy: lang === "ar" ? "شخصين بالغين" : "2 Adults" },
    { id: "triple", name: lang === "ar" ? "ثلاثية" : "Triple", pricePerNight: 0, maxOccupancy: lang === "ar" ? "3 أشخاص بالغين" : "3 Adults" }
  ];
  const [hotelRoomTypes, setHotelRoomTypes] = useState<RoomType[]>(defaultRoomTypes);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomOcc, setNewRoomOcc] = useState("");

  // Availability Periods & Editing
  const [availabilityPeriods, setAvailabilityPeriods] = useState<any[]>([]);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [periodSingleAvailable, setPeriodSingleAvailable] = useState(true);
  const [periodSinglePrice, setPeriodSinglePrice] = useState(100);
  const [periodDoubleAvailable, setPeriodDoubleAvailable] = useState(true);
  const [periodDoublePrice, setPeriodDoublePrice] = useState(150);
  const [periodTripleAvailable, setPeriodTripleAvailable] = useState(true);
  const [periodTriplePrice, setPeriodTriplePrice] = useState(200);

  // Dynamic Prices Map per Room Type ID: { [roomTypeId]: { price: number, isAvailable: boolean } }
  const [periodRoomPrices, setPeriodRoomPrices] = useState<Record<string, { price: number; isAvailable: boolean }>>({
    single: { price: 100, isAvailable: true },
    double: { price: 150, isAvailable: true },
    triple: { price: 200, isAvailable: true }
  });

  // Accommodation Options
  const [accName, setAccName] = useState("");
  const [accPrice, setAccPrice] = useState(0);
  const [hotelAccTypes, setHotelAccTypes] = useState<AccommodationType[]>([
    { 
      id: "init-a-1", 
      name: lang === "ar" ? "إقامة شاملة بالكامل (All Inclusive)" : "All Inclusive (AI)", 
      priceAddition: 0 
    }
  ]);

  // Transfer Locations & Vehicle Options
  const [transPolicy, setTransPolicy] = useState(
    lang === "ar"
      ? "انتقالات جماعية مكيفة من المطار للفندق وبالعكس."
      : "Air-conditioned shared transfers from airport to hotel and back."
  );
  const [transPrice, setTransPrice] = useState(15);
  const [transAvailable, setTransAvailable] = useState(true);
  const [transLocations, setTransLocations] = useState<TransferLocation[]>([]);
  const [newLocName, setNewLocName] = useState("");
  const [newVehicleTypes, setNewVehicleTypes] = useState<Record<string, string>>({});
  const [newVehiclePrices, setNewVehiclePrices] = useState<Record<string, number>>({});

  // Status indicators
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- SUBMIT DESTINATION ---
  const handleAddDestinationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!destName || !destDesc) {
      setErrorMsg(t.destFormError);
      return;
    }

    // Default image if empty
    const finalImage = destImage.trim() || "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80";

    const newDest: Destination = {
      id: "dest-" + Date.now(),
      name: destName.trim(),
      country: destCountry.trim(),
      description: destDesc.trim(),
      image: finalImage.trim(),
    };

    onAddDestination(newDest);
    setSuccessMsg(t.destFormSuccess.replace("{name}", destName));
    
    // Reset Form
    setDestName("");
    setDestDesc("");
    setDestImage("");
  };

  // --- EDIT HOTEL HANDLER ---
  const handleEditHotelClick = (hotel: Hotel) => {
    setEditingHotelId(hotel.id);
    setHotelDestId(hotel.destinationId);
    setHotelName(hotel.name);
    setHotelStars(hotel.stars);
    setHotelDesc(hotel.description);
    setHotelLocName(hotel.locationName);
    setHotelLocMapUrl(hotel.locationMapUrl || "");
    setHotelChildPolicy(hotel.childPolicy || "");
    setHotelFeatures(hotel.mainFeatures || []);
    setHotelImages(hotel.images || []);
    setHotelRoomTypes(hotel.roomTypes && hotel.roomTypes.length > 0 ? hotel.roomTypes : defaultRoomTypes);
    setAvailabilityPeriods(hotel.availabilityPeriods || []);
    setEditingPeriodId(null);
    setHotelAccTypes(hotel.accommodationTypes || []);
    setTransPolicy(hotel.transfers?.policy || "");
    setTransPrice(hotel.transfers?.price || 0);
    setTransAvailable(hotel.transfers?.isAvailable ?? true);
    setTransLocations(hotel.transfers?.locations || []);
    
    // Switch to hotels tab if not already there
    setActiveTab("hotels");
    
    // Scroll smoothly to the form
    const element = document.getElementById("admin-hotel-form-title");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    setEditingHotelId(null);
    setEditingPeriodId(null);
    setHotelName("");
    setHotelDesc("");
    setHotelLocName("");
    setHotelLocMapUrl("");
    setHotelChildPolicy("");
    setHotelRoomTypes(defaultRoomTypes);
    setHotelFeatures(lang === "ar"
      ? ["واي فاي مجاني", "مسبح خارجي دافئ", "شاطئ خاص", "نادي صحي وسبا"]
      : ["Free Wi-Fi", "Heated Outdoor Pool", "Private Beach", "Health Club & Spa"]
    );
    setHotelImages([
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
    ]);
    setAvailabilityPeriods([]);
    setHotelAccTypes([{ id: "init-a-1", name: lang === "ar" ? "إقامة شاملة بالكامل (All Inclusive)" : "All Inclusive (AI)", priceAddition: 0 }]);
    setTransLocations([]);
  };

  // --- SUBMIT HOTEL ---
  const handleAddHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const activeDestId = hotelDestId || destinations[0]?.id;

    if (!activeDestId) {
      setErrorMsg(t.hotelFormErrorDest);
      return;
    }

    if (!hotelName || !hotelDesc || !hotelLocName) {
      setErrorMsg(t.hotelFormErrorFields);
      return;
    }

    // Construct/Update Hotel object
    const hotelId = editingHotelId || "hotel-" + Date.now();
    const newHotel: Hotel = {
      id: hotelId,
      destinationId: activeDestId,
      name: hotelName.trim(),
      stars: hotelStars,
      description: hotelDesc.trim(),
      mainFeatures: hotelFeatures.length > 0 ? hotelFeatures : (lang === "ar" ? ["واي فاي مجاني", "خدمة غرف"] : ["Free Wi-Fi", "Room Service"]),
      images: hotelImages, // Exactly 5 images
      locationName: hotelLocName.trim(),
      locationMapUrl: hotelLocMapUrl.trim() || `https://maps.google.com/maps?q=${encodeURIComponent(hotelName)}&t=&z=13&ie=UTF8&iwloc=&output=embed`,
      roomTypes: hotelRoomTypes.length > 0 ? hotelRoomTypes : defaultRoomTypes,
      accommodationTypes: hotelAccTypes.length > 0 ? hotelAccTypes : [{ id: "acc-def", name: lang === "ar" ? "إفطار فقط" : "Breakfast Only", priceAddition: 0 }],
      childPolicy: hotelChildPolicy.trim() || (lang === "ar" ? "الأطفال حتى سن 5.99 سنوات مجاناً." : "Children up to 5.99 years are free of charge."),
      transfers: {
        policy: transPolicy.trim() || (lang === "ar" ? "انتقالات اختيارية مكيفة." : "Optional air-conditioned transfers."),
        price: transPrice,
        isAvailable: transAvailable,
        locations: transLocations
      },
      availabilityPeriods: availabilityPeriods
    };

    onAddHotel(newHotel);
    
    if (editingHotelId) {
      setSuccessMsg(lang === "ar" ? "تم تعديل بيانات الفندق بنجاح!" : "Hotel details updated successfully!");
    } else {
      setSuccessMsg(t.hotelFormSuccess.replace("{name}", hotelName));
    }

    // Reset Form & Editing State
    setEditingHotelId(null);
    setEditingPeriodId(null);
    setHotelName("");
    setHotelDesc("");
    setHotelLocName("");
    setHotelLocMapUrl("");
    setHotelChildPolicy("");
    setTransLocations([]);
    setHotelLocMapUrl("");
    setHotelChildPolicy("");
    setHotelFeatures(lang === "ar"
      ? ["واي فاي مجاني", "مسبح خارجي دافئ", "شاطئ خاص", "نادي صحي وسبا"]
      : ["Free Wi-Fi", "Heated Outdoor Pool", "Private Beach", "Health Club & Spa"]
    );
    setHotelImages([
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
    ]);
    setAvailabilityPeriods([]);
    setHotelAccTypes([{ id: "init-a-1", name: lang === "ar" ? "إقامة شاملة بالكامل (All Inclusive)" : "All Inclusive (AI)", priceAddition: 0 }]);
  };

  // --- Dynamic add/remove helpers ---
  const addFeature = () => {
    if (newFeature.trim()) {
      setHotelFeatures([...hotelFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (idx: number) => {
    setHotelFeatures(hotelFeatures.filter((_, i) => i !== idx));
  };

  const handleImageChange = (index: number, val: string) => {
    const updated = [...hotelImages];
    updated[index] = val;
    setHotelImages(updated);
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          handleImageChange(index, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addAccType = () => {
    if (accName.trim()) {
      const newAcc: AccommodationType = {
        id: "acc-" + Date.now() + Math.random(),
        name: accName.trim(),
        priceAddition: Number(accPrice) || 0
      };
      setHotelAccTypes([...hotelAccTypes, newAcc]);
      setAccName("");
      setAccPrice(0);
    }
  };

  const removeAccType = (id: string) => {
    setHotelAccTypes(hotelAccTypes.filter(a => a.id !== id));
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${lang === "ar" ? "text-right" : "text-left"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Dashboard Welcome Header */}
      <div className={`bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800 mb-8 ${lang === "ar" ? "text-right" : "text-left"}`}>
        <div className="absolute top-0 left-0 translate-y-[-20%] translate-x-[-20%] w-64 h-64 rounded-full bg-sky-500/10 blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
            <Layers className="w-8 h-8 text-sky-400" />
            <span>{t.adminDashboardTitle}</span>
          </h2>
          <p className="text-slate-200 text-sm sm:text-base mt-2 max-w-2xl font-sans">
            {t.adminDashboardSubtitle}
          </p>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="flex border-b border-slate-200 mb-8 gap-2">
        <button
          onClick={() => {
            setActiveTab("destinations");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "destinations"
              ? "border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab-destinations-btn"
        >
          <Compass className="w-5 h-5" />
          <span>{t.manageDestinations} ({destinations.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("hotels");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "hotels"
              ? "border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab-hotels-btn"
        >
          <Building2 className="w-5 h-5" />
          <span>{t.manageHotels} ({hotels.length})</span>
        </button>
      </div>

      {/* Feedback Alerts */}
      {errorMsg && (
        <div className={`bg-red-50 border border-red-200 text-red-900 p-4 rounded-2xl flex items-start gap-3 mb-6 ${lang === "ar" ? "text-right" : "text-left"}`}>
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className={`bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-2xl flex items-start gap-3 mb-6 ${lang === "ar" ? "text-right" : "text-left"}`}>
          <Check className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{successMsg}</div>
        </div>
      )}

      {/* --- TAB 1: DESTINATIONS BUILDER --- */}
      {activeTab === "destinations" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Side (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <PlusCircle className="w-5 h-5 text-sky-600" />
              <span>{t.createDestination}</span>
            </h3>

            <form onSubmit={handleAddDestinationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.destNameLabel}</label>
                <input
                  type="text"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  placeholder={t.destNamePlaceholder}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white ${lang === "ar" ? "text-right" : "text-left"}`}
                  id="form-dest-name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.destCountryLabel}</label>
                <input
                  type="text"
                  value={destCountry}
                  onChange={(e) => setDestCountry(e.target.value)}
                  placeholder={t.destCountryPlaceholder}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white ${lang === "ar" ? "text-right" : "text-left"}`}
                  id="form-dest-country"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.destImageLabel}</label>
                <input
                  type="url"
                  value={destImage}
                  onChange={(e) => setDestImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white text-left"
                  dir="ltr"
                  id="form-dest-image"
                />
                <p className="text-[10px] text-slate-400 mt-1">{t.destImageHint}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.destDescLabel}</label>
                <textarea
                  value={destDesc}
                  onChange={(e) => setDestDesc(e.target.value)}
                  placeholder={t.destDescPlaceholder}
                  rows={4}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white ${lang === "ar" ? "text-right" : "text-left"}`}
                  id="form-dest-desc"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-md shadow-sky-600/10 flex items-center justify-center gap-2 cursor-pointer"
                id="form-dest-submit-btn"
              >
                <Plus className="w-5 h-5 text-sky-200" />
                <span>{t.saveDestBtn}</span>
              </button>
            </form>
          </div>

          {/* List Side (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
                <span>{t.currentDestList}</span>
                <span className="text-xs bg-sky-50 text-sky-600 px-3 py-1 rounded-full font-bold">
                  {t.allDestCount.replace("{count}", String(destinations.length))}
                </span>
              </h3>

              {destinations.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {destinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={dest.image}
                          alt={translateText(dest.name, lang)}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                            <span>{translateText(dest.name, lang)}</span>
                            <span className="text-xs font-medium text-slate-400">({translateText(dest.country, lang)})</span>
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-1 mt-1 max-w-md">
                            {translateText(dest.description, lang)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(t.deleteDestConfirm.replace("{name}", translateText(dest.name, lang)))) {
                            onDeleteDestination(dest.id);
                            setSuccessMsg(t.deleteDestSuccess.replace("{name}", translateText(dest.name, lang)));
                          }
                        }}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        title={lang === "ar" ? "حذف الوجهة" : "Delete Destination"}
                        id={`delete-dest-btn-${dest.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-semibold">{t.emptyDestList}</p>
                </div>
              )}
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 mt-6 text-xs text-sky-950 leading-relaxed">
              {t.destWarningNotice}
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 2: HOTELS & RESORTS BUILDER --- */}
      {activeTab === "hotels" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
            <h3 id="admin-hotel-form-title" className="text-lg font-bold text-slate-900 flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                <span>{editingHotelId ? (lang === "ar" ? "تعديل بيانات الفندق" : "Edit Hotel Details") : t.createHotel}</span>
              </span>
              {editingHotelId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-100 transition-all cursor-pointer"
                >
                  {lang === "ar" ? "إلغاء التعديل ✕" : "Cancel Edit ✕"}
                </button>
              )}
            </h3>

            <form onSubmit={handleAddHotelSubmit} className="space-y-6">
              
              {/* Core Hotel Info Group */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                  {lang === "ar" ? "البيانات الأساسية للفندق" : "Basic Hotel Information"}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.hotelNameLabel}</label>
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: ريكسوس بريميوم، أو سوفيتيل" : "e.g., Rixos Premium, or Sofitel"}
                      className={`w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 font-medium ${lang === "ar" ? "text-right" : "text-left"}`}
                      id="form-hotel-name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.selectDestLabel}</label>
                    <select
                      value={hotelDestId}
                      onChange={(e) => setHotelDestId(e.target.value)}
                      className={`w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 font-medium ${lang === "ar" ? "text-right" : "text-left"}`}
                      id="form-hotel-dest-select"
                    >
                      <option value="">{t.hotelDefaultOption}</option>
                      {destinations.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {translateText(dest.name, lang)} ({translateText(dest.country, lang)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.hotelStarsLabel}</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={hotelStars}
                        onChange={(e) => setHotelStars(Number(e.target.value))}
                        className={`w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-600 font-bold ${lang === "ar" ? "text-right" : "text-left"}`}
                        id="form-hotel-stars"
                      >
                        <option value="5">{t.star5}</option>
                        <option value="4">{t.star4}</option>
                        <option value="3">{t.star3}</option>
                        <option value="2">{t.star2}</option>
                        <option value="1">{t.star1}</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.hotelLocLabel}</label>
                    <input
                      type="text"
                      value={hotelLocName}
                      onChange={(e) => setHotelLocName(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: خليج نعمة، بجوار ممشى خليج نعمة، شرم الشيخ" : "e.g., Naama Bay, near Naama Bay Promenade, Sharm El Sheikh"}
                      className={`w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 ${lang === "ar" ? "text-right" : "text-left"}`}
                      id="form-hotel-address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.hotelDescLabel}</label>
                  <textarea
                    value={hotelDesc}
                    onChange={(e) => setHotelDesc(e.target.value)}
                    placeholder={t.hotelDescPlaceholder}
                    rows={3}
                    className={`w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-600 ${lang === "ar" ? "text-right" : "text-left"}`}
                    id="form-hotel-desc"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.hotelMapLabel}</label>
                  <input
                    type="url"
                    value={hotelLocMapUrl}
                    onChange={(e) => setHotelLocMapUrl(e.target.value)}
                    placeholder="https://maps.google.com/maps?q=..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-600 text-left"
                    dir="ltr"
                    id="form-hotel-map-url"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">{t.hotelMapHint}</p>
                </div>
              </div>

              {/* Dynamic Images and Features Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Features list editor */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.featuresTitle}</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder={t.featurePlaceholder}
                      className={`w-full bg-white border border-slate-200 rounded-xl p-2 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}
                      id="form-hotel-feat-input"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
                    >
                      {t.addFeature}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-100">
                    {hotelFeatures.map((feat, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-sky-50 text-sky-900 px-2 py-1 rounded-lg text-[10px] font-bold border border-sky-100">
                        <span>{feat}</span>
                        <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Images strip editor - Exactly 5 with Link + File upload */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <label className="block text-xs font-extrabold text-slate-700">{t.hotelImagesTitle}</label>
                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                    {hotelImages.map((img, idx) => (
                      <div key={idx} className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold text-slate-500">
                          {t.imageUrlLabel.replace("{index}", String(idx + 1))}
                        </span>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => handleImageChange(idx, e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-grow bg-white border border-slate-200 rounded-xl p-1.5 text-[10px] font-mono text-left"
                            dir="ltr"
                          />
                          <label className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100 rounded-xl px-2.5 py-1.5 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1 shrink-0 transition-colors">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>{t.uploadFileBtn}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(idx, e)}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>



              {/* Hotel Room Types Builder */}
              <div className="bg-sky-50/20 p-4 rounded-2xl border border-sky-100/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-sky-600" />
                    <span>{t.hotelRoomTypesSection}</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {hotelRoomTypes.length} {lang === "ar" ? "أنواع غرف مضافة" : "room types configured"}
                  </span>
                </div>

                {/* Form to add a new custom room type */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end bg-white p-3 rounded-xl border border-sky-100">
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.roomTypeNameLabel}</label>
                    <input
                      type="text"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      placeholder={t.roomTypeNamePlaceholder}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.roomOccupancyLabel}</label>
                    <input
                      type="text"
                      value={newRoomOcc}
                      onChange={(e) => setNewRoomOcc(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: 4 أشخاص بالغين" : "e.g., 4 Adults"}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newRoomName.trim()) return;
                      const newRt: RoomType = {
                        id: "rt-" + Date.now() + Math.random().toString(36).substr(2, 4),
                        name: newRoomName.trim(),
                        pricePerNight: 0,
                        maxOccupancy: newRoomOcc.trim() || (lang === "ar" ? "شخصين" : "2 Adults")
                      };
                      setHotelRoomTypes([...hotelRoomTypes, newRt]);
                      setPeriodRoomPrices(prev => ({ ...prev, [newRt.id]: { price: 150, isAvailable: true } }));
                      setNewRoomName("");
                      setNewRoomOcc("");
                    }}
                    className="sm:col-span-2 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer h-9 transition-colors shrink-0"
                  >
                    {t.addRoomTypeBtn}
                  </button>
                </div>

                {/* Display list of room types */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {hotelRoomTypes.map((rt) => (
                    <div key={rt.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-sky-100 shadow-2xs">
                      <BedDouble className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{rt.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">{rt.maxOccupancy}</span>
                      {hotelRoomTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setHotelRoomTypes(hotelRoomTypes.filter(r => r.id !== rt.id));
                          }}
                          className="text-red-400 hover:text-red-600 cursor-pointer text-xs"
                          title={lang === "ar" ? "حذف نوع الغرفة" : "Remove room type"}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Availability Periods */}
              <div className="bg-indigo-50/20 p-4 rounded-2xl border border-indigo-100/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>{t.availabilityPeriodsSection}</span>
                  </h4>
                  {editingPeriodId && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {lang === "ar" ? "تعديل فترة قائمة" : "Editing Period"}
                    </span>
                  )}
                </div>

                <div className="space-y-3 bg-white/60 p-3.5 rounded-xl border border-indigo-100/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.startDateLabel}</label>
                      <input
                        type="date"
                        value={periodStart}
                        onChange={(e) => setPeriodStart(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.endDateLabel}</label>
                      <input
                        type="date"
                        value={periodEnd}
                        onChange={(e) => setPeriodEnd(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-center"
                      />
                    </div>
                  </div>

                  {/* Dynamic Room Prices for ALL Room Types */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-indigo-950 mb-2">
                      {lang === "ar" ? "أسعار الغرف المتاحة في هذه الفترة (لكل أنواع الغرف بالفندق):" : "Room prices for this period (for all configured room types):"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {hotelRoomTypes.map((rt) => {
                        const priceInfo = periodRoomPrices[rt.id] || { price: 100, isAvailable: true };
                        return (
                          <div key={rt.id} className="bg-white p-2.5 rounded-xl border border-indigo-100 flex flex-col justify-between space-y-1.5 shadow-2xs">
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={priceInfo.isAvailable}
                                onChange={(e) => {
                                  setPeriodRoomPrices({
                                    ...periodRoomPrices,
                                    [rt.id]: { ...priceInfo, isAvailable: e.target.checked }
                                  });
                                }}
                                className="w-3.5 h-3.5 text-indigo-600 accent-indigo-600 rounded cursor-pointer"
                              />
                              <span className="text-[11px] font-bold text-slate-800 line-clamp-1">{rt.name}</span>
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                disabled={!priceInfo.isAvailable}
                                value={priceInfo.price}
                                onChange={(e) => {
                                  setPeriodRoomPrices({
                                    ...periodRoomPrices,
                                    [rt.id]: { ...priceInfo, price: Number(e.target.value) || 0 }
                                  });
                                }}
                                className="w-full bg-slate-50 disabled:opacity-40 border border-slate-200 rounded-lg p-1 text-xs text-center font-bold font-mono text-emerald-700"
                              />
                              <span className="text-[9px] text-slate-400 shrink-0">{t.currencySymbol}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!periodStart || !periodEnd) return;
                        
                        // Extract single/double/triple for fallback compatibility
                        const singleP = periodRoomPrices["single"]?.price ?? (hotelRoomTypes.find(r => r.id === "single") ? periodRoomPrices["single"]?.price : 0) ?? 0;
                        const doubleP = periodRoomPrices["double"]?.price ?? (hotelRoomTypes.find(r => r.id === "double") ? periodRoomPrices["double"]?.price : 0) ?? 0;
                        const tripleP = periodRoomPrices["triple"]?.price ?? (hotelRoomTypes.find(r => r.id === "triple") ? periodRoomPrices["triple"]?.price : 0) ?? 0;

                        if (editingPeriodId) {
                          setAvailabilityPeriods(availabilityPeriods.map(p => {
                            if (p.id === editingPeriodId) {
                              return {
                                ...p,
                                startDate: periodStart,
                                endDate: periodEnd,
                                singlePrice: singleP,
                                doublePrice: doubleP,
                                triplePrice: tripleP,
                                singleAvailable: periodRoomPrices["single"]?.isAvailable ?? true,
                                doubleAvailable: periodRoomPrices["double"]?.isAvailable ?? true,
                                tripleAvailable: periodRoomPrices["triple"]?.isAvailable ?? true,
                                roomPrices: { ...periodRoomPrices }
                              };
                            }
                            return p;
                          }));
                          setEditingPeriodId(null);
                        } else {
                          const newPeriod = {
                            id: "period-" + Date.now() + Math.random().toString(36).substr(2, 4),
                            startDate: periodStart,
                            endDate: periodEnd,
                            singlePrice: singleP,
                            doublePrice: doubleP,
                            triplePrice: tripleP,
                            singleAvailable: periodRoomPrices["single"]?.isAvailable ?? true,
                            doubleAvailable: periodRoomPrices["double"]?.isAvailable ?? true,
                            tripleAvailable: periodRoomPrices["triple"]?.isAvailable ?? true,
                            roomPrices: { ...periodRoomPrices }
                          };
                          setAvailabilityPeriods([...availabilityPeriods, newPeriod]);
                        }
                        setPeriodStart("");
                        setPeriodEnd("");
                      }}
                      className={`flex-1 py-2 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors ${editingPeriodId ? "bg-amber-600 hover:bg-amber-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                    >
                      {editingPeriodId ? t.updatePeriodBtn : t.addPeriodBtn}
                    </button>

                    {editingPeriodId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPeriodId(null);
                          setPeriodStart("");
                          setPeriodEnd("");
                        }}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        {t.cancelEditPeriodBtn}
                      </button>
                    )}
                  </div>
                </div>

                {/* Display Added Periods with dynamic columns for ALL room types */}
                {availabilityPeriods.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{t.addedPeriodsHeader}</h5>
                    <div className="overflow-x-auto border border-indigo-100 rounded-xl bg-white text-xs">
                      <table className="w-full text-right divide-y divide-slate-100">
                        <thead className="bg-indigo-50/50 text-indigo-950 font-bold">
                          <tr className={lang === "ar" ? "text-right" : "text-left"}>
                            <th className="px-3 py-2 whitespace-nowrap">{t.startDateLabel}</th>
                            <th className="px-3 py-2 whitespace-nowrap">{t.endDateLabel}</th>
                            {hotelRoomTypes.map((rt) => (
                              <th key={rt.id} className="px-3 py-2 text-center whitespace-nowrap">
                                {rt.name}
                              </th>
                            ))}
                            <th className="px-3 py-2 text-center whitespace-nowrap">{lang === "ar" ? "إجراءات" : "Actions"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {availabilityPeriods.map((per: any) => (
                            <tr key={per.id} className={`hover:bg-slate-50 ${editingPeriodId === per.id ? "bg-amber-50/60" : ""}`}>
                              <td className="px-3 py-2 font-mono whitespace-nowrap">{per.startDate}</td>
                              <td className="px-3 py-2 font-mono whitespace-nowrap">{per.endDate}</td>
                              
                              {/* Price input for each room type */}
                              {hotelRoomTypes.map((rt) => {
                                const rp = per.roomPrices?.[rt.id] || {
                                  price: rt.id === "single" ? per.singlePrice : rt.id === "double" ? per.doublePrice : rt.id === "triple" ? per.triplePrice : 0,
                                  isAvailable: rt.id === "single" ? per.singleAvailable : rt.id === "double" ? per.doubleAvailable : rt.id === "triple" ? per.tripleAvailable : true
                                };

                                return (
                                  <td key={rt.id} className="px-3 py-2 text-center font-mono whitespace-nowrap">
                                    {rp.isAvailable !== false ? (
                                      <input
                                        type="number"
                                        value={rp.price ?? 0}
                                        onChange={(e) => {
                                          const val = Number(e.target.value) || 0;
                                          const updatedPrices = {
                                            ...(per.roomPrices || {}),
                                            [rt.id]: { price: val, isAvailable: true }
                                          };
                                          setAvailabilityPeriods(availabilityPeriods.map(p => p.id === per.id ? {
                                            ...p,
                                            roomPrices: updatedPrices,
                                            singlePrice: rt.id === "single" ? val : p.singlePrice,
                                            doublePrice: rt.id === "double" ? val : p.doublePrice,
                                            triplePrice: rt.id === "triple" ? val : p.triplePrice
                                          } : p));
                                        }}
                                        className="w-16 text-center font-bold text-emerald-600 bg-slate-50 border border-slate-200 rounded p-1 text-xs"
                                      />
                                    ) : (
                                      <span className="text-slate-400 line-through text-[10px]">N/A</span>
                                    )}
                                  </td>
                                );
                              })}

                              <td className="px-3 py-2 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingPeriodId(per.id);
                                      setPeriodStart(per.startDate);
                                      setPeriodEnd(per.endDate);
                                      
                                      // Build periodRoomPrices for editing form
                                      const pricesMap: Record<string, { price: number; isAvailable: boolean }> = {};
                                      hotelRoomTypes.forEach(rt => {
                                        if (per.roomPrices && per.roomPrices[rt.id]) {
                                          pricesMap[rt.id] = per.roomPrices[rt.id];
                                        } else {
                                          const pr = rt.id === "single" ? per.singlePrice : rt.id === "double" ? per.doublePrice : rt.id === "triple" ? per.triplePrice : 100;
                                          const av = rt.id === "single" ? per.singleAvailable : rt.id === "double" ? per.doubleAvailable : rt.id === "triple" ? per.tripleAvailable : true;
                                          pricesMap[rt.id] = { price: pr || 0, isAvailable: av !== false };
                                        }
                                      });
                                      setPeriodRoomPrices(pricesMap);
                                    }}
                                    className="text-amber-600 hover:text-amber-800 cursor-pointer p-1 rounded hover:bg-amber-50"
                                    title={lang === "ar" ? "تعديل الفترة" : "Edit Period"}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAvailabilityPeriods(availabilityPeriods.filter(p => p.id !== per.id))}
                                    className="text-red-500 hover:text-red-700 cursor-pointer p-1 rounded hover:bg-red-50"
                                    title={lang === "ar" ? "حذف الفترة" : "Delete Period"}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Accommodation Types Builder */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-sky-600" />
                  <span>{t.accTitle}</span>
                </h4>
                
                {/* Inputs to add accommodation */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.accNameLabel}</label>
                    <input
                      type="text"
                      value={accName}
                      onChange={(e) => setAccName(e.target.value)}
                      placeholder={t.accNamePlaceholder}
                      className={`w-full bg-white border border-slate-200 rounded-xl p-2 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.accPriceLabel}</label>
                    <input
                      type="number"
                      value={accPrice}
                      onChange={(e) => setAccPrice(Number(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-center"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addAccType}
                    className="sm:col-span-2 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold h-9 cursor-pointer"
                  >
                    {t.addAcc}
                  </button>
                </div>

                {/* Added Acc table */}
                <div className="overflow-hidden border border-slate-200/40 rounded-xl bg-white text-xs">
                  <table className="w-full text-right divide-y divide-slate-100">
                    <tbody className="divide-y divide-slate-50">
                      {hotelAccTypes.map((acc) => (
                        <tr key={acc.id} className="hover:bg-slate-50">
                          <td className={`px-3 py-2 font-medium text-slate-800 ${lang === "ar" ? "text-right" : "text-left"}`}>{acc.name}</td>
                          <td className="px-3 py-2 text-center font-bold text-sky-600 font-mono">
                            {acc.priceAddition >= 0 ? `+${acc.priceAddition} ${t.currencySymbol}` : `-${Math.abs(acc.priceAddition)} ${t.currencySymbol}`}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button type="button" onClick={() => removeAccType(acc.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Child Policy & General Transfers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                {/* Child Policy Area */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-600 flex items-center gap-1 mb-2">
                    <Baby className="w-4 h-4 text-sky-600" />
                    <span>{t.hotelChildLabel}</span>
                  </h4>
                  <textarea
                    value={hotelChildPolicy}
                    onChange={(e) => setHotelChildPolicy(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: الأطفال حتى سن 5.99 سنة مجاناً في غرف والديهم..." : "e.g., Children up to 5.99 years are free of charge in their parents room..."}
                    rows={4}
                    className={`w-full bg-white border border-slate-200 rounded-xl p-2 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}
                    id="form-hotel-child-policy"
                  />
                </div>

                {/* Transfer policy details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-600 flex items-center gap-1">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>{t.transfersDetailLabel}</span>
                  </h4>
                  
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">{t.transfersDescLabel}</label>
                    <input
                      type="text"
                      value={transPolicy}
                      onChange={(e) => setTransPolicy(e.target.value)}
                      placeholder={t.transPolicyPlaceholder}
                      className={`w-full bg-white border border-slate-200 rounded-xl p-2 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}
                      id="form-hotel-trans-policy"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={transAvailable}
                        onChange={(e) => setTransAvailable(e.target.checked)}
                        className="w-4 h-4 text-sky-600 accent-sky-600 rounded focus:ring-0 cursor-pointer"
                        id="form-hotel-trans-avail"
                      />
                      <span className="text-xs font-semibold text-slate-700">{t.serviceAvailable}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Transfer Locations & Vehicle Options (مسارات النقل وأسعار السيارات للكرسي) */}
              <div className="bg-sky-50/30 p-4 rounded-2xl border border-sky-100/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-sky-600" />
                    <span>{t.transferLocationsTitle}</span>
                  </h4>
                </div>

                {/* Input to add a new transfer location/route */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    placeholder={t.locationNamePlaceholder}
                    className={`flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newLocName.trim()) return;
                      const newLoc: TransferLocation = {
                        id: "loc-" + Date.now(),
                        locationName: newLocName.trim(),
                        vehicles: []
                      };
                      setTransLocations([...transLocations, newLoc]);
                      setNewLocName("");
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addLocationBtn}</span>
                  </button>
                </div>

                {/* Display Transfer Locations List */}
                {transLocations.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">{t.noLocationsAdded}</p>
                ) : (
                  <div className="space-y-3">
                    {transLocations.map((loc) => (
                      <div key={loc.id} className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-sky-600" />
                            <span className="font-bold text-xs text-slate-800">{loc.locationName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setTransLocations(transLocations.filter(l => l.id !== loc.id))}
                            className="text-red-500 hover:text-red-700 cursor-pointer p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Form to add a vehicle to this location */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                          <div className="sm:col-span-6">
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.vehicleTypeLabel}</label>
                            <input
                              type="text"
                              value={newVehicleTypes[loc.id] || ""}
                              onChange={(e) => setNewVehicleTypes({ ...newVehicleTypes, [loc.id]: e.target.value })}
                              placeholder={t.vehicleTypePlaceholder}
                              className={`w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.pricePerSeatLabel}</label>
                            <input
                              type="number"
                              value={newVehiclePrices[loc.id] ?? 0}
                              onChange={(e) => setNewVehiclePrices({ ...newVehiclePrices, [loc.id]: Number(e.target.value) || 0 })}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold font-mono"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const vType = (newVehicleTypes[loc.id] || "").trim();
                              const vPrice = newVehiclePrices[loc.id] ?? 0;
                              if (!vType) return;
                              const newVeh: VehicleOption = {
                                id: "v-" + Date.now(),
                                vehicleType: vType,
                                pricePerSeat: vPrice
                              };
                              setTransLocations(transLocations.map(l => {
                                if (l.id === loc.id) {
                                  return { ...l, vehicles: [...l.vehicles, newVeh] };
                                }
                                return l;
                              }));
                              setNewVehicleTypes({ ...newVehicleTypes, [loc.id]: "" });
                              setNewVehiclePrices({ ...newVehiclePrices, [loc.id]: 0 });
                            }}
                            className="sm:col-span-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            {t.addVehicleBtn}
                          </button>
                        </div>

                        {/* List of vehicles in this location */}
                        {loc.vehicles.length > 0 && (
                          <div className="overflow-hidden rounded-lg border border-slate-100 bg-white">
                            <table className="w-full text-xs">
                              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                                <tr className={lang === "ar" ? "text-right" : "text-left"}>
                                  <th className="px-3 py-1.5">{t.vehicleTypeLabel}</th>
                                  <th className="px-3 py-1.5 text-center">{t.pricePerSeatLabel}</th>
                                  <th className="px-3 py-1.5 text-center">{t.tableDeleteHeader}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {loc.vehicles.map((v) => (
                                  <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 font-medium text-slate-800 flex items-center gap-1.5">
                                      <Car className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                      <span>{v.vehicleType}</span>
                                    </td>
                                    <td className="px-3 py-2 text-center font-mono font-bold text-emerald-600">
                                      {v.pricePerSeat} {t.currencySymbol}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTransLocations(transLocations.map(l => {
                                            if (l.id === loc.id) {
                                              return { ...l, vehicles: l.vehicles.filter(veh => veh.id !== v.id) };
                                            }
                                            return l;
                                          }));
                                        }}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Save Button */}
              <button
                type="submit"
                className={`w-full py-4 px-4 text-white font-bold rounded-xl text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  editingHotelId 
                    ? "bg-indigo-600 hover:bg-indigo-700" 
                    : "bg-sky-600 hover:bg-sky-700"
                }`}
                id="form-hotel-submit-btn"
              >
                {editingHotelId ? (
                  <>
                    <Check className="w-6 h-6 text-indigo-200" />
                    <span>{lang === "ar" ? "حفظ التعديلات" : "Save Changes"}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6 text-sky-200" />
                    <span>{t.saveHotelBtn}</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* List Side (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
                <span>{t.currentHotelsList}</span>
                <span className="text-xs bg-sky-50 text-sky-800 px-3 py-1 rounded-full font-bold">
                  {t.allHotelCount.replace("{count}", String(hotels.length))}
                </span>
              </h3>

              {hotels.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {hotels.map((hotel) => {
                    const hotelDest = destinations.find((d) => d.id === hotel.destinationId);
                    return (
                      <div
                        key={hotel.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={hotel.images[0]}
                            alt={translateText(hotel.name, lang)}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                              {translateText(hotel.name, lang)}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {hotelDest ? translateText(hotelDest.name, lang) : t.unknownDest}
                              </span>
                              <div className="flex">
                                {Array.from({ length: hotel.stars }).map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleEditHotelClick(hotel)}
                            className="p-2.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all cursor-pointer"
                            title={lang === "ar" ? "تعديل الفندق" : "Edit Hotel"}
                            id={`edit-hotel-btn-${hotel.id}`}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(t.deleteHotelConfirm.replace("{name}", translateText(hotel.name, lang)))) {
                                onDeleteHotel(hotel.id);
                                setSuccessMsg(t.deleteHotelSuccess.replace("{name}", translateText(hotel.name, lang)));
                              }
                            }}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title={lang === "ar" ? "حذف الفندق" : "Delete Hotel"}
                            id={`delete-hotel-btn-${hotel.id}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-semibold">{t.emptyHotelList}</p>
                </div>
              )}
            </div>

            <div className={`bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-6 text-xs text-slate-700 leading-relaxed ${lang === "ar" ? "text-right" : "text-left"}`}>
              <strong>{t.noticesHeader}</strong> {t.noticesBody}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
