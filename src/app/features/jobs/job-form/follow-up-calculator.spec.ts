import { calculateFollowUpDate } from './follow-up-calculator';

const toParts = (value: Date) => ({
  year: value.getFullYear(),
  month: value.getMonth(),
  day: value.getDate()
});

describe('calculateFollowUpDate', () => {
  it('returns null when applied date is missing', () => {
    expect(calculateFollowUpDate(null, '1w')).toBeNull();
  });

  it('returns null when preset is missing', () => {
    expect(calculateFollowUpDate(new Date(2024, 0, 1), null)).toBeNull();
  });

  it('adds 7 days for 1w', () => {
    const result = calculateFollowUpDate(new Date(2024, 0, 1), '1w');
    expect(result).not.toBeNull();
    expect(toParts(result!)).toEqual({ year: 2024, month: 0, day: 8 });
  });

  it('adds 14 days for 2w', () => {
    const result = calculateFollowUpDate(new Date(2024, 0, 1), '2w');
    expect(result).not.toBeNull();
    expect(toParts(result!)).toEqual({ year: 2024, month: 0, day: 15 });
  });

  it('adds 5 business days and skips weekends', () => {
    const result = calculateFollowUpDate(new Date(2024, 0, 1), '5bd');
    expect(result).not.toBeNull();
    expect(toParts(result!)).toEqual({ year: 2024, month: 0, day: 8 });
  });

  it('handles starting on a Friday for 5bd', () => {
    const result = calculateFollowUpDate(new Date(2024, 0, 5), '5bd');
    expect(result).not.toBeNull();
    expect(toParts(result!)).toEqual({ year: 2024, month: 0, day: 12 });
  });
});
