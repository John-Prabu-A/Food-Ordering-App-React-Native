import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Redirect, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function MenuScreen() {
  const { session, isAdmin } = useAuth();

  if (!session) {
    return <Redirect href="/" />;
  }
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerRight: () => (
          <Link href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="shopping-cart"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
        headerLeft: () =>
          isAdmin && (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="home"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Menu" }} />
    </Stack>
  );
}
