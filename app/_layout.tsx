import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  return (
    <>
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
      <PortalHost />
    </>
  );
}

export default function RootLayout() {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
