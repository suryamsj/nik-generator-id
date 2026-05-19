import { ParsedNik } from '../types/public.js';
import { NIKError } from '../errors/nik-error.js';

export function parseNik(nik: string): ParsedNik {
  const result: ParsedNik = {
    provinceCode: '',
    regencyCode: '',
    districtCode: '',
    birthDate: null,
    gender: 'male',
    serialNumber: '',
    isValid: false,
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
  }

  const currentYear = new Date().getFullYear();
  const century = Math.floor(currentYear / 100) * 100;
  const fullYear = birthYear > currentYear % 100 ? (century - 100) + birthYear : century + birthYear;

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
  } catch {
    throw new NIKError('Error parsing birth date', 'DATE_PARSING_ERROR');
  }

  result.isValid = true;
  return result;
}
