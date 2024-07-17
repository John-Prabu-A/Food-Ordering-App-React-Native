import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import Button from "@/src/components/Button";
import { supabase } from "@/src/lib/supabase";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { useAuth } from "@/src/providers/AuthProvider";
import { useColorScheme } from "@/src/components/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

type UserData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(!useLocalSearchParams());
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const animationValue = useSharedValue(0);
  const { updateAuth } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const formikRef = useRef<any>(null); // Step 1: Create a ref for Formik

  const toggleFormType = () => {
    animationValue.value = withTiming(
      1,
      {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      },
      () => {
        runOnJS(setIsSignUp)(!isSignUp);
        animationValue.value = withTiming(0, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      }
    );

    // Step 2: Reset form values on toggle
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(animationValue.value * 3000, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
      opacity: withTiming(animationValue.value === 1 ? 0 : 1, {
        duration: 300,
      }),
    };
  });

  const onSignIn = async (values: UserData) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setLoading(false);
      Alert.alert("Sign In Error", error.message);
      return;
    }
    setLoading(false);
    updateAuth();
    <Redirect href="/" />;
  };

  const onSignUp = async (values: UserData) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setLoading(false);
      Alert.alert("Sign Up Error", error.message);
      return;
    }
    setLoading(false);
  };

  const handleAuth = (values: UserData) => {
    isSignUp ? onSignUp(values) : onSignIn(values);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: isSignUp
      ? Yup.string()
          .oneOf([Yup.ref("password"), undefined], "Passwords must match")
          .required("Confirm Password is required")
      : Yup.string(),
  });

  return (
    <Formik
      innerRef={formikRef} // Assign ref to Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={(values, { resetForm }) => {
        handleAuth(values);
        resetForm();
      }}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? "#121212" : "#FFFFFF" },
          ]}
        >
          <Stack.Screen options={{ title: isSignUp ? "Sign Up" : "Sign In" }} />

          <Animated.View style={[styles.form, animatedStyle]}>
            <Text
              style={[
                styles.label,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Email
            </Text>
            <TextInput
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              style={[
                styles.textInput,
                {
                  backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                  borderColor: isDarkMode ? "#444444" : "#CCCCCC",
                },
              ]}
              placeholder="Email"
              placeholderTextColor={isDarkMode ? "#AAAAAA" : "#888888"}
              keyboardType="email-address"
            />
            <Text style={styles.errorText}>
              {touched.email && errors.email ? errors.email : ""}
            </Text>

            <Text
              style={[
                styles.label,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
                    color: isDarkMode ? "#FFFFFF" : "#000000",
                    borderColor: isDarkMode ? "#444444" : "#CCCCCC",
                    flex: 1,
                  },
                ]}
                placeholder="Password"
                placeholderTextColor={isDarkMode ? "#AAAAAA" : "#888888"}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye"}
                  size={24}
                  color={isDarkMode ? "#ccc" : "#444"}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>
              {touched.password && errors.password ? errors.password : ""}
            </Text>

            {isSignUp && (
              <>
                <Text
                  style={[
                    styles.label,
                    { color: isDarkMode ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Confirm Password
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                        borderColor: isDarkMode ? "#444444" : "#CCCCCC",
                        flex: 1,
                      },
                    ]}
                    placeholder="Confirm Password"
                    placeholderTextColor={isDarkMode ? "#AAAAAA" : "#888888"}
                    secureTextEntry={!confirmPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={confirmPasswordVisible ? "eye-off-outline" : "eye"}
                      size={24}
                      color={isDarkMode ? "#ccc" : "#444"}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.errorText}>
                  {touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : ""}
                </Text>
              </>
            )}

            <Button
              disabled={loading}
              text={
                isSignUp
                  ? loading
                    ? "Creating Account..."
                    : "Create Account"
                  : loading
                    ? "Logging in..."
                    : "Log In"
              }
              onPress={handleSubmit as unknown as () => void}
            />
            <Text
              onPress={toggleFormType}
              disabled={loading}
              style={[
                styles.textButton,
                { color: isDarkMode ? "#1e90ff" : "#1e90ff" },
              ]}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Text>
          </Animated.View>
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
  form: {
    padding: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  textInput: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: -40,
    padding: 10,
    top: 5,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  textButton: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});
