const assert = require('node:assert');
const test = require('node:test');

test('Monthly boundary test with anchor', (t) => {
  const created_at = new Date('2026-01-31T10:00:00.000Z');
  let nextRun = new Date('2026-02-28T10:00:00.000Z'); // It's currently Feb 28
  
  const originalDay = created_at.getDate(); // 31
  let targetMonth = nextRun.getMonth() + 1; // 2 (March)
  
  nextRun.setDate(originalDay); // Set to 31. Since it's Feb, this wraps to Mar 3!
  // Wait, if I do nextRun.setMonth(targetMonth) now, it's already March. 
  // If nextRun is Mar 3, getMonth is 2. setMonth(2) does nothing. 
  // It stays Mar 3! That's wrong.
});

