import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link, Redirect, useRouter } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../lib/supabase";

const index = () => {
  const { session, loading, isAdmin, profile } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: colorScheme === "dark" ? "#111" : "#fff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  if (!isAdmin) {
    return <Redirect href="/(user)" />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>
      <Button text="SignOut" onPress={() => supabase.auth.signOut()} />
    </View>
  );
};

export default index;
