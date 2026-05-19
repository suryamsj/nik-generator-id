export interface NikOptions {
  gender?: 'male' | 'female';
  birthDate?: Date;
  provinceCode?: string;
  regencyCode?: string;
  districtCode?: string;
}

export interface RegionData {
  code: string;
  name: string;
}

export interface ParsedNik {
  provinceCode: string;
  regencyCode: string;
  districtCode: string;
  birthDate: Date | null;
  gender: 'male' | 'female';
  serialNumber: string;
  isValid: boolean;
}
