import { shuffle } from '../shuffle';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it('contains all original elements', () => {
    const arr = ['cat', 'dog', 'lion', 'tiger'];
    const result = shuffle(arr);
    expect(result.sort()).toEqual(arr.sort());
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3];
    const original = [...arr];
    shuffle(arr);
    expect(arr).toEqual(original);
  });

  it('produces a different order at least sometimes across multiple calls', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = new Set(Array.from({ length: 20 }, () => shuffle(arr).join(',')));
    expect(results.size).toBeGreaterThan(1);
  });
});
