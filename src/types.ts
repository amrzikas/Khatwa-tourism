export interface RoomType {
  id: string;
  name: string; // e.g. "غرفة قياسية", "جناح جونيور", "غرفة مطلة على البحر"
  pricePerNight: number; // in USD or EGP
  maxOccupancy: string; // e.g. "شخصين بالغين"
}

export interface AccommodationType {
  id: string;
  name: string; // e.g. "إقامة كاملة (FB)", "نصف إقامة (HB)", "شامل جميع المشروبات والوجبات (All Inclusive)"
  priceAddition: number; // Price added per night
}

export interface VehicleOption {
  id: string;
  vehicleType: string; // e.g. "سيارة ملاكي (Sedan)", "هايس سياحي (HiAce)", "حافلة كوستر (Coaster)"
  pricePerSeat: number; // سعر الكرسي / المقعد
}

export interface TransferLocation {
  id: string;
  locationName: string; // e.g. "من مطار القاهرة / المطار إلى الفندق"
  vehicles: VehicleOption[];
}

export interface TransferPolicy {
  policy: string; // e.g. "سياسة ودليل الانتقالات"
  price: number; // Base/legacy price per person
  isAvailable: boolean;
  locations?: TransferLocation[];
}

export interface AvailabilityPeriod {
  id: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  singlePrice: number;
  doublePrice: number;
  triplePrice: number;
  singleAvailable: boolean;
  doubleAvailable: boolean;
  tripleAvailable: boolean;
}

export interface Hotel {
  id: string;
  destinationId: string;
  name: string;
  stars: number; // 1-5
  description: string;
  mainFeatures: string[]; // e.g. ["مسبح", "شاطئ خاص", "واي فاي", "سبا"]
  images: string[]; // URLs of hotel images
  locationName: string;
  locationMapUrl: string; // Embed or link URL
  roomTypes: RoomType[];
  accommodationTypes: AccommodationType[];
  childPolicy: string;
  transfers: TransferPolicy;
  availabilityPeriods: AvailabilityPeriod[];
}

export interface Destination {
  id: string;
  name: string; // e.g. "شرم الشيخ", "الغردقة"
  description: string;
  image: string; // main image url
  country: string;
}
