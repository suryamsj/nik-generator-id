import { cpSync, mkdirSync } from 'fs';

mkdirSync('dist/data', { recursive: true });
cpSync('src/data/provinces.json', 'dist/data/provinces.json');
cpSync('src/data/regencies', 'dist/data/regencies', { recursive: true });
cpSync('src/data/districts', 'dist/data/districts', { recursive: true });
cpSync('README.md', 'dist/README.md');

console.log('Data copied to dist/data/');
