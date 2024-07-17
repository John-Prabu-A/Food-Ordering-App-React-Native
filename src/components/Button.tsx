import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Colors from "../constants/Colors";
import { forwardRef } from "react";
type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => {
    const colorScheme = useColorScheme();

    const backgroundColor =
      colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint;
    const textColor = colorScheme === "dark" ? "#000" : "#fff";

    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={[styles.container, { backgroundColor }]}
      >
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button;
