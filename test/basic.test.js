import { expect, it } from 'vitest';

import { answer } from './helper.js';

it('loads', () => {
  expect(answer).toBe(42);
});
