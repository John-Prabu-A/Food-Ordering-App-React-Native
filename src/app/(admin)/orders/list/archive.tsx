import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Text, View } from "@/src/components/Themed";
import OrderListItem from "@/src/components/OrderListItem";
import { useAdminOrderList } from "@/src/api/orders";
import { useInsertOrderSubscription } from "@/src/api/orders/subscriptions";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  useInsertOrderSubscription(); // realtime orders update
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: true });
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
          name="food-outline"
          size={200}
          style={{ opacity: 0.6 }}
          color="grey"
        />
        <Text style={{ color: "grey", opacity: 0.9, fontSize: 26 }}>
          Archive List Is Empty!
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "#000" : "#fff" },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
});
