import { RegionData } from '../types/public.js';
import { NIKError } from '../errors/nik-error.js';
import { regencyCache, districtCache } from './cache.js';

export async function loadRegencies(provinceCode: string): Promise<RegionData[]> {
  if (regencyCache[provinceCode]) {
    return regencyCache[provinceCode];
  }

  try {
    const data = await import(`../data/regencies/${provinceCode}.json`);
    regencyCache[provinceCode] = data.default;
    return data.default;
  } catch {
    throw new NIKError(`Failed to load regency data for province ${provinceCode}`, 'REGENCY_DATA_ERROR');
  }
}

export async function loadDistricts(provinceCode: string, regencyCode: string): Promise<RegionData[]> {
  if (districtCache[provinceCode]?.[regencyCode]) {
    return districtCache[provinceCode][regencyCode];
  }

  try {
    const data = await import(`../data/districts/${provinceCode}/${regencyCode}.json`);

    if (!districtCache[provinceCode]) {
      districtCache[provinceCode] = {};
    }

    districtCache[provinceCode][regencyCode] = data.default;
    return data.default;
  } catch {
    throw new NIKError(`Failed to load district data for regency ${provinceCode}.${regencyCode}`, 'DISTRICT_DATA_ERROR');
  }
}
