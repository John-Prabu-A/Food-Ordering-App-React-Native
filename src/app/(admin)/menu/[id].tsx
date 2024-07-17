import { useProduct } from "@/src/api/products";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import RemoteImage from "@/src/components/RemoteImage";
import Colors from "@/src/constants/Colors";
import { PizzaSize } from "@/src/types";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from "react-native";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    !idString ? "" : typeof idString === "string" ? idString : idString[0]
  );
  const { data: product, error, isLoading } = useProduct(id);
  const colorScheme = useColorScheme() || "light";

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colorScheme === "dark" ? "#111" : "#fff" },
        ]}
      >
        <Stack.Screen
          options={{
            title: "Menu Item",
          }}
        />
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
        <Stack.Screen
          options={{
            title: "Menu Item",
          }}
        />
        <Text>{error.message}</Text>
      </View>
    );
  }
  if (!product) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colorScheme === "dark" ? "#111" : "#fff" },
        ]}
      >
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
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors[colorScheme].tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Stack.Screen options={{ title: product.name }} />

      <View
        style={[
          styles.imageContainer,
          { backgroundColor: colorScheme === "dark" ? "#333" : "#eee" },
        ]}
      >
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
        {product.name}
      </Text>
      <Text style={[styles.price, { color: Colors[colorScheme].text }]}>
        ${product.price}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 30,
    padding: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
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
});

export default ProductDetailsScreen;
