import { useFetchTransactions } from "@/hooks/useFetchTransactions";
import { useProfileStore } from "@/store/userProfile";
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Transaction {
  _id: string;
  profileId: string;
  amount: number;
  paymentType: "cash" | "online";
  note: string;
  created: string;
  createdAt: string;
  updatedAt: string;
}

// Shimmer Loading Component
const ShimmerCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Animated.View
            style={{ opacity }}
            className="bg-gray-200 rounded h-5 w-24 mb-2"
          />
          <Animated.View
            style={{ opacity }}
            className="bg-gray-200 rounded h-4 w-full mb-1"
          />
          <Animated.View
            style={{ opacity }}
            className="bg-gray-200 rounded h-4 w-3/4"
          />
        </View>
        <Animated.View
          style={{ opacity }}
          className="bg-gray-200 rounded-full h-7 w-16"
        />
      </View>
      <View className="pt-2 border-t border-gray-100">
        <Animated.View
          style={{ opacity }}
          className="bg-gray-200 rounded h-3 w-32"
        />
      </View>
    </View>
  );
};

const ShimmerLoader = () => {
  return (
    <View className="pt-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <ShimmerCard key={item} />
      ))}
    </View>
  );
};

const Records = () => {
  const { activeProfile } = useProfileStore();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { data, isPending, isSuccess, error, refetch, isFetching } =
    useFetchTransactions({
      profileId: activeProfile,
      page: currentPage,
      limit,
    });

  const transactions = data?.transactions || [];
  const pagination = data?.pagination || {};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderTransactionCard = (transaction: Transaction) => (
    <View
      key={transaction._id}
      className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
      style={{
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {formatAmount(transaction.amount)}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {transaction.note}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            transaction.paymentType === "online"
              ? "bg-blue-100"
              : "bg-green-100"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              transaction.paymentType === "online"
                ? "text-blue-700"
                : "text-green-700"
            }`}
          >
            {transaction.paymentType === "online" ? "Online" : "Cash"}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
        <Text className="text-xs text-gray-500">
          {formatDate(transaction.created)}
        </Text>
      </View>
    </View>
  );

  if (!activeProfile) {
    return (
      <SafeAreaProvider className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">📋</Text>
          <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
            No Profile Selected
          </Text>
          <Text className="text-gray-600 text-center">
            Please select a profile to view transactions
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gray-200 px-6 pt-4 pb-3 shadow-sm border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          Transaction Records
        </Text>
        {pagination.totalTransactions !== undefined && (
          <Text className="text-sm text-gray-600">
            {pagination.totalTransactions} total transaction
            {pagination.totalTransactions !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      {/* Content with proper spacing */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingTop: isPending ? 0 : 16,
          paddingBottom: 100, // Extra space for custom tabs
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isPending}
            onRefresh={refetch}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        {isPending ? (
          <ShimmerLoader />
        ) : error ? (
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-4">⚠️</Text>
            <Text className="text-gray-900 text-lg font-semibold mb-2">
              Something went wrong
            </Text>
            <Text className="text-gray-500 text-center">
              Unable to load transactions. Please try again.
            </Text>
          </View>
        ) : isSuccess && transactions.length > 0 ? (
          <>
            {transactions.map((transaction: Transaction) =>
              renderTransactionCard(transaction)
            )}

            {/* Revamped Pagination Controls */}
            {pagination.totalPages > 1 && (
              <View className="mt-4 mb-4">
                {/* Page Info Card */}
                <View className="bg-white rounded-lg px-4 py-3 mb-3 border border-gray-200">
                  <View className="flex-row items-center justify-center">
                    <Text className="text-sm text-gray-600">
                      Page{" "}
                      <Text className="font-bold text-gray-900">
                        {currentPage}
                      </Text>{" "}
                      of{" "}
                      <Text className="font-bold text-gray-900">
                        {pagination.totalPages}
                      </Text>
                    </Text>
                    <Text className="text-gray-400 mx-2">•</Text>
                    <Text className="text-sm text-gray-600">
                      Showing{" "}
                      <Text className="font-semibold text-gray-900">
                        {transactions.length}
                      </Text>{" "}
                      of{" "}
                      <Text className="font-semibold text-gray-900">
                        {pagination.totalTransactions}
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* Navigation Buttons */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`flex-1 flex-row items-center justify-center py-3.5 rounded-lg ${
                      currentPage === 1
                        ? "bg-gray-100 border border-gray-200"
                        : "bg-blue-600"
                    }`}
                    activeOpacity={0.7}
                    style={{
                      elevation: currentPage === 1 ? 0 : 2,
                      shadowColor: "#3b82f6",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: currentPage === 1 ? 0 : 0.2,
                      shadowRadius: 3,
                    }}
                  >
                    <CaretLeftIcon
                      size={18}
                      color={currentPage === 1 ? "#9ca3af" : "#fff"}
                      weight="bold"
                    />
                    <Text
                      className={`ml-2 font-semibold ${
                        currentPage === 1 ? "text-gray-400" : "text-white"
                      }`}
                    >
                      Previous
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleNextPage}
                    disabled={currentPage === pagination.totalPages}
                    className={`flex-1 flex-row items-center justify-center py-3.5 rounded-lg ${
                      currentPage === pagination.totalPages
                        ? "bg-gray-100 border border-gray-200"
                        : "bg-blue-600"
                    }`}
                    activeOpacity={0.7}
                    style={{
                      elevation: currentPage === pagination.totalPages ? 0 : 2,
                      shadowColor: "#3b82f6",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity:
                        currentPage === pagination.totalPages ? 0 : 0.2,
                      shadowRadius: 3,
                    }}
                  >
                    <Text
                      className={`mr-2 font-semibold ${
                        currentPage === pagination.totalPages
                          ? "text-gray-400"
                          : "text-white"
                      }`}
                    >
                      Next
                    </Text>
                    <CaretRightIcon
                      size={18}
                      color={
                        currentPage === pagination.totalPages
                          ? "#9ca3af"
                          : "#fff"
                      }
                      weight="bold"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-4">📭</Text>
            <Text className="text-gray-900 text-lg font-semibold mb-2">
              No Transactions Found
            </Text>
            <Text className="text-gray-500 text-center">
              No transaction records available for this profile
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Records;
