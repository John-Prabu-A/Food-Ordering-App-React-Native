import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
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

type UserData = {
  email: string;
  password: string;
};

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(!useLocalSearchParams());
  const [loading, setLoading] = useState(false);
  const animationValue = useSharedValue(0);
  const { updateAuth } = useAuth();

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
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
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
        <View style={styles.container}>
          <Stack.Screen options={{ title: isSignUp ? "Sign Up" : "Sign In" }} />

          <Animated.View style={[styles.form, animatedStyle]}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              style={styles.textInput}
              placeholder="Email"
              keyboardType="email-address"
            />
            <Text style={styles.errorText}>
              {touched.email && errors.email ? errors.email : ""}
            </Text>

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry
            />
            <Text style={styles.errorText}>
              {touched.password && errors.password ? errors.password : ""}
            </Text>

            <Button
              disabled={loading}
              text={
                isSignUp
                  ? loading
                    ? "Signing Up..."
                    : "Sign Up"
                  : loading
                    ? "Signing in..."
                    : "Sign In"
              }
              onPress={handleSubmit as unknown as () => void}
            />
            <Text
              onPress={toggleFormType}
              disabled={loading}
              style={styles.textButton}
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
    borderColor: "gray",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  textButton: {
    color: "#1e90ff",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});
