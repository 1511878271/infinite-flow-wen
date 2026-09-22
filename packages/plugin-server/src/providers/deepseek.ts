import { z } from "zod";
import { fetchJson } from "../lib/http.js";
import { ApiError } from "../lib/errors.js";

const envSchema = z.object({
  DEEPSEEK_API_KEY: z.string().optional().default(""),
});

export async function deepseekChat(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  jsonMode: boolean = false
): Promise<{ text: string }> {
  const { DEEPSEEK_API_KEY } = envSchema.parse(process.env);
  
  if (!DEEPSEEK_API_KEY) {
    throw new ApiError("UNAUTHORIZED", 401, "DeepSeek API key is not configured in .env");
  }

  const url = "https://api.deepseek.com/chat/completions";

  try {
    const body: any = {
      model: "deepseek-chat",
      messages,
      temperature: jsonMode ? 0.2 : 0.7,
      max_tokens: jsonMode ? 1400 : 500
    };
    if (jsonMode) {
      body.response_format = { type: "json_object" };
    }

    const res = await fetchJson<any>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const reply = res.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error("No content in response");
    }

    return { text: reply };
  } catch (error: any) {
    throw new ApiError("UPSTREAM_ERROR", 502, `DeepSeek API Error: ${error.message}`);
  }
}
