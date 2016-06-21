import clone from 'lodash/clone';

export function createFixedArray(val, count) {
  return Array.apply(null, Array(count)).map(() => {
    return clone(val);
  });
}
