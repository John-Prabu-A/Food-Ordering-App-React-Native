import { StyleSheet, Text, Image, Pressable } from "react-native";
import { Product } from "@/src/types";
import { Link } from "expo-router";

interface ProductListItemProps {
  product: Product;
}

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link href={`/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: product.image || defaultPizzaImage }}
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "auto",
  },
  price: {
    fontSize: 16,
    color: "grey",
    fontWeight: "light",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
