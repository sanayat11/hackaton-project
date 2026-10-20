// src/shared/lib/validation.ts

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export function validateRequired(value: string | undefined | null): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateMinLength(value: string | undefined | null, min: number): boolean {
  return typeof value === 'string' && value.trim().length >= min;
}

export function validateMaxLength(value: string | undefined | null, max: number): boolean {
  return typeof value === 'string' && value.trim().length <= max;
}

export function validatePhone(phone: string | undefined | null): boolean {
  if (!phone) return false;
  // Allows +996 XXX XXXXXX, 0XXX XXXXXX, or digits with formatting
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+?996\d{9}|0\d{9})$/.test(cleaned);
}

export function formatKyrgyzPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  // Standardize around 996
  let normalized = digits;
  if (normalized.startsWith('0')) {
    normalized = '996' + normalized.substring(1);
  } else if (!normalized.startsWith('996') && normalized.length > 0) {
    normalized = '996' + normalized;
  }

  normalized = normalized.substring(0, 12);

  const country = normalized.substring(0, 3);
  const code = normalized.substring(3, 6);
  const part1 = normalized.substring(6, 8);
  const part2 = normalized.substring(8, 10);
  const part3 = normalized.substring(10, 12);

  let formatted = `+${country}`;
  if (code) formatted += ` (${code}`;
  if (code.length === 3) formatted += `)`;
  if (part1) formatted += ` ${part1}`;
  if (part2) formatted += `-${part2}`;
  if (part3) formatted += `-${part3}`;

  return formatted;
}
