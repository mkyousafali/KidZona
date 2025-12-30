import { AGE_BANDS } from '$lib/config/app';

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getAgeBand(birthDate: string): (typeof AGE_BANDS)[number] {
  const age = calculateAge(birthDate);
  return AGE_BANDS.find((band) => age >= band.min && age <= band.max) || AGE_BANDS[0];
}
