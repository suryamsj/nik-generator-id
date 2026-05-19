export function pad(num: number, size: number): string {
  return num.toString().padStart(size, '0');
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomBirthDate(): Date {
  const year = randomInt(1990, 2025);
  const month = randomInt(0, 11);
  const day = randomInt(1, new Date(year, month + 1, 0).getDate());
  return new Date(year, month, day);
}
