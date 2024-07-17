import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  useColorScheme,
} from "react-native";
import ProductListItem from "@components/ProductListItem";
import { useProductList } from "@/src/api/products";
import Colors from "@/src/constants/Colors";

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();
  const colorScheme = useColorScheme() || "light";

  if (isLoading || !products) {
    return <ActivityIndicator color={Colors[colorScheme].tint} />;
  }
  if (error) {
    Alert.alert("Error", error.message);
    return <Text>Products Not Found!!!</Text>;
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductListItem key={item.id} product={item} />
      )}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}
