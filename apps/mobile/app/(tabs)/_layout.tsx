import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useStore } from "@/src/store";
import { colors } from "@/src/theme";

function Mark({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.mark, { borderColor: color }]}>
      <Text style={[styles.markText, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { count } = useStore();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brass,
        tabBarInactiveTintColor: "#8E98A3",
        tabBarStyle: { backgroundColor: colors.navy, borderTopColor: colors.navyMid, height: 62, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Help",
          tabBarIcon: ({ color }) => <Mark label="?" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => <Mark label="S" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="basket"
        options={{
          title: "Basket",
          tabBarBadge: count > 0 ? count : undefined,
          tabBarIcon: ({ color }) => <Mark label="B" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <Mark label="O" color={String(color)} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  markText: { fontSize: 12, fontWeight: "800" },
});
