import { View, Text, StyleSheet, Image, useColorScheme } from "react-native";
import React from "react";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";
import Colors from "../constants/Colors";

type OrderItemListItemProps = {
  item: {
    created_at: string;
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    size: string;
    products: {
      created_at: string;
      id: number;
      image: string | null;
      name: string;
      price: number;
    } | null;
  };
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
  const theme = useColorScheme();
  const styles = createStyles(theme || "");

  if (!item.products) return null;
  return (
    <View style={styles.container}>
      <RemoteImage
        path={item.products.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.products.name}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.price}>₹{item.products.price.toFixed(2)}</Text>
          <Text style={styles.text}>Size: {item.size}</Text>
        </View>
      </View>
      <View style={styles.quantitySelector}>
        <Text style={styles.quantity}>{item.quantity}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: string) => {
  const isDark = theme === "dark";
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#333" : "#fff",
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 10,
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDark ? "#444" : "#ccc",
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
      color: isDark ? "#fff" : "#000",
    },
    subtitleContainer: {
      flexDirection: "row",
      gap: 5,
    },
    text: {
      color: isDark ? "#ccc" : "#000",
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
      color: isDark ? "#fff" : "#000",
    },
    price: {
      color: isDark ? Colors.dark.tint : Colors.light.tint,
      fontWeight: "bold",
    },
  });
};

export default OrderItemListItem;
