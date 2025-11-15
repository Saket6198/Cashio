import { BASE_URL } from "@/constants";
import axios from "axios";

export interface BalanceSummary {
  rentAmount: number;
  totalPaid: number;
  remaining: number;
  due: number;
  fineAmount: number;
  totalDue: number; // due + fine
  month: string;
  year: number;
  status: "paid" | "due" | "fine";
  daysOverdue: number;
}

interface ProfileData {
  rentAmount: number;
  finePerDay: number;
  fineActive: boolean;
  fineStartDate?: string;
  fineEndDate?: string;
}

const calculateFine = (
  profile: ProfileData,
  rentDueDate: Date,
  hasUnpaidAmount: boolean
): number => {
  // Only calculate fine if there's actually unpaid rent and fine is active
  if (!profile.fineActive || !hasUnpaidAmount || !profile.finePerDay) return 0;

  const fineStartDate = profile.fineStartDate
    ? new Date(profile.fineStartDate)
    : null;
  const fineEndDate = profile.fineEndDate
    ? new Date(profile.fineEndDate)
    : null;

  // Fine period must be defined
  if (!fineStartDate || !fineEndDate) return 0;

  const now = new Date();
  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startMidnight = new Date(
    fineStartDate.getFullYear(),
    fineStartDate.getMonth(),
    fineStartDate.getDate()
  );
  const endMidnight = new Date(
    fineEndDate.getFullYear(),
    fineEndDate.getMonth(),
    fineEndDate.getDate()
  );

  // Check if current date is before fine period starts
  if (nowMidnight < startMidnight) return 0;

  // Determine the effective end date (either fineEndDate or today, whichever is earlier)
  const effectiveEndDate =
    nowMidnight < endMidnight ? nowMidnight : endMidnight;

  // Calculate days between start and effective end (inclusive)
  const diffTime = effectiveEndDate.getTime() - startMidnight.getTime();
  const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day

  // Calculate total fine
  const fineDays = Math.max(0, daysDiff);
  return fineDays * profile.finePerDay;
};

const getDaysOverdue = (dueDate: Date): number => {
  const now = new Date();
  // Set both dates to midnight for accurate day calculation
  const dueDateMidnight = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );
  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffTime = nowMidnight.getTime() - dueDateMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const calculateMonthlyBalance = async (
  profileId: string
): Promise<BalanceSummary> => {
  try {
    // Get current month range
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Fetch profile to get rent amount
    const profileResponse = await axios.get(
      `${BASE_URL}/user/profile/${profileId}`
    );
    const profile: ProfileData = profileResponse.data.profile;

    // Fetch all transactions for this profile this month
    const transactionsResponse = await axios.get(
      `${BASE_URL}/user/getAllTransactions/${profileId}`,
      {
        params: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          limit: 100,
        },
      }
    );

    const transactions = transactionsResponse.data.transactions || [];

    // Calculate total paid this month
    const totalPaid = transactions.reduce((sum: number, txn: any) => {
      const txnDate = new Date(txn.createdAt || txn.created);
      if (txnDate >= start && txnDate < end) {
        return sum + (txn.amount || 0);
      }
      return sum;
    }, 0);

    // Calculate remaining balance
    const remaining = profile.rentAmount - totalPaid;
    const due = Math.max(0, remaining);

    // Calculate fine if overdue (assuming rent is due by 5th of each month)
    const rentDueDate = new Date(now.getFullYear(), now.getMonth(), 5);
    const daysOverdue = getDaysOverdue(rentDueDate);
    const hasUnpaidAmount = due > 0;
    const fineAmount = calculateFine(profile, rentDueDate, hasUnpaidAmount);
    const totalDue = due + fineAmount;

    // Determine status
    let status: "paid" | "due" | "fine";
    if (totalPaid >= profile.rentAmount) {
      status = "paid";
    } else if (fineAmount > 0) {
      status = "fine";
    } else {
      status = "due";
    }

    return {
      rentAmount: profile.rentAmount,
      totalPaid,
      remaining,
      due,
      fineAmount,
      totalDue,
      daysOverdue,
      status,
      month: now.toLocaleDateString("en-US", { month: "long" }),
      year: now.getFullYear(),
    };
  } catch (error) {
    console.error("Error calculating monthly balance:", error);
    throw error;
  }
};

// Get balance for a specific month/year
export const calculateBalanceForMonth = async (
  profileId: string,
  month: number,
  year: number
): Promise<BalanceSummary> => {
  try {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    const profileResponse = await axios.get(
      `${BASE_URL}/user/profile/${profileId}`
    );
    const profile = profileResponse.data.profile;

    const transactionsResponse = await axios.get(
      `${BASE_URL}/user/getAllTransactions/${profileId}`,
      {
        params: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          limit: 1000,
        },
      }
    );

    const transactions = transactionsResponse.data.transactions || [];
    const totalPaid = transactions.reduce(
      (sum: number, txn: any) => sum + (txn.amount || 0),
      0
    );
    const remaining = profile.rentAmount - totalPaid;

    const due = Math.max(0, remaining);
    const rentDueDate = new Date(year, month, 5);
    const daysOverdue = getDaysOverdue(rentDueDate);
    const hasUnpaidAmount = due > 0;
    const fineAmount = calculateFine(profile, rentDueDate, hasUnpaidAmount);
    const totalDue = due + fineAmount;

    let status: "paid" | "due" | "fine";
    if (totalPaid >= profile.rentAmount) {
      status = "paid";
    } else if (fineAmount > 0) {
      status = "fine";
    } else {
      status = "due";
    }

    return {
      rentAmount: profile.rentAmount,
      totalPaid,
      remaining,
      due,
      fineAmount,
      totalDue,
      daysOverdue,
      status,
      month: new Date(year, month).toLocaleDateString("en-US", {
        month: "long",
      }),
      year,
    };
  } catch (error) {
    console.error("Error calculating balance for specific month:", error);
    throw error;
  }
};
