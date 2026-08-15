import { describe, it, expect } from "vitest";
import { formatMoney } from "./money";

describe('Testing formatMoney function', () => {
  it('formats 0 cents as $0.00', () => {
    expect(formatMoney(0)).toBe('$0.00');
  });
  it('formats 1256 cents as $12.56', () => {
    expect(formatMoney(1256)).toBe('$12.56');
  })
  it('formats 999 cents as $9.99', () => {
    expect(formatMoney(999)).toBe('$9.99');
  });
  it('formats large numbers correctly', () => {
    expect(formatMoney(100000)).toBe('$1000.00');
  });
});