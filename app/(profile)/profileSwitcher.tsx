import ProfileCard from "@/components/ProfilesCard";
import { useFetchProfiles } from "@/hooks/useFetchProfiles";
import { useProfileStore } from "@/store/userProfile";
import { useRouter } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Profile {
  _id: string;
  uuid: string;
  name: string;
  entityType: "individual" | "hotel";
  createdAt: string;
}

const ProfileSwitcher = () => {
  const { data, isPending, isSuccess, refetch, isFetching, isRefetching } =
    useFetchProfiles();
  const router = useRouter();
  const { setActiveProfile, setProfileName } = useProfileStore();

  const handleProfilePress = (profile: Profile) => {
    console.log("Selected profile:", profile._id);
    setActiveProfile(profile._id);
    setProfileName(profile.name);
    router.replace("/(main)/home");
  };

  return (
    <SafeAreaProvider className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white pt-14 pb-6 px-6 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Switch Profile
              </Text>
              <Text className="text-gray-600 text-base">
                Select a profile to continue
              </Text>
            </View>
            <TouchableOpacity
              className="bg-blue-600 px-6 py-3 rounded-full"
              onPress={() => router.push("/(profile)/newProfile")}
            >
              <PlusIcon size={20} color="#fff" weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#6366f1"]}
              tintColor="#6366f1"
            />
          }
        >
          {isPending ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#6366f1" />
              <Text className="text-gray-500 mt-4">Loading profiles...</Text>
            </View>
          ) : isSuccess && data?.profiles ? (
            <>
              {data.profiles.map((profile: Profile) => (
                <ProfileCard
                  key={profile._id}
                  profile={profile}
                  onPress={handleProfilePress}
                />
              ))}

              {data?.profiles?.length === 0 && (
                <View className="items-center justify-center py-20">
                  <Text className="text-6xl mb-4">📋</Text>
                  <Text className="text-gray-900 text-lg font-semibold mb-2">
                    No profiles found
                  </Text>
                  <Text className="text-gray-500 text-center">
                    Create a new profile to get started
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View className="items-center justify-center py-20">
              <Text className="text-6xl mb-4">⚠️</Text>
              <Text className="text-gray-900 text-lg font-semibold mb-2">
                Something went wrong
              </Text>
              <Text className="text-gray-500 text-center">
                Unable to load profiles. Please try again.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default ProfileSwitcher;
