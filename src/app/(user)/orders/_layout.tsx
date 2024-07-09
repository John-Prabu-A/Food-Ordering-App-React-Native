import { Stack } from "expo-router";

export default function OrdersScreen() {
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
