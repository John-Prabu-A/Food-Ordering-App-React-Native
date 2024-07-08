import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { Stack, useLocalSearchParams } from "expo-router";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import Button from "@/src/components/Button";
import { Product } from "@/src/types";
import products from "@/assets/data/products";

export default function CreateItem() {
  const { id } = useLocalSearchParams();
  const isUpdating = !!id;

  // TODO: Replace with actual db call
  const item = products.find((product) => product.id.toString() === id);

  const [localImage, setLocalImage] = useState<string | null>(
    isUpdating ? item?.image ?? defaultPizzaImage : defaultPizzaImage
  );

  const localId = isUpdating ? +id : 0;
  const localTitle = isUpdating ? item?.name : "";
  const localPrice = isUpdating ? item?.price : 0;

  const pickImage = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    // Request permission to access media library
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

    console.log(result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImage(uri);
      setFieldValue("image", uri);
    }
  };

  const createItem = (values: Product) => {
    console.warn("Creating Item with values:", values);
    // TODO: Implement create item logic in db
  };

  const updateItem = (values: Product) => {
    console.warn("Updating Item with values:", values);
    // TODO: Implement update item logic in db
  };

  const onDelete = () => {
    console.warn("Deleting Item with id:", localId);
    // TODO: Implement delete item logic in db
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Title is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be a positive number")
      .required("Price is required"),
  });

  return (
    <Formik
      initialValues={{
        id: localId,
        image: localImage,
        name: localTitle ?? "",
        price: localPrice ?? 0,
      }}
      onSubmit={(values: Product, { resetForm }) => {
        isUpdating ? createItem(values) : updateItem(values);
        resetForm();
        setLocalImage(defaultPizzaImage);
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

          <Image
            style={styles.image}
            source={{ uri: values.image ?? defaultPizzaImage }}
          />
          <Button
            text="Pick an image"
            onPress={() => pickImage(setFieldValue)}
          />

          <Text style={styles.label}>Title</Text>
          <TextInput
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            style={styles.textInput}
            placeholder="Product Title"
          />
          {touched.name && errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}

          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            value={values.price !== 0 ? values.price.toString() : ""}
            onChangeText={handleChange("price")}
            onBlur={handleBlur("price")}
            style={styles.textInput}
            placeholder="9.99"
            keyboardType="numeric"
          />
          {touched.price && errors.price && (
            <Text style={styles.errorText}>{errors.price}</Text>
          )}

          <Button
            text={isUpdating ? "Update" : "Create"}
            onPress={handleSubmit as unknown as () => void}
          />
          {isUpdating && (
            <Text onPress={onConfirmDelete} style={styles.textButton}>
              Delete
            </Text>
          )}
        </View>
      )}
    </Formik>
  );
}

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
