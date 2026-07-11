import { useUpdateProfile } from "@/hooks/useCreateProfile";
import {
  useFetchProfileById,
  useFetchProfileSettingsByMonthYear,
} from "@/hooks/useFetchProfiles";
import { SettingsSchema, SettingsType } from "@/schema/settingsSchema";
import { useProfileStore } from "@/store/userProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { UserSwitchIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { MONTHS } from "@/constants/dates";
import { formatDate } from "@/utils/dateHelper";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ProfileSettingsHistoryItem } from "@/services/profileServices";

const Settings = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const insets = useSafeAreaInsets();

  const [showFineStartDatePicker, setShowFineStartDatePicker] = useState(false);
  const [showFineEndDatePicker, setShowFineEndDatePicker] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [viewMonth, setViewMonth] = useState(currentMonth);
  const [viewYear, setViewYear] = useState(currentYear);
  const isCurrentPeriod =
    viewMonth === currentMonth && viewYear === currentYear;

  const { activeProfile, setProfileName, setSelectedPeriod } =
    useProfileStore();
  const profileId = activeProfile || "";
  const {
    data,
    isFetching: isProfileLoading,
    isSuccess,
  } = useFetchProfileById(profileId);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const {
    data: periodSettings,
    isLoading: isPeriodLoading,
    isFetching: isPeriodFetching,
    isFetched: isPeriodFetched,
  } = useFetchProfileSettingsByMonthYear(profileId, viewYear, viewMonth);

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
      month: currentMonth,
      year: currentYear,
      rentAmount: 0,
      previous_month_balance: 0,
      gstAmount: 0,
      vatAmount: 0,
      otherCharges: 0,
      note: "",
      fineActive: false,
      finePerDay: 0,
      fineStartDate: undefined,
      fineEndDate: undefined,
    },
  });

  const router = useRouter();

  const calculateGrandTotal = (
    rentAmount: number,
    previous_month_balance: number,
    gstAmount: number,
    vatAmount: number,
    otherCharges: number,
  ) =>
    rentAmount + previous_month_balance + gstAmount + vatAmount + otherCharges;

  const applyBaseProfileFields = (source: any) => {
    setValue("name", source?.name || "");
    setValue("entityType", source?.entityType || "individual");
    setProfileName(source?.name || "");
  };

  const applyChargeFields = (source: ProfileSettingsHistoryItem) => {
    setValue("rentAmount", source?.rentAmount || 0);
    setValue("previous_month_balance", source?.previous_month_balance);
    setValue("gstAmount", source?.gstAmount || 0);
    setValue("vatAmount", source?.vatAmount || 0);
    setValue("otherCharges", source?.otherCharges || 0);
    setValue("note", source?.note || "");
    setValue("fineActive", source?.fineActive || false);
    setValue("finePerDay", source?.finePerDay || 0);
    setValue(
      "fineStartDate",
      source?.fineStartDate ? new Date(source.fineStartDate) : undefined,
    );
    setValue(
      "fineEndDate",
      source?.fineEndDate ? new Date(source.fineEndDate) : undefined,
    );
  };

  const clearChargeFields = () => {
    setValue("rentAmount", 0);
    setValue("previous_month_balance", 0);
    setValue("gstAmount", 0);
    setValue("vatAmount", 0);
    setValue("otherCharges", 0);
    setValue("note", "");
    setValue("fineActive", false);
    setValue("finePerDay", 0);
    setValue("fineStartDate", undefined);
    setValue("fineEndDate", undefined);
  };

  // Load base profile identity fields on mount/update
  useEffect(() => {
    if (isSuccess && data) {
      applyBaseProfileFields(data);
    }
  }, [isSuccess, data]);

  // Load period-specific data whenever month/year changes
  useEffect(() => {
    setValue("month", viewMonth);
    setValue("year", viewYear);

    // Sync selected period to store so Home tab pie chart updates
    setSelectedPeriod(viewMonth, viewYear);

    if (isPeriodLoading) return;
    if (!isPeriodFetched) return;

    if (periodSettings) {
      // Data exists for this period — populate from it
      applyChargeFields(periodSettings);
    } else {
      // No data for this period (new month or past month with no record) — always zero out
      clearChargeFields();
    }
  }, [periodSettings, viewMonth, viewYear, isPeriodLoading, isPeriodFetched]);

  const watchFineActive = watch("fineActive");
  const watchFineStartDate = watch("fineStartDate");
  const watchFineEndDate = watch("fineEndDate");
  const watchRent = watch("rentAmount") || 0;
  const watchPreviousMonthBalance = watch("previous_month_balance") || 0;
  const watchGst = watch("gstAmount") || 0;
  const watchVat = watch("vatAmount") || 0;
  const watchOther = watch("otherCharges") || 0;
  const grandTotal = calculateGrandTotal(
    watchRent,
    watchPreviousMonthBalance,
    watchGst,
    watchVat,
    watchOther,
  );

  const yearOptions = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i,
  ).reverse();

  const allowedMonths =
    viewYear === currentYear
      ? MONTHS.filter((m) => m.value <= currentMonth)
      : MONTHS;

  const getMonthShort = (v: number) =>
    MONTHS.find((m) => m.value === v)?.short ?? "—";

  const onSubmit = (formData: SettingsType) => {
    updateProfile(
      {
        profileId: activeProfile,
        profileData: { ...formData, month: viewMonth, year: viewYear },
      },
      {
        onSuccess: () => {
          setProfileName(formData.name || "");
          Alert.alert("Success", "Profile updated successfully");
        },
      },
    );
  };

  return (
    <SafeAreaProvider
      className="flex-1 bg-gray-50"
      style={{ paddingBottom: insets.bottom + 20 }}
    >
      <View className="flex-1">
        <View className="bg-white px-5 pt-4 pb-3 shadow-sm border-b border-gray-100">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-gray-900">Settings</Text>
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center"
              onPress={() => router.push("/(profile)/profileSwitcher")}
            >
              <UserSwitchIcon size={16} color="#fff" weight="bold" />
              <Text className="text-white font-semibold text-sm ml-1.5">
                Switch Profile
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">
              Viewing:
            </Text>

            <TouchableOpacity
              onPress={() => setShowMonthModal(true)}
              className={`flex-row items-center px-3 py-1.5 rounded-full border ${
                isCurrentPeriod
                  ? "bg-blue-600 border-blue-600"
                  : "bg-amber-50 border-amber-400"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  isCurrentPeriod ? "text-white" : "text-amber-700"
                }`}
              >
                {getMonthShort(viewMonth)}
              </Text>
              <Text
                className={`text-xs ml-1 ${
                  isCurrentPeriod ? "text-blue-100" : "text-amber-500"
                }`}
              >
                ▾
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowYearModal(true)}
              className={`flex-row items-center px-3 py-1.5 rounded-full border ${
                isCurrentPeriod
                  ? "bg-blue-600 border-blue-600"
                  : "bg-amber-50 border-amber-400"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  isCurrentPeriod ? "text-white" : "text-amber-700"
                }`}
              >
                {viewYear}
              </Text>
              <Text
                className={`text-xs ml-1 ${
                  isCurrentPeriod ? "text-blue-100" : "text-amber-500"
                }`}
              >
                ▾
              </Text>
            </TouchableOpacity>

            {isCurrentPeriod ? (
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-semibold">
                  Current
                </Text>
              </View>
            ) : (
              <View className="bg-amber-100 px-2 py-1 rounded-full">
                <Text className="text-amber-700 text-xs font-semibold">
                  Past Record
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="flex-1 relative">
          <KeyboardAwareScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bottomOffset={20}
          >
            {isUpdating ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-gray-500 mt-4">
                  Loading profile settings...
                </Text>
              </View>
            ) : (
              <View className="p-4 gap-4">
                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <Text className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                    Profile Information
                  </Text>

                  <View className="mb-4">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Name
                    </Text>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-sm font-medium ${
                            focusedField === "name"
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-gray-200 bg-gray-50 text-gray-800"
                          }`}
                          placeholder="Enter name"
                          placeholderTextColor="#9ca3af"
                          onBlur={() => {
                            setFocusedField(null);
                            onBlur();
                          }}
                          onFocus={() => setFocusedField("name")}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                    {errors.name && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Entity Type
                    </Text>
                    <Controller
                      control={control}
                      name="entityType"
                      render={({ field: { onChange, value } }) => (
                        <View className="flex-row gap-3">
                          {(["individual", "hotel"] as const).map((type) => (
                            <TouchableOpacity
                              key={type}
                              className={`flex-1 py-3 rounded-xl border-2 ${
                                value === type
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                              onPress={() => onChange(type)}
                            >
                              <Text
                                className={`text-center text-sm font-semibold ${
                                  value === type
                                    ? "text-blue-700"
                                    : "text-gray-500"
                                }`}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    />
                    {errors.entityType && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.entityType.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <Text className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                    Charges & Amounts
                  </Text>

                  <View className="mb-3">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Current Rent Amount
                    </Text>
                    <Controller
                      control={control}
                      name="rentAmount"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-sm font-medium ${
                            focusedField === "rentAmount"
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-gray-200 bg-gray-50 text-gray-800"
                          }`}
                          placeholder="0"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                          onBlur={() => {
                            setFocusedField(null);
                            onBlur();
                          }}
                          onFocus={() => setFocusedField("rentAmount")}
                          onChangeText={(text) =>
                            onChange(parseFloat(text) || 0)
                          }
                          value={value?.toString()}
                        />
                      )}
                    />
                    {errors.rentAmount && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.rentAmount.message}
                      </Text>
                    )}
                  </View>

                  <View className="mb-3">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Previous Month Balance
                    </Text>
                    <Controller
                      control={control}
                      name="previous_month_balance"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-sm font-medium ${
                            focusedField === "previous_month_balance"
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-gray-200 bg-gray-50 text-gray-800"
                          }`}
                          placeholder="0"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                          onBlur={() => {
                            setFocusedField(null);
                            onBlur();
                          }}
                          onFocus={() =>
                            setFocusedField("previous_month_balance")
                          }
                          onChangeText={(text) =>
                            onChange(parseFloat(text) || 0)
                          }
                          value={value?.toString()}
                        />
                      )}
                    />
                    {errors.previous_month_balance && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.previous_month_balance.message}
                      </Text>
                    )}
                  </View>

                  <View className="mb-4">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      GST
                    </Text>
                    <Controller
                      control={control}
                      name="gstAmount"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-sm font-medium ${
                            focusedField === "gstAmount"
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-gray-200 bg-gray-50 text-gray-800"
                          }`}
                          placeholder="0"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                          onBlur={() => {
                            setFocusedField(null);
                            onBlur();
                          }}
                          onFocus={() => setFocusedField("gstAmount")}
                          onChangeText={(text) =>
                            onChange(parseFloat(text) || 0)
                          }
                          value={value?.toString()}
                        />
                      )}
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      VAT
                    </Text>
                    <Controller
                      control={control}
                      name="vatAmount"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-sm font-medium ${
                            focusedField === "vatAmount"
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-gray-200 bg-gray-50 text-gray-800"
                          }`}
                          placeholder="0"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                          onBlur={() => {
                            setFocusedField(null);
                            onBlur();
                          }}
                          onFocus={() => setFocusedField("vatAmount")}
                          onChangeText={(text) =>
                            onChange(parseFloat(text) || 0)
                          }
                          value={value?.toString()}
                        />
                      )}
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Other Charges
                    </Text>
                    <Controller
                      control={control}
                      name="otherCharges"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-sm font-medium ${
                            focusedField === "otherCharges"
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-gray-200 bg-gray-50 text-gray-800"
                          }`}
                          placeholder="0"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                          onBlur={() => {
                            setFocusedField(null);
                            onBlur();
                          }}
                          onFocus={() => setFocusedField("otherCharges")}
                          onChangeText={(text) =>
                            onChange(parseFloat(text) || 0)
                          }
                          value={value?.toString()}
                        />
                      )}
                    />
                  </View>

                  <View className="bg-green-600 rounded-xl px-5 py-4 flex-row justify-between items-center">
                    <View>
                      <Text className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-0.5">
                        Grand Total
                      </Text>
                    </View>
                    <Text className="text-white text-2xl font-bold">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>

                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <Text className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                    Note
                  </Text>
                  <Controller
                    control={control}
                    name="note"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={`border rounded-xl px-4 py-3 text-sm font-medium min-h-20 ${
                          focusedField === "note"
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-200 bg-gray-50 text-gray-800"
                        }`}
                        placeholder="Add a note (optional)"
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={8}
                        textAlignVertical="top"
                        onBlur={() => {
                          setFocusedField(null);
                          onBlur();
                        }}
                        onFocus={() => setFocusedField("note")}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.note && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.note.message}
                    </Text>
                  )}
                </View>

                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <View className="flex-row justify-between items-center mb-1">
                    <View>
                      <Text className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                        Late Fine
                      </Text>
                      <Text className="text-xs text-gray-400 mt-0.5">
                        Enable fine charges for late payments
                      </Text>
                    </View>
                    <Controller
                      control={control}
                      name="fineActive"
                      render={({ field: { onChange, value } }) => (
                        <Switch
                          value={value}
                          onValueChange={onChange}
                          trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                          thumbColor="#ffffff"
                        />
                      )}
                    />
                  </View>

                  {watchFineActive && (
                    <View className="mt-4 pt-4 border-t border-gray-100 gap-4">
                      <View>
                        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Fine Per Day
                        </Text>
                        <Controller
                          control={control}
                          name="finePerDay"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                              className={`border rounded-xl px-4 py-3 text-sm font-medium ${
                                focusedField === "finePerDay"
                                  ? "border-blue-500 bg-blue-50 text-blue-900"
                                  : "border-gray-200 bg-gray-50 text-gray-800"
                              }`}
                              placeholder="0"
                              placeholderTextColor="#9ca3af"
                              keyboardType="numeric"
                              onBlur={() => {
                                setFocusedField(null);
                                onBlur();
                              }}
                              onFocus={() => setFocusedField("finePerDay")}
                              onChangeText={(text) =>
                                onChange(parseFloat(text) || 0)
                              }
                              value={value?.toString()}
                            />
                          )}
                        />
                        {errors.finePerDay && (
                          <Text className="text-red-500 text-xs mt-1">
                            {errors.finePerDay.message}
                          </Text>
                        )}
                      </View>

                      <View className="flex-row gap-3">
                        <View className="flex-1">
                          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            Start Date
                          </Text>
                          <TouchableOpacity
                            className="border border-gray-200 rounded-xl px-3 py-3 bg-gray-50"
                            onPress={() => setShowFineStartDatePicker(true)}
                          >
                            <Text className="text-sm text-gray-700 font-medium">
                              {formatDate(watchFineStartDate)}
                            </Text>
                          </TouchableOpacity>
                          {showFineStartDatePicker && (
                            <DateTimePicker
                              value={watchFineStartDate || new Date()}
                              mode="date"
                              display={
                                Platform.OS === "ios" ? "spinner" : "default"
                              }
                              onChange={(event, selectedDate) => {
                                setShowFineStartDatePicker(
                                  Platform.OS === "ios",
                                );
                                if (selectedDate)
                                  setValue("fineStartDate", selectedDate);
                              }}
                            />
                          )}
                        </View>

                        <View className="flex-1">
                          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            End Date
                          </Text>
                          <TouchableOpacity
                            className="border border-gray-200 rounded-xl px-3 py-3 bg-gray-50"
                            onPress={() => setShowFineEndDatePicker(true)}
                          >
                            <Text className="text-sm text-gray-700 font-medium">
                              {formatDate(watchFineEndDate)}
                            </Text>
                          </TouchableOpacity>
                          {showFineEndDatePicker && (
                            <DateTimePicker
                              value={watchFineEndDate || new Date()}
                              mode="date"
                              display={
                                Platform.OS === "ios" ? "spinner" : "default"
                              }
                              onChange={(event, selectedDate) => {
                                setShowFineEndDatePicker(Platform.OS === "ios");
                                if (selectedDate)
                                  setValue("fineEndDate", selectedDate);
                              }}
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  className={`rounded-2xl py-4 flex-row items-center justify-center shadow-sm ${
                    isUpdating ? "bg-blue-400" : "bg-blue-600"
                  }`}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isUpdating}
                  activeOpacity={0.85}
                >
                  {isUpdating && (
                    <ActivityIndicator size="small" color="#fff" />
                  )}
                  <Text className="text-white text-center font-bold text-base ml-2">
                    {isUpdating
                      ? "Saving..."
                      : `Save for ${getMonthShort(viewMonth)} ${viewYear}`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAwareScrollView>

          {isPeriodLoading && !isUpdating ? (
            <View className="absolute inset-0 bg-gray-50/70 items-center justify-center">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-gray-600 mt-3 font-medium">
                Loading selected period...
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Modal
        visible={showMonthModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowMonthModal(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl max-h-[70%] px-5 py-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">
                Select Month
              </Text>
              <TouchableOpacity
                className="bg-gray-100 px-3 py-2 rounded-lg"
                onPress={() => setShowMonthModal(false)}
              >
                <Text className="text-gray-700 font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {allowedMonths.map((option) => {
                const selected = option.value === viewMonth;
                return (
                  <TouchableOpacity
                    key={option.value}
                    className={`mb-2 rounded-xl border px-4 py-3 ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    onPress={() => {
                      setViewMonth(option.value);
                      setShowMonthModal(false);
                    }}
                  >
                    <Text
                      className={`font-semibold ${selected ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showYearModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowYearModal(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl max-h-[70%] px-5 py-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">
                Select Year
              </Text>
              <TouchableOpacity
                className="bg-gray-100 px-3 py-2 rounded-lg"
                onPress={() => setShowYearModal(false)}
              >
                <Text className="text-gray-700 font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {yearOptions.map((year) => {
                const selected = year === viewYear;
                return (
                  <TouchableOpacity
                    key={year}
                    className={`mb-2 rounded-xl border px-4 py-3 ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    onPress={() => {
                      setViewYear(year);
                      if (year === currentYear && viewMonth > currentMonth) {
                        setViewMonth(currentMonth);
                      }
                      setShowYearModal(false);
                    }}
                  >
                    <Text
                      className={`font-semibold ${selected ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaProvider>
  );
};

export default Settings;
