import { generateNik } from '../nik-generator';
import { getProvinces, getRegencies, getDistricts } from '../region';
import { NikOptions } from '../types/nik';

describe('NIK Generator', () => {
  describe('generateNik', () => {
    test('should generate valid NIK with default options', () => {
      const nik = generateNik();
      expect(typeof nik).toBe('string');
      expect(nik.length).toBe(16);
      // Format NIK: PPRRDDTTMMYYXXXX
      // PP: Kode Provinsi (2 digit)
      // RR: Kode Kabupaten/Kota (2 digit)
      // DD: Kode Kecamatan (2 digit)
      // TTMMYY: Tanggal Lahir (6 digit)
      // XXXX: Nomor Urut (4 digit)
      expect(/^\d{16}$/.test(nik)).toBe(true);
    });

    test('should generate valid NIK for male', () => {
      const options: NikOptions = {
        gender: 'male',
        birthDate: new Date(1990, 0, 15) // 15 Januari 1990
      };

      const nik = generateNik(options);
      expect(nik.length).toBe(16);

      // Untuk laki-laki, tanggal lahir tidak ditambah 40
      // Digit ke-7 dan 8 adalah tanggal lahir (15)
      const dayPart = nik.substring(6, 8);
      expect(dayPart).toBe('15');

      // Digit ke-9 dan 10 adalah bulan lahir (01 untuk Januari)
      const monthPart = nik.substring(8, 10);
      expect(monthPart).toBe('01');

      // Digit ke-11 dan 12 adalah tahun lahir (90 untuk 1990)
      const yearPart = nik.substring(10, 12);
      expect(yearPart).toBe('90');
    });

    test('should generate valid NIK for female', () => {
      const options: NikOptions = {
        gender: 'female',
        birthDate: new Date(1990, 0, 15) // 15 Januari 1990
      };

      const nik = generateNik(options);
      expect(nik.length).toBe(16);

      // Untuk perempuan, tanggal lahir ditambah 40
      // Digit ke-7 dan 8 adalah tanggal lahir (15+40=55)
      const dayPart = nik.substring(6, 8);
      expect(dayPart).toBe('55');

      // Digit ke-9 dan 10 adalah bulan lahir (01 untuk Januari)
      const monthPart = nik.substring(8, 10);
      expect(monthPart).toBe('01');

      // Digit ke-11 dan 12 adalah tahun lahir (90 untuk 1990)
      const yearPart = nik.substring(10, 12);
      expect(yearPart).toBe('90');
    });

    test('should generate valid NIK with specific location', () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      const regencies = getRegencies(provinceCode);
      const regencyCode = regencies[0].code;

      const districts = getDistricts(provinceCode, regencyCode);
      const districtCode = districts[0].code;

      const options: NikOptions = {
        provinceCode,
        regencyCode,
        districtCode
      };

      const nik = generateNik(options);
      expect(nik.length).toBe(16);

      // Periksa kode lokasi
      const locationPart = nik.substring(0, 6);
      expect(locationPart).toBe(`${provinceCode}${regencyCode}${districtCode}`);
    });

    test('should throw error for invalid location code', () => {
      const options: NikOptions = {
        provinceCode: '11', // Aceh
        regencyCode: '01', // Kab. Aceh Selatan
        districtCode: '99' // Kode kecamatan tidak valid
      };

      expect(() => generateNik(options)).toThrow('Kode wilayah tidak valid.');
    });
  });
});
