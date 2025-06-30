# NIK Generator ID

A JavaScript/TypeScript package for generating random or customized Indonesian NIKs (Nomor Induk Kependudukan) for development and testing purposes.

## Description

**NIK Generator ID** is a comprehensive utility package that provides complete functionality for Indonesian National Identity Numbers (NIKs). Beyond generation, it offers robust validation and parsing capabilities:

### Core Features:

1. **NIK Generation**: Generate random or user-defined NIKs using comprehensive regional data covering provinces, regencies/cities, and districts to produce NIKs that conform to the official format.

2. **NIK Validation**: Validate existing NIKs against both format rules and actual regional data:

   - **Asynchronous validation** (`validateNik`): Performs complete validation including format, date validity, and regional code verification against the official administrative database
   - **Synchronous validation** (`validateNikSync`): Fast format validation that checks NIK structure, date validity, and province code existence

3. **NIK Parsing**: Extract and interpret all components from a NIK string:

   - Parse province, regency, and district codes
   - Extract birth date with automatic gender detection (females have birth day + 40)
   - Determine gender based on birth day encoding
   - Extract serial number
   - Validate date components and overall format

4. **Regional Data Access**: Access comprehensive Indonesian administrative data including provinces, regencies/cities, and districts for accurate NIK generation and validation.

5. **Error Handling**: Custom `NIKError` class with specific error codes for different validation and parsing scenarios.

6. **TypeScript Support**: Built with TypeScript for enhanced type safety and developer experience.

## Installation

```bash
npm install nik-generator-id
```

## Usage

### ES Modules

```javascript
import {
  generateNik,
  generateNikSync,
  getProvinces,
  getRegencies,
  getDistricts,
  NIKError,
} from "nik-generator-id";
```

### CommonJS

```javascript
const {
  generateNik,
  generateNikSync,
  getProvinces,
  getRegencies,
  getDistricts,
  NIKError,
} = require("nik-generator-id");
```

## API Reference

### `generateNik(options)`

Generates a random or customized NIK asynchronously with accurate regional data.

#### Parameters

- `options` (optional): An object with the following fields:

  - `gender`: `'male'` or `'female'` (optional, default: random)
  - `birthDate`: `Date` object representing the date of birth (optional, default: random between 1990–2025)
  - `provinceCode`: `string` representing the province code (optional, default: random)
  - `regencyCode`: `string` representing the regency/city code (optional, default: random)
  - `districtCode`: `string` representing the district code (optional, default: random)

#### Returns

- `Promise<string>`: A Promise that resolves to a 16-digit NIK

#### Throws

- `NIKError`: Throws a custom error with code `INVALID_LOCATION_CODE` if the provided district code is invalid

#### Example

```javascript
// Generate a completely random NIK
generateNik().then((randomNik) => {
  console.log(randomNik); // e.g., 3273081505900001
});

// Generate a NIK for a male individual
generateNik({ gender: "male" }).then((maleNik) => {
  console.log(maleNik);
});

// Generate a NIK for a female born on January 15, 1990
generateNik({
  gender: "female",
  birthDate: new Date(1990, 0, 15),
}).then((femaleNik) => {
  console.log(femaleNik);
});

// Generate a NIK for a specific location
generateNik({
  provinceCode: "32", // West Java
  regencyCode: "73", // Bandung City
  districtCode: "08", // Specific district in Bandung City
}).then((specificNik) => {
  console.log(specificNik);
});

// Using async/await with error handling
async function generateSampleNik() {
  try {
    const nik = await generateNik({ gender: "male" });
    console.log(nik);
  } catch (error) {
    if (error instanceof NIKError) {
      console.error(`NIK Error: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
```

---

### `generateNikSync(options)`

Generates a random or customized NIK synchronously. This function is faster but uses random values for regency and district codes if not specified.

#### Parameters

- `options` (optional): An object with the following fields:

  - `gender`: `'male'` or `'female'` (optional, default: random)
  - `birthDate`: `Date` object representing the date of birth (optional, default: random between 1990–2025)
  - `provinceCode`: `string` representing the province code (optional, default: random)
  - `regencyCode`: `string` representing the regency/city code (optional, default: random 01-99)
  - `districtCode`: `string` representing the district code (optional, default: random 01-99)

#### Returns

- `string`: A 16-digit NIK

#### Example

```javascript
// Generate a completely random NIK synchronously
const randomNik = generateNikSync();
console.log(randomNik); // e.g., 3273081505900001

// Generate a NIK for a male individual
const maleNik = generateNikSync({ gender: "male" });

// Generate a NIK for a female born on January 15, 1990
const femaleNik = generateNikSync({
  gender: "female",
  birthDate: new Date(1990, 0, 15),
});

// Generate a NIK for a specific location
const specificNik = generateNikSync({
  provinceCode: "32", // West Java
  regencyCode: "73", // Bandung City
  districtCode: "08", // Specific district in Bandung City
});
```

---

### `parseNik(nik)`

Parses a NIK string and returns its components.

#### Parameters

- `nik`: `string` - The 16-digit NIK string to parse

#### Returns

- `ParsedNik`: An object containing the NIK components and validation status

#### Throws

- `NIKError`: Throws a custom error with code `DATE_PARSING_ERROR` if there's an error parsing the birth date

#### Example

```javascript
// Parse a valid NIK
const parsedNik = parseNik("3273081505900001");
console.log(parsedNik);
/* Output:
{
  provinceCode: '32',
  regencyCode: '73',
  districtCode: '08',
  birthDate: 1990-05-15T00:00:00.000Z, // Date object
  gender: 'male',
  serialNumber: '0001',
  isValid: true
}
*/

// Parse a female NIK (note the day value > 40)
const femaleParsedNik = parseNik("3273084505900002");
console.log(femaleParsedNik.gender); // 'female'
console.log(femaleParsedNik.birthDate); // 1990-05-05T00:00:00.000Z (day 45 - 40 = 5)

// Parse an invalid NIK
const invalidNik = parseNik("12345");
console.log(invalidNik.isValid); // false

// Error handling
try {
  const parsedNik = parseNik("3273089905900001"); // Invalid date (month 99)
} catch (error) {
  if (error instanceof NIKError) {
    console.error(`NIK Error: ${error.message} (Code: ${error.code})`);
    // Output: NIK Error: Error parsing birth date (Code: DATE_PARSING_ERROR)
  }
}
```

---

### `validateNik(nik)`

Validates a NIK string against format rules and regional data.

#### Parameters

- `nik`: `string` - The 16-digit NIK string to validate

#### Returns

- `Promise<boolean>`: Whether the NIK is valid

#### Throws

- `NIKError`: Throws a custom error with code `VALIDATION_ERROR` if there's an error during validation

#### Example

```javascript
// Validate a NIK asynchronously
validateNik("3273081505900001").then((isValid) => {
  console.log(isValid); // true or false depending on if the NIK is valid
});

// Using async/await
async function checkNik() {
  try {
    const isValid = await validateNik("3273081505900001");
    console.log(`NIK is ${isValid ? "valid" : "invalid"}`);
  } catch (error) {
    if (error instanceof NIKError) {
      console.error(`NIK Error: ${error.message} (Code: ${error.code})`);
      // Possible output: NIK Error: Error validating NIK (Code: VALIDATION_ERROR)
    }
  }
}

// Validate a NIK with invalid regional codes
validateNik("9999081505900001").then((isValid) => {
  console.log(isValid); // false - province code 99 doesn't exist
});
```

---

### `validateNikSync(nik)`

Validates a NIK string against format rules (synchronous version).

#### Parameters

- `nik`: `string` - The 16-digit NIK string to validate

#### Returns

- `boolean`: Whether the NIK has a valid format

#### Example

```javascript
// Validate a NIK synchronously (only checks format and province code)
const isValid = validateNikSync("3273081505900001");
console.log(isValid); // true if format is valid and province exists

// Validate an invalid NIK
const isInvalidNikValid = validateNikSync("12345"); // too short
console.log(isInvalidNikValid); // false

// Validate a NIK with invalid province code
const hasInvalidProvince = validateNikSync("9999081505900001");
console.log(hasInvalidProvince); // false - province code 99 doesn't exist
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

- `Promise<Array<Object>>`: A Promise that resolves to an array of objects, each containing a `code` and `name` property.

#### Throws

- `NIKError`: Throws a custom error with code `REGENCY_DATA_ERROR` if there's an error loading regency data

#### Example

```javascript
// Using Promises with error handling
getRegencies("11")
  .then((regencies) => {
    // Aceh
    console.log(regencies);
    // Output: [{ code: '01', name: 'Aceh Selatan Regency' }, { code: '02', name: 'Aceh Tenggara Regency' }, ...]
  })
  .catch((error) => {
    if (error instanceof NIKError) {
      console.error(`NIK Error: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("Unexpected error:", error);
    }
  });

// Using async/await with error handling
async function getAcehRegencies() {
  try {
    const regencies = await getRegencies("11"); // Aceh
    console.log(regencies);
  } catch (error) {
    if (error instanceof NIKError) {
      console.error(`NIK Error: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
```

---

### `getDistricts(provinceCode, regencyCode)`

Returns a list of districts within a specified regency or city.

#### Parameters

- `provinceCode`: `string`
- `regencyCode`: `string`

#### Returns

- `Promise<Array<Object>>`: A Promise that resolves to an array of objects, each containing a `code` and `name` property.

#### Throws

- `NIKError`: Throws a custom error with code `DISTRICT_DATA_ERROR` if there's an error loading district data

#### Example

```javascript
// Using Promises with error handling
getDistricts("11", "01")
  .then((districts) => {
    // Aceh Selatan Regency
    console.log(districts);
    // Output: [{ code: '01', name: 'Bakongan' }, { code: '02', name: 'Kluet Utara' }, ...]
  })
  .catch((error) => {
    if (error instanceof NIKError) {
      console.error(`NIK Error: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("Unexpected error:", error);
    }
  });

// Using async/await with error handling
async function getAcehSelatanDistricts() {
  try {
    const districts = await getDistricts("11", "01"); // Aceh Selatan Regency
    console.log(districts);
  } catch (error) {
    if (error instanceof NIKError) {
      console.error(`NIK Error: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
```

---

### `NIKError`

A custom error class for NIK-related errors that allows for specific error identification.

#### Properties

- `message`: `string` - The error message
- `code`: `string` - Optional error code for more specific identification

#### Error Codes

- `INVALID_LOCATION_CODE`: Thrown when an invalid district code is provided
- `DATE_PARSING_ERROR`: Thrown when there's an error parsing a birth date
- `VALIDATION_ERROR`: Thrown when there's an error validating a NIK
- `REGENCY_DATA_ERROR`: Thrown when there's an error loading regency data
- `DISTRICT_DATA_ERROR`: Thrown when there's an error loading district data

#### Example

```javascript
try {
  // Some operation that might throw NIKError
  const nik = await generateNik({ districtCode: "99" });
} catch (error) {
  if (error instanceof NIKError) {
    console.error(`NIK Error: ${error.message}`);
    console.error(`Error Code: ${error.code}`);

    // Handle specific error codes
    if (error.code === "INVALID_LOCATION_CODE") {
      console.error("Please provide a valid district code.");
    }
  } else {
    console.error("Unexpected error:", error);
  }
}
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
- The asynchronous `generateNik` function loads regional data dynamically for accurate NIK generation.
- The synchronous `generateNikSync` function is faster but may use random values for regency and district codes if not specified.
- All generated NIKs are for **development and testing purposes only**; they are not valid for official use.
- The package includes a custom `NIKError` class for better error handling and identification.

---

## License

Licensed under the [MIT License](LICENSE).

---

## Contributions

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/suryamsj/nik-generator-id).

---

## Author

Developed by [Muhammad Surya J](https://suryamsj.my.id)
