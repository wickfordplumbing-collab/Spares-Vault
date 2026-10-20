import { Platform, type TextStyle } from "react-native";

export const colors = {
  navy: "#0B1F33",
  navyMid: "#14324A",
  brass: "#A97832",
  brassSoft: "#F3E6CC",
  cream: "#F4F0E6",
  paper: "#FFFCF7",
  ink: "#1C1915",
  muted: "#5E584E",
  line: "#E3D9C8",
  danger: "#7A2E2A",
  dangerBg: "#F8EBE6",
  ok: "#1E5C3A",
  okBg: "#E5F2EA",
  chip: "#EADFCB",
};

export const serif: TextStyle = {
  fontFamily: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "Georgia, 'Iowan Old Style', Palatino, serif",
  }),
};

export function gbp(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}
