import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "@/src/api";
import { colors, gbp, serif } from "@/src/theme";
import type { Alternative, Product } from "@/src/types";
import { AddButton, ErrorText, GasSafe, Loading, Price, Screen } from "@/src/ui";

export default function ProductScreen() {
  const params = useLocalSearchParams<{ partNumber: string }>();
  const partNumber = String(params.partNumber || "");
  const [product, setProduct] = useState<Product | null>(null);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!partNumber) return;
    api<{ product: Product; alternatives: Alternative[]; warnings: string[] }>(
      `/api/product?partNumber=${encodeURIComponent(partNumber)}`,
    )
      .then((data) => {
        setProduct(data.product);
        setAlternatives(data.alternatives);
        setWarnings(data.warnings);
      })
      .catch((err: Error) => setError(err.message));
  }, [partNumber]);

  return (
    <Screen back>
      <ScrollView contentContainerStyle={styles.scroll}>
        <GasSafe compact />
        {error ? <ErrorText message={error} /> : null}
        {!product && !error ? <Loading /> : null}
        {product && (
          <>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.number}>{product.partNumber}</Text>
            <Text style={styles.desc}>{product.description}</Text>
            <Price product={product} />
            <Text style={styles.stock}>Sample stock figure: {product.stock}</Text>
            <Text style={styles.section}>Fits</Text>
            {product.fits.split(";").map((line) => (
              <Text key={line} style={styles.fit}>
                {line.trim()}
              </Text>
            ))}
            {warnings.length > 0 && (
              <>
                <Text style={styles.section}>Cautions from the notes</Text>
                {warnings.map((warning) => (
                  <Text key={warning} style={styles.warning}>
                    {warning}
                  </Text>
                ))}
              </>
            )}
            <Text style={styles.section}>Cross-brand and cheaper alternatives</Text>
            {alternatives.length === 0 && (
              <Text style={styles.muted}>No row in the cross-brand table mentions this number. That is not proof it is unique — check the diagram.</Text>
            )}
            {alternatives.map((alt, index) => (
              <View key={`${alt.description}-${index}`} style={styles.alt}>
                <Text style={styles.altKind}>{alt.sameCompany ? "Same company — not a cross-brand swap" : "Cross-brand row"}</Text>
                <Text style={styles.altTitle}>{alt.description}</Text>
                <Text style={styles.confidence}>{alt.confidence}</Text>
                {alt.cautions ? <Text style={styles.caution}>{alt.cautions}</Text> : null}
                {alt.groupStatus ? <Text style={styles.muted}>{alt.groupStatus}</Text> : null}
                {alt.cheaperInCatalogue.map((cheaper) => (
                  <Pressable key={cheaper.partNumber} onPress={() => router.push(`/product/${encodeURIComponent(cheaper.partNumber)}`)}>
                    <Text style={styles.cheaper}>
                      Also in this catalogue: {cheaper.brand} {cheaper.partNumber} at {gbp(cheaper.pricePence)} — placeholder prices, so “cheaper” is only a hint.
                    </Text>
                  </Pressable>
                ))}
                <Text style={styles.muted}>Numbers on this row</Text>
                {alt.equivalents.slice(0, 8).map((item) => (
                  <Text key={`${item.brand}-${item.partNumber}`} style={styles.equiv}>
                    {item.brand}: {item.partNumber}
                  </Text>
                ))}
              </View>
            ))}
            <View style={{ height: 16 }} />
            <AddButton product={product} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  brand: { color: colors.muted, fontWeight: "700", letterSpacing: 0.4 },
  number: { ...serif, fontSize: 32, color: colors.navy },
  desc: { fontSize: 16, lineHeight: 22, color: colors.ink, marginVertical: 8 },
  stock: { color: colors.muted, marginTop: 4 },
  section: { ...serif, fontSize: 22, color: colors.navy, marginTop: 18, marginBottom: 6 },
  fit: { color: colors.ink, lineHeight: 20, marginBottom: 4 },
  warning: { backgroundColor: colors.dangerBg, color: colors.danger, padding: 10, borderRadius: 8, marginBottom: 8, lineHeight: 19 },
  muted: { color: colors.muted, lineHeight: 18, marginBottom: 6 },
  alt: { backgroundColor: colors.paper, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.line },
  altKind: { color: colors.brass, fontWeight: "700", fontSize: 12 },
  altTitle: { ...serif, fontSize: 18, color: colors.navy, marginVertical: 4 },
  confidence: { color: colors.ok, fontWeight: "700", marginBottom: 6 },
  caution: { color: colors.ink, lineHeight: 20, marginBottom: 6 },
  cheaper: { color: colors.navy, marginVertical: 6, lineHeight: 20 },
  equiv: { color: colors.ink, fontSize: 13, lineHeight: 18 },
});
