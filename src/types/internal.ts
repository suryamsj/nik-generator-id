import { RegionData } from './public.js';

export interface RegencyCache {
  [provinceCode: string]: RegionData[];
}

export interface DistrictCache {
  [provinceCode: string]: {
    [regencyCode: string]: RegionData[];
  };
}
