import { NewTransactionProps } from "@/schema/newTransactionSchema";
import {
  createTransaction,
  deleteTransactionById,
} from "@/services/transactionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useCreateTransaction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: NewTransactionProps) => {
      createTransaction(transactionData);
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
  return useMutation({
    mutationFn: async (transactionId: string) => {
      return deleteTransactionById(transactionId);
    },
  });
};
