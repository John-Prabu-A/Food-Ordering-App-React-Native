import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function OrdersScreen() {
  const { session, loading, isAdmin, profile } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  if (!isAdmin) {
    return <Redirect href="/(user)" />;
  }
  return <Redirect href="/(admin)/orders/list" />;
}
