import rawData from './data/indonesia.json';
import { Province, RegionData } from './types/nik';

const provincesRaw = rawData as Record<string, Province>;

export function getProvinces(): RegionData[] {
  return Object.entries(provincesRaw).map(([name, val]) => ({
    code: val.ID,
    name,
  }));
}

export function getRegencies(provinceCode: string): RegionData[] {
  const province = Object.entries(provincesRaw).find(([, val]) => val.ID === provinceCode);
  if (!province) return [];

  const regencies = province[1]['Kabupaten/Kota'];
  return Object.entries(regencies).map(([name, val]) => ({
    code: val.ID.split('.')[1],
    name,
  }));
}

export function getDistricts(provinceCode: string, regencyCode: string): RegionData[] {
  const province = Object.entries(provincesRaw).find(([, val]) => val.ID === provinceCode);
  if (!province) return [];

  const regencies = province[1]['Kabupaten/Kota'];
  const regency = Object.entries(regencies).find(([, val]) => val.ID.endsWith(regencyCode));
  if (!regency) return [];

  const districts = regency[1]['Kecamatan'];
  return Object.entries(districts).map(([name, val]) => ({
    code: val.ID.split('.')[2],
    name,
  }));
}
