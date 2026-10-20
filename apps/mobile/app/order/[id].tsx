import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "@/src/api";
import { colors, gbp, serif } from "@/src/theme";
import type { Order } from "@/src/types";
import { ErrorText, GasSafe, Loading, Screen } from "@/src/ui";

export default function OrderScreen() {
  const params = useLocalSearchParams<{ id: string; email?: string }>();
  const id = String(params.id || "");
  const email = String(params.email || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !email) {
      setError("Open this order from the device that placed it.");
      return;
    }
    api<{ order: Order }>(`/api/orders/${id}?email=${encodeURIComponent(email)}`)
      .then((data) => setOrder(data.order))
      .catch((err: Error) => setError(err.message));
  }, [id, email]);

  return (
    <Screen back>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>{id}</Text>
        {error ? <ErrorText message={error} /> : null}
        {!order && !error ? <Loading /> : null}
        {order && (
          <>
            <Text style={styles.status}>{label(order.status)}</Text>
            <Text style={styles.meta}>
              {order.customerName}, {order.addressLine1}, {order.city} {order.postcode}
            </Text>
            <Text style={styles.meta}>Payment: {order.paymentMode}</Text>
            <Text style={styles.total}>{gbp(order.subtotalPence)} ex VAT</Text>
            {order.items.map((item) => (
              <Text key={item.partNumber} style={styles.item}>
                {item.qty} × {item.partNumber} {item.brand} — {item.description}
              </Text>
            ))}
            <GasSafe />
            {order.supplierEmailBody ? (
              <View style={styles.email}>
                <Text style={styles.emailTitle}>Supplier drop-ship email</Text>
                <Text style={styles.emailMeta}>
                  To {order.supplierEmailTo} · delivery {order.emailDelivery}
                </Text>
                <Text style={styles.emailBody}>{order.supplierEmailBody}</Text>
                <Text style={styles.emailTitle}>Copy for Wickford</Text>
                <Text style={styles.emailMeta}>To {order.wickfordEmailTo}</Text>
                <Text style={styles.emailBody}>{order.wickfordEmailBody}</Text>
              </View>
            ) : (
              <Text style={styles.meta}>The order email appears here once payment is complete.</Text>
            )}
            {order.supplierStatus ? <Text style={styles.meta}>{order.supplierStatus}</Text> : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function label(status: string): string {
  if (status === "sent_to_supplier") return "Sent to the supplier";
  if (status === "pending_payment") return "Waiting for payment";
  if (status === "supplier_pending_adapter") return "Paid — supplier adapter did not send";
  return status;
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  heading: { ...serif, fontSize: 28, color: colors.navy },
  status: { color: colors.ok, fontWeight: "700", marginVertical: 6, fontSize: 16 },
  meta: { color: colors.muted, lineHeight: 20, marginBottom: 4 },
  total: { ...serif, fontSize: 22, color: colors.navy, marginVertical: 8 },
  item: { color: colors.ink, marginBottom: 4, lineHeight: 20 },
  email: { marginTop: 12 },
  emailTitle: { fontWeight: "700", color: colors.navy, marginTop: 12 },
  emailMeta: { color: colors.muted, marginBottom: 6 },
  emailBody: { backgroundColor: colors.paper, borderRadius: 10, padding: 12, color: colors.ink, lineHeight: 20, borderWidth: 1, borderColor: colors.line },
});
