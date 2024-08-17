import { useProduct } from "@/src/api/products";
import Button from "@/src/components/Button";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import RemoteImage from "@/src/components/RemoteImage";
import { useCart } from "@/src/providers/CartProvider";
import { PizzaSize } from "@/src/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  useColorScheme,
  Alert,
} from "react-native";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    !idString ? "" : typeof idString === "string" ? idString : idString[0]
  );

  const { data: product, error, isLoading } = useProduct(id);
  const colorScheme = useColorScheme() || "light";

  const { addItem } = useCart();

  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem(product, selectedSize);
    Alert.alert("Success", "Added to cart. Go to cart?", [
      {
        text: "Go to cart",
        onPress: () => router.push("/cart"),
      },
      {
        text: "Cancel",
        onPress: () => router.back(),
        style: "cancel",
      },
    ]);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colorScheme === "dark" ? "#111" : "#fff" },
        ]}
      >
        <Stack.Screen options={{ title: "Menu Item" }} />
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colorScheme === "dark" ? "#111" : "#fff" },
        ]}
      >
        <Stack.Screen options={{ title: "Menu Item" }} />
        <Text>{error.message}</Text>
      </View>
    );
  }
  if (!product) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colorScheme === "dark" ? "#111" : "#fff",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Stack.Screen options={{ title: "Menu Item" }} />
        <Text>Product not found</Text>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "#111" : "#fff" },
      ]}
    >
      <Stack.Screen
        options={{
          title: product.name,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              {({ pressed }) => (
                <FontAwesome6
                  name="arrow-left"
                  size={20}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: colorScheme === "dark" ? "#333" : "#eee" },
        ]}
      >
        <RemoteImage
          path={product?.image}
          fallback={defaultPizzaImage}
          style={styles.image}
        />
      </View>
      <Text>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => {
              setSelectedSize(size);
            }}
            style={[
              styles.size,
              {
                backgroundColor:
                  selectedSize === size && colorScheme === "dark"
                    ? "#444"
                    : selectedSize === size
                      ? "#ccc"
                      : colorScheme === "dark"
                        ? "#222"
                        : "#eee",
              },
            ]}
            key={size}
          >
            <Text
              style={[
                styles.sizeText,
                {
                  color:
                    selectedSize === size && colorScheme === "dark"
                      ? "white"
                      : selectedSize === size
                        ? "black"
                        : "gray",
                },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>₹{product.price}</Text>
      <Button onPress={addToCart} text="Add to cart" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    width: "auto",
    aspectRatio: 1,
    borderRadius: 30,
    padding: 10,
    backgroundColor: "#00ffff",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "500",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default ProductDetailsScreen;
