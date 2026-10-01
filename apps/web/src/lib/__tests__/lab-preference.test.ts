import { describe, it, expect } from 'vitest';
import { matchesTestingPreference } from '../lab-preference';

describe('matchesTestingPreference', () => {
  it('unset filter matches everything', () => {
    expect(matchesTestingPreference('lab', undefined)).toBe(true);
    expect(matchesTestingPreference('portable', undefined)).toBe(true);
    expect(matchesTestingPreference('both', undefined)).toBe(true);
    expect(matchesTestingPreference('none', undefined)).toBe(true);
    expect(matchesTestingPreference(undefined, undefined)).toBe(true);
  });

  it('profile "lab" matches filter "lab"', () => {
    expect(matchesTestingPreference('lab', 'lab')).toBe(true);
  });

  it('profile "lab" does NOT match filter "portable"', () => {
    expect(matchesTestingPreference('lab', 'portable')).toBe(false);
  });

  it('profile "none" matches filter "lab"', () => {
    expect(matchesTestingPreference('none', 'lab')).toBe(true);
  });

  it('profile "none" matches filter "portable"', () => {
    expect(matchesTestingPreference('none', 'portable')).toBe(true);
  });

  it('profile "both" matches filter "both"', () => {
    expect(matchesTestingPreference('both', 'both')).toBe(true);
  });

  it('profile "both" matches filter unset', () => {
    expect(matchesTestingPreference('both', '')).toBe(true);
  });

  it('profile "none" matches filter "both"', () => {
    expect(matchesTestingPreference('none', 'both')).toBe(true);
  });

  it('profile "lab" does NOT match filter "both"', () => {
    expect(matchesTestingPreference('lab', 'both')).toBe(false);
  });
});
