import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const rawData = require('../src/data/indonesia.json');

const outputDir = path.join(__dirname, '../src/data');
const regenciesDir = path.join(outputDir, 'regencies');
const districtsDir = path.join(outputDir, 'districts');

if (!fs.existsSync(regenciesDir)) {
  fs.mkdirSync(regenciesDir, { recursive: true });
}

const provinces = Object.entries(rawData).map(([name, val]) => ({
  code: val.ID,
  name,
}));

fs.writeFileSync(
  path.join(outputDir, 'provinces.json'),
  JSON.stringify(provinces, null, 2)
);

Object.entries(rawData).forEach(([provinceName, provinceData]) => {
  const provinceCode = provinceData.ID;

  const regencies = Object.entries(provinceData['Kabupaten/Kota']).map(([name, val]) => ({
    code: val.ID.split('.')[1],
    name,
  }));

  fs.writeFileSync(
    path.join(regenciesDir, `${provinceCode}.json`),
    JSON.stringify(regencies, null, 2)
  );

  const provinceDistrictsDir = path.join(districtsDir, provinceCode);
  if (!fs.existsSync(provinceDistrictsDir)) {
    fs.mkdirSync(provinceDistrictsDir, { recursive: true });
  }

  Object.entries(provinceData['Kabupaten/Kota']).forEach(([regencyName, regencyData]) => {
    const regencyCode = regencyData.ID.split('.')[1];

    const districts = Object.entries(regencyData.Kecamatan).map(([name, val]) => ({
      code: val.ID.split('.')[2],
      name,
    }));

    fs.writeFileSync(
      path.join(provinceDistrictsDir, `${regencyCode}.json`),
      JSON.stringify(districts, null, 2)
    );
  });
});

console.log('Data splitting completed successfully!');
