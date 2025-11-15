import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";

export const icon = {
  home: (props: any) => (
    <Entypo name="home" size={22} color={"#673ab7"} {...props} />
  ),
  records: (props: any) => <Entypo name="wallet" size={24} color="black" />,
  settings: (props: any) => (
    <Feather name="settings" size={22} color={"#673ab7"} {...props} />
  ),
};
