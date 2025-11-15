import { CheckCircle, Warning, XCircle } from "phosphor-react-native";
import React from "react";
import { Text, View } from "react-native";

interface StatusIndicatorProps {
  status: "paid" | "due" | "fine";
  amount?: number;
  size?: "small" | "medium" | "large";
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  amount,
  size = "medium",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "paid":
        return {
          color: "#10b981", // Green
          bgColor: "#d1fae5",
          textColor: "#065f46",
          icon: CheckCircle,
          label: "Paid",
          description: "Rent fully paid",
        };
      case "fine":
        return {
          color: "#ef4444", // Red
          bgColor: "#fee2e2",
          textColor: "#991b1b",
          icon: XCircle,
          label: "Fine",
          description: "Overdue with penalty",
        };
      case "due":
      default:
        return {
          color: "#3b82f6", // Blue
          bgColor: "#dbeafe",
          textColor: "#1e40af",
          icon: Warning,
          label: "Due",
          description: "Payment pending",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const iconSize = size === "small" ? 16 : size === "large" ? 28 : 20;
  const textSize =
    size === "small" ? "text-xs" : size === "large" ? "text-lg" : "text-sm";
  const padding =
    size === "small"
      ? "px-2 py-1"
      : size === "large"
        ? "px-4 py-3"
        : "px-3 py-2";

  return (
    <View
      className={`flex-row items-center rounded-full ${padding}`}
      style={{ backgroundColor: config.bgColor }}
    >
      <Icon size={iconSize} color={config.color} weight="fill" />
      <Text
        className={`ml-2 font-semibold ${textSize}`}
        style={{ color: config.textColor }}
      >
        {config.label}
        {amount && ` ₹${amount.toLocaleString("en-IN")}`}
      </Text>
    </View>
  );
};

// Usage examples component for testing
export const StatusExamples: React.FC = () => {
  return (
    <View className="p-4 space-y-4">
      <Text className="text-lg font-bold mb-4">Status Color Examples</Text>

      <View className="space-y-3">
        <StatusIndicator status="paid" amount={10000} size="large" />
        <StatusIndicator status="due" amount={5000} size="medium" />
        <StatusIndicator status="fine" amount={12000} size="medium" />
      </View>

      <View className="mt-6">
        <Text className="font-semibold mb-2">Color Legend:</Text>
        <View className="space-y-2">
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-green-500 rounded mr-3" />
            <Text className="text-sm">
              🟢 Green - Paid (Rent fully paid for the month)
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-blue-500 rounded mr-3" />
            <Text className="text-sm">
              🔵 Blue - Due (Payment pending but no fine yet)
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-red-500 rounded mr-3" />
            <Text className="text-sm">
              🔴 Red - Fine (Overdue with penalty charges)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
