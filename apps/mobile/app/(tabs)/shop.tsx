import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "@/src/api";
import { colors, serif } from "@/src/theme";
import type { SearchHit } from "@/src/types";
import { CatalogueNote, ErrorText, GasSafe, Loading, Price, Screen } from "@/src/ui";

export default function ShopScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function search(next = query) {
    const q = next.trim();
    if (!q) return;
    setQuery(q);
    setBusy(true);
    setError("");
    try {
      const data = await api<{ results: SearchHit[] }>(`/api/search?q=${encodeURIComponent(q)}`);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Find a part</Text>
        <Text style={styles.lead}>Part number, GC number, boiler model, or a plain description.</Text>
        <CatalogueNote />
        <View style={styles.row}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => search()}
            placeholder="the blue valve under the boiler"
            placeholderTextColor={colors.muted}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable style={styles.go} onPress={() => search()}>
            <Text style={styles.goText}>Search</Text>
          </Pressable>
        </View>
        <View style={styles.chips}>
          {["175591", "47-044-32", "ecoTEC plus 831", "the blue valve under the boiler"].map((chip) => (
            <Pressable key={chip} style={styles.chip} onPress={() => search(chip)}>
              <Text style={styles.chipText}>{chip}</Text>
            </Pressable>
          ))}
        </View>
        <GasSafe compact />
        {busy && <Loading />}
        {error ? <ErrorText message={error} /> : null}
        {results && results.length === 0 && <Text style={styles.empty}>Nothing in the catalogue matches that. Try the GC number or a manufacturer part number.</Text>}
        {results?.map((hit) => (
          <Pressable
            key={hit.partNumber}
            style={styles.card}
            onPress={() => router.push(`/product/${encodeURIComponent(hit.partNumber)}`)}
          >
            <Text style={styles.reason}>{hit.reason}</Text>
            <Text style={styles.brand}>{hit.brand}</Text>
            <Text style={styles.number}>{hit.partNumber}</Text>
            <Text style={styles.desc}>{hit.description}</Text>
            <Text style={styles.fits} numberOfLines={2}>{hit.fits}</Text>
            <Price product={hit} />
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  heading: { ...serif, fontSize: 28, color: colors.navy },
  lead: { color: colors.muted, marginTop: 4, marginBottom: 12, lineHeight: 20 },
  row: { flexDirection: "row", gap: 8 },
  input: { flex: 1, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: 10, paddingHorizontal: 12, minHeight: 48, fontSize: 16, color: colors.ink },
  go: { backgroundColor: colors.navy, borderRadius: 10, paddingHorizontal: 14, justifyContent: "center" },
  goText: { color: "#fff", fontWeight: "700" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 12 },
  chip: { backgroundColor: colors.chip, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { color: colors.navy, fontSize: 12 },
  empty: { color: colors.muted, lineHeight: 20 },
  card: { backgroundColor: colors.paper, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.line },
  reason: { color: colors.brass, fontSize: 11, fontWeight: "700", letterSpacing: 0.4 },
  brand: { color: colors.muted, marginTop: 4, fontSize: 12, fontWeight: "700" },
  number: { ...serif, fontSize: 20, color: colors.navy },
  desc: { color: colors.ink, marginVertical: 4, lineHeight: 20 },
  fits: { color: colors.muted, fontSize: 13, marginBottom: 6 },
});
