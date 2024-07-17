import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Text, View } from "@/src/components/Themed";
import OrderListItem from "@/src/components/OrderListItem";
import { useMyOrderList } from "@/src/api/orders";
import { useUpdateOrderSubscription } from "@/src/api/orders/subscriptions";
import { useAuth } from "@/src/providers/AuthProvider";

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const { data: orders, isLoading, error } = useMyOrderList();
  const { session } = useAuth();
  useUpdateOrderSubscription(session?.user.id || "");
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        { backgroundColor: colorScheme === "dark" ? "#000" : "#fff", flex: 1 },
      ]}
    >
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
