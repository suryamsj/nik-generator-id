export interface NikOptions {
  gender?: 'male' | 'female';
  birthDate?: Date;
  provinceCode?: string;
  regencyCode?: string;
  districtCode?: string;
}

interface District {
  ID: string;
  [key: string]: any;
}

interface Regency {
  ID: string;
  Kecamatan: Record<string, District>;
  [key: string]: any;
}

export interface Province {
  ID: string;
  'Kabupaten/Kota': Record<string, Regency>;
  [key: string]: any;
}

export interface RegionData {
  code: string;
  name: string;
}

export interface RegencyCache {
  [provinceCode: string]: RegionData[];
}

export interface DistrictCache {
  [provinceCode: string]: {
    [regencyCode: string]: RegionData[];
  };
}
