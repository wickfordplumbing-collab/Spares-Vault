import { Link } from "expo-router";
import { Text, View } from "react-native";
import { colors, serif } from "@/src/theme";

export default function NotFound() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, padding: 24, justifyContent: "center" }}>
      <Text style={{ ...serif, fontSize: 28, color: colors.navy }}>That page is not on the counter.</Text>
      <Link href="/" style={{ marginTop: 16, color: colors.brass, fontWeight: "700" }}>
        Back to Help
      </Link>
    </View>
  );
}
