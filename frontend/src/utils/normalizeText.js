export function normalizeText(text) {
  if (text == null || typeof text !== "string") {
    return text;
  }
  return text.replace(/[^\S\r\n]+/g, " ").trim();
}
