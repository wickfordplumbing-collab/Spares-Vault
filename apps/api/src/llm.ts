import type { AppConfig } from "./config.js";

export type LlmMessage = { role: "user" | "assistant"; content: string };

export interface LlmProvider {
  id: string;
  complete(system: string, messages: LlmMessage[]): Promise<string>;
}

export class MockProvider implements LlmProvider {
  id = "mock";
  async complete(): Promise<string> {
    throw new Error("Mock provider does not call a model");
  }
}

export class OpenAiProvider implements LlmProvider {
  id = "openai";
  constructor(
    private apiKey: string,
    private model: string,
  ) {}

  async complete(system: string, messages: LlmMessage[]): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI error ${response.status}: ${(await response.text()).slice(0, 300)}`);
    }
    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI returned an empty response");
    return content;
  }
}

export class AnthropicProvider implements LlmProvider {
  id = "anthropic";
  constructor(
    private apiKey: string,
    private model: string,
  ) {}

  async complete(system: string, messages: LlmMessage[]): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1800,
        temperature: 0.2,
        system,
        messages,
      }),
    });
    if (!response.ok) {
      throw new Error(`Anthropic error ${response.status}: ${(await response.text()).slice(0, 300)}`);
    }
    const payload = (await response.json()) as { content?: { type: string; text?: string }[] };
    const text = payload.content?.filter((block) => block.type === "text").map((block) => block.text || "").join("\n");
    if (!text) throw new Error("Anthropic returned an empty response");
    return text;
  }
}

export function createProvider(config: AppConfig): LlmProvider {
  if (config.llmProvider === "openai" && config.openaiApiKey) {
    return new OpenAiProvider(config.openaiApiKey, config.openaiModel);
  }
  if (config.llmProvider === "anthropic" && config.anthropicApiKey) {
    return new AnthropicProvider(config.anthropicApiKey, config.anthropicModel);
  }
  return new MockProvider();
}
