import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { api, isDemoMode } from "@/src/api";
import { colors, gbp, serif } from "@/src/theme";
import type { Order } from "@/src/types";
import { Button, ErrorText, Field, Screen } from "@/src/ui";

export default function AdminScreen() {
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [csv, setCsv] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    setError("");
    try {
      const data = await api<{ orders: Order[] }>("/api/admin/orders", { token: token.trim() });
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders");
    }
  }

  async function importCsv() {
    setError("");
    setMessage("");
    try {
      const result = await api<{ inserted: number; updated: number; catalogueMode: string }>("/api/admin/catalogue/import", {
        method: "POST",
        token: token.trim(),
        body: JSON.stringify({ csv, replace: false }),
      });
      setMessage(`Imported ${result.inserted} new, ${result.updated} updated. Catalogue is ${result.catalogueMode}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    }
  }

  return (
    <Screen back>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Staff orders</Text>
        <Text style={styles.lead}>
          {isDemoMode()
            ? "Browser demo. The staff token is change-me. Orders and the composed supplier email stay in this browser. Nothing is sent."
            : "The token is the API ADMIN_TOKEN. It is not stored in the app binary."}
        </Text>
        <Field label="Staff token" value={token} onChangeText={setToken} secureTextEntry autoCapitalize="none" />
        <Button label="Load orders" onPress={load} />
        {error ? <ErrorText message={error} /> : null}
        {message ? <Text style={styles.ok}>{message}</Text> : null}
        {orders?.map((order) => (
          <View key={order.id} style={styles.card}>
            <Text style={styles.id}>{order.id}</Text>
            <Text style={styles.meta}>
              {order.status} · {order.customerName} · {order.postcode} · {gbp(order.subtotalPence)}
            </Text>
            <Text style={styles.meta}>
              {order.items.map((item) => `${item.qty}× ${item.partNumber}`).join(", ")}
            </Text>
            <Text style={styles.meta}>Email: {order.emailDelivery || "not sent"} → {order.supplierEmailTo || "—"}</Text>
            <Button label={openId === order.id ? "Hide email" : "Show email"} tone="ghost" onPress={() => setOpenId(openId === order.id ? null : order.id)} />
            {openId === order.id && order.supplierEmailBody ? <Text style={styles.email}>{order.supplierEmailBody}</Text> : null}
          </View>
        ))}
        <Text style={styles.section}>Import catalogue CSV</Text>
        <Text style={styles.lead}>Columns: part_number, description, brand, price, stock, fits. Optional price_note.</Text>
        <Field label="CSV" value={csv} onChangeText={setCsv} multiline style={{ minHeight: 120, textAlignVertical: "top" }} />
        <Button label="Import rows" tone="brass" onPress={importCsv} disabled={!token.trim() || !csv.trim()} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  heading: { ...serif, fontSize: 28, color: colors.navy },
  lead: { color: colors.muted, lineHeight: 20, marginVertical: 8 },
  ok: { color: colors.ok, marginVertical: 8 },
  card: { backgroundColor: colors.paper, borderRadius: 12, padding: 12, marginTop: 10, borderWidth: 1, borderColor: colors.line, gap: 4 },
  id: { ...serif, fontSize: 20, color: colors.navy },
  meta: { color: colors.ink, lineHeight: 18 },
  email: { marginTop: 8, color: colors.ink, lineHeight: 18 },
  section: { ...serif, fontSize: 22, color: colors.navy, marginTop: 20 },
});
