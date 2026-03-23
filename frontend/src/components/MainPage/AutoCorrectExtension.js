import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const COMMON_TYPO_FIXES = [
  { typo: "teh", fixed: "the" },
  { typo: "adn", fixed: "and" },
  { typo: "recieve", fixed: "receive" },
  { typo: "seperate", fixed: "separate" },
  { typo: "definately", fixed: "definitely" },
  { typo: "occured", fixed: "occurred" },
  { typo: "becuase", fixed: "because" },
  { typo: "thier", fixed: "their" },
  { typo: "writting", fixed: "writing" },
  { typo: "enviroment", fixed: "environment" },
  { typo: "dont", fixed: "don't" },
  { typo: "cant", fixed: "can't" },
  { typo: "wont", fixed: "won't" },
  { typo: "im", fixed: "I'm" },
  { typo: "ive", fixed: "I've" },
  { typo: "ill", fixed: "I'll" },
  { typo: "id", fixed: "I'd" },
];

const TYPO_LOOKUP = COMMON_TYPO_FIXES.reduce((acc, entry) => {
  acc[entry.typo] = entry.fixed;
  return acc;
}, {});
const TYPO_PATTERN = new RegExp(
  `\\b(${Object.keys(TYPO_LOOKUP)
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "gi"
);

function preserveCase(originalWord, replacement) {
  const first = originalWord?.[0];
  if (first && first === first.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

const AutoCorrectExtension = Extension.create({
  name: "autoCorrectExtension",

  addProseMirrorPlugins() {
    const getSpellCheckDecorations = doc => {
      const decorations = [];

      doc.descendants((node, pos) => {
        if (!node.isText || !node.text) return;

        TYPO_PATTERN.lastIndex = 0;
        let match = TYPO_PATTERN.exec(node.text);
        while (match) {
          const typedWord = match[0];
          const suggestion = TYPO_LOOKUP[typedWord.toLowerCase()];
          if (suggestion) {
            const from = pos + match.index;
            const to = from + typedWord.length;
            decorations.push(
              Decoration.inline(from, to, {
                class: "spellError",
                title: `Did you mean "${preserveCase(typedWord, suggestion)}"?`,
              })
            );
          }
          match = TYPO_PATTERN.exec(node.text);
        }
      });

      return DecorationSet.create(doc, decorations);
    };

    return [
      new Plugin({
        state: {
          init: (_, state) => getSpellCheckDecorations(state.doc),
          apply: (tr, oldDecorations, _oldState, newState) => {
            if (!tr.docChanged) return oldDecorations;
            return getSpellCheckDecorations(newState.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleTextInput: (view, from, to, text) => {
            if (!/[\s.,!?;:)\]\n]/.test(text)) return false;

            const { state } = view;
            const $from = state.doc.resolve(from);
            const blockStart = $from.start();
            const beforeCursor = state.doc.textBetween(
              blockStart,
              from,
              " ",
              " "
            );
            const match = beforeCursor.match(/([A-Za-z']+)$/);
            if (!match) return false;

            const typedWord = match[1];
            const correction = TYPO_LOOKUP[typedWord.toLowerCase()];
            if (!correction) return false;

            const replacement = preserveCase(typedWord, correction);
            const wordStart = from - typedWord.length;
            const tr = state.tr.insertText(replacement, wordStart, from);
            view.dispatch(tr);
            return false;
          },
        },
      }),
    ];
  },
});

export default AutoCorrectExtension;
