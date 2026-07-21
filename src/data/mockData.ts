import { Destination, Hotel } from "../types";

export const initialDestinations: Destination[] = [
  {
    id: "dest-1",
    name: "شرم الشيخ",
    country: "مصر",
    description: "مدينة السلام الساحرة، حيث تلتقي المياه الفيروزية الصافية مع الشعاب المرجانية الخلابة وصحراء سيناء المهيبة.",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "dest-2",
    name: "الغردقة",
    country: "مصر",
    description: "عاصمة السحر والجمال على شاطئ البحر الأحمر، الوجهة المثالية لعشاق الرياضات المائية والاسترخاء الفاخر.",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "dest-3",
    name: "أسوان",
    country: "مصر",
    description: "أرض النوبة العريقة والهدوء النفسي، حيث ينساب النيل الخالد بين الصخور الجرانيتية والمعابد الفرعونية الشامخة.",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "dest-4",
    name: "دبي",
    country: "الإمارات العربية المتحدة",
    description: "مدينة المستقبل وعاصمة التسوق والأرقام القياسية، تجمع بين ناطحات السحاب العملاقة والتراث العربي الأصيل.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
  }
];

export const initialHotels: Hotel[] = [
  {
    id: "hotel-1",
    destinationId: "dest-1",
    name: "منتجع ريكسوس بريميوم سيجيت شرم الشيخ",
    stars: 5,
    description: "منتجع فاخر متكامل الخدمات يقع على شاطئ البحر مباشرة، ويتميز بشاطئ خاص مذهل، وحديقة مائية عملاقة، وخدمة الغرف المتميزة.",
    mainFeatures: ["شاطئ خاص ممتد", "ألعاب مائية (Aqua Park)", "10 مطاعم عالمية", "نادي صحي وسبا فاخر", "واي فاي مجاني فائق السرعة", "مسابح خارجية متعددة دافئة"],
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
    ],
    locationName: "خليج نبق، شرم الشيخ، مصر",
    locationMapUrl: "https://maps.google.com/maps?q=Rixos%20Premium%20Seagate%20Sharm%20El%20Sheikh&t=&z=13&ie=UTF8&iwloc=&output=embed",
    roomTypes: [
      { id: "single", name: "فردي", pricePerNight: 150, maxOccupancy: "شخص واحد" },
      { id: "double", name: "ثنائية", pricePerNight: 220, maxOccupancy: "شخصين بالغين" },
      { id: "triple", name: "ثلاثية", pricePerNight: 310, maxOccupancy: "3 أشخاص بالغين" }
    ],
    accommodationTypes: [
      { id: "a1", name: "إقامة شاملة كلياً فائق التميز (Ultra All Inclusive)", priceAddition: 0 },
      { id: "a2", name: "نصف إقامة (إفطار وعشاء)", priceAddition: -30 }
    ],
    childPolicy: "الطفل الأول أقل من 11.99 سنة مجاناً في نفس الغرفة. الطفل الثاني أقل من 5.99 سنة مجاناً، ومن 6 سنوات إلى 11.99 سنة يحصل على خصم 50% من سعر الفرد الكبير.",
    transfers: {
      policy: "انتقالات مجانية متميزة بسيارة خاصة من وإلى مطار شرم الشيخ الدولي عند حجز حد أدنى 4 ليالي.",
      price: 25,
      isAvailable: true
    },
    availabilityPeriods: []
  },
  {
    id: "hotel-2",
    destinationId: "dest-1",
    name: "فندق وسبا ستجِنبرجر ألكازار",
    stars: 5,
    description: "فندق عصري فاخر مصمم على طراز فريد يجمع بين الأناقة والرفاهية، مثالي للأزواج والعائلات الباحثين عن الهدوء المطلق والخدمات العالمية.",
    mainFeatures: ["تصميم معماري خلاب", "3 مسابح خارجية ضخمة", "شاطئ رملي خاص", "مطاعم إيطالية وآسيوية متخصصة", "أنشطة رياضية وترفيهية يومية"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
    ],
    locationName: "خليج نبق، شرم الشيخ، مصر",
    locationMapUrl: "https://maps.google.com/maps?q=Steigenberger%20Alcazar%20Sharm%20El%20Sheikh&t=&z=13&ie=UTF8&iwloc=&output=embed",
    roomTypes: [
      { id: "single", name: "فردي", pricePerNight: 130, maxOccupancy: "شخص واحد" },
      { id: "double", name: "ثنائية", pricePerNight: 180, maxOccupancy: "شخصين بالغين" },
      { id: "triple", name: "ثلاثية", pricePerNight: 250, maxOccupancy: "3 أشخاص بالغين" }
    ],
    accommodationTypes: [
      { id: "a3", name: "إقامة شاملة بالكامل (All Inclusive)", priceAddition: 0 },
      { id: "a4", name: "إقامة كاملة (إفطار + غداء + عشاء)", priceAddition: -15 }
    ],
    childPolicy: "الأطفال حتى سن 5.99 سنة إقامة كاملة مجاناً مع الوالدين. الأطفال من سن 6 إلى 11.99 سنة يتم احتساب 40% من قيمة الغرفة الفردية.",
    transfers: {
      policy: "انتقالات سياحية مشتركة مكيفة من وإلى المطار بأسعار رمزية ومريحة.",
      price: 15,
      isAvailable: true
    },
    availabilityPeriods: []
  },
  {
    id: "hotel-3",
    destinationId: "dest-2",
    name: "منتجع دبل تري من هيلتون الغردقة - الممشى السياحي",
    stars: 4,
    description: "يقع هذا المنتجع العائلي المبهج في قلب الممشى السياحي الشهير بالغردقة، ويتميز بشاطئ رملي آمن ممهد للأطفال وأنشطة ممتعة ومستمرة طوال اليوم.",
    mainFeatures: ["موقع استراتيجي بالممشى السياحي", "شاطئ رملي ممهد آمن", "نادي أطفال متكامل ومراقب", "صالة ألعاب رياضية وملاعب تنس", "مطعم بوفيه مفتوح ضخم"],
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
    ],
    locationName: "طريق القرى، الممشى السياحي، الغردقة، مصر",
    locationMapUrl: "https://maps.google.com/maps?q=DoubleTree%20by%20Hilton%20Hurghada%20&t=&z=13&ie=UTF8&iwloc=&output=embed",
    roomTypes: [
      { id: "single", name: "فردي", pricePerNight: 90, maxOccupancy: "شخص واحد" },
      { id: "double", name: "ثنائية", pricePerNight: 130, maxOccupancy: "شخصين بالغين" },
      { id: "triple", name: "ثلاثية", pricePerNight: 180, maxOccupancy: "3 أشخاص بالغين" }
    ],
    accommodationTypes: [
      { id: "a5", name: "إقامة شاملة (All Inclusive)", priceAddition: 0 },
      { id: "a6", name: "إفطار وعشاء فقط", priceAddition: -20 }
    ],
    childPolicy: "الطفل الأول والطفل الثاني أقل من 5.99 سنة مجاناً بالكامل. من سن 6 إلى 11.99 سنة يحصل على خصم 50% من سعر الفرد الكبير بحد أقصى طفلين في الغرفة.",
    transfers: {
      policy: "خدمة حافلة انتقالات جماعية مريحة من المطار إلى الفندق وبالعكس عند الطلب.",
      price: 12,
      isAvailable: true
    },
    availabilityPeriods: []
  },
  {
    id: "hotel-4",
    destinationId: "dest-3",
    name: "فندق سوفيتل ليجند كتراكت أسوان",
    stars: 5,
    description: "قصر تاريخي ساحر يطل على النيل الخالد ومقابر النبلاء، حيث تجتمع الفخامة والخدمة الفرنسية الراقية مع عراقة التراث النوبي والمصري القديم.",
    mainFeatures: ["إطلالة بانورامية ساحرة على النيل", "مبنى تاريخي وقصر ملكي عتيق", "مطعم الشرفة التاريخي الشهير", "مسبح خارجي دافئ على النيل مباشرة", "خدمة المساعد الشخصي (Butler)"],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
    ],
    locationName: "شارع أبطال التحرير، أسوان، مصر",
    locationMapUrl: "https://maps.google.com/maps?q=Sofitel%20Legend%20Old%20Cataract%20Aswan&t=&z=13&ie=UTF8&iwloc=&output=embed",
    roomTypes: [
      { id: "single", name: "فردي", pricePerNight: 280, maxOccupancy: "شخص واحد" },
      { id: "double", name: "ثنائية", pricePerNight: 390, maxOccupancy: "شخصين بالغين" },
      { id: "triple", name: "ثلاثية", pricePerNight: 550, maxOccupancy: "3 أشخاص بالغين" }
    ],
    accommodationTypes: [
      { id: "a7", name: "إقامة شاملة الإفطار الفاخر فقط", priceAddition: 0 },
      { id: "a8", name: "إقامة شاملة إفطار وعشاء فاخر في مطعم 1902 الأسطوري", priceAddition: 90 }
    ],
    childPolicy: "الأطفال أقل من 5 سنوات مجاناً في غرف الآباء. الأطفال من سن 6 إلى 12 سنة يتم توفير سرير إضافي لهم بخصم خاص وخصم 50% على وجبات الطعام.",
    transfers: {
      policy: "انتقالات خاصة بسيارة ليموزين فخمة من مطار أسوان أو محطة القطار مجاناً عند حجز الأجنحة.",
      price: 30,
      isAvailable: true
    },
    availabilityPeriods: []
  }
];
