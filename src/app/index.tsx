import { View, Text } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link } from "expo-router";

const index = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>
      <Link href={"/(auth)?isCreateAccount=true"} asChild>
        <Button text="SignIn" />
      </Link>
      <Link href={"/(auth)"} asChild>
        <Button text="signUp" />
      </Link>
    </View>
  );
};

export default index;
