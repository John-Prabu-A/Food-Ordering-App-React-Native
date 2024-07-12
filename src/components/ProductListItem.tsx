import { StyleSheet, Text, Image, Pressable } from "react-native";
import { Link, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";
import { Tables } from "../database.types";

interface ProductListItemProps {
  product: Tables<"products">;
}

export const defaultPizzaImage =
  "https://tjfrqdpfhcstpgdtwido.supabase.co/storage/v1/object/sign/product-images/defaultPizzaImage.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0LWltYWdlcy9kZWZhdWx0UGl6emFJbWFnZS5wbmciLCJpYXQiOjE3MjA3ODg5MjQsImV4cCI6MTc1MjMyNDkyNH0.bNDGzEVZzwOWtJsyhW4I8ctRouECt55Aw3lv4vkrDbU&t=2024-07-12T12%3A55%3A24.823Z";

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
    // margin: 5,
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
