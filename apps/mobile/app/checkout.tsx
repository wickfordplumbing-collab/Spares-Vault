import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { api } from "@/src/api";
import { useStore } from "@/src/store";
import { colors, gbp, serif } from "@/src/theme";
import { Button, ErrorText, Field, GasSafe, Screen } from "@/src/ui";

export default function CheckoutScreen() {
  const { items, subtotalPence, rememberOrder } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const result = await api<{
        orderId: string;
        paymentMode: string;
        checkoutUrl: string | null;
      }>("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          customer: { name, email, phone },
          address: { line1, line2, city, postcode },
          notes,
          items: items.map((item) => ({ partNumber: item.partNumber, qty: item.qty })),
        }),
      });
      rememberOrder({ id: result.orderId, email: email.trim() });
      if (result.paymentMode === "stripe-test" && result.checkoutUrl) {
        await WebBrowser.openBrowserAsync(result.checkoutUrl);
        router.replace(`/order/${result.orderId}?email=${encodeURIComponent(email.trim())}`);
        return;
      }
      router.replace(`/pay/${result.orderId}?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen back>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Delivery</Text>
        <Text style={styles.lead}>The supplier drop-ships to this address. A copy of the order email goes to Wickford.</Text>
        <GasSafe compact />
        <Text style={styles.total}>{gbp(subtotalPence)} ex VAT · placeholder if the sample catalogue is loaded</Text>
        <Field label="Name" value={name} onChangeText={setName} autoComplete="name" />
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label="Address line 1" value={line1} onChangeText={setLine1} />
        <Field label="Address line 2" value={line2} onChangeText={setLine2} />
        <Field label="Town / city" value={city} onChangeText={setCity} />
        <Field label="Postcode" value={postcode} onChangeText={setPostcode} autoCapitalize="characters" />
        <Field label="Notes for the order (model, GC, serial)" value={notes} onChangeText={setNotes} multiline />
        {error ? <ErrorText message={error} /> : null}
        <Button label={busy ? "Raising the order…" : "Continue to payment"} onPress={submit} disabled={busy || items.length === 0} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  heading: { ...serif, fontSize: 28, color: colors.navy },
  lead: { color: colors.muted, lineHeight: 20, marginVertical: 8 },
  total: { color: colors.navy, fontWeight: "700", marginBottom: 12 },
});
