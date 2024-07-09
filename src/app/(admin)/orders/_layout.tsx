import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Redirect, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function OrdersScreen() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Redirect href="/" />;
  }
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Orders" }} />
      <Stack.Screen name="list" options={{ headerShown: false }} />
    </Stack>
  );
}
