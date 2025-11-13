import { icon } from "@/constants/Icon";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type TabBarButtonProps = {
  //   key: string;
  onPress: () => void;
  onLongPress: () => void;
  routeName: keyof typeof icon;
  color: string;
  label: string;
  isFocused: boolean;
};

const TabBarButton = ({
  //   key,
  onPress,
  onLongPress,
  routeName,
  color,
  label,
  isFocused,
}: TabBarButtonProps) => {
  const scale = useSharedValue(0);
  useEffect(() => {
    ((scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    )),
      [scale, isFocused]);
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return { opacity };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const top = interpolate(scale.value, [0, 1], [0, 9]);

    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={style.tabBarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {icon[routeName]({
          color: isFocused ? "#FFF" : "#222",
        })}
      </Animated.View>
      <Animated.Text
        style={[
          { color: isFocused ? "#673ab7" : "#222", fontSize: 12 },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const style = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 70,
    paddingVertical: 15,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },

  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
