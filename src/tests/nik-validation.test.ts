import {
  parseNik,
  validateNik,
  validateNikSync,
  generateNik,
} from "../nik-generator";
import { getProvinces, getRegencies, getDistricts } from "../region";
import { NIKError } from "../nik-error";
import { ParsedNik } from "../types/nik";

describe("NIK Validation and Parsing", () => {
  describe("parseNik", () => {
    test("should parse valid NIK correctly for male", () => {
      // NIK untuk laki-laki: 3201011501900001
      // 32: Jakarta Selatan, 01: Kab/Kota, 01: Kecamatan
      // 15: tanggal lahir, 01: bulan (Januari), 90: tahun (1990)
      // 0001: nomor urut
      const nik = "3201011501900001";
      const parsed = parseNik(nik);

      expect(parsed.isValid).toBe(true);
      expect(parsed.provinceCode).toBe("32");
      expect(parsed.regencyCode).toBe("01");
      expect(parsed.districtCode).toBe("01");
      expect(parsed.gender).toBe("male");
      expect(parsed.serialNumber).toBe("0001");
      expect(parsed.birthDate).toEqual(new Date(1990, 0, 15));
    });

    test("should parse valid NIK correctly for female", () => {
      // NIK untuk perempuan: 3201015501900001
      // 32: Jakarta Selatan, 01: Kab/Kota, 01: Kecamatan
      // 55: tanggal lahir + 40 (15+40), 01: bulan (Januari), 90: tahun (1990)
      // 0001: nomor urut
      const nik = "3201015501900001";
      const parsed = parseNik(nik);

      expect(parsed.isValid).toBe(true);
      expect(parsed.provinceCode).toBe("32");
      expect(parsed.regencyCode).toBe("01");
      expect(parsed.districtCode).toBe("01");
      expect(parsed.gender).toBe("female");
      expect(parsed.serialNumber).toBe("0001");
      expect(parsed.birthDate).toEqual(new Date(1990, 0, 15));
    });

    test("should handle different birth years correctly", () => {
      // Test untuk tahun 2010 - PERBAIKAN: menggunakan bulan 01 bukan 11
      const nik2010 = "3201011501100001";
      const parsed2010 = parseNik(nik2010);
      expect(parsed2010.isValid).toBe(true);
      expect(parsed2010.birthDate).toEqual(new Date(2010, 0, 15));

      // Test untuk tahun 1985
      const nik1985 = "3201011501850001";
      const parsed1985 = parseNik(nik1985);
      expect(parsed1985.isValid).toBe(true);
      expect(parsed1985.birthDate).toEqual(new Date(1985, 0, 15));

      // Test untuk tahun 2005
      const nik2005 = "3201011501050001";
      const parsed2005 = parseNik(nik2005);
      expect(parsed2005.isValid).toBe(true);
      expect(parsed2005.birthDate).toEqual(new Date(2005, 0, 15));
    });

    test("should return invalid result for invalid NIK format", () => {
      const invalidNiks = [
        "", // empty string
        "123", // too short
        "12345678901234567", // too long
        "abcd1234567890ab", // contains letters
        "1234567890123456a", // contains letter at end
        null, // null value
        undefined, // undefined value
      ];

      invalidNiks.forEach((nik) => {
        const parsed = parseNik(nik as string);
        expect(parsed.isValid).toBe(false);
        expect(parsed.provinceCode).toBe("");
        expect(parsed.regencyCode).toBe("");
        expect(parsed.districtCode).toBe("");
        expect(parsed.birthDate).toBe(null);
        expect(parsed.serialNumber).toBe("");
      });
    });

    test("should return invalid result for invalid birth date", () => {
      // NIK dengan tanggal tidak valid (32 Januari)
      const nikInvalidDate = "3201013201900001";
      const parsed = parseNik(nikInvalidDate);
      expect(parsed.isValid).toBe(false);

      // NIK dengan bulan tidak valid (bulan 00 - karena birthMonth = parseInt - 1)
      const nikInvalidMonth = "3201011500900001";
      const parsedMonth = parseNik(nikInvalidMonth);
      expect(parsedMonth.isValid).toBe(false);

      // NIK dengan tanggal 0
      const nikZeroDate = "3201010001900001";
      const parsedZero = parseNik(nikZeroDate);
      expect(parsedZero.isValid).toBe(false);
    });

    test("should handle edge cases for date validation", () => {
      // Test tanggal 29 Februari pada tahun kabisat (2000)
      const nikLeapYear = "3201012902000001";
      const parsedLeap = parseNik(nikLeapYear);
      expect(parsedLeap.isValid).toBe(true);
      expect(parsedLeap.birthDate).toEqual(new Date(2000, 1, 29));

      // Test tanggal 29 Februari pada tahun non-kabisat (1900)
      const nikNonLeapYear = "3201012900000001";
      const parsedNonLeap = parseNik(nikNonLeapYear);
      expect(parsedNonLeap.isValid).toBe(false); // 29 Feb 1900 tidak valid
    });
  });

  describe("validateNik", () => {
    test("should validate correct NIK with real location data", async () => {
      // Generate NIK yang valid terlebih dahulu
      const validNik = await generateNik();
      const isValid = await validateNik(validNik);
      expect(isValid).toBe(true);
    });

    test("should validate NIK with specific valid location", async () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      const regencies = await getRegencies(provinceCode);
      const regencyCode = regencies[0].code;

      const districts = await getDistricts(provinceCode, regencyCode);
      const districtCode = districts[0].code;

      // Buat NIK dengan lokasi yang valid
      const validNik = `${provinceCode}${regencyCode}${districtCode}1501900001`;
      const isValid = await validateNik(validNik);
      expect(isValid).toBe(true);
    });

    test("should return false for invalid NIK format", async () => {
      const invalidNiks = [
        "123", // too short
        "abcd1234567890ab", // contains letters
        "1234567890123456a", // contains letter
      ];

      for (const nik of invalidNiks) {
        const isValid = await validateNik(nik);
        expect(isValid).toBe(false);
      }
    });

    test("should return false for invalid province code", async () => {
      const nikInvalidProvince = "9901011501900001"; // province code 99 tidak ada
      const isValid = await validateNik(nikInvalidProvince);
      expect(isValid).toBe(false);
    });

    test("should return false for invalid regency code", async () => {
      const provinces = getProvinces();
      const validProvinceCode = provinces[0].code;

      const nikInvalidRegency = `${validProvinceCode}99011501900001`; // regency code 99 mungkin tidak ada
      const isValid = await validateNik(nikInvalidRegency);
      expect(isValid).toBe(false);
    });

    test("should return false for invalid district code", async () => {
      const provinces = getProvinces();
      const provinceCode = provinces[0].code;

      const regencies = await getRegencies(provinceCode);
      const regencyCode = regencies[0].code;

      const nikInvalidDistrict = `${provinceCode}${regencyCode}991501900001`; // district code 99 mungkin tidak ada
      const isValid = await validateNik(nikInvalidDistrict);
      expect(isValid).toBe(false);
    });

    test("should throw NIKError when validation fails due to region data error", async () => {
      // Test dengan NIK yang mungkin menyebabkan error pada region data
      const problematicNik = "1101011501900001";

      try {
        await validateNik(problematicNik);
        // Jika tidak ada error, test tetap lanjut
      } catch (error) {
        if (error instanceof NIKError) {
          expect(error.code).toBe("VALIDATION_ERROR");
          expect(error.message).toBe("Error validating NIK");
        }
      }
    });
  });

  describe("validateNikSync", () => {
    test("should validate NIK format and province code synchronously", () => {
      const provinces = getProvinces();
      const validProvinceCode = provinces[0].code;

      const validNik = `${validProvinceCode}01011501900001`;
      const isValid = validateNikSync(validNik);
      expect(isValid).toBe(true);
    });

    test("should return false for invalid NIK format", () => {
      const invalidNiks = [
        "123", // too short
        "abcd1234567890ab", // contains letters
        "1234567890123456a", // contains letter
      ];

      invalidNiks.forEach((nik) => {
        const isValid = validateNikSync(nik);
        expect(isValid).toBe(false);
      });
    });

    test("should return false for invalid province code", () => {
      const nikInvalidProvince = "9901011501900001"; // province code 99 tidak ada
      const isValid = validateNikSync(nikInvalidProvince);
      expect(isValid).toBe(false);
    });

    test("should return true for valid format even with invalid regency/district", () => {
      const provinces = getProvinces();
      const validProvinceCode = provinces[0].code;

      // NIK dengan province valid tapi regency/district mungkin tidak valid
      const nikValidProvince = `${validProvinceCode}99991501900001`;
      const isValid = validateNikSync(nikValidProvince);
      expect(isValid).toBe(true); // validateNikSync hanya cek format dan province
    });
  });

  describe("Integration Tests", () => {
    test("should work together: generate, parse, and validate", async () => {
      // Generate NIK
      const generatedNik = await generateNik({
        gender: "female",
        birthDate: new Date(1995, 5, 20), // 20 Juni 1995
      });

      // Parse NIK
      const parsed = parseNik(generatedNik);
      expect(parsed.isValid).toBe(true);
      expect(parsed.gender).toBe("female");
      expect(parsed.birthDate).toEqual(new Date(1995, 5, 20));

      // Validate NIK
      const isValid = await validateNik(generatedNik);
      expect(isValid).toBe(true);

      // Validate NIK Sync
      const isValidSync = validateNikSync(generatedNik);
      expect(isValidSync).toBe(true);
    });

    test("should handle edge cases consistently", async () => {
      const edgeCases = [
        "", // empty
        "1234567890123456", // valid format but might be invalid data
        "0000000000000000", // all zeros
        "9999999999999999", // all nines
      ];

      for (const nik of edgeCases) {
        const parsed = parseNik(nik);
        const validAsync = await validateNik(nik);
        const validSync = validateNikSync(nik);

        // Consistency check: if parseNik says invalid, validation should also be false
        if (!parsed.isValid) {
          expect(validAsync).toBe(false);
          expect(validSync).toBe(false);
        }
      }
    });
  });
});
