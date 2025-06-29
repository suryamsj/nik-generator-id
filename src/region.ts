import provinceList from './data/provinces.json';
import { DistrictCache, RegencyCache, RegionData } from './types/nik';

const regencyCache: RegencyCache = {};
const districtCache: DistrictCache = {};

export function getProvinces(): RegionData[] {
  return provinceList;
}

export async function getRegencies(provinceCode: string): Promise<RegionData[]> {
  if (regencyCache[provinceCode]) {
    return regencyCache[provinceCode];
  }

  try {
    const regencyData = await import(`./data/regencies/${provinceCode}.json`);
    regencyCache[provinceCode] = regencyData.default;
    return regencyData.default;
  } catch (error) {
    console.error(`Failed to load regency data for province ${provinceCode}`, error);
    return [];
  }
}

export async function getDistricts(provinceCode: string, regencyCode: string): Promise<RegionData[]> {
  if (districtCache[provinceCode]?.[regencyCode]) {
    return districtCache[provinceCode][regencyCode];
  }

  try {
    const districtData = await import(`./data/districts/${provinceCode}/${regencyCode}.json`);

    if (!districtCache[provinceCode]) {
      districtCache[provinceCode] = {};
    }

    districtCache[provinceCode][regencyCode] = districtData.default;
    return districtData.default;
  } catch (error) {
    console.error(`Failed to load district data for regency ${provinceCode}.${regencyCode}`, error);
    return [];
  }
}
