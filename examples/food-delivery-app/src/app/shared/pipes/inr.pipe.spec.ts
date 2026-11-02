import { InrPipe } from './inr.pipe';

describe('InrPipe (pure unit test — no TestBed needed)', () => {
  const pipe = new InrPipe();

  it.each([
    [24950, '₹249.50'],
    [100000, '₹1,000.00'],
    [0, '₹0.00'],
  ])('formats %i paise as %s', (paise, expected) => {
    expect(pipe.transform(paise)).toBe(expected);
  });

  it('returns empty string for null/undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
