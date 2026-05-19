import { NIKError } from '../errors/nik-error.js';
import { getProvinces, getRegencies, getDistricts } from '../region/index.js';
import { parseNik } from './parser.js';

export async function validateNik(nik: string): Promise<boolean> {
  const parsed = parseNik(nik);

  if (!parsed.isValid) {
    return false;
  }

  try {
    const provinceExists = getProvinces().some(p => p.code === parsed.provinceCode);
    if (!provinceExists) return false;

    const regencies = await getRegencies(parsed.provinceCode);
    if (!regencies.some(r => r.code === parsed.regencyCode)) return false;

    const districts = await getDistricts(parsed.provinceCode, parsed.regencyCode);
    if (!districts.some(d => d.code === parsed.districtCode)) return false;

    return true;
  } catch {
    throw new NIKError('Error validating NIK', 'VALIDATION_ERROR');
  }
}

export function validateNikSync(nik: string): boolean {
  const parsed = parseNik(nik);

  if (!parsed.isValid) {
    return false;
  }

  return getProvinces().some(p => p.code === parsed.provinceCode);
}
