import { TabBar } from "@/components/tabBar";
import { Stack, Tabs } from "expo-router";
import React from "react";

const HomeLayout = () => {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }} initialRouteName="sangam" >
      <Tabs.Screen options={{title: "Sangam"}} name="sangam" />
      <Tabs.Screen options={{title: "Indus"}} name="indus" />
      <Tabs.Screen options={{title: "Settings"}} name="settings" />
    </Tabs>
  );
};

export default HomeLayout;
