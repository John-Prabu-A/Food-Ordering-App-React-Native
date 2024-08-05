import { useOrderDetails } from "@/src/api/orders";
import OrderItemListItem from "@/src/components/OrderItemListItem";
import OrderListItem from "@components/OrderListItem";
import { useAuth } from "@/src/providers/AuthProvider";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    !idString ? "" : typeof idString === "string" ? idString : idString[0]
  );
  const { profile } = useAuth();
  const {
    data: order,
    isLoading,
    error,
  } = useOrderDetails(profile?.id || "", id);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Stack.Screen options={{ title: `Order` }} />
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Stack.Screen options={{ title: `Order` }} />
        <Text>{error.message}</Text>
      </View>
    );
  }
  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Stack.Screen options={{ title: `Order` }} />
        <Text>Order not found</Text>
      </View>
    );
  }
  return (
    <View style={{ padding: 10 }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />
      <FlatList
        data={order?.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
