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
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  if (!orders || (orders && orders.length === 0)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <MaterialCommunityIcons
          name="food"
          size={200}
          style={{ opacity: 0.6 }}
          color="grey"
        />
        <Text style={{ color: "grey", opacity: 0.9, fontSize: 26 }}>
          No Orders Yet
        </Text>
        <Text style={{ color: "grey", opacity: 0.7, fontSize: 12 }}>
          Order something from the menu
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[{ backgroundColor: colorScheme === "dark" ? "#000" : "#fff" }]}
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
