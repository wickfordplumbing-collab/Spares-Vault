import { router } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "./api";
import { colors, gbp, serif } from "./theme";
import type { Health, Product } from "./types";
import { useStore } from "./store";

export function Screen({
  children,
  back,
  footer,
}: {
  children: ReactNode;
  back?: boolean;
  footer?: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.brand}>
        {back ? (
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.back}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        <View style={styles.brandText}>
          <Text style={styles.kicker}>WICKFORD</Text>
          <Text style={styles.brandName}>Plumbing Supplies</Text>
        </View>
        <Text style={styles.town}>Essex</Text>
      </View>
      <View style={styles.body}>{children}</View>
      {footer}
    </SafeAreaView>
  );
}

export function GasSafe({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.gas}>
      <Text style={styles.gasTitle}>Gas Safe</Text>
      <Text style={styles.gasBody}>
        {compact
          ? "Gas work must be done by a Gas Safe registered engineer."
          : "Gas work must be done by a Gas Safe registered engineer. This is parts guidance, not a procedure for opening a boiler."}
      </Text>
    </View>
  );
}

export function Button({
  label,
  onPress,
  disabled,
  tone = "navy",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "navy" | "brass" | "ghost";
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, tone === "brass" && styles.buttonBrass, tone === "ghost" && styles.buttonGhost, disabled && styles.disabled]}
    >
      <Text style={[styles.buttonText, tone === "ghost" && styles.buttonGhostText]}>{label}</Text>
    </Pressable>
  );
}

export function Field(props: TextInputProps & { label: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} style={[styles.input, style]} {...rest} />
    </View>
  );
}

export function Price({ product }: { product: Pick<Product, "pricePence" | "priceNote"> }) {
  const placeholder = /placeholder/i.test(product.priceNote);
  return (
    <View style={styles.priceRow}>
      <Text style={styles.price}>{gbp(product.pricePence)}</Text>
      <Text style={styles.priceNote}>{placeholder ? "Placeholder price" : "ex VAT"}</Text>
    </View>
  );
}

export function CatalogueNote() {
  const [health, setHealth] = useState<Health | null>(null);
  useEffect(() => {
    api<Health>("/api/health")
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);
  if (!health) return null;
  if (health.catalogueMode === "sample") {
    return (
      <View style={styles.note}>
        <Text style={styles.noteText}>
          Sample catalogue ({health.productCount} parts). Prices are placeholders until the Intact/Xline CSV is imported.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.note}>
      <Text style={styles.noteText}>Prices come from the last CSV import. Confirm the live trade price before you quote it.</Text>
    </View>
  );
}

export function AddButton({ product, qty = 1 }: { product: Product; qty?: number }) {
  const store = useStore();
  const [added, setAdded] = useState(false);
  return (
    <Button
      label={added ? "Added to basket" : "Add to basket"}
      tone="brass"
      onPress={() => {
        store.add(product, qty);
        setAdded(true);
      }}
    />
  );
}

export function Loading() {
  return <ActivityIndicator color={colors.brass} style={{ marginTop: 24 }} />;
}

export function ErrorText({ message }: { message: string }) {
  return <Text style={styles.error}>{message}</Text>;
}

export function scrollContent(extra?: ViewStyle) {
  return [styles.scroll, extra];
}

export { ScrollView };

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  brand: {
    backgroundColor: colors.navy,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  back: { paddingBottom: 2, minWidth: 44 },
  backSpacer: { width: 8 },
  backText: { color: colors.brassSoft, fontSize: 15 },
  brandText: { flex: 1 },
  kicker: { color: colors.brass, letterSpacing: 2.4, fontSize: 11, fontWeight: "700" },
  brandName: { ...serif, color: colors.cream, fontSize: 22, marginTop: 1 },
  town: { color: "#D9C7A2", fontSize: 12, paddingBottom: 4 },
  body: { flex: 1 },
  gas: {
    backgroundColor: colors.dangerBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  gasTitle: { color: colors.danger, fontWeight: "700", fontSize: 12, letterSpacing: 0.6 },
  gasBody: { color: colors.danger, fontSize: 13, lineHeight: 18, marginTop: 2 },
  button: {
    backgroundColor: colors.navy,
    borderRadius: 10,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonBrass: { backgroundColor: colors.brass },
  buttonGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.line },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  buttonGhostText: { color: colors.navy },
  disabled: { opacity: 0.45 },
  field: { marginBottom: 12 },
  fieldLabel: { color: colors.muted, fontSize: 12, marginBottom: 4, fontWeight: "600" },
  input: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  price: { ...serif, fontSize: 22, color: colors.ink },
  priceNote: { color: colors.brass, fontSize: 12, fontWeight: "700" },
  note: { backgroundColor: colors.brassSoft, borderRadius: 8, padding: 10, marginBottom: 12 },
  noteText: { color: colors.navy, fontSize: 13, lineHeight: 18 },
  error: { color: colors.danger, marginVertical: 8, lineHeight: 20 },
  scroll: { padding: 16, paddingBottom: 32 },
});
