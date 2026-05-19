import { createRequire } from 'module';
import { RegionData } from '../types/public.js';
import { loadRegencies, loadDistricts } from './loader.js';

const _require = createRequire(import.meta.url);
const provinceList: RegionData[] = _require('../data/provinces.json');

export function getProvinces(): RegionData[] {
  return provinceList;
}

export function getRegencies(provinceCode: string): Promise<RegionData[]> {
  return loadRegencies(provinceCode);
}

export function getDistricts(provinceCode: string, regencyCode: string): Promise<RegionData[]> {
  return loadDistricts(provinceCode, regencyCode);
}
