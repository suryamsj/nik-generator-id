import { getProvinces, getRegencies, getDistricts } from './region';
import { NikOptions } from './types/nik';

function pad(num: number, size: number): string {
  return num.toString().padStart(size, '0');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBirthDate(): Date {
  const year = randomInt(1990, 2025);
  const month = randomInt(0, 11);
  const day = randomInt(1, new Date(year, month + 1, 0).getDate());
  return new Date(year, month, day);
}

export async function generateNik(options: NikOptions = {}): Promise<string> {
  const gender = options.gender || (Math.random() < 0.5 ? 'male' : 'female');
  const birthDate = options.birthDate || randomBirthDate();

  const provinces = getProvinces();
  const provinceCode = options.provinceCode || provinces[randomInt(0, provinces.length - 1)].code;

  const regencies = await getRegencies(provinceCode);
  const regencyCode = options.regencyCode || regencies[randomInt(0, regencies.length - 1)].code;

  const districts = await getDistricts(provinceCode, regencyCode);
  const districtCode = options.districtCode || districts[randomInt(0, districts.length - 1)].code;

  if (!districts.find(d => d.code === districtCode)) {
    throw new Error('Kode wilayah tidak valid.');
  }

  const day = birthDate.getDate();
  const dayAdj = gender === 'female' ? day + 40 : day;
  const dobPart = `${pad(dayAdj, 2)}${pad(birthDate.getMonth() + 1, 2)}${pad(birthDate.getFullYear() % 100, 2)}`;

  const locationPart = `${provinceCode}${regencyCode}${districtCode}`;
  const serial = pad(randomInt(0, 9999), 4);

  return `${locationPart}${dobPart}${serial}`;
}

export function generateNikSync(options: NikOptions = {}): string {
  const gender = options.gender || (Math.random() < 0.5 ? 'male' : 'female');
  const birthDate = options.birthDate || randomBirthDate();

  const provinces = getProvinces();
  const provinceCode = options.provinceCode || provinces[randomInt(0, provinces.length - 1)].code;

  const regencyCode = options.regencyCode || pad(randomInt(1, 99), 2);
  const districtCode = options.districtCode || pad(randomInt(1, 99), 2);

  const day = birthDate.getDate();
  const dayAdj = gender === 'female' ? day + 40 : day;
  const dobPart = `${pad(dayAdj, 2)}${pad(birthDate.getMonth() + 1, 2)}${pad(birthDate.getFullYear() % 100, 2)}`;

  const locationPart = `${provinceCode}${regencyCode}${districtCode}`;
  const serial = pad(randomInt(0, 9999), 4);

  return `${locationPart}${dobPart}${serial}`;
}
