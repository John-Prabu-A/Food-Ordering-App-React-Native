import { View, Text, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { CartItem } from "../types";
import { useCart } from "../providers/CartProvider";
import { FontAwesome } from "@expo/vector-icons";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type CartListItemProps = {
  cartItem: CartItem;
};

const CartListItem = ({ cartItem }: CartListItemProps) => {
  const { updateQuantity } = useCart();
  const colorScheme = useColorScheme(); // Get the current color scheme

  // Determine the appropriate colors based on the color scheme
  const backgroundColor = colorScheme === "dark" ? "#333" : "#fff";
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const iconColor = colorScheme === "dark" ? "#fff" : "gray";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <RemoteImage
        path={cartItem.product.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: textColor }]}>
          {cartItem.product.name}
        </Text>
        <View style={styles.subtitleContainer}>
          <Text style={[styles.price, { color: Colors.light.tint }]}>
            ₹{cartItem.product.price.toFixed(2)}
          </Text>
          <Text style={{ color: textColor }}>Size: {cartItem.size}</Text>
        </View>
      </View>
      <View style={styles.quantitySelector}>
        <FontAwesome
          onPress={() => updateQuantity(cartItem.id, -1)}
          name="minus"
          color={iconColor}
          style={{ padding: 5 }}
        />
        <Text style={[styles.quantity, { color: textColor }]}>
          {cartItem.quantity}
        </Text>
        <FontAwesome
          onPress={() => updateQuantity(cartItem.id, 1)}
          name="plus"
          color={iconColor}
          style={{ padding: 5 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  quantity: {
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    fontWeight: "bold",
  },
});

export default CartListItem;
