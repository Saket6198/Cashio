import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.replace("/(main)/home");
    }, 1300);
  }, []);

  return (
    <SafeAreaProvider className="flex">
      <View className="flex flex-1 justify-center items-center bg-neutral-900">
        <Animated.Image
          style={{ aspectRatio: 1, height: hp("30%") }}
          entering={FadeInDown.delay(300).duration(800).springify()}
          source={require("@/assets/images/Wallet1.png")}
        />
        <Animated.Text
          className="text-white font-bold mt-6"
          style={{ fontSize: hp("4%") }}
          entering={FadeInDown.delay(300).duration(800).springify()}
        >
          Cashio
        </Animated.Text>
      </View>
    </SafeAreaProvider>
  );
};

export default Index;
