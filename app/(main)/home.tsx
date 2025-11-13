import { transactions } from "@/constants/dummyData";
import { useRouter } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const Home = () => {
  const router = useRouter();
  const totalBalance = 120000;
  const paidAmount = 45000;
  const remainingBalance = totalBalance - paidAmount;

  // Calculate percentages
  const paidPercentage = ((paidAmount / totalBalance) * 100).toFixed(1);
  const remainingPercentage = ((remainingBalance / totalBalance) * 100).toFixed(
    1
  );

  const pieData = [
    {
      value: paidAmount,
      color: "#10b981",
      text: `${paidPercentage}%`,
    },
    {
      value: remainingBalance,
      color: "#0000ff",
      text: `${remainingPercentage}%`,
    },
  ];

  // Get the 5 latest transactions
  const latestTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString("en-IN")}`;
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="flex flex-row justify-between items-center px-6 py-4 bg-gray-100">
        <Text className="flex justify-center items-center font-bold text-2xl">
          Sangam Restaurant
        </Text>
        <TouchableOpacity
          className="items-center justify-center"
          onPress={() => router.push({ pathname: "/(transactions)/new" })}
        >
          <PlusIcon size={32} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Header */}
      {/* <View className="bg-blue-600 px-6 py-8 pb-6">
        <Text className="text-white text-2xl font-bold">Sangam Restaurant</Text>
        <Text className="text-blue-100 text-sm mt-1">
          Rental Payment Tracker
        </Text>
      </View> */}

      {/* Pie Chart Section */}
      <View className="items-center py-8 bg-gray-50">
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Rent Balance Overview
        </Text>
        <Text className="text-sm text-gray-600 mb-6">
          Total Rent: {formatAmount(totalBalance.toString())}
        </Text>

        <PieChart
          data={pieData}
          donut
          radius={120}
          innerRadius={80}
          centerLabelComponent={() => {
            return (
              <View className="items-center">
                <Text className="text-2xl font-bold text-red-600">
                  {formatAmount(remainingBalance.toString())}
                </Text>
                <Text className="text-xs text-gray-600 mt-1">Remaining</Text>
              </View>
            );
          }}
        />

        {/* Legend */}
        <View className="flex-row mt-6 gap-6">
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-blue-700 rounded mr-2" />
            <Text className="text-sm text-gray-700">
              Paid ({formatAmount(paidAmount.toString())})
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-red-500 rounded mr-2" />
            <Text className="text-sm text-gray-700">
              Due ({formatAmount(remainingBalance.toString())})
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Transactions */}
      <View className="px-6 py-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Recent Transactions
        </Text>

        {latestTransactions.map((transaction, index) => (
          <View
            key={transaction.id}
            className={`flex-row justify-between items-center py-4 ${
              index !== latestTransactions.length - 1
                ? "border-b border-gray-200"
                : ""
            }`}
          >
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-800">
                {transaction.name}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {formatDate(transaction.createdAt)}
              </Text>
            </View>
            <View className="items-end">
              <Text
                className={`text-base font-semibold ${
                  transaction.typeOfPayment === "online"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {formatAmount(transaction.amount)}
              </Text>
              <Text className="text-xs text-gray-500 mt-1 capitalize">
                {transaction.typeOfPayment}
              </Text>
            </View>
          </View>
        ))}

        {/* See More Button */}
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-3 mt-6 items-center"
          onPress={() => {
            // router.push("/(main)/transactions");
            console.log("Navigate to all transactions");
          }}
        >
          <Text className="text-white font-semibold text-base">
            See All Transactions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      {/* <View className="mx-6 mb-8 bg-blue-50 rounded-lg p-5 border border-blue-200">
        <Text className="text-sm font-semibold text-blue-900 mb-3">
          Payment Summary
        </Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-700">Total Rent Amount</Text>
          <Text className="text-sm font-semibold text-gray-900">
            {formatAmount(totalBalance.toString())}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-700">Amount Paid</Text>
          <Text className="text-sm font-semibold text-green-600">
            {formatAmount(paidAmount.toString())}
          </Text>
        </View>
        <View className="border-t border-blue-300 my-2" />
        <View className="flex-row justify-between">
          <Text className="text-sm font-semibold text-gray-700">
            Balance Due
          </Text>
          <Text className="text-base font-bold text-red-600">
            {formatAmount(remainingBalance.toString())}
          </Text>
        </View>
      </View> */}
    </ScrollView>
  );
};

export default Home;
