import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Stack, useSegments } from "expo-router";

export default function OrdersScreen() {
  const { isAdmin } = useAuth();
  const segments = useSegments();

  if (!isAdmin) {
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
      <Stack.Screen name="index" options={{ title: "Orders" }} />
      <Stack.Screen name="list" options={{ headerShown: false }} />
    </Stack>
  );
}
