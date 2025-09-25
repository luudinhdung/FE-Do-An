import { SENSITIVE_WORDS } from "./sensitiveWords";

export function filterSensitiveWords(text: string): string {
  let filtered = text;
  for (const word of SENSITIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    filtered = filtered.replace(regex, "***");
  }
  return filtered;
}
