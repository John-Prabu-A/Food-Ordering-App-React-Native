import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Stack } from "expo-router";
import Button from "@/src/components/Button";

type UserData = {
  email: string;
  password: string;
};

export default function AuthForm() {
  const [isSignUp, setIsSignup] = useState(true);

  const toggleFormType = () => setIsSignup(!isSignUp);

  const onSignIn = (values: UserData) => {
    // TODO: Implement sign-in logic
    Alert.alert("Sign In", JSON.stringify(values));
  };

  const onSignUp = (values: UserData) => {
    // TODO: Implement sign-up logic
    Alert.alert("Sign Up", JSON.stringify(values));
  };

  const handleAuth = (values: UserData) => {
    {
      isSignUp ? onSignIn(values) : onSignUp(values);
    }
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
            text={isSignUp ? "Sign Up" : "Sign In"}
            onPress={handleSubmit as unknown as () => void}
          />
          <Text onPress={toggleFormType} style={styles.textButton}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Text>
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
