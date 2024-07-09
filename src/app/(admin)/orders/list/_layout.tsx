import { Redirect, withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/providers/AuthProvider";

export const TopTabs = withLayoutContext(
  createMaterialTopTabNavigator().Navigator
);

export default function OrdersScreen() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Redirect href="/" />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <TopTabs>
        <TopTabs.Screen name="index" options={{ title: "Active" }} />
      </TopTabs>
    </SafeAreaView>
  );
}
