import {
  StyleSheet,
  Text,
  useColorScheme,
  Platform,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Link, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";
import { Tables } from "../database.types";

interface ProductListItemProps {
  product: Tables<"products">;
}

export const defaultPizzaImage: ImageSourcePropType = require("@assets/images/defaultPizzaImage.png");

const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();
  const baseSegment = segments[0] || "(unknown)";
  const theme = useColorScheme();
  const styles = createStyles(theme || "");

  return (
    <Link href={`/${baseSegment}/menu/${product.id}`} asChild>
      <TouchableOpacity style={styles.container} activeOpacity={0.5}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default ProductListItem;

const createStyles = (theme: string) => {
  const isDark = theme === "dark";
  return StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: isDark ? "#333" : "#fff",
      borderRadius: 10,
      flex: 1,
      maxWidth: "50%",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: "auto",
      color: isDark ? "#fff" : "#000",
    },
    price: {
      fontSize: 16,
      color: isDark ? "#ccc" : "grey",
      fontWeight: "300",
    },
    image: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 10,
    },
  });
};
