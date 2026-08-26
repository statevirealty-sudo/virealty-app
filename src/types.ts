export type OperationType = 'comprar' | 'planos' | 'renta';

export type PropertyCategory = 'Apartamento' | 'Penthouse' | 'Casa Campestre' | 'Loft' | 'Oficina';

export type ZoneLocation = 
  | 'Circunvalar' 
  | 'Cerritos' 
  | 'Pinares' 
  | 'Dosquebradas' 
  | 'Álamos' 
  | 'La Julita' 
  | 'Alfonso López' 
  | 'Santa Rosa';

export interface Hotspot {
  id: string;
  targetPanoramaId?: string;
  label: string;
  type: 'navigation' | 'info' | 'dimension';
  pitch?: number; // degrees -90 to +90 (Pannellum format)
  yaw?: number;   // degrees -180 to +180 (Pannellum format)
  x?: number;     // 3D Cartesian X coordinate on sphere
  y?: number;     // 3D Cartesian Y coordinate
  z?: number;     // 3D Cartesian Z coordinate
  info?: string;
  dimensionText?: string;
}

export interface PanoramaRoom {
  id: string;
  name: string;
  roomType: 'living' | 'kitchen' | 'master_bedroom' | 'terrace' | 'bathroom' | 'exterior';
  url: string;
  description: string;
  hotspots: Hotspot[];
}

export interface FinancialHighlights {
  adminFee: number; // COP/month
  predialTaxYear: number; // COP/year
  estimatedMonthlyRent: number; // COP/month
  estimatedAirbnbDaily: number; // COP/night
  expectedOccupancyRate: number; // % e.g. 72
  annualAppreciation: number; // % e.g. 9.5
  capRate: number; // % e.g. 8.4
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  slug: string;
  operationType: OperationType;
  category: PropertyCategory;
  price: number; // COP
  discountPrice?: number;
  zone: ZoneLocation;
  city: 'Pereira' | 'Dosquebradas' | 'Santa Rosa';
  address: string;
  area: number; // m²
  bedrooms: number;
  bathrooms: number;
  parking: number;
  stratum: number; // Estrato 4, 5, 6
  has3DVirtualTour: boolean;
  featured: boolean;
  onPlans?: boolean;
  deliveryDate?: string;
  images: string[];
  panoramas: PanoramaRoom[];
  floorPlanUrl?: string;
  description: string;
  features: string[];
  virtualTourLiveAvailable: boolean;
  financialHighlights: FinancialHighlights;
  neighborhoodScores: {
    safety: number;
    access: number;
    commerce: number;
    greenAreas: number;
  };
}

export interface SearchFilters {
  operationType: string;
  zone: string;
  budgetRange: string;
  category: string;
  minBedrooms: number;
  only3D: boolean;
  experienceType?: 'all' | '3d' | 'photos';
  searchTerm: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'roi' | 'area';
}

export interface ValuationSubmission {
  propertyType: PropertyCategory;
  city: string;
  zone: string;
  address: string;
  stratum: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  ageYears: number;
  amenities: string[];
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  estimatedValueCOP: number;
  estimatedPricePerM2: number;
}
