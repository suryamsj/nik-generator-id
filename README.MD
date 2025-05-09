# NIK Generator ID

A JavaScript/TypeScript package for generating random or customized Indonesian NIKs (Nomor Induk Kependudukan) for development and testing purposes.

## Description

**NIK Generator ID** is a utility package that generates random or user-defined Indonesian National Identity Numbers (NIKs). It leverages comprehensive regional data—covering provinces, regencies/cities, and districts—to produce NIKs that conform to the official format.

## Installation

```bash
npm install nik-generator-id
```

## Usage

### ES Modules

```javascript
import {
  generateNik,
  getProvinces,
  getRegencies,
  getDistricts,
} from "nik-generator-id";
```

### CommonJS

```javascript
const {
  generateNik,
  getProvinces,
  getRegencies,
  getDistricts,
} = require("nik-generator-id");
```

## API Reference

### `generateNik(options)`

Generates a random or customized NIK.

#### Parameters

- `options` (optional): An object with the following fields:

  - `gender`: `'male'` or `'female'` (optional, default: random)
  - `birthDate`: `Date` object representing the date of birth (optional, default: random between 1990–2025)
  - `provinceCode`: `string` representing the province code (optional, default: random)
  - `regencyCode`: `string` representing the regency/city code (optional, default: random)
  - `districtCode`: `string` representing the district code (optional, default: random)

#### Returns

- `string`: A 16-digit NIK

#### Example

```javascript
// Generate a completely random NIK
const randomNik = generateNik();
console.log(randomNik); // e.g., 3273081505900001

// Generate a NIK for a male individual
const maleNik = generateNik({ gender: "male" });

// Generate a NIK for a female born on January 15, 1990
const femaleNik = generateNik({
  gender: "female",
  birthDate: new Date(1990, 0, 15),
});

// Generate a NIK for a specific location
const specificNik = generateNik({
  provinceCode: "32", // West Java
  regencyCode: "73", // Bandung City
  districtCode: "08", // Specific district in Bandung City
});
```

---

### `getProvinces()`

Returns a list of all provinces in Indonesia.

#### Returns

- `Array<Object>`: Each object contains a `code` and `name` property.

#### Example

```javascript
const provinces = getProvinces();
console.log(provinces);
// Output: [{ code: '11', name: 'Aceh' }, { code: '12', name: 'North Sumatra' }, ...]
```

---

### `getRegencies(provinceCode)`

Returns a list of regencies or cities within a specified province.

#### Parameters

- `provinceCode`: `string` — The code of the province

#### Returns

- `Array<Object>`: Each object contains a `code` and `name` property.

#### Example

```javascript
const regencies = getRegencies("11"); // Aceh
console.log(regencies);
// Output: [{ code: '01', name: 'Aceh Selatan Regency' }, { code: '02', name: 'Aceh Tenggara Regency' }, ...]
```

---

### `getDistricts(provinceCode, regencyCode)`

Returns a list of districts within a specified regency or city.

#### Parameters

- `provinceCode`: `string`
- `regencyCode`: `string`

#### Returns

- `Array<Object>`: Each object contains a `code` and `name` property.

#### Example

```javascript
const districts = getDistricts("11", "01"); // Aceh Selatan Regency
console.log(districts);
// Output: [{ code: '01', name: 'Bakongan' }, { code: '02', name: 'Kluet Utara' }, ...]
```

---

## NIK Format

A valid NIK consists of 16 digits, formatted as:

```
PPRRDDTTMMYYXXXX
```

Where:

- `PP`: Province code (2 digits)
- `RR`: Regency/City code (2 digits)
- `DD`: District code (2 digits)
- `TT`: Birth day (2 digits; add 40 for females)
- `MM`: Birth month (2 digits)
- `YY`: Last two digits of birth year
- `XXXX`: Sequence number (4 digits)

**Note:** For females, the birth day value is increased by 40, as per the official NIK convention.

---

## Notes

- This package uses comprehensive regional data based on official Indonesian administrative divisions.
- All generated NIKs are for **development and testing purposes only**; they are not valid for official use.

---

## License

Licensed under the [MIT License](LICENSE).

---

## Contributions

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/suryamsj/nik-generator-id).

---

## Author

Developed by [Muhammad Surya J](https://suryamsj.my.id)
