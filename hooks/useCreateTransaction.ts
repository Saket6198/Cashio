import { NewTransactionProps } from "@/schema/newTransactionSchema";
import {
  createTransaction,
  deleteTransactionById,
  fetchTransactionById,
  updateTransactionById,
} from "@/services/transactionService";
import { useProfileStore } from "@/store/userProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const buildTransactionPayload = (
  transactionData: NewTransactionProps,
  selectedMonth: number | null,
  selectedYear: number | null
) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const payload = { ...transactionData };

  const isCurrentPeriod =
    (selectedMonth ?? currentMonth) === currentMonth &&
    (selectedYear ?? currentYear) === currentYear;

  if (isCurrentPeriod) {
    delete payload.createdAt;
    return payload;
  }

  const firstDayOfSelectedMonth = new Date(
    selectedYear ?? currentYear,
    (selectedMonth ?? currentMonth) - 1,
    1,
    0,
    0,
    0,
    0
  );

  return {
    ...payload,
    createdAt: firstDayOfSelectedMonth,
  };
};

export const useCreateTransaction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedMonth, selectedYear } = useProfileStore();

  return useMutation({
    mutationFn: async (transactionData: NewTransactionProps) => {
      const payload = buildTransactionPayload(
        transactionData,
        selectedMonth,
        selectedYear
      );
      return createTransaction(payload);
    },
    onSuccess: (data, variables) => {
      console.log("Transaction created successfully:");

      // Invalidate transaction queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      // Also invalidate profile queries since balance might change
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.profileId],
      });

      Alert.alert("Success!", `Transaction recorded successfully`, [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
      Alert.alert("Error", "There was an error recording the transaction.");
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transactionId: string) => {
      return deleteTransactionById(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useFetchTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => fetchTransactionById(transactionId),
    enabled: !!transactionId,
  });
};

export const useUpdateTransaction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionId,
      transactionData,
    }: {
      transactionId: string;
      transactionData: NewTransactionProps;
    }) => {
      return updateTransactionById(transactionId, transactionData);
    },
    onSuccess: (data, variables) => {
      console.log("Transaction updated successfully:");

      // Invalidate transaction queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      // Invalidate specific transaction query
      queryClient.invalidateQueries({
        queryKey: ["transaction", variables.transactionId],
      });

      // Also invalidate profile queries since balance might change
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.transactionData.profileId],
      });

      Alert.alert("Success!", "Transaction updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error) => {
      console.error("Error updating transaction:", error);
      Alert.alert("Error", "There was an error updating the transaction.");
    },
  });
};
