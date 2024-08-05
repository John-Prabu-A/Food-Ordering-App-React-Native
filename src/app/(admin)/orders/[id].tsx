import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderItemListItem from "@components/OrderItemListItem";
import OrderListItem from "@components/OrderListItem";
import { OrderStatusList } from "@/src/types";
import Colors from "@/src/constants/Colors";
import { useOrderDetails, useUpdateOrder } from "@/src/api/orders";
import { sendOrderStatusNotification } from "@/src/lib/notifications";
import { useAuth } from "@/src/providers/AuthProvider";
const OrderDetailScreen = () => {
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
  const { mutate: updateOrder } = useUpdateOrder();
  const updateStatus = async (status: string) => {
    await updateOrder({
      id: id,
      updatedFields: { status },
    });
    if (order) {
      sendOrderStatusNotification({ ...order, status });
    }
  };
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
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
        keyExtractor={(item) => item.id.toString()}
      />
      <>
        <Text style={{ fontWeight: "bold" }}>Status</Text>
        <View style={{ flexDirection: "row", gap: 5 }}>
          {OrderStatusList.map((status) => (
            <Pressable
              key={status}
              onPress={() => updateStatus(status)}
              style={{
                borderColor: Colors.light.tint,
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                marginVertical: 10,
                backgroundColor:
                  order.status === status ? Colors.light.tint : "transparent",
              }}
            >
              <Text
                style={{
                  color: order.status === status ? "white" : Colors.light.tint,
                }}
              >
                {status}
              </Text>
            </Pressable>
          ))}
        </View>
      </>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
});
export default OrderDetailScreen;
