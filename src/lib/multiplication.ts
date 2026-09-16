import type { MultiplicationRow } from '@/types/multiplication';

/**
 * Build the rows of a multiplication table for `multiplicand`,
 * from 1 up to and including `upTo` (default 10).
 */
export function buildMultiplicationTable(multiplicand: number, upTo: number = 10): MultiplicationRow[] {
  const length = Math.max(0, Math.floor(upTo));
  return Array.from({ length }, (_, index) => {
    const multiplier = index + 1;
    return {
      multiplicand,
      multiplier,
      product: multiplicand * multiplier,
    };
  });
}
