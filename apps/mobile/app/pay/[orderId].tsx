import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { api } from "@/src/api";
import { useStore } from "@/src/store";
import { colors, serif } from "@/src/theme";
import type { Order } from "@/src/types";
import { Button, ErrorText, Field, GasSafe, Screen } from "@/src/ui";

export default function PayScreen() {
  const params = useLocalSearchParams<{ orderId: string; email?: string }>();
  const orderId = String(params.orderId || "");
  const email = String(params.email || "");
  const { clear } = useStore();
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    const digits = card.replace(/\D/g, "");
    if (!/^\d{2}\/\d{2}$/.test(expiry) || cvc.replace(/\D/g, "").length < 3) {
      setError("Enter an expiry as MM/YY and a 3-digit CVC. They stay on this device.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api<{ order: Order }>(`/api/orders/${orderId}/confirm-test`, {
        method: "POST",
        body: JSON.stringify({ cardNumber: digits }),
      });
      clear();
      router.replace(`/order/${orderId}?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen back>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>Stripe test mode · simulated</Text>
        <Text style={styles.heading}>Pay {orderId}</Text>
        <Text style={styles.lead}>
          No Stripe secret key is configured, so this checkout does not contact Stripe. Use test card 4242 4242 4242 4242, any future expiry, and any CVC. The card number is checked and then discarded.
        </Text>
        <GasSafe compact />
        <Field label="Card number" value={card} onChangeText={setCard} keyboardType="number-pad" placeholder="4242 4242 4242 4242" />
        <Field label="Expiry" value={expiry} onChangeText={setExpiry} placeholder="12/28" />
        <Field label="CVC" value={cvc} onChangeText={setCvc} keyboardType="number-pad" placeholder="123" />
        {error ? <ErrorText message={error} /> : null}
        <Button label={busy ? "Taking payment…" : "Pay with test card"} onPress={pay} disabled={busy} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  kicker: { color: colors.brass, fontWeight: "700", letterSpacing: 0.4 },
  heading: { ...serif, fontSize: 28, color: colors.navy, marginBottom: 8 },
  lead: { color: colors.ink, lineHeight: 21, marginBottom: 12 },
});
