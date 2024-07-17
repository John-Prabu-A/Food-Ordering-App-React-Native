import {
  ActivityIndicator,
  FlatList,
  Text,
  useColorScheme,
  View,
} from "react-native";

import ProductListItem from "@components/ProductListItem";
import { useProductList } from "@/src/api/products";

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();
  const colorScheme = useColorScheme() || "light";

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: colorScheme === "dark" ? "#111" : "#fff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View
        style={[
          {
            backgroundColor: colorScheme === "dark" ? "#111" : "#fff",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          },
        ]}
      >
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductListItem key={item.id} product={item} />
      )}
      numColumns={2}
      contentContainerStyle={{
        gap: 10,
        padding: 10,
        backgroundColor: colorScheme === "dark" ? "#111" : "#fff",
      }}
      columnWrapperStyle={{ gap: 10, maxWidth: "100%" }}
      keyExtractor={(item) => item.created_at}
    />
  );
}
