import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Profile {
  _id: string;
  uuid: string;
  name: string;
  entityType: "individual" | "hotel";
  createdAt: string;
}

interface ProfileCardProps {
  profile: Profile;
  onPress: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onPress }) => {
  const isHotel = profile.entityType === "hotel";
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(profile)}
      className="bg-white rounded-xl p-4 mb-3 border border-gray-200 active:bg-gray-50"
      activeOpacity={0.6}
      style={{
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <View className="flex-row items-center">
        {/* Profile Avatar */}
        <View
          className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
            isHotel ? "bg-indigo-600" : "bg-emerald-600"
          }`}
        >
          <Text className="text-white text-lg font-bold">
            {getInitials(profile.name)}
          </Text>
        </View>

        {/* Profile Info */}
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900 mb-1"
            numberOfLines={1}
          >
            {profile.name}
          </Text>

          <View className="flex-row items-center">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${isHotel ? "bg-indigo-600" : "bg-emerald-600"}`}
            />
            <Text className="text-sm text-gray-600 mr-3">
              {isHotel ? "Business" : "Personal"}
            </Text>
            <Text className="text-xs text-gray-400">
              {formatDate(profile.createdAt)}
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <View className="w-6 h-6 items-center justify-center">
          <View
            className="w-2 h-2 border-r-2 border-t-2 border-gray-400 rotate-45"
            style={{ transform: [{ rotate: "45deg" }] }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;
