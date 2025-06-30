import { getProvinces, getRegencies, getDistricts } from '../region';
import { NIKError } from '../nik-error';

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
    test('should return array of regencies for valid province code', async () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      const regencies = await getRegencies(provinceCode);
      expect(Array.isArray(regencies)).toBe(true);
      expect(regencies.length).toBeGreaterThan(0);

      // Periksa struktur data
      const regency = regencies[0];
      expect(regency).toHaveProperty('code');
      expect(regency).toHaveProperty('name');
      expect(typeof regency.code).toBe('string');
      expect(typeof regency.name).toBe('string');
    });

    test('should throw NIKError for invalid province code', async () => {
      await expect(getRegencies('invalid-code')).rejects.toThrow(NIKError);
      await expect(getRegencies('invalid-code')).rejects.toThrow('Failed to load regency data');
      await expect(getRegencies('invalid-code')).rejects.toMatchObject({
        code: 'REGENCY_DATA_ERROR'
      });
    });
  });

  describe('getDistricts', () => {
    test('should return array of districts for valid province and regency code', async () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      const regencies = await getRegencies(provinceCode);
      const regencyCode = regencies[0].code;

      const districts = await getDistricts(provinceCode, regencyCode);
      expect(Array.isArray(districts)).toBe(true);
      expect(districts.length).toBeGreaterThan(0);

      // Periksa struktur data
      const district = districts[0];
      expect(district).toHaveProperty('code');
      expect(district).toHaveProperty('name');
      expect(typeof district.code).toBe('string');
      expect(typeof district.name).toBe('string');
    });

    test('should throw NIKError for invalid province code', async () => {
      await expect(getDistricts('invalid-code', 'any-code')).rejects.toThrow(NIKError);
      await expect(getDistricts('invalid-code', 'any-code')).rejects.toThrow('Failed to load district data');
      await expect(getDistricts('invalid-code', 'any-code')).rejects.toMatchObject({
        code: 'DISTRICT_DATA_ERROR'
      });
    });

    test('should throw NIKError for invalid regency code', async () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      await expect(getDistricts(provinceCode, 'invalid-code')).rejects.toThrow(NIKError);
      await expect(getDistricts(provinceCode, 'invalid-code')).rejects.toThrow('Failed to load district data');
      await expect(getDistricts(provinceCode, 'invalid-code')).rejects.toMatchObject({
        code: 'DISTRICT_DATA_ERROR'
      });
    });
  });
});
