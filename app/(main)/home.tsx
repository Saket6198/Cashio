import TransactionShimmer from "@/components/TransactionShimmer";
import { useFetchTransactions } from "@/hooks/useFetchTransactions";
import { useBalanceStore } from "@/store/balanceStore";
import { useProfileStore } from "@/store/userProfile";
import { useRouter } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";

const Home = () => {
  const { activeProfile, profileName } = useProfileStore();
  const {
    currentBalance,
    isLoading,
    fetchBalance,
    getStatusColor,
    refreshBalance,
  } = useBalanceStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const router = useRouter();

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useFetchTransactions({
    profileId: activeProfile || "",
    page: 1,
    limit: 5,
  });

  const pieChartAnim = useRef(new Animated.Value(0)).current;
  const transactionsAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (activeProfile) {
      fetchBalance(activeProfile);
    }
  }, [activeProfile, fetchBalance]);

  useEffect(() => {
    if (currentBalance) {
      Animated.spring(pieChartAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [currentBalance]);

  useEffect(() => {
    if (transactionsData?.transactions) {
      Animated.spring(transactionsAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [transactionsData]);

  const onRefresh = async () => {
    if (!activeProfile) return;
    setRefreshing(true);
    try {
      await Promise.all([refreshBalance(activeProfile), refetchTransactions()]);
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const totalBalance = currentBalance?.rentAmount || 0;
  const paidAmount = currentBalance?.totalPaid || 0;
  const dueAmount = currentBalance?.due || 0;
  const fineAmount = currentBalance?.fineAmount || 0;
  const statusColor = getStatusColor();

  const paidPercentage = ((paidAmount / totalBalance) * 100).toFixed(1);
  const duePercentage = ((dueAmount / totalBalance) * 100).toFixed(1);
  const finePercentage =
    fineAmount > 0 ? ((fineAmount / totalBalance) * 100).toFixed(1) : "0";

  const pieData = [];

  if (paidAmount > 0) {
    pieData.push({
      value: paidAmount,
      color: "#10b981", // Green for paid
      text: `${paidPercentage}%`,
      label: "Paid",
    });
  }

  if (dueAmount > 0) {
    pieData.push({
      value: dueAmount,
      color: "#3b82f6", // Blue for due
      text: `${duePercentage}%`,
      label: "Due",
    });
  }

  if (fineAmount > 0) {
    pieData.push({
      value: fineAmount,
      color: "#ef4444", // Red for fine
      text: `${finePercentage}%`,
      label: "Fine",
    });
  }

  if (pieData.length === 0) {
    pieData.push({
      value: totalBalance,
      color: "#6b7280", // Gray for no data
      text: "100%",
      label: "Pending",
    });
  }

  const latestTransactions = transactionsData?.transactions || [];

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: string | number) => {
    if (!amount) return "₹0";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return `₹${numAmount.toLocaleString("en-IN")}`;
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3b82f6"]}
          tintColor="#3b82f6"
        />
      }
    >
      <View className="flex flex-row justify-between items-center px-6 py-4 bg-gray-100">
        <Text className="flex justify-center items-center font-bold text-2xl">
          {profileName ? profileName : "Home"}
        </Text>
        <TouchableOpacity
          className="items-center justify-center"
          onPress={() =>
            router.push({ pathname: "/(transactions)/newTransaction" })
          }
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

      <Animated.View
        className="items-center py-8 bg-gray-50"
        style={{
          opacity: pieChartAnim,
          transform: [
            {
              scale: pieChartAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        }}
      >
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
            const totalOutstanding = dueAmount + fineAmount;
            return (
              <View className="items-center">
                <Text
                  className="text-2xl font-bold"
                  style={{
                    color:
                      totalOutstanding > 0
                        ? fineAmount > 0
                          ? "#ef4444"
                          : "#3b82f6"
                        : "#10b981",
                  }}
                >
                  ₹{totalOutstanding.toLocaleString("en-IN")}
                </Text>
                <Text className="text-xs text-gray-600 mt-1 text-center">
                  {totalOutstanding > 0 ? "Outstanding" : "Paid"}
                </Text>
                {fineAmount > 0 && (
                  <Text className="text-xs text-red-600 mt-1 text-center">
                    Fine: ₹{fineAmount.toLocaleString("en-IN")}
                  </Text>
                )}
              </View>
            );
          }}
        />
        <View className="mt-6 space-y-2">
          {paidAmount > 0 && (
            <View className="flex-row items-center justify-center">
              <View
                className="w-5 h-5 bg-green-500 rounded-full mr-3 border-2 border-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              />
              <Text className="text-sm font-semibold text-green-700">
                Paid: ₹{paidAmount.toLocaleString("en-IN")} ({paidPercentage}%)
              </Text>
            </View>
          )}

          {dueAmount > 0 && (
            <View className="flex-row items-center justify-center">
              <View
                className="w-5 h-5 bg-blue-500 rounded-full mr-3 border-2 border-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              />
              <Text className="text-sm font-semibold text-blue-700">
                Due: ₹{dueAmount.toLocaleString("en-IN")} ({duePercentage}%)
              </Text>
            </View>
          )}

          {fineAmount > 0 && (
            <View className="flex-row items-center justify-center">
              <View
                className="w-5 h-5 bg-red-500 rounded-full mr-3 border-2 border-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              />
              <Text className="text-sm font-semibold text-red-700">
                Fine: ₹{fineAmount.toLocaleString("en-IN")} ({finePercentage}%)
              </Text>
            </View>
          )}

          {pieData.length > 1 && (
            <View className="mt-3 pt-2 border-t border-gray-200">
              <Text className="text-center text-sm font-bold text-gray-800">
                Total Rent: ₹{totalBalance.toLocaleString("en-IN")}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      <Animated.View
        className="px-6 py-6"
        style={{
          opacity: transactionsAnim,
          transform: [
            {
              translateY: transactionsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Recent Transactions
        </Text>

        {isLoadingTransactions ? (
          <TransactionShimmer />
        ) : latestTransactions.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-gray-500 text-center">
              No transactions yet
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Add your first transaction to get started
            </Text>
          </View>
        ) : (
          latestTransactions.map((transaction: any, index: number) => (
            <View
              key={transaction._id || transaction.id || index}
              className={`flex-row justify-between items-center py-4 ${
                index !== latestTransactions.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-800">
                  {transaction.note || "Payment"}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  {formatDate(transaction.created || transaction.createdAt)}
                </Text>
              </View>
              <View className="items-end">
                <Text
                  className={`text-base font-semibold ${
                    transaction.paymentType === "online"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  ₹{transaction.amount?.toLocaleString("en-IN") || "0"}
                </Text>
                <Text className="text-xs text-gray-500 mt-1 capitalize">
                  {transaction.paymentType || "cash"}
                </Text>
              </View>
            </View>
          ))
        )}
      </Animated.View>

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
