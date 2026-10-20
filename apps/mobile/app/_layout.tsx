import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "@/src/store";
import { colors } from "@/src/theme";

export default function RootLayout() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#08141F";
    const update = () => setWide(window.innerWidth > 760);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const frame = (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.cream },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[partNumber]" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="pay/[orderId]" />
          <Stack.Screen name="order/[id]" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="privacy" />
        </Stack>
      </StoreProvider>
    </SafeAreaProvider>
  );

  if (!wide) return frame;
  return (
    <View style={{ flex: 1, backgroundColor: "#08141F", alignItems: "center" }}>
      <View style={{ width: 430, maxWidth: "100%", flex: 1, backgroundColor: colors.cream }}>{frame}</View>
    </View>
  );
}
