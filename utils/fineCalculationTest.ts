// Fine Calculation Logic Test Examples

/**
 * Example 1: Fine period from Nov 10 to Nov 14 (5 days)
 * Fine per day: ₹500
 * Current date: Nov 15 (after period ends)
 * Expected: 5 days × ₹500 = ₹2,500
 */

/**
 * Example 2: Fine period from Nov 14 to Nov 20 (7 days)
 * Fine per day: ₹500
 * Current date: Nov 15 (1 day into period)
 * Expected: 2 days × ₹500 = ₹1,000 (Nov 14 + Nov 15)
 *
 * Tomorrow (Nov 16): 3 days × ₹500 = ₹1,500 (Nov 14 + Nov 15 + Nov 16)
 */

/**
 * Example 3: Fine period from Nov 13 to Nov 16
 * Fine per day: ₹500
 * Current date: Nov 15 (within period)
 * Expected: 3 days × ₹500 = ₹1,500 (Nov 13 + Nov 14 + Nov 15)
 */

// How the calculation works:

function calculateFineDays(
  startDate: Date,
  endDate: Date,
  currentDate: Date
): number {
  const startMidnight = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endMidnight = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  const currentMidnight = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  // If current date is before start, no fine
  if (currentMidnight < startMidnight) return 0;

  // Use the earlier of current date or end date
  const effectiveEndDate =
    currentMidnight < endMidnight ? currentMidnight : endMidnight;

  // Calculate days (inclusive of start day)
  const diffTime = effectiveEndDate.getTime() - startMidnight.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(0, days);
}

// Test cases:
console.log("Test Case 1 (Nov 10 to Nov 14, today is Nov 15):");
console.log(
  "Days:",
  calculateFineDays(
    new Date(2025, 10, 10), // Nov 10
    new Date(2025, 10, 14), // Nov 14
    new Date(2025, 10, 15) // Nov 15 (today)
  )
); // Expected: 5 days (period ended)

console.log("\nTest Case 2 (Nov 14 to Nov 20, today is Nov 15):");
console.log(
  "Days:",
  calculateFineDays(
    new Date(2025, 10, 14), // Nov 14
    new Date(2025, 10, 20), // Nov 20
    new Date(2025, 10, 15) // Nov 15 (today)
  )
); // Expected: 2 days (Nov 14, Nov 15)

console.log("\nTest Case 3 (Nov 13 to Nov 16, today is Nov 15):");
console.log(
  "Days:",
  calculateFineDays(
    new Date(2025, 10, 13), // Nov 13
    new Date(2025, 10, 16), // Nov 16
    new Date(2025, 10, 15) // Nov 15 (today)
  )
); // Expected: 3 days (Nov 13, Nov 14, Nov 15)

// Your actual profile data:
console.log("\nYour Profile (Nov 13 to Nov 16, today is Nov 15):");
const finePerDay = 500;
const days = calculateFineDays(
  new Date("2025-11-13T08:41:00.000Z"),
  new Date("2025-11-16T08:41:00.000Z"),
  new Date()
);
console.log("Days:", days);
console.log("Fine Amount: ₹" + (days * finePerDay).toLocaleString("en-IN"));
// Expected: 3 days × ₹500 = ₹1,500
