import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function OrdersScreen() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/" />;
  }
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Orders" }} />
    </Stack>
  );
}
