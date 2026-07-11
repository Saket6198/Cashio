import { BASE_URL } from "@/constants";
import axios from "axios";

export interface BalanceSummary {
  rentAmount: number;
  previous_month_balance: number;
  totalPaid: number;
  remaining: number;
  due: number;
  fineAmount: number;
  totalDue: number;
  month: string;
  year: number;
  status: "paid" | "due" | "fine";
  daysOverdue: number;
}

interface ProfileData {
  rentAmount: number;
  previous_month_balance: number;
  gstAmount: number;
  vatAmount: number;
  otherCharges: number;
  finePerDay: number;
  fineActive: boolean;
  fineStartDate?: string;
  fineEndDate?: string;
}

const getEmptyPeriodSettings = (): ProfileData => ({
  rentAmount: 0,
  previous_month_balance: 0,
  gstAmount: 0,
  vatAmount: 0,
  otherCharges: 0,
  finePerDay: 0,
  fineActive: false,
  fineStartDate: undefined,
  fineEndDate: undefined,
});

const getGrandTotal = (profile: ProfileData) =>
  profile.rentAmount +
  profile.previous_month_balance +
  profile.gstAmount +
  profile.vatAmount +
  profile.otherCharges;

const calculateFine = (
  profile: ProfileData,
  rentDueDate: Date,
  hasUnpaidAmount: boolean,
): number => {
  if (!profile.fineActive || !hasUnpaidAmount || !profile.finePerDay) return 0;

  const fineStartDate = profile.fineStartDate
    ? new Date(profile.fineStartDate)
    : null;
  const fineEndDate = profile.fineEndDate
    ? new Date(profile.fineEndDate)
    : null;

  if (!fineStartDate || !fineEndDate) return 0;

  const now = new Date();
  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startMidnight = new Date(
    fineStartDate.getFullYear(),
    fineStartDate.getMonth(),
    fineStartDate.getDate(),
  );
  const endMidnight = new Date(
    fineEndDate.getFullYear(),
    fineEndDate.getMonth(),
    fineEndDate.getDate(),
  );

  if (nowMidnight < startMidnight) return 0;

  const effectiveEndDate =
    nowMidnight < endMidnight ? nowMidnight : endMidnight;
  const diffTime = effectiveEndDate.getTime() - startMidnight.getTime();
  const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const fineDays = Math.max(0, daysDiff);
  return fineDays * profile.finePerDay;
};

const getDaysOverdue = (dueDate: Date): number => {
  const now = new Date();
  const dueDateMidnight = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  );
  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const diffTime = nowMidnight.getTime() - dueDateMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const calculateBalanceForMonth = async (
  profileId: string,
  month: number, // 0-indexed (JS month)
  year: number,
): Promise<BalanceSummary> => {
  try {
    // month+1 because backend expects 1-indexed month
    const oneIndexedMonth = month + 1;

    // Fetch period settings for this specific month/year
    let periodSettings: ProfileData | null = null;
    try {
      const periodSettingsResponse = await axios.get(
        `${BASE_URL}/user/profile/settings-history/${profileId}/${year}/${oneIndexedMonth}`,
      );
      periodSettings = periodSettingsResponse?.data?.history || null;
    } catch (err) {
      periodSettings = null;
    }

    const profile = periodSettings || getEmptyPeriodSettings();
    const grandTotalRent = getGrandTotal(profile);

    // ✅ Filter transactions by created date for the selected billing month
    // Uses createdAt date range so a March query only includes payments created in March.
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 1).toISOString();

    const transactionsResponse = await axios.get(
      `${BASE_URL}/user/getAllTransactions/${profileId}`,
      {
        params: {
          startDate,
          endDate,
          limit: 1000,
        },
      },
    );

    const transactions = transactionsResponse.data.transactions || [];
    const totalPaid = transactions.reduce(
      (sum: number, txn: any) => sum + (txn.amount || 0),
      0,
    );

    const remaining = grandTotalRent - totalPaid;
    const due = Math.max(0, remaining);
    const rentDueDate = new Date(year, month, 5);
    const daysOverdue = getDaysOverdue(rentDueDate);
    const hasUnpaidAmount = due > 0;
    const fineAmount = calculateFine(profile, rentDueDate, hasUnpaidAmount);
    const totalDue = due + fineAmount;

    let status: "paid" | "due" | "fine";
    if (totalPaid >= grandTotalRent && grandTotalRent > 0) {
      status = "paid";
    } else if (fineAmount > 0) {
      status = "fine";
    } else {
      status = "due";
    }

    return {
      rentAmount: grandTotalRent,
      previous_month_balance: profile.previous_month_balance,
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
