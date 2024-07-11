import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { View } from "@/src/components/Themed";
import OrderListItem from "@/src/components/OrderListItem";
import { useAdminOrderList } from "@/src/api/orders";
import { useInsertOrderSubscription } from "@/src/api/orders/subscriptions";

export default function OrdersScreen() {
  useInsertOrderSubscription(); // realtime order Status update
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: false });
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
    <View style={styles.container}>
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
