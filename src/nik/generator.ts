import { NikOptions } from '../types/public.js';
import { NIKError } from '../errors/nik-error.js';
import { getProvinces, getRegencies, getDistricts } from '../region/index.js';
import { pad, randomInt, randomBirthDate } from '../utils/format.js';

export async function generateNik(options: NikOptions = {}): Promise<string> {
  const gender = options.gender ?? (Math.random() < 0.5 ? 'male' : 'female');
  const birthDate = options.birthDate ?? randomBirthDate();

  const provinces = getProvinces();
  const provinceCode = options.provinceCode ?? provinces[randomInt(0, provinces.length - 1)].code;

  const regencies = await getRegencies(provinceCode);
  const regencyCode = options.regencyCode ?? regencies[randomInt(0, regencies.length - 1)].code;

  const districts = await getDistricts(provinceCode, regencyCode);
  const districtCode = options.districtCode ?? districts[randomInt(0, districts.length - 1)].code;

  if (!districts.find(d => d.code === districtCode)) {
    throw new NIKError('Invalid district code.', 'INVALID_LOCATION_CODE');
  }

  const day = birthDate.getDate();
  const dayAdj = gender === 'female' ? day + 40 : day;
  const dobPart = `${pad(dayAdj, 2)}${pad(birthDate.getMonth() + 1, 2)}${pad(birthDate.getFullYear() % 100, 2)}`;
  const locationPart = `${provinceCode}${regencyCode}${districtCode}`;

  return `${locationPart}${dobPart}${pad(randomInt(0, 9999), 4)}`;
}

export function generateNikSync(options: NikOptions = {}): string {
  const gender = options.gender ?? (Math.random() < 0.5 ? 'male' : 'female');
  const birthDate = options.birthDate ?? randomBirthDate();

  const provinces = getProvinces();
  const provinceCode = options.provinceCode ?? provinces[randomInt(0, provinces.length - 1)].code;
  const regencyCode = options.regencyCode ?? pad(randomInt(1, 99), 2);
  const districtCode = options.districtCode ?? pad(randomInt(1, 99), 2);

  const day = birthDate.getDate();
  const dayAdj = gender === 'female' ? day + 40 : day;
  const dobPart = `${pad(dayAdj, 2)}${pad(birthDate.getMonth() + 1, 2)}${pad(birthDate.getFullYear() % 100, 2)}`;
  const locationPart = `${provinceCode}${regencyCode}${districtCode}`;

  return `${locationPart}${dobPart}${pad(randomInt(0, 9999), 4)}`;
}
