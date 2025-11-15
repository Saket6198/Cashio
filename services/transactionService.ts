import { BASE_URL } from "@/constants";
import axios from "axios";

interface FetchTransactionsParams {
  profileId: string;
  page?: number;
  limit?: number;
}


export const createTransaction = async (transactionData: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/newTransaction`,
      transactionData
    );
    console.log("Transaction created with response:", response.data);
    return response.data;
  } catch (err: any) {
    console.log("Error creating transaction:", err);
    throw err;
  }
};

export const fetchAllTransactionsByProfile = async ({profileId, page=1, limit=10}: FetchTransactionsParams) => {
  try{
    const response = await axios.get(`${BASE_URL}/user/getAllTransactions/${profileId}`, {
      params: {
        page,
        limit,
      }
    });
    return response?.data;
  } catch (err: any) {
    console.log("Error fetching transactions:", err);
    throw err;
  }
}