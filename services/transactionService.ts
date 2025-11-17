import { BASE_URL } from "@/constants";
import { NewTransactionProps } from "@/schema/newTransactionSchema";
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

export const fetchAllTransactionsByProfile = async ({
  profileId,
  page = 1,
  limit = 10,
}: FetchTransactionsParams) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/getAllTransactions/${profileId}`,
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response?.data;
  } catch (err: any) {
    console.log("Error fetching transactions:", err);
    throw err;
  }
};

export const deleteTransactionById = async (transactionId: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/user/transaction/${transactionId}`
    );
    return response?.data;
  } catch (err: any) {
    console.log("Error deleting transaction:", err);
    throw err;
  }
};

export const fetchTransactionById = async (transactionId: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/getTransaction/${transactionId}`
    );
    return response?.data;
  } catch (err: any) {
    console.log("Error fetching transaction:", err);
    throw err;
  }
};

export const updateTransactionById = async (
  transactionId: string,
  transactionData: NewTransactionProps
) => {
  try {
    const url = `${BASE_URL}/user/updateTransaction/${transactionId}`;

    const response = await axios.patch(url, transactionData);
    return response?.data;
  } catch (err: any) {
    console.log("Error updating transaction:", err);
    throw err;
  }
};
