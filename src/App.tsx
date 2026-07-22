import React, { useState, useEffect } from "react";
import { Destination, Hotel } from "./types";
import { initialDestinations, initialHotels } from "./data/mockData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import DestinationList from "./components/DestinationList";
import HotelCard from "./components/HotelCard";
import ActivitySection from "./components/ActivitySection";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import { Compass, Sparkles, Phone, Mail, MapPin, Building2, HelpCircle } from "lucide-react";
import { Language, translations, translateText } from "./utils/translations";

// Firebase integrations
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs 
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth, handleFirestoreError, OperationType } from "./firebase";

export default function App() {
  // Language Support (Default is English 'en')
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("khatwa_lang");
    return (saved === "ar" || saved === "en") ? saved : "en";
  });

  // Destinations and Hotels State (Synchronized with Firebase Firestore)
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  // Selected Destination Filter
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Navigation / Views: "client" | "admin"
  const [currentView, setCurrentView] = useState<"client" | "admin">("client");

  // Admin Auth States
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync Language Selection to LocalStorage
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("khatwa_lang", newLang);
  };

  // --- INITIALIZE FIRESTORE REAL-TIME SYNC & AUTH ---
  useEffect(() => {
    // 1. Real-time Destinations Sync
    const unsubDests = onSnapshot(
      collection(db, "destinations"),
      (snapshot) => {
        const dests: Destination[] = [];
        snapshot.forEach((docSnap) => {
          dests.push(docSnap.data() as Destination);
        });
        setDestinations(dests);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "destinations");
      }
    );

    // 2. Real-time Hotels Sync
    const unsubHotels = onSnapshot(
      collection(db, "hotels"),
      (snapshot) => {
        const hots: Hotel[] = [];
        snapshot.forEach((docSnap) => {
          hots.push(docSnap.data() as Hotel);
        });
        setHotels(hots);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "hotels");
      }
    );

    // 3. Real-time Firebase Auth Session Changed
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminEmail(user.email);
        localStorage.setItem("rayahati_active_admin", user.email || "");
      } else {
        setAdminEmail(null);
        localStorage.removeItem("rayahati_active_admin");
      }
    });

    return () => {
      unsubDests();
      unsubHotels();
      unsubAuth();
    };
  }, []);

  // --- AUTO-SEED DATA TO FIRESTORE ONCE AN ADMIN LOGS IN IF DB IS EMPTY ---
  useEffect(() => {
    const checkAndSeed = async () => {
      if (!adminEmail) return;
      try {
        const destSnap = await getDocs(collection(db, "destinations"));
        if (destSnap.empty) {
          console.log("Seeding destinations to Firestore...");
          for (const dest of initialDestinations) {
            await setDoc(doc(db, "destinations", dest.id), dest);
          }
        }
        const hotelSnap = await getDocs(collection(db, "hotels"));
        if (hotelSnap.empty) {
          console.log("Seeding hotels to Firestore...");
          for (const hotel of initialHotels) {
            await setDoc(doc(db, "hotels", hotel.id), hotel);
          }
        }
      } catch (err) {
        console.warn("Autoseeding skipped or unauthorized under current rules:", err);
      }
    };
    checkAndSeed();
  }, [adminEmail]);

  // --- ADMIN ACTIONS WRITING TO FIRESTORE ---
  const handleAddDestination = async (newDest: Destination) => {
    try {
      await setDoc(doc(db, "destinations", newDest.id), newDest);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `destinations/${newDest.id}`);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    try {
      await deleteDoc(doc(db, "destinations", id));
      if (selectedDestinationId === id) {
        setSelectedDestinationId(null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `destinations/${id}`);
    }
  };

  const handleAddHotel = async (newHotel: Hotel) => {
    try {
      await setDoc(doc(db, "hotels", newHotel.id), newHotel);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `hotels/${newHotel.id}`);
    }
  };

  const handleDeleteHotel = async (id: string) => {
    try {
      await deleteDoc(doc(db, "hotels", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `hotels/${id}`);
    }
  };

  // --- LOGIN & LOGOUT HANDLERS ---
  const handleLoginSuccess = (email: string) => {
    setAdminEmail(email);
    localStorage.setItem("rayahati_active_admin", email);
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAdminEmail(null);
      localStorage.removeItem("rayahati_active_admin");
      setCurrentView("client");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const handleViewChange = (view: "client" | "admin") => {
    if (view === "admin") {
      if (!adminEmail) {
        setIsLoginModalOpen(true);
      } else {
        setCurrentView("admin");
      }
    } else {
      setCurrentView("client");
    }
  };

  // --- CLIENT FILTERING LOGIC ---
  const filteredHotels = hotels.filter((hotel) => {
    // 1. Destination filter
    const matchesDest = selectedDestinationId ? hotel.destinationId === selectedDestinationId : true;
    
    // Get destination name for additional search capability
    const dest = destinations.find((d) => d.id === hotel.destinationId);
    const destName = dest ? dest.name : "";
    const englishDestName = dest ? translateText(dest.name, "en") : "";

    // 2. Search query matches name, features, or destination
    const query = searchTerm.toLowerCase().trim();
    if (!query) return matchesDest;

    const matchesSearch =
      hotel.name.toLowerCase().includes(query) ||
      translateText(hotel.name, "en").toLowerCase().includes(query) ||
      hotel.description.toLowerCase().includes(query) ||
      translateText(hotel.description, "en").toLowerCase().includes(query) ||
      hotel.locationName.toLowerCase().includes(query) ||
      translateText(hotel.locationName, "en").toLowerCase().includes(query) ||
      destName.toLowerCase().includes(query) ||
      englishDestName.toLowerCase().includes(query) ||
      hotel.mainFeatures.some((f) => f.toLowerCase().includes(query) || translateText(f, "en").toLowerCase().includes(query));

    return matchesDest && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-800 selection:text-white" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* 1. Header Navigation */}
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        lang={lang}
        onLanguageChange={handleLanguageChange}
      />

      {/* 2. Main Content Routing */}
      {currentView === "client" ? (
        <main className="flex-grow">
          {/* Hero Header Search */}
          <Hero
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            destinationsCount={destinations.length}
            hotelsCount={hotels.length}
            lang={lang}
          />

          {/* Horizontal Destinations Category Bar */}
          <DestinationList
            destinations={destinations}
            selectedDestinationId={selectedDestinationId}
            onSelectDestination={setSelectedDestinationId}
            lang={lang}
          />

          {/* Hotels display section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="hotels-display-section">
            <div className={`mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
              lang === "ar" ? "text-right" : "text-left"
            }`}>
              <div>
                <span className="text-sky-600 text-xs sm:text-sm font-semibold uppercase tracking-wider font-mono">
                  {lang === "ar" ? "الفنادق والمنتجعات المتاحة" : "Available Luxury Resorts"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {selectedDestinationId 
                    ? (lang === "ar" 
                        ? `أرقى الفنادق في ${destinations.find(d => d.id === selectedDestinationId)?.name}` 
                        : `Premium hotels in ${translateText(destinations.find(d => d.id === selectedDestinationId)?.name || "", lang)}`)
                    : (lang === "ar" ? "استعراض كافة الفنادق الشريكة" : "Browse all our partner resorts")
                  }
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  {lang === "ar" ? "أفضل الأسعار المتاحة مع سياسات مرنة وإمكانيات حجز متكاملة." : "Best rates available with flexible policies and smart booking estimates."}
                </p>
              </div>

              {/* Reset filter badge */}
              {(selectedDestinationId || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedDestinationId(null);
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 bg-sky-50 text-sky-800 text-xs font-bold rounded-xl hover:bg-sky-100 transition-all cursor-pointer w-fit"
                >
                  {lang === "ar" ? "إعادة تعيين مرشحات البحث" : "Reset search and filters"}
                </button>
              )}
            </div>

            {/* Grid of Hotel Cards */}
            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHotels.map((hotel) => {
                  const rawDestName = destinations.find((d) => d.id === hotel.destinationId)?.name || "وجهة سياحية";
                  return (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      destinationName={rawDestName}
                      lang={lang}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-slate-200/50 rounded-3xl max-w-lg mx-auto shadow-sm">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {lang === "ar" ? "عذراً، لم نعثر على أي نتائج!" : "Sorry, no results found!"}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm px-6">
                  {lang === "ar" 
                    ? "لا تتوفر فنادق تطابق المعايير أو كلمة البحث المدخلة حالياً في هذه الوجهة. حاول تغيير كلمة البحث أو التصفية بجميع الوجهات." 
                    : "No hotels match your specific filters or search keywords in this destination. Please try search keywords or filter other destinations."}
                </p>
              </div>
            )}
          </section>

          {/* Popular Activities Section ("بحر وجبال وسفاري وغطس") - Moved after Hotels Section */}
          <ActivitySection
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            lang={lang}
          />

          {/* Quick FAQ / Info block for brand value */}
          <section className="bg-white border-t border-slate-100 py-16" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`bg-slate-50 p-6 rounded-2xl border border-slate-100 ${lang === "ar" ? "text-right" : "text-left"}`}>
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-xl w-fit mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">
                    {lang === "ar" ? "أرقى مستويات الجودة والضمان" : "Premier Quality & Comfort"}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {lang === "ar" 
                      ? "نختار الفنادق والمنتجعات الشريكة بعناية بالغة. نضمن لك إقامة مريحة تتطابق مع كافة الصور والخدمات المعروضة على بوابتنا." 
                      : "We carefully vet and partner with premium resorts. We guarantee your stay perfectly matches all photos and amenities presented on our portal."}
                  </p>
                </div>

                <div className={`bg-slate-50 p-6 rounded-2xl border border-slate-100 ${lang === "ar" ? "text-right" : "text-left"}`}>
                  <div className="p-3 bg-sky-100 text-sky-800 rounded-xl w-fit mb-4">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">
                    {lang === "ar" ? "أسعار تنافسية وحاسبة دقيقة" : "Exclusive Rates & Live Estimates"}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {lang === "ar" 
                      ? "نقدم لك أسعاراً شفافة وحاسبة تكلفة تفاعلية متطورة تمكنك من معرفة التكلفة الإجمالية بحسب نوع الغرفة وخيارات الإقامة بكل دقة." 
                      : "Enjoy complete transparent pricing and an interactive calculator to get accurate dynamic totals based on selected room, meals, and transfer options."}
                  </p>
                </div>

                <div className={`bg-slate-50 p-6 rounded-2xl border border-slate-100 ${lang === "ar" ? "text-right" : "text-left"}`}>
                  <div className="p-3 bg-sky-100 text-sky-800 rounded-xl w-fit mb-4">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">
                    {lang === "ar" ? "دعم فني وإرشاد مستمر" : "Dedicated Support & Pickups"}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {lang === "ar" 
                      ? "فريق خدمة عملاء خطوة جاهز للرد على استفساراتكم حول سياسات الأطفال والانتقالات ومساعدتكم في تأكيد الحجز طوال أيام الأسبوع." 
                      : "Our Khatwa support team is ready to answer questions about children policies and customized transfers, helping you finalize booking coordinates 24/7."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="flex-grow">
          {/* Admin Dashboard Control Panel */}
          <AdminDashboard
            destinations={destinations}
            hotels={hotels}
            onAddDestination={handleAddDestination}
            onDeleteDestination={handleDeleteDestination}
            onAddHotel={handleAddHotel}
            onDeleteHotel={handleDeleteHotel}
            lang={lang}
          />
        </main>
      )}

      {/* 3. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Column 1: About */}
            <div className={`space-y-4 ${lang === "ar" ? "text-right" : "text-left"}`}>
              <div className="flex items-center gap-2 text-white">
                <div className="p-2 bg-sky-600 text-white rounded-lg">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold font-sans">
                  {lang === "ar" ? "خطوة للسياحة" : "Khatwa Tourism"}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === "ar" 
                  ? "بوابتك الرقمية المتطورة للتعرف على أفخم المنتجعات والوجهات السياحية العالمية والعربية بأفضل الأسعار وأسهل الإجراءات التفاعلية الممكنة." 
                  : "Your premium digital gateway to discover the finest luxury resorts and travel destinations worldwide, offering exclusive rates and seamless cost estimators."}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <h4 className="text-white font-bold text-sm mb-4">
                {lang === "ar" ? "روابط سريعة" : "Quick Links"}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => { setSelectedDestinationId(null); setCurrentView("client"); }} className="hover:text-sky-400 transition-all cursor-pointer">
                    {lang === "ar" ? "الرئيسية" : "Home"}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleViewChange("admin")} className="hover:text-sky-400 transition-all cursor-pointer">
                    {lang === "ar" ? "لوحة تحكم المسؤولين" : "Admin Dashboard"}
                  </button>
                </li>
                <li>
                  <a href="#hotels-display-section" className="hover:text-sky-400 transition-all">
                    {lang === "ar" ? "تصفح الفنادق الشريكة" : "Browse Partner Resorts"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div className={`space-y-3 ${lang === "ar" ? "text-right" : "text-left"}`}>
              <h4 className="text-white font-bold text-sm mb-4">
                {lang === "ar" ? "تواصل معنا" : "Contact Us"}
              </h4>
              <div className={`flex items-center gap-2 text-xs ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="font-mono">+20 100 123 4567</span>
              </div>
              <div className={`flex items-center gap-2 text-xs ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="font-mono">support@khatwa.com</span>
              </div>
              <div className={`flex items-center gap-2 text-xs ${lang === "en" ? "flex-row" : "flex-row-reverse"}`}>
                <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                <span>
                  {lang === "ar" ? "الممشى السياحي، الغردقة، مصر" : "The Tourist Promenade, Hurghada, Egypt"}
                </span>
              </div>
            </div>

            {/* Column 4: Quote */}
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <h4 className="text-white font-bold text-sm mb-4">
                {lang === "ar" ? "نحن في خدمتك" : "At Your Service"}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {lang === "ar" 
                  ? "تصفح الفنادق وخطط لعطلتك اليوم. لوحة الإدارة تتيح إضافة المزيد من المزايا دورياً لراحتكم." 
                  : "Explore hand-picked hotels and plan your luxury vacation today. Our real-time portal makes travel booking estimations stress-free."}
              </p>
              <div className="text-[10px] bg-slate-800 text-slate-300 p-2.5 rounded-xl border border-slate-700/50">
                {lang === "ar" 
                  ? "مواعيد العمل: يومياً من ٩ صباحاً وحتى ٩ مساءً." 
                  : "Working hours: Daily from 9:00 AM to 9:00 PM."}
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row sm:justify-between gap-4">
            <p>
              {lang === "ar" 
                ? "© 2026 شركة خطوة للسياحة والأسفار. جميع الحقوق محفوظة." 
                : "© 2026 Khatwa Tourism & Travel. All rights reserved."}
            </p>
            <p className="font-mono text-[10px]">PREMIUM EXPERIENCE CREATED FOR SUCCESS</p>
          </div>
        </div>
      </footer>

      {/* 4. Login Modal */}
      {isLoginModalOpen && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginModalOpen(false)}
          lang={lang}
        />
      )}

    </div>
  );
}
