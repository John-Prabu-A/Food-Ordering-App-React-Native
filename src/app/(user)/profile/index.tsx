import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";
import Button from "@/src/components/Button";
import { supabase } from "@/src/lib/supabase";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import RemoteImage from "@/src/components/RemoteImage";
import { useProfile, useUpdateProfile } from "@/src/api/profile";
import { UpdateTables } from "@/src/types";

type ProfileUpdateValues = {
  avatarUrl: string | null;
  fullName: string | null;
  username: string | null;
  website: string | null;
};

const ProfilePage = () => {
  const { session, loading, profile } = useAuth();
  const {
    data: myProfile,
    isLoading: isLoadingProfile,
    isError,
  } = useProfile(profile?.id);
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatar_url || "defaultProfilePic.png");
    }
    if (myProfile) {
      setAvatarUrl(myProfile.avatar_url || "defaultProfilePic.png");
    }
  }, [profile, myProfile]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    username: Yup.string().required("Username is required"),
    website: Yup.string().url("Invalid URL format"),
  });

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
      setAvatarUrl(uri);
      setFieldValue("avatarUrl", uri);
    }
  };

  const uploadImage = async (imageUri: string): Promise<string | null> => {
    if (!imageUri.startsWith("file://")) {
      return imageUri;
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";

    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, decode(base64), { contentType });

    if (error) {
      Alert.alert("Error uploading image", error.message);
      return null;
    }

    return data ? data.path : null;
  };

  const handleSave = async (
    values: ProfileUpdateValues,
    { setSubmitting }: FormikHelpers<ProfileUpdateValues>
  ) => {
    if (!profile) return;

    setProcessing(true);
    const avatarPath = await uploadImage(values.avatarUrl as string);
    const updates: UpdateTables<"profiles"> = {
      id: profile.id,
      avatar_url: avatarPath,
      full_name: values.fullName,
      username: values.username,
      website: values.website,
      updated_at: new Date().toISOString(),
    };

    updateProfileMutation.mutate(updates, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: () => {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      },
      onSettled: () => {
        setProcessing(false);
        setSubmitting(false);
      },
    });
  };

  const SignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          supabase.auth.signOut();
          <Redirect href="/" />;
        },
      },
    ]);
  };

  if (loading || isLoadingProfile || processing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error Loading Profile</Text>
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable onPress={() => setIsEditing((prev) => !prev)}>
                {({ pressed }) => (
                  <MaterialIcons
                    name={isEditing ? "done" : "edit"}
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
        <Formik
          initialValues={{
            avatarUrl: avatarUrl ?? "defaultProfilePic.png",
            fullName: profile?.full_name || "",
            username: profile?.username || "",
            website: profile?.website || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave as unknown as () => void}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View>
              <Pressable
                onPress={() => isEditing && pickImage(setFieldValue)}
                style={styles.imagePicker}
              >
                {values.avatarUrl.startsWith("file://") ? (
                  <Image
                    source={{ uri: values.avatarUrl }}
                    style={styles.profileImage}
                  />
                ) : (
                  <RemoteImage
                    path={avatarUrl}
                    fallback="defaultProfilePic.png"
                    bucketName="profile-images"
                    style={styles.profileImage}
                  />
                )}
                {isEditing && (
                  <FontAwesome
                    name={"pencil-square-o"}
                    size={25}
                    color={Colors.light.tint}
                    style={styles.pencilIcon}
                  />
                )}
              </Pressable>
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={[styles.input, isEditing && styles.editableInput]}
                    value={values.fullName}
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    placeholder="eg. John Doe"
                    editable={isEditing}
                  />
                  {touched.fullName && errors.fullName && (
                    <Text style={styles.errorText}>
                      {errors.fullName.toString()}
                    </Text>
                  )}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={[styles.input, isEditing && styles.editableInput]}
                    value={values.username}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    placeholder="eg: johndoe123"
                    editable={isEditing}
                  />
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>
                      {errors.username.toString()}
                    </Text>
                  )}
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Website</Text>
                  <TextInput
                    style={[styles.input, isEditing && styles.editableInput]}
                    value={values.website}
                    onChangeText={handleChange("website")}
                    onBlur={handleBlur("website")}
                    placeholder="eg: https://example.com"
                    editable={isEditing}
                  />
                  {touched.website && errors.website && (
                    <Text style={styles.errorText}>
                      {errors.website.toString()}
                    </Text>
                  )}
                </View>
              </View>
              {isEditing && (
                <Button
                  text="Save"
                  onPress={handleSubmit as unknown as () => void}
                  disabled={processing || isSubmitting}
                />
              )}
            </View>
          )}
        </Formik>
        {!isEditing && (
          <Button text="Sign Out" onPress={SignOut} disabled={processing} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: "center",
  },
  imagePicker: {
    width: 125,
    height: 100,
    justifyContent: "center",
    alignSelf: "center",
    paddingBottom: 15,
    marginBottom: 15,
  },
  pencilIcon: {
    position: "absolute",
    right: 0,
    bottom: 10,
  },
  table: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    flex: 2,
    height: 40,
    paddingHorizontal: 10,
    borderColor: Colors.light.tint,
    borderLeftWidth: 2,
    borderRadius: 5,
    backgroundColor: "white",
    color: "black",
  },
  editableInput: {
    borderBottomWidth: 1,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default ProfilePage;
