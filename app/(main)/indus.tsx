import React from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Indus = () => {
  return (
    <SafeAreaProvider className="flex-1">
      <View className="flex">
        <Text>Sangam Restaurant</Text>
      </View>
    </SafeAreaProvider>
  );
};

export default Indus;
