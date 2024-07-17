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
  ImageSourcePropType,
  useColorScheme,
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
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 10,
      backgroundColor: colorScheme === "dark" ? "#111" : "#eee",
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 15,
      alignSelf: "center",
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
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
    input: {
      flex: 2,
      height: 40,
      paddingHorizontal: 10,
      borderColor: Colors.light.tint,
      borderLeftWidth: 2,
      borderRadius: 5,
      backgroundColor: colorScheme === "dark" ? "#333" : "#fff",
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
    errorText: {
      color: "red",
      marginTop: 5,
    },
  });

  if (loading || session === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const {
    data: myProfile,
    isLoading: isLoadingProfile,
    isError,
  } = useProfile(session.user.id);
  // console.log(useProfile(profile?.id || ""));
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const defaultProfileImage = "@assets/images/defaultProfilePic.png";
  useEffect(() => {
    // console.log(avatarUrl);
    if (profile) {
      setAvatarUrl(profile.avatar_url || "defaultProfilePic.png");
    }
    if (myProfile) {
      setAvatarUrl(myProfile.avatar_url || "defaultProfilePic.png");
    }
    // console.log("Profile", profile);
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
      // console.log("uri", uri);
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
      // console.error("Error uploading image", error);
      return null;
    }

    return data ? data.path : null;
  };

  const handleSave = async (
    values: ProfileUpdateValues,
    { setSubmitting }: FormikHelpers<ProfileUpdateValues>
  ) => {
    if (!profile) {
      return;
    }
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
        // console.log("Profile updated successfully");
        setIsEditing(false);
      },
      onError: (error) => {
        // console.error("Error updating profile:", error);
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
      {
        text: "Cancel",
        style: "cancel",
      },
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
        <Formik
          initialValues={{
            avatarUrl: avatarUrl ?? defaultProfileImage,
            fullName: myProfile?.full_name || profile?.full_name || "",
            username: myProfile?.username || profile?.username || "",
            website: myProfile?.website || profile?.website || "",
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
              <Stack.Screen
                options={{
                  headerRight: () => (
                    <Pressable
                      onPress={() => {
                        if (!isEditing) {
                          setIsSaved(false);
                          setIsEditing((prev) => !prev);
                        } else if (isSaved) {
                          setIsEditing(false);
                        } else {
                          Alert.alert(
                            "Discard Changes",
                            "Are you sure you want to discard changes?",
                            [
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                              {
                                text: "Discard",
                                style: "destructive",
                                onPress: () => {
                                  setAvatarUrl(profile?.avatar_url || null);
                                  values.avatarUrl = profile?.avatar_url || "";
                                  values.fullName =
                                    myProfile?.full_name ||
                                    profile?.full_name ||
                                    "";
                                  values.username =
                                    myProfile?.username ||
                                    profile?.username ||
                                    "";
                                  values.website =
                                    myProfile?.website ||
                                    profile?.website ||
                                    "";
                                  setIsEditing(false);
                                },
                              },
                            ]
                          );
                        }
                      }}
                    >
                      {({ pressed }) => (
                        <MaterialIcons
                          name={isEditing ? "done" : "edit"}
                          size={25}
                          color={Colors.light.tint}
                          style={{
                            marginRight: 15,
                            opacity: pressed ? 0.5 : 1,
                          }}
                        />
                      )}
                    </Pressable>
                  ),
                }}
              />
              <Pressable
                onPress={() => isEditing && pickImage(setFieldValue)}
                style={{
                  width: 125,
                  height: 100,
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingBottom: 15,
                  marginBottom: 15,
                }}
              >
                {typeof values.avatarUrl === "string" &&
                values.avatarUrl.startsWith("file://") ? (
                  <Image
                    source={{ uri: values.avatarUrl }}
                    style={styles.profileImage}
                  />
                ) : (
                  <RemoteImage
                    path={avatarUrl}
                    fallback={defaultProfileImage}
                    bucketName="profile-images"
                    style={styles.profileImage}
                  />
                )}
                {isEditing && (
                  <FontAwesome
                    name={"pencil-square-o"}
                    size={25}
                    color={
                      colorScheme === "dark"
                        ? "rgba(0, 255, 255, 0.7)"
                        : "black"
                    }
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 20,
                      backgroundColor:
                        colorScheme === "dark"
                          ? "rgba(128, 128, 128, 0)"
                          : "rgba(255, 255, 255, 0.7)",
                      borderRadius: 5,
                      padding: 5,
                      paddingBottom: 2,
                      alignContent: "center",
                      justifyContent: "center",
                      textShadowColor:
                        colorScheme === "dark"
                          ? "rgba(255,255,255,1)"
                          : "rgba(0,0,0,1)",
                      textShadowOffset: { width: 0.2, height: 0.2 },
                      textShadowRadius: 1,
                    }}
                  />
                )}
              </Pressable>
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      isEditing && {
                        borderBottomWidth: 1,
                      },
                    ]}
                    value={values.fullName || ""}
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    placeholder="eg. John Doe"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#aaa" : "#666"
                    }
                    editable={isEditing}
                  />
                </View>
                {touched.fullName && errors.fullName && (
                  <Text style={styles.errorText}>
                    {errors.fullName.toString()}
                  </Text>
                )}
                <View style={styles.row}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={[
                      styles.input,
                      isEditing && {
                        borderBottomWidth: 1,
                      },
                    ]}
                    value={values.username || ""}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    placeholder="eg: johndoe123"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#aaa" : "#666"
                    }
                    editable={isEditing}
                  />
                </View>
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>
                    {errors.username.toString()}
                  </Text>
                )}
                <View style={styles.row}>
                  <Text style={styles.label}>Website</Text>
                  <TextInput
                    style={[
                      styles.input,
                      isEditing && {
                        borderBottomWidth: 1,
                      },
                    ]}
                    value={values.website || ""}
                    onChangeText={handleChange("website")}
                    onBlur={handleBlur("website")}
                    placeholder="eg: https://example.com"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#aaa" : "#666"
                    }
                    editable={isEditing}
                  />
                </View>
                {touched.website && errors.website && (
                  <Text style={styles.errorText}>
                    {errors.website.toString()}
                  </Text>
                )}
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

export default ProfilePage;
