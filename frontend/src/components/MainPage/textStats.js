export function getTextStats(text = "") {
  const trimmedText = text.trim();

  return {
    characters: text.length,
    words: trimmedText ? trimmedText.split(/\s+/).length : 0,
  };
}
