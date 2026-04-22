import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";


function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            paddingTop: insets.top,
          },
        }}
        initialRouteName="index"
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(main)" />
      </Stack>
      <PortalHost />
    </>
  );
}

export default function RootLayout() {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <KeyboardProvider preload={false}>
        <RootLayoutNav />
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
