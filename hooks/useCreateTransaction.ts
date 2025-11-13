import { NewTransactionProps } from "@/schema/newTransactionSchema";
import { createTransaction } from "@/services/transactionService";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useCreateTransaction = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (transactionData: NewTransactionProps) => {
      createTransaction(transactionData);
    },
    onSuccess: (data) => {
      console.log("Transaction created successfully:"); 
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
