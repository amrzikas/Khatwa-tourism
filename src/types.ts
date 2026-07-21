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

export interface TransferPolicy {
  policy: string; // e.g. "انتقالات ذهاب وعودة من وإلى المطار"
  price: number; // Price per person
  isAvailable: boolean;
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
