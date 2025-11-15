import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const TransactionShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View className="space-y-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <View
          key={item}
          className="flex-row justify-between items-center py-4 border-b border-gray-200"
        >
          <View className="flex-1">
            <Animated.View
              className="h-4 bg-gray-300 rounded w-3/4 mb-2"
              style={{ opacity }}
            />
            <Animated.View
              className="h-3 bg-gray-300 rounded w-1/2"
              style={{ opacity }}
            />
          </View>
          <View className="items-end ml-4">
            <Animated.View
              className="h-4 bg-gray-300 rounded w-20 mb-2"
              style={{ opacity }}
            />
            <Animated.View
              className="h-3 bg-gray-300 rounded w-12"
              style={{ opacity }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default TransactionShimmer;
