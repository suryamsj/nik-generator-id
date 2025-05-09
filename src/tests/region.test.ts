import { getProvinces, getRegencies, getDistricts } from '../region';

describe('Region Functions', () => {
  describe('getProvinces', () => {
    test('should return array of provinces', () => {
      const provinces = getProvinces();
      expect(Array.isArray(provinces)).toBe(true);
      expect(provinces.length).toBeGreaterThan(0);

      // Periksa struktur data
      const province = provinces[0];
      expect(province).toHaveProperty('code');
      expect(province).toHaveProperty('name');
      expect(typeof province.code).toBe('string');
      expect(typeof province.name).toBe('string');
    });
  });

  describe('getRegencies', () => {
    test('should return array of regencies for valid province code', () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      const regencies = getRegencies(provinceCode);
      expect(Array.isArray(regencies)).toBe(true);
      expect(regencies.length).toBeGreaterThan(0);

      // Periksa struktur data
      const regency = regencies[0];
      expect(regency).toHaveProperty('code');
      expect(regency).toHaveProperty('name');
      expect(typeof regency.code).toBe('string');
      expect(typeof regency.name).toBe('string');
    });

    test('should return empty array for invalid province code', () => {
      const regencies = getRegencies('invalid-code');
      expect(Array.isArray(regencies)).toBe(true);
      expect(regencies.length).toBe(0);
    });
  });

  describe('getDistricts', () => {
    test('should return array of districts for valid province and regency code', () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      const regencies = getRegencies(provinceCode);
      const regencyCode = regencies[0].code;

      const districts = getDistricts(provinceCode, regencyCode);
      expect(Array.isArray(districts)).toBe(true);
      expect(districts.length).toBeGreaterThan(0);

      // Periksa struktur data
      const district = districts[0];
      expect(district).toHaveProperty('code');
      expect(district).toHaveProperty('name');
      expect(typeof district.code).toBe('string');
      expect(typeof district.name).toBe('string');
    });

    test('should return empty array for invalid province code', () => {
      const districts = getDistricts('invalid-code', 'any-code');
      expect(Array.isArray(districts)).toBe(true);
      expect(districts.length).toBe(0);
    });

    test('should return empty array for invalid regency code', () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      const districts = getDistricts(provinceCode, 'invalid-code');
      expect(Array.isArray(districts)).toBe(true);
      expect(districts.length).toBe(0);
    });
  });
});
