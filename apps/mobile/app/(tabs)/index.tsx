import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "@/src/api";
import { colors, serif } from "@/src/theme";
import type { ChatResponse } from "@/src/types";
import { AddButton, ErrorText, GasSafe, Loading, Price, Screen } from "@/src/ui";

type Turn = { role: "user" | "assistant"; content: string; response?: ChatResponse };

const EXAMPLES = [
  "Vaillant ecoTEC plus 831 F.24",
  "Ideal Logic Combi 30, hot water cold, heating fine",
  "Worcester 28i Junior keeps losing pressure",
];

export default function HelpScreen() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history = [...turns, { role: "user" as const, content }];
    setTurns(history);
    setDraft("");
    setBusy(true);
    setError("");
    try {
      const response = await api<ChatResponse>("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: history.map((turn) => ({ role: turn.role, content: turn.content })),
        }),
      });
      setTurns((current) => [...current, { role: "assistant", content: response.reply, response }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The assistant could not be reached");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <GasSafe />
          <Text style={styles.heading}>Diagnose a fault</Text>
          <Text style={styles.lead}>
            Describe the fault, or give the make, model, GC number and the code on the display. The counter notes walk the checks, then suggest parts.
          </Text>
          {turns.length === 0 && (
            <View style={styles.examples}>
              {EXAMPLES.map((example) => (
                <Pressable key={example} style={styles.example} onPress={() => send(example)}>
                  <Text style={styles.exampleText}>{example}</Text>
                </Pressable>
              ))}
            </View>
          )}
          {turns.map((turn, index) =>
            turn.role === "user" ? (
              <View key={index} style={styles.userBubble}>
                <Text style={styles.userText}>{turn.content}</Text>
              </View>
            ) : (
              <AssistantTurn key={index} turn={turn} />
            ),
          )}
          {busy && <Loading />}
          {error ? <ErrorText message={error} /> : null}
        </ScrollView>
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="e.g. Vaillant ecoTEC plus 831 F.24"
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
          />
          <Pressable style={styles.send} onPress={() => send(draft)} disabled={busy}>
            <Text style={styles.sendText}>Ask</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function AssistantTurn({ turn }: { turn: Turn }) {
  const response = turn.response;
  return (
    <View style={styles.assistant}>
      <Text style={styles.mode}>{response?.mode === "mock" ? "Offline notes" : `Assistant · ${response?.mode}`}</Text>
      <Text style={styles.reply}>{turn.content}</Text>
      {response?.steps.map((step) => (
        <View key={step.title} style={styles.step}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepBody}>{step.detail}</Text>
        </View>
      ))}
      {response?.parts.map((part) => (
        <View key={part.partNumber} style={styles.part}>
          <Text style={styles.partBrand}>{part.brand}</Text>
          <Text style={styles.partNumber}>{part.partNumber}</Text>
          <Text style={styles.partDesc}>{part.description}</Text>
          <Text style={styles.why}>{part.why}</Text>
          <Price product={part} />
          <View style={{ height: 8 }} />
          <AddButton product={part} />
        </View>
      ))}
      {response && response.sources.length > 0 && (
        <Text style={styles.sources}>
          Notes used: {response.sources.map((source) => source.file).filter((file, i, all) => all.indexOf(file) === i).join(", ")}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 24 },
  heading: { ...serif, fontSize: 28, color: colors.navy, marginBottom: 6 },
  lead: { color: colors.muted, fontSize: 15, lineHeight: 21, marginBottom: 12 },
  examples: { gap: 8, marginBottom: 8 },
  example: { backgroundColor: colors.paper, borderRadius: 10, borderWidth: 1, borderColor: colors.line, padding: 12 },
  exampleText: { color: colors.navy, fontSize: 15 },
  userBubble: { alignSelf: "flex-end", backgroundColor: colors.navy, borderRadius: 14, padding: 12, marginVertical: 8, maxWidth: "90%" },
  userText: { color: colors.cream, fontSize: 15, lineHeight: 21 },
  assistant: { marginBottom: 8 },
  mode: { color: colors.brass, fontSize: 12, fontWeight: "700", marginBottom: 4 },
  reply: { color: colors.ink, fontSize: 16, lineHeight: 23 },
  step: { backgroundColor: colors.paper, borderRadius: 10, padding: 12, marginTop: 10, borderWidth: 1, borderColor: colors.line },
  stepTitle: { fontWeight: "700", color: colors.navy, marginBottom: 4 },
  stepBody: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  part: { backgroundColor: colors.paper, borderRadius: 12, padding: 12, marginTop: 10, borderWidth: 1, borderColor: colors.brassSoft },
  partBrand: { color: colors.muted, fontSize: 12, fontWeight: "700", letterSpacing: 0.4 },
  partNumber: { ...serif, fontSize: 20, color: colors.navy },
  partDesc: { color: colors.ink, marginBottom: 6 },
  why: { color: colors.muted, fontSize: 13, lineHeight: 18, marginBottom: 8 },
  sources: { color: colors.muted, fontSize: 12, marginTop: 8 },
  composer: { flexDirection: "row", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.cream },
  input: { flex: 1, minHeight: 48, maxHeight: 100, backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.ink },
  send: { backgroundColor: colors.navy, borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "700" },
});
