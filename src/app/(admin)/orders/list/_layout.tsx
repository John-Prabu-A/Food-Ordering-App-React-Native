import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

export const TopTabs = withLayoutContext(
  createMaterialTopTabNavigator().Navigator
);

export default function OrdersScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <TopTabs>
        <TopTabs.Screen name="index" options={{ title: "Active" }} />
      </TopTabs>
    </SafeAreaView>
  );
}
