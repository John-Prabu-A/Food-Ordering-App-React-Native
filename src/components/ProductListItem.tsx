import { StyleSheet, Text, Image, Pressable } from "react-native";
import { Product } from "@/src/types";
import { Link, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";

interface ProductListItemProps {
  product: Product;
}

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();
  const baseSegment = segments[0] || "(unknown)";
  return (
    <Link href={`/${baseSegment}/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    maxWidth: "50%",
    margin: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "auto",
  },
  price: {
    fontSize: 16,
    color: "grey",
    fontWeight: "300",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
