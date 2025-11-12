import "@/global.css";
import { Stack } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RootLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingTop: insets.top,
        },
      }}
      initialRouteName="Index"
    >
      <Stack.Screen name="Index" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
};

export default RootLayout;
