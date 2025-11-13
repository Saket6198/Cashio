import { Input } from "@/components/ui/input";
import { SettingsSchema, SettingsType } from "@/schema/settingsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Settings = () => {
  const [showFineStartDatePicker, setShowFineStartDatePicker] = useState(false);
  const [showFineEndDatePicker, setShowFineEndDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsType>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: "",
      entityType: "individual",
      rentAmount: 0,
      fineActive: false,
      finePerDay: 0,
      fineStartDate: undefined,
      fineEndDate: undefined,
    },
  });
  const router = useRouter();

  const watchFineActive = watch("fineActive");
  const watchFineStartDate = watch("fineStartDate");
  const watchFineEndDate = watch("fineEndDate");

  const onSubmit = (data: SettingsType) => {
    console.log("Form Data:", data);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaProvider className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="bg-white px-6 py-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-gray-800">Settings</Text>
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center" onPress={() => router.push("/(profile)/newProfile")}>
              <PlusIcon size={20} color="#fff" />
              <Text className="text-white font-medium ml-2">
                Add New Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className="p-6">
          <View className="bg-white rounded-xl shadow-sm p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-6">
              Profile Information
            </Text>

            {/* Name Field */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Name
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    // className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50 focus:border-blue-500 focus:bg-white"
                    placeholder="Enter name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* Entity Type */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Entity Type
              </Text>
              <Controller
                control={control}
                name="entityType"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                        value === "individual"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                      onPress={() => onChange("individual")}
                    >
                      <Text
                        className={`text-center font-medium ${
                          value === "individual"
                            ? "text-blue-700"
                            : "text-gray-600"
                        }`}
                      >
                        Individual
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                        value === "hotel"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                      onPress={() => onChange("hotel")}
                    >
                      <Text
                        className={`text-center font-medium ${
                          value === "hotel" ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        Hotel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.entityType && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.entityType.message}
                </Text>
              )}
            </View>

            {/* Rent Amount */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Rent Amount
              </Text>
              <Controller
                control={control}
                name="rentAmount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    // className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50 focus:border-blue-500 focus:bg-white"
                    placeholder="Enter rent amount"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    value={value?.toString()}
                  />
                )}
              />
              {errors.rentAmount && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.rentAmount.message}
                </Text>
              )}
            </View>

            {/* Fine Amount Toggle */}
            <View className="mb-5">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-medium text-gray-700">
                  Fine Amount
                </Text>
                <Controller
                  control={control}
                  name="fineActive"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                      thumbColor={value ? "#ffffff" : "#ffffff"}
                    />
                  )}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Enable fine charges for late payments
              </Text>
            </View>

            {/* Fine Details - Conditional */}
            {watchFineActive && (
              <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <Text className="text-base font-medium text-blue-900 mb-4">
                  Fine Configuration
                </Text>

                {/* Fine Per Day */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Fine Per Day
                  </Text>
                  <Controller
                    control={control}
                    name="finePerDay"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        // className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white focus:border-blue-500"
                        placeholder="Enter fine amount per day"
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                        value={value?.toString()}
                      />
                    )}
                  />
                  {errors.finePerDay && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.finePerDay.message}
                    </Text>
                  )}
                </View>

                {/* Fine Start Date */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Fine Start Date
                  </Text>
                  <TouchableOpacity
                    className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                    onPress={() => setShowFineStartDatePicker(true)}
                  >
                    <Text className="text-base text-gray-700">
                      {formatDate(watchFineStartDate)}
                    </Text>
                  </TouchableOpacity>

                  {showFineStartDatePicker && (
                    <DateTimePicker
                      value={watchFineStartDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        setShowFineStartDatePicker(Platform.OS === "ios");
                        if (selectedDate) {
                          setValue("fineStartDate", selectedDate);
                        }
                      }}
                    />
                  )}
                </View>

                {/* Fine End Date */}
                <View className="mb-2">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Fine End Date
                  </Text>
                  <TouchableOpacity
                    className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                    onPress={() => setShowFineEndDatePicker(true)}
                  >
                    <Text className="text-base text-gray-700">
                      {formatDate(watchFineEndDate)}
                    </Text>
                  </TouchableOpacity>

                  {showFineEndDatePicker && (
                    <DateTimePicker
                      value={watchFineEndDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        setShowFineEndDatePicker(Platform.OS === "ios");
                        if (selectedDate) {
                          setValue("fineEndDate", selectedDate);
                        }
                      }}
                    />
                  )}
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-blue-600 rounded-lg py-4 mt-8"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white text-center font-semibold text-base">
                Save Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Settings;
