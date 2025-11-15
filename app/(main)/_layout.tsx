import { TabBar } from "@/components/tabBar";
import { Tabs } from "expo-router";
import React from "react";

const HomeLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, animation: "fade" }}
      initialRouteName="home"
    >
      <Tabs.Screen options={{ title: "Home" }} name="home" />
      <Tabs.Screen options={{ title: "Records" }} name="records" />
      <Tabs.Screen options={{ title: "Settings" }} name="settings" />
    </Tabs>
  );
};

export default HomeLayout;
