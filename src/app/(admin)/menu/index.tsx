import { FlatList } from "react-native";

import ProductListItem from "@components/ProductListItem";
import products from "@assets/data/products";

export default function MenuScreen() {
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
