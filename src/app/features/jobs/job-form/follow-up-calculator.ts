export type FollowUpPreset = '5bd' | '1w' | '2w';

export function calculateFollowUpDate(
  appliedOn: Date | null,
  preset: FollowUpPreset | null
): Date | null {
  if (!appliedOn || !preset) {
    return null;
  }

  const base = normalizeDate(appliedOn);
  switch (preset) {
    case '1w':
      return addDays(base, 7);
    case '2w':
      return addDays(base, 14);
    case '5bd':
      return addBusinessDays(base, 5);
    default:
      return null;
  }
}

function normalizeDate(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function addDays(value: Date, days: number): Date {
  const result = new Date(value);
  result.setDate(result.getDate() + days);
  return result;
}

function addBusinessDays(value: Date, days: number): Date {
  let remaining = days;
  const result = new Date(value);

  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      remaining -= 1;
    }
  }

  return result;
}

function isBusinessDay(value: Date): boolean {
  const day = value.getDay();
  return day !== 0 && day !== 6;
}
