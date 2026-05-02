import { useQuery } from "@tanstack/react-query";
import { fetchAllTransactionsByProfile } from "../services/transactionService";

interface UseTransactionsParams {
  profileId: string;
  page?: number;
  limit?: number;
}

export const useFetchTransactions = ({
  profileId,
  page = 1,
  limit = 10,
}: UseTransactionsParams) => {
  return useQuery<{ transactions: any[]; pagination: any }, Error>({
    queryKey: ["transactions", profileId, page, limit],
    queryFn: () => fetchAllTransactionsByProfile({ profileId, page, limit }),
    enabled: !!profileId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
