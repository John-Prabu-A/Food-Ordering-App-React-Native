import {
  View,
  Text,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useCart } from "@providers/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CartScreen = () => {
  const { items, total, checkout, isCartProcessing } = useCart();

  if (isCartProcessing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <MaterialCommunityIcons
          name="cart-variant"
          size={200}
          style={{ opacity: 0.5 }}
          color="grey"
        />
        <Text style={{ color: "grey", opacity: 0.5, fontSize: 26 }}>
          Your cart is empty
        </Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CartListItem key={item.id} cartItem={item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 10 }}
      />
      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>
        Total : ${total.toFixed(2)}
      </Text>
      <Button text="Checkout" onPress={checkout} />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default CartScreen;
