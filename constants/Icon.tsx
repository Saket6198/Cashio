import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export const icon = {
  sangam: (props: any) => (
    <MaterialCommunityIcons
      name="food-fork-drink"
      size={22}
      color={"#673ab7"}
      {...props}
    />
  ),
  indus: (props: any) => (
    <FontAwesome5 name="bed" size={22} color={"#673ab7"} {...props} />
  ),
  settings: (props: any) => (
    <Feather name="settings" size={22} color={"#673ab7"} {...props} />
  ),
};
