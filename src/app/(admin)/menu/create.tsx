import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/src/api/products";
import { supabase } from "@/src/lib/supabase";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import Button from "@/src/components/Button";
import RemoteImage from "@/src/components/RemoteImage";
import { FontAwesome } from "@expo/vector-icons";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    !idString ? "" : typeof idString === "string" ? idString : idString?.[0]
  );
  const isUpdating = !!idString;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct, isLoading } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
    setLoading(false);
  }, [updatingProduct]);

  const resetFields = () => {
    setName("");
    setPrice("");
  };

  const onCreate = async () => {
    const imagePath = await uploadImage();
    console.log("imagePath", imagePath);
    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          console.log("Success.. fields resetted.");
          router.back();
          console.log("Back..");

          setProcessing(false);
        },
      }
    );
  };

  const onUpdate = async () => {
    const imagePath = await uploadImage();
    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const pickImage = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setFieldValue("image", uri);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    if (updatingProduct?.image) {
      try {
        console.log("Attempting to delete image:", updatingProduct.image);

        const { data, error } = await supabase.storage
          .from("product-images")
          .remove([updatingProduct.image]);

        if (error) {
          console.error("Error deleting image:", error.message);
        } else {
          console.log("Image deleted successfully:", data);
        }
      } catch (error: any) {
        console.error("Error checking or deleting image:", error.message);
      }
    } else {
      console.log("No image to delete.");
    }

    deleteProduct(id, {
      onSuccess: () => {
        setDeleting(false);
        resetFields();
        router.replace("/(admin)");
      },
    });
  };

  const onConfirmDelete = () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (error) {
      console.error("Error uploading image", error);
    }

    if (data) {
      return data.path;
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Title is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be a positive number")
      .required("Price is required"),
  });

  if (loading || (isLoading && isUpdating)) {
    return <ActivityIndicator />;
  }

  return (
    <Formik
      initialValues={{
        id: id,
        image: image ?? defaultPizzaImage,
        name: name ?? "",
        price: price ? parseFloat(price.toString()) : 0,
      }}
      onSubmit={async () => {
        console.log("Submitting..");

        setProcessing(true);
        console.log("process start..");
        if (isUpdating) {
          console.log("Updating..");
          await onUpdate();
        } else {
          console.log("Creating..");
          await onCreate();
        }
        console.log("process end..");
      }}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Stack.Screen
            options={{ title: isUpdating ? "Update Item" : "Create Item" }}
          />
          <Pressable
            onPress={() => pickImage(setFieldValue)}
            disabled={processing || loading || deleting}
            style={{
              // width: 125,
              // height: 100,
              justifyContent: "center",
              alignSelf: "center",
              paddingBottom: 15,
              marginBottom: 15,
            }}
          >
            {values.image.startsWith("file://") ? (
              <Image
                style={styles.image}
                source={{ uri: values.image ?? defaultPizzaImage }}
              />
            ) : (
              <RemoteImage
                path={values.image}
                fallback={defaultPizzaImage}
                bucketName="product-images"
                style={styles.image}
              />
            )}
            <FontAwesome
              name={"pencil-square-o"}
              size={25}
              color="black"
              style={{
                position: "absolute",
                right: 10,
                bottom: 20,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 5,
                padding: 5,
                paddingBottom: 2,
                alignContent: "center",
                justifyContent: "center",
              }}
            />
          </Pressable>
          <Button
            disabled={processing || loading || deleting}
            text="Pick an image"
            onPress={() => pickImage(setFieldValue)}
          />

          <Text style={styles.label}>Title</Text>
          <TextInput
            value={values.name}
            // disable editing while processing
            editable={!processing}
            onChangeText={(text) => {
              setFieldValue("name", text);
              setName(text);
            }}
            onBlur={handleBlur("name")}
            style={styles.textInput}
            placeholder="Product Title"
          />
          {touched.name && errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}

          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            value={values.price === 0 ? "" : values.price.toString()}
            editable={!processing}
            onChangeText={(text) => {
              setFieldValue("price", text);
              setPrice(text);
            }}
            onBlur={handleBlur("price")}
            style={styles.textInput}
            placeholder="9.99"
            keyboardType="numeric"
          />
          {touched.price && errors.price && (
            <Text style={styles.errorText}>{errors.price}</Text>
          )}

          <Button
            text={
              isUpdating
                ? processing
                  ? "Updating..."
                  : "Update"
                : processing
                  ? "Creating..."
                  : "Create"
            }
            disabled={processing || loading || deleting}
            style={{ opacity: processing ? 0.5 : 1 }}
            onPress={handleSubmit as unknown as () => void}
          />
          {isUpdating && (
            <Text
              onPress={onConfirmDelete}
              disabled={deleting || processing || loading}
              style={styles.textButton}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Text>
          )}
        </View>
      )}
    </Formik>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  textButton: {
    color: "#ff2c2c",
    textAlign: "center",
    fontSize: 18,
  },
});
