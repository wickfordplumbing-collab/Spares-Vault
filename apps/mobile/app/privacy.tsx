import { ScrollView, StyleSheet, Text } from "react-native";
import { colors, serif } from "@/src/theme";
import { Screen } from "@/src/ui";

export default function PrivacyScreen() {
  return (
    <Screen back>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Privacy</Text>
        <Text style={styles.body}>
          Wickford Plumbing Supplies uses the name, email, phone and delivery address you enter so a supplier can drop-ship the parts and so we can email a copy of the order to the counter in Wickford, Essex.
        </Text>
        <Text style={styles.body}>
          Fault descriptions you type are sent to our own API so the assistant can search the boiler-spares notes. If a live model is configured, that text is also sent to the model provider named in the server environment. Card numbers are not stored. In Stripe test mode, payment is handled by Stripe. In simulated test mode, the app only checks that you typed the published Stripe test card and then discards it.
        </Text>
        <Text style={styles.body}>
          The basket and the list of order numbers stay on this device. The catalogue prices in the sample file are placeholders, not a quote.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  heading: { ...serif, fontSize: 28, color: colors.navy, marginBottom: 8 },
  body: { color: colors.ink, fontSize: 16, lineHeight: 23, marginBottom: 12 },
});
