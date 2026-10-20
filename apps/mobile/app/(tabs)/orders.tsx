import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useStore } from "@/src/store";
import { colors, serif } from "@/src/theme";
import { Button, Screen } from "@/src/ui";

export default function OrdersScreen() {
  const { orders } = useStore();
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Your orders</Text>
        <Text style={styles.lead}>Orders placed on this device. Staff can open the full list.</Text>
        {orders.length === 0 && <Text style={styles.empty}>No orders yet.</Text>}
        {orders.map((order) => (
          <Pressable key={order.id} style={styles.card} onPress={() => router.push(`/order/${order.id}?email=${encodeURIComponent(order.email)}`)}>
            <Text style={styles.id}>{order.id}</Text>
            <Text style={styles.email}>{order.email}</Text>
          </Pressable>
        ))}
        <View style={{ height: 16 }} />
        <Button label="Staff orders" tone="ghost" onPress={() => router.push("/admin")} />
        <View style={{ height: 8 }} />
        <Button label="Privacy" tone="ghost" onPress={() => router.push("/privacy")} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  heading: { ...serif, fontSize: 28, color: colors.navy },
  lead: { color: colors.muted, marginVertical: 8, lineHeight: 20 },
  empty: { color: colors.muted },
  card: { backgroundColor: colors.paper, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.line },
  id: { ...serif, fontSize: 20, color: colors.navy },
  email: { color: colors.muted },
});
