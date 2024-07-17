import { useAuth } from "@/src/providers/AuthProvider";
import { FontAwesome6 } from "@expo/vector-icons";
import { Redirect, Stack, useSegments } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { router } from "expo-router";

export default function OrdersScreen() {
  const { session, isAdmin } = useAuth();
  const segments = useSegments();
  const colorScheme = useColorScheme();

  if (!session) {
    return <Redirect href="/" />;
  }
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: `Order #${segments[2]}`,
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "Orders",
          headerLeft: () =>
            !isAdmin &&
            segments[2] === "[id]" && (
              <Pressable onPress={() => router.back()}>
                {({ pressed }) => (
                  <FontAwesome6
                    name="arrow-left"
                    size={20}
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
        }}
      />
    </Stack>
  );
}
