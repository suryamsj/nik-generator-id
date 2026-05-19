export { generateNik, generateNikSync } from './nik/generator.js';
export { parseNik } from './nik/parser.js';
export { validateNik, validateNikSync } from './nik/validator.js';
export { getProvinces, getRegencies, getDistricts } from './region/index.js';
export type { NikOptions, ParsedNik, RegionData } from './types/public.js';
export { NIKError } from './errors/nik-error.js';
