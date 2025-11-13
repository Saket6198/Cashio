import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import {
  newTransactionSchema,
  type NewTransactionProps,
} from "@/schema/newTransactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  CheckCircle,
  CurrencyInr,
  DeviceMobile,
  MoneyIcon,
  NotePencil,
  Wallet,
  Warning,
  X,
} from "phosphor-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const AddTransaction = () => {
  const [amountFocused, setAmountFocused] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const { data, mutate, isSuccess, isPending } = useCreateTransaction();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewTransactionProps>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      profileId: "6734e9b1a4f9b27c8a9c5b72", // You'll get this from your store/params
      amount: 0,
      paymentType: "cash",
      note: "",
    },
  });

  const paymentType = watch("paymentType");
  const amount = watch("amount");

  const onSubmit = (transactionData: NewTransactionProps) => {
    console.log("Transaction Data:", transactionData);
    mutate(transactionData);
  };

  const formatAmount = (value: number) => {
    return value.toLocaleString("en-IN");
  };

  // Quick amount buttons
  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={["#1e40af", "#3b82f6", "#60a5fa"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 py-8 rounded-b-3xl"
          style={{ elevation: 8 }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-white/20 p-3 rounded-2xl mr-3">
                <Wallet size={28} weight="duotone" color="#fff" />
              </View>
              <View>
                <Text className="text-white text-2xl font-bold">
                  Add Transaction
                </Text>
                <Text className="text-blue-100 text-sm mt-1">
                  Record a new payment
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-full active:bg-white/30"
            >
              <X size={24} color="#fff" weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Amount Display Card */}
          <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mt-4 border border-white/20">
            <Text className="text-blue-100 text-sm mb-2">Total Amount</Text>
            <View className="flex-row items-center">
              <CurrencyInr size={36} color="#fff" weight="bold" />
              <Text className="text-white text-5xl font-bold ml-2">
                {formatAmount(amount || 0)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View className="px-6 mt-6">
          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-bold mb-3 text-lg">
              Enter Amount
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View
                    className={`flex-row items-center bg-white rounded-2xl px-5 py-4 border-2 shadow-lg ${
                      amountFocused
                        ? "border-blue-500"
                        : errors.amount
                          ? "border-red-300"
                          : "border-gray-200"
                    }`}
                    style={{ elevation: 4 }}
                  >
                    <View className="bg-blue-50 p-2 rounded-lg">
                      <CurrencyInr size={24} color="#3b82f6" weight="duotone" />
                    </View>
                    <TextInput
                      className="flex-1 ml-4 text-gray-800 text-2xl font-semibold"
                      placeholder="0"
                      placeholderTextColor="#cbd5e1"
                      value={value?.toString()}
                      onChangeText={(text) => {
                        const numValue = text.replace(/[^0-9]/g, "");
                        onChange(Number(numValue) || 0);
                      }}
                      keyboardType="numeric"
                      onFocus={() => setAmountFocused(true)}
                      onBlur={() => setAmountFocused(false)}
                    />
                  </View>
                  {errors.amount && (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Warning size={16} color="#ef4444" weight="fill" />
                      <Text className="text-red-500 text-sm ml-1 font-medium">
                        {errors.amount.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />

            {/* Quick Amount Buttons */}
            <View className="flex-row flex-wrap gap-2 mt-4">
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 active:bg-blue-100"
                  onPress={() => setValue("amount", quickAmount)}
                >
                  <Text className="text-blue-600 font-semibold">
                    +₹{quickAmount.toLocaleString("en-IN")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Type Selection */}
          <View className="mb-6">
            <Text className="text-gray-700 font-bold mb-3 text-lg">
              Payment Method
            </Text>
            <Controller
              control={control}
              name="paymentType"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-3">
                  {/* Cash Option */}
                  <Pressable
                    className="flex-1"
                    onPress={() => onChange("cash")}
                  >
                    <LinearGradient
                      colors={
                        value === "cash"
                          ? ["#10b981", "#059669"]
                          : ["#ffffff", "#f9fafb"]
                      }
                      className={`rounded-2xl p-5 border-2 ${
                        value === "cash"
                          ? "border-green-500"
                          : "border-gray-200"
                      }`}
                      style={{ elevation: value === "cash" ? 6 : 2 }}
                    >
                      <View className="items-center">
                        <View
                          className={`p-3 rounded-full mb-3 ${
                            value === "cash" ? "bg-white/20" : "bg-green-50"
                          }`}
                        >
                          <MoneyIcon
                            size={32}
                            color={value === "cash" ? "#fff" : "#10b981"}
                            weight={value === "cash" ? "fill" : "duotone"}
                          />
                        </View>
                        <Text
                          className={`font-bold text-base ${
                            value === "cash" ? "text-white" : "text-gray-700"
                          }`}
                        >
                          Cash
                        </Text>
                        {value === "cash" && (
                          <View className="absolute top-2 right-2">
                            <CheckCircle size={24} color="#fff" weight="fill" />
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </Pressable>

                  {/* Online Option */}
                  <Pressable
                    className="flex-1"
                    onPress={() => onChange("online")}
                  >
                    <LinearGradient
                      colors={
                        value === "online"
                          ? ["#8b5cf6", "#7c3aed"]
                          : ["#ffffff", "#f9fafb"]
                      }
                      className={`rounded-2xl p-5 border-2 ${
                        value === "online"
                          ? "border-purple-500"
                          : "border-gray-200"
                      }`}
                      style={{ elevation: value === "online" ? 6 : 2 }}
                    >
                      <View className="items-center">
                        <View
                          className={`p-3 rounded-full mb-3 ${
                            value === "online" ? "bg-white/20" : "bg-purple-50"
                          }`}
                        >
                          <DeviceMobile
                            size={32}
                            color={value === "online" ? "#fff" : "#8b5cf6"}
                            weight={value === "online" ? "fill" : "duotone"}
                          />
                        </View>
                        <Text
                          className={`font-bold text-base ${
                            value === "online" ? "text-white" : "text-gray-700"
                          }`}
                        >
                          Online
                        </Text>
                        {value === "online" && (
                          <View className="absolute top-2 right-2">
                            <CheckCircle size={24} color="#fff" weight="fill" />
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </Pressable>
                </View>
              )}
            />
          </View>

          {/* Description/Note */}
          <View className="mb-6">
            <Text className="text-gray-700 font-bold mb-3 text-lg">
              Description
            </Text>
            <Controller
              control={control}
              name="note"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View
                    className={`bg-white rounded-2xl px-5 py-4 border-2 shadow-lg ${
                      errors.note ? "border-red-300" : "border-gray-200"
                    }`}
                    style={{ elevation: 4 }}
                  >
                    <View className="flex-row items-start">
                      <View className="bg-amber-50 p-2 rounded-lg mt-1">
                        <NotePencil
                          size={20}
                          color="#f59e0b"
                          weight="duotone"
                        />
                      </View>
                      <View className="flex-1 ml-3">
                        <TextInput
                          className="text-gray-800 text-base"
                          placeholder="E.g., Monthly rent, Advance payment..."
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          multiline
                          numberOfLines={3}
                          maxLength={60}
                          textAlignVertical="top"
                          style={{ minHeight: 70 }}
                        />
                        <Text className="text-gray-400 text-xs mt-2 text-right">
                          {value?.length || 0}/60
                        </Text>
                      </View>
                    </View>
                  </View>
                  {errors.note && (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Warning size={16} color="#ef4444" weight="fill" />
                      <Text className="text-red-500 text-sm ml-1 font-medium">
                        {errors.note.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          </View>

          {/* Summary Card */}
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-100">
            <Text className="text-blue-900 font-bold text-base mb-3">
              Transaction Summary
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-600 text-sm">Amount</Text>
                <Text className="text-gray-900 font-bold text-lg">
                  ₹{formatAmount(amount || 0)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-600 text-sm">Payment Method</Text>
                <View className="flex-row items-center">
                  {paymentType === "cash" ? (
                    <MoneyIcon size={16} color="#10b981" weight="fill" />
                  ) : (
                    <DeviceMobile size={16} color="#8b5cf6" weight="fill" />
                  )}
                  <Text className="text-gray-900 font-semibold text-sm ml-2 capitalize">
                    {paymentType}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              className="rounded-2xl py-5 shadow-xl active:shadow-lg"
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#1e40af", "#3b82f6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl py-1 flex-row items-center justify-center"
                style={{ elevation: 8 }}
              >
                <CheckCircle size={28} color="#fff" weight="fill" />
                <Text className="text-white font-bold text-xl ml-3">
                  Save Transaction
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AddTransaction;
