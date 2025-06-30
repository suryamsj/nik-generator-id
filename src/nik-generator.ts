import { getProvinces, getRegencies, getDistricts } from './region';
import { NikOptions, ParsedNik } from './types/nik';
import { NIKError } from './nik-error';

/**
 * Pads a number with leading zeros to reach the specified size
 * @param {number} num - The number to pad
 * @param {number} size - The desired length of the resulting string
 * @returns {string} - The padded number as a string
 */
function pad(num: number, size: number): string {
  return num.toString().padStart(size, '0');
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} - A random integer between min and max
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random birth date between 1990 and 2025
 * @returns {Date} - A random Date object

 */
function randomBirthDate(): Date {
  const year = randomInt(1990, 2025);
  const month = randomInt(0, 11);
  const day = randomInt(1, new Date(year, month + 1, 0).getDate());
  return new Date(year, month, day);
}

/**
 * Generates a random or customized NIK asynchronously with accurate regional data
 * @param {NikOptions} options - Optional configuration for NIK generation
 * @returns {Promise<string>} - A Promise that resolves to a 16-digit NIK string
 */
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
    throw new NIKError('Invalid district code.', 'INVALID_LOCATION_CODE');
  }

  const day = birthDate.getDate();
  const dayAdj = gender === 'female' ? day + 40 : day;
  const dobPart = `${pad(dayAdj, 2)}${pad(birthDate.getMonth() + 1, 2)}${pad(birthDate.getFullYear() % 100, 2)}`;

  const locationPart = `${provinceCode}${regencyCode}${districtCode}`;
  const serial = pad(randomInt(0, 9999), 4);

  return `${locationPart}${dobPart}${serial}`;
}

/**
 * Generates a random or customized NIK synchronously
 * @param {NikOptions} options - Optional configuration for NIK generation
 * @returns {string} - A 16-digit NIK string
 * @remarks This synchronous version is faster but may use random values for regency and district codes if not specified
 */
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

/**
 * Parses a NIK string and returns its components
 * @param {string} nik - The 16-digit NIK string to parse
 * @returns {ParsedNik} - ParsedNik object containing the NIK components and validation status
 */
export function parseNik(nik: string): ParsedNik {
  const result: ParsedNik = {
    provinceCode: '',
    regencyCode: '',
    districtCode: '',
    birthDate: null,
    gender: 'male',
    serialNumber: '',
    isValid: false
  };

  if (!nik || typeof nik !== 'string' || !/^\d{16}$/.test(nik)) {
    return result;
  }

  result.provinceCode = nik.substring(0, 2);
  result.regencyCode = nik.substring(2, 4);
  result.districtCode = nik.substring(4, 6);
  result.serialNumber = nik.substring(12, 16);

  let birthDay = parseInt(nik.substring(6, 8), 10);
  const birthMonth = parseInt(nik.substring(8, 10), 10) - 1;
  const birthYear = parseInt(nik.substring(10, 12), 10);

  if (birthDay > 40) {
    result.gender = 'female';
    birthDay -= 40;
  } else {
    result.gender = 'male';
  }

  let fullYear = birthYear;
  if (birthYear < 100) {
    const currentYear = new Date().getFullYear();
    const century = Math.floor(currentYear / 100) * 100;

    if (birthYear > currentYear % 100) {
      fullYear = (century - 100) + birthYear;
    } else {
      fullYear = century + birthYear;
    }
  }

  try {
    const date = new Date(fullYear, birthMonth, birthDay);

    if (
      date.getFullYear() === fullYear &&
      date.getMonth() === birthMonth &&
      date.getDate() === birthDay
    ) {
      result.birthDate = date;
    } else {
      return result;
    }
  } catch (e) {
    throw new NIKError('Error parsing birth date', 'DATE_PARSING_ERROR');
  }

  result.isValid = true;

  return result;
}

/**
 * Validates a NIK string against format rules and regional data
 * @param {string} nik - The 16-digit NIK string to validate
 * @returns {Promise<boolean>} - Whether the NIK is valid
 */
export async function validateNik(nik: string): Promise<boolean> {
  const parsedNik = parseNik(nik);

  if (!parsedNik.isValid) {
    return false;
  }

  try {
    const provinces = getProvinces();
    const provinceExists = provinces.some(p => p.code === parsedNik.provinceCode);
    if (!provinceExists) {
      return false;
    }

    const regencies = await getRegencies(parsedNik.provinceCode);
    const regencyExists = regencies.some(r => r.code === parsedNik.regencyCode);
    if (!regencyExists) {
      return false;
    }

    const districts = await getDistricts(parsedNik.provinceCode, parsedNik.regencyCode);
    const districtExists = districts.some(d => d.code === parsedNik.districtCode);
    if (!districtExists) {
      return false;
    }

    return true;
  } catch (error) {
    throw new NIKError('Error validating NIK', 'VALIDATION_ERROR');
  }
}

/**
 * Validates a NIK string against format rules (synchronous version)
 * @param {string} nik - The 16-digit NIK string to validate
 * @returns {boolean} - Whether the NIK has a valid format
 * @remarks This sync version only validates the format and province code
 */
export function validateNikSync(nik: string): boolean {
  const parsedNik = parseNik(nik);

  if (!parsedNik.isValid) {
    return false;
  }

  const provinces = getProvinces();
  const provinceExists = provinces.some(p => p.code === parsedNik.provinceCode);
  if (!provinceExists) {
    return false;
  }

  return true;
}
