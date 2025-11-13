import {
  newProfileSchema,
  type NewProfileType,
} from "@/schema/newProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import {
  Buildings,
  CalendarBlank,
  CheckCircle,
  CurrencyInr,
  NotePencil,
  User,
  Warning,
} from "phosphor-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateProfile } from "../../hooks/useCreateProfile";

const NewProfile = () => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewProfileType>({
    resolver: zodResolver(newProfileSchema),
    defaultValues: {
      name: "",
      entityType: "individual",
      rentAmount: 0,
      finePerDay: 0,
      fineActive: false,
      note: "",
    },
  });

  const fineActive = watch("fineActive");
  const entityType = watch("entityType");
  const { mutate, isPending, isError, error, isSuccess } = useCreateProfile();

  useEffect(() => {
    if (isSuccess) {
      router.replace("/(main)/home");
    }
  }, [isSuccess]);

  const onSubmit = (data: NewProfileType) => {
    mutate(data, {
      onSuccess: () => {
        Alert.alert("Success", "Profile created successfully!");
      },
      onError: (err: any) => {
        Alert.alert(
          "Error",
          err?.response?.data?.message || "Failed to create profile"
        );
      },
    });
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text className="text-3xl font-bold text-gray-800 px-6 py-4">
              Create New Profile
            </Text>
          </View>
          <View className="px-6 mt-6">
            {/* Name Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2 text-base">
                Profile Name
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                      <User size={20} color="#6b7280" weight="duotone" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-800 text-base"
                        placeholder="Enter profile name"
                        placeholderTextColor="#9ca3af"
                        value={value}
                        onChangeText={onChange}
                        maxLength={18}
                      />
                    </View>
                    {errors.name && (
                      <View className="flex-row items-center mt-2">
                        <Warning size={14} color="#ef4444" weight="fill" />
                        <Text className="text-red-500 text-xs ml-1">
                          {errors.name.message}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Entity Type Selection */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-3 text-base">
                Entity Type
              </Text>
              <Controller
                control={control}
                name="entityType"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className={`flex-1 flex-row items-center justify-center py-4 rounded-xl border-2 ${
                        value === "individual"
                          ? "bg-blue-50 border-blue-500"
                          : "bg-white border-gray-200"
                      }`}
                      onPress={() => onChange("individual")}
                    >
                      <User
                        size={24}
                        color={value === "individual" ? "#3b82f6" : "#6b7280"}
                        weight={value === "individual" ? "fill" : "regular"}
                      />
                      <Text
                        className={`ml-2 font-semibold ${
                          value === "individual"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        Individual
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`flex-1 flex-row items-center justify-center py-4 rounded-xl border-2 ${
                        value === "hotel"
                          ? "bg-blue-50 border-blue-500"
                          : "bg-white border-gray-200"
                      }`}
                      onPress={() => onChange("hotel")}
                    >
                      <Buildings
                        size={24}
                        color={value === "hotel" ? "#3b82f6" : "#6b7280"}
                        weight={value === "hotel" ? "fill" : "regular"}
                      />
                      <Text
                        className={`ml-2 font-semibold ${
                          value === "hotel" ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        Hotel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            {/* Rent Amount */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2 text-base">
                Monthly Rent Amount
              </Text>
              <Controller
                control={control}
                name="rentAmount"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                      <CurrencyInr size={20} color="#6b7280" weight="duotone" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-800 text-base"
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        value={value?.toString()}
                        onChangeText={(text) => onChange(Number(text) || 0)}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.rentAmount && (
                      <View className="flex-row items-center mt-2">
                        <Warning size={14} color="#ef4444" weight="fill" />
                        <Text className="text-red-500 text-xs ml-1">
                          {errors.rentAmount.message}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Fine Settings Card */}
            <View className="mb-6 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="bg-amber-100 p-2 rounded-lg mr-3">
                    <Warning size={20} color="#f59e0b" weight="fill" />
                  </View>
                  <Text className="text-gray-800 font-semibold text-base">
                    Late Payment Fine
                  </Text>
                </View>
                <Controller
                  control={control}
                  name="fineActive"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{ false: "#e5e7eb", true: "#93c5fd" }}
                      thumbColor={value ? "#3b82f6" : "#f3f4f6"}
                    />
                  )}
                />
              </View>

              {fineActive && (
                <>
                  {/* Fine Per Day */}
                  <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">
                      Fine Per Day
                    </Text>
                    <Controller
                      control={control}
                      name="finePerDay"
                      render={({ field: { onChange, value } }) => (
                        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                          <CurrencyInr size={18} color="#6b7280" />
                          <TextInput
                            className="flex-1 ml-2 text-gray-800"
                            placeholder="0"
                            placeholderTextColor="#9ca3af"
                            value={value?.toString()}
                            onChangeText={(text) => onChange(Number(text) || 0)}
                            keyboardType="numeric"
                          />
                        </View>
                      )}
                    />
                  </View>

                  {/* Fine Start Date */}
                  <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">
                      Fine Start Date
                    </Text>
                    <Controller
                      control={control}
                      name="fineStartDate"
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TouchableOpacity
                            className="flex-row items-center bg-gray-50 rounded-lg px-3 py-3 border border-gray-200"
                            onPress={() => setShowStartDatePicker(true)}
                          >
                            <CalendarBlank size={18} color="#6b7280" />
                            <Text className="flex-1 ml-2 text-gray-800">
                              {formatDate(value)}
                            </Text>
                          </TouchableOpacity>
                          {showStartDatePicker && (
                            <DateTimePicker
                              value={value || new Date()}
                              mode="date"
                              display={
                                Platform.OS === "ios" ? "spinner" : "default"
                              }
                              onChange={(event, selectedDate) => {
                                setShowStartDatePicker(false);
                                if (selectedDate) onChange(selectedDate);
                              }}
                            />
                          )}
                        </>
                      )}
                    />
                  </View>

                  {/* Fine End Date */}
                  <View>
                    <Text className="text-gray-600 text-sm mb-2">
                      Fine End Date
                    </Text>
                    <Controller
                      control={control}
                      name="fineEndDate"
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TouchableOpacity
                            className="flex-row items-center bg-gray-50 rounded-lg px-3 py-3 border border-gray-200"
                            onPress={() => setShowEndDatePicker(true)}
                          >
                            <CalendarBlank size={18} color="#6b7280" />
                            <Text className="flex-1 ml-2 text-gray-800">
                              {formatDate(value)}
                            </Text>
                          </TouchableOpacity>
                          {showEndDatePicker && (
                            <DateTimePicker
                              value={value || new Date()}
                              mode="date"
                              display={
                                Platform.OS === "ios" ? "spinner" : "default"
                              }
                              onChange={(event, selectedDate) => {
                                setShowEndDatePicker(false);
                                if (selectedDate) onChange(selectedDate);
                              }}
                            />
                          )}
                        </>
                      )}
                    />
                  </View>
                </>
              )}
            </View>

            {/* Note */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2 text-base">
                Additional Notes
              </Text>
              <Controller
                control={control}
                name="note"
                render={({ field: { onChange, value } }) => (
                  <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                    <View className="flex-row items-start">
                      <NotePencil
                        size={20}
                        color="#6b7280"
                        weight="duotone"
                        style={{ marginTop: 2 }}
                      />
                      <TextInput
                        className="flex-1 ml-3 text-gray-800 text-base"
                        placeholder="Add any additional information..."
                        placeholderTextColor="#9ca3af"
                        value={value}
                        onChangeText={onChange}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={{ minHeight: 80 }}
                      />
                    </View>
                  </View>
                )}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 shadow-lg flex-row items-center justify-center ${
                isPending ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700"
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <CheckCircle size={24} color="#fff" weight="fill" />
              )}
              <Text className="text-white font-bold text-lg ml-2">
                {isPending ? "Creating Profile..." : "Create Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default NewProfile;
