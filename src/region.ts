import provinceList from './data/provinces.json';
import { DistrictCache, RegencyCache, RegionData } from './types/nik';
import { NIKError } from './nik-error';

const regencyCache: RegencyCache = {};
const districtCache: DistrictCache = {};

/**
 * Returns a list of all provinces in Indonesia
 * @returns {RegionData[]} - Array of province data objects containing code and name
 */
export function getProvinces(): RegionData[] {
  return provinceList;
}

/**
 * Retrieves regency/city data for a specific province
 * @param {string} provinceCode - The 2-digit province code
 * @returns {Promise<RegionData[]>} - Promise resolving to an array of regency data objects
 */
export async function getRegencies(provinceCode: string): Promise<RegionData[]> {
  if (regencyCache[provinceCode]) {
    return regencyCache[provinceCode];
  }

  try {
    const regencyData = await import(`./data/regencies/${provinceCode}.json`);
    regencyCache[provinceCode] = regencyData.default;
    return regencyData.default;
  } catch (error) {
    throw new NIKError(`Failed to load regency data for province ${provinceCode}`, 'REGENCY_DATA_ERROR');
  }
}

/**
 * Retrieves district data for a specific regency/city within a province
 * @param {string} provinceCode - The 2-digit province code
 * @param {string} regencyCode - The 2-digit regency/city code
 * @returns {Promise<RegionData[]>} - Promise resolving to an array of district data objects
 */
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
    throw new NIKError(`Failed to load district data for regency ${provinceCode}.${regencyCode}`, 'DISTRICT_DATA_ERROR');
  }
}
