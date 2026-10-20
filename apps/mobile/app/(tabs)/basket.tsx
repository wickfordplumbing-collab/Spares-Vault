import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useStore } from "@/src/store";
import { colors, gbp, serif } from "@/src/theme";
import { Button, CatalogueNote, GasSafe, Screen } from "@/src/ui";

export default function BasketScreen() {
  const { items, setQty, subtotalPence } = useStore();
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Basket</Text>
        <CatalogueNote />
        <GasSafe compact />
        {items.length === 0 && <Text style={styles.empty}>Nothing in the basket yet. Search a part number, a GC number, or describe the part.</Text>}
        {items.map((item) => (
          <View key={item.partNumber} style={styles.card}>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.number}>{item.partNumber}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.price}>{gbp(item.pricePence)} each</Text>
            <View style={styles.qty}>
              <Button label="−" tone="ghost" onPress={() => setQty(item.partNumber, item.qty - 1)} />
              <Text style={styles.qtyText}>{item.qty}</Text>
              <Button label="+" tone="ghost" onPress={() => setQty(item.partNumber, item.qty + 1)} />
            </View>
          </View>
        ))}
        {items.length > 0 && (
          <>
            <Text style={styles.total}>Merchandise {gbp(subtotalPence)} ex VAT</Text>
            <Text style={styles.note}>Carriage is arranged by the supplier on drop-ship. It is not added here.</Text>
            <Button label="Checkout" onPress={() => router.push("/checkout")} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  heading: { ...serif, fontSize: 28, color: colors.navy, marginBottom: 8 },
  empty: { color: colors.muted, lineHeight: 21 },
  card: { backgroundColor: colors.paper, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.line },
  brand: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  number: { ...serif, fontSize: 20, color: colors.navy },
  desc: { color: colors.ink, marginVertical: 4 },
  price: { color: colors.muted },
  qty: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  qtyText: { fontSize: 18, fontWeight: "700", minWidth: 24, textAlign: "center" },
  total: { ...serif, fontSize: 24, color: colors.navy, marginVertical: 8 },
  note: { color: colors.muted, marginBottom: 12 },
});
