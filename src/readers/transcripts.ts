import { readFileSync } from "fs";
import type { CondensedTranscript, TranscriptMessage } from "../types.js";

const MAX_TURN_LENGTH = 500;

export function readCondensedTranscript(sessionPath: string): CondensedTranscript {
  const raw = readFileSync(sessionPath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());

  const messages: TranscriptMessage[] = lines.map((l) => JSON.parse(l) as TranscriptMessage);

  let sessionId = "";
  const turns: Array<{ role: string; text: string }> = [];

  for (const msg of messages) {
    if (!sessionId && msg.sessionId) sessionId = msg.sessionId;

    if (msg.type !== "user" && msg.type !== "assistant") continue;
    if (!msg.message?.content) continue;

    // Handle string content (user messages can be plain strings)
    const contentArr = Array.isArray(msg.message.content)
      ? msg.message.content
      : [{ type: "text" as const, text: String(msg.message.content) }];

    const textParts = contentArr.filter(
      (item) =>
        item.type === "text" &&
        item.text &&
        !item.name?.includes("thinking")
    );

    // Skip entries with tool_result or tool_use content
    const hasToolContent = contentArr.some(
      (item) => item.type === "tool_result" || item.type === "tool_use"
    );
    if (hasToolContent) continue;

    const text = textParts.map((p) => p.text).join("\n");
    if (!text) continue;

    turns.push({ role: msg.message.role, text });
  }

  // Take first 5 + last 5 if more than 10
  let condensed = turns;
  if (turns.length > 10) {
    condensed = [...turns.slice(0, 5), ...turns.slice(-5)];
  }

  // Truncate each turn
  condensed = condensed.map((t) => ({
    role: t.role,
    text: t.text.length > MAX_TURN_LENGTH ? t.text.slice(0, MAX_TURN_LENGTH) + "..." : t.text,
  }));

  return {
    sessionId,
    turns: condensed,
    messageCount: messages.length,
  };
}
