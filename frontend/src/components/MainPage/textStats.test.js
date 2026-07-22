import { getTextStats } from "./textStats";

describe("getTextStats", () => {
  test("returns zero counts for empty text", () => {
    expect(getTextStats()).toEqual({ characters: 0, words: 0 });
  });

  test("counts words separated by varied whitespace", () => {
    expect(getTextStats("  one\ntwo\tthree  ")).toEqual({
      characters: 17,
      words: 3,
    });
  });

  test("keeps punctuation within a word", () => {
    expect(getTextStats("Hello, world!")).toEqual({
      characters: 13,
      words: 2,
    });
  });
});
