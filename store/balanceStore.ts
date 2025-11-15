import {
  BalanceSummary,
  calculateMonthlyBalance,
} from "@/services/balanceService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BalanceStore {
  // Current balance data
  currentBalance: BalanceSummary | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBalance: (profileId: string) => Promise<void>;
  refreshBalance: (profileId: string) => Promise<void>;
  clearBalance: () => void;

  // Computed values
  getFormattedBalance: () => string;
  getDueStatus: () => "paid" | "fine" | "unpaid";
  getStatusColor: () => { bg: string; text: string; label: string };
}

export const useBalanceStore = create<BalanceStore>()(
  persist(
    (set, get) => ({
      currentBalance: null,
      isLoading: false,
      error: null,

      fetchBalance: async (profileId: string) => {
        if (!profileId) return;

        set({ isLoading: true, error: null });

        try {
          const balance = await calculateMonthlyBalance(profileId);
          set({
            currentBalance: balance,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch balance",
            isLoading: false,
          });
        }
      },

      refreshBalance: async (profileId: string) => {
        // Force refresh without showing loading state
        try {
          const balance = await calculateMonthlyBalance(profileId);
          set({ currentBalance: balance });
        } catch (error: any) {
          console.error("Error refreshing balance:", error);
        }
      },

      clearBalance: () => {
        set({
          currentBalance: null,
          error: null,
          isLoading: false,
        });
      },

      getFormattedBalance: () => {
        const { currentBalance } = get();
        if (!currentBalance) return "₹0";
        return `₹${currentBalance.remaining.toLocaleString("en-IN")}`;
      },

      getDueStatus: (): "paid" | "fine" | "unpaid" => {
        const { currentBalance } = get();
        if (!currentBalance) return "unpaid";

        return currentBalance.status === "paid"
          ? "paid"
          : currentBalance.status === "fine"
            ? "fine"
            : "unpaid";
      },

      getStatusColor: () => {
        const { currentBalance } = get();
        if (!currentBalance)
          return { bg: "#ef4444", text: "#fff", label: "Due" };

        switch (currentBalance.status) {
          case "paid":
            return { bg: "#10b981", text: "#fff", label: "Paid" };
          case "fine":
            return { bg: "#ef4444", text: "#fff", label: "Fine" };
          case "due":
          default:
            return { bg: "#3b82f6", text: "#fff", label: "Due" };
        }
      },
    }),
    {
      name: "balance-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentBalance: state.currentBalance,
      }),
    }
  )
);
