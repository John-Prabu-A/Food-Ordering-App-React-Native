import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import React from "react";
import { Tables } from "../types";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Link, useSegments } from "expo-router";

dayjs.extend(relativeTime);

type OrderListItemProps = {
  order: Tables<"orders">;
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const segments = useSegments();
  const theme = useColorScheme();

  const styles = createStyles(theme || "");

  if (!order) return null;

  return (
    <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
      <Pressable style={styles.container}>
        <View>
          <Text style={styles.title}>Order #{order.id}</Text>
          <Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>
        </View>
        <Text style={styles.status}>{order.status}</Text>
      </Pressable>
    </Link>
  );
};

const createStyles = (theme: string) => {
  const isDark = theme === "dark";
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#333" : "#fff",
      padding: 10,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDark ? "#444" : "#ccc",
    },
    title: {
      fontWeight: "bold",
      marginVertical: 5,
      color: isDark ? "#fff" : "#000",
    },
    time: {
      color: isDark ? "#ccc" : "gray",
    },
    status: {
      fontWeight: "500",
      color: isDark ? "#ddd" : "#000",
    },
  });
};

export default OrderListItem;
