import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";

export default function AuthenticationScreen() {
  const { isCreateAccount } = useLocalSearchParams();
  const isSignIn = !!isCreateAccount;
  const { session } = useAuth();
  if (session) {
    return <Redirect href="/" />;
  }
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: isSignIn ? "SignIn" : "SignUp",
        }}
      />
    </Stack>
  );
}
