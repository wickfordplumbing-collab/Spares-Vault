import type { ExpoConfig } from "expo/config";

export default ({ config }: { config: ExpoConfig }): ExpoConfig => {
  const raw = process.env.EXPO_PUBLIC_BASE_PATH?.trim() ?? "";
  const baseUrl = raw ? (raw.startsWith("/") ? raw.replace(/\/$/, "") : `/${raw.replace(/\/$/, "")}`) : "";
  return {
    ...config,
    experiments: {
      ...(config.experiments ?? {}),
      typedRoutes: false,
      ...(baseUrl ? { baseUrl } : {}),
    },
  };
};
