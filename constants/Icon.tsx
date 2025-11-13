import { Feather, FontAwesome5 } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";

export const icon = {
  home: (props: any) => (
    <Entypo name="home" size={22} color={"#673ab7"} {...props} />
  ),
  indus: (props: any) => (
    <FontAwesome5 name="bed" size={22} color={"#673ab7"} {...props} />
  ),
  settings: (props: any) => (
    <Feather name="settings" size={22} color={"#673ab7"} {...props} />
  ),
};
