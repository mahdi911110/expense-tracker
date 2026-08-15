import { describe, it, expect } from "vitest";
import { formatMoney } from "./money";

describe('Testing formatMoney function', () => {
  it('works with 0', () => {
    expect(formatMoney(0)).toBe('$0.00');
  });
  it('1256 cents must be equal to $12.56', () => {
    expect(formatMoney(1256)).toBe('$12.56');
  })
  it('1254 cents must be equal to $12.55', () => {
    expect(formatMoney(1254)).toBe('$12.54');
  });
  it('works with large numbers', () => {
    expect(formatMoney(100000)).toBe('$1000.00');
  });
});