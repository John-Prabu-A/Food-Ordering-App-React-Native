import { Stack, useLocalSearchParams } from "expo-router";

export default function AuthenticationScreen() {
  const { isCreateAccount } = useLocalSearchParams();
  const isSignIn = !!isCreateAccount;
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
