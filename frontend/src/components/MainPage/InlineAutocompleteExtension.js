import { Extension } from "@tiptap/core";
import InlineSuggestion from "@sereneinserenade/tiptap-inline-suggestion";
import { Plugin } from "prosemirror-state";
import wordFrequencies from "subtlex-word-frequencies";

const MINIMUM_PREFIX_LENGTH = 3;
const WORD_LIMIT = 30000;
const WORD_PATTERN = /^[A-Za-z][A-Za-z'-]+$/;
const wordsByPrefix = wordFrequencies
  .slice(0, WORD_LIMIT)
  .reduce((index, { word }) => {
    if (!WORD_PATTERN.test(word) || word.length <= MINIMUM_PREFIX_LENGTH) {
      return index;
    }

    const normalizedWord = word.toLowerCase();
    const prefix = normalizedWord.slice(0, MINIMUM_PREFIX_LENGTH);
    if (!index[prefix]) index[prefix] = [];
    index[prefix].push(normalizedWord);
    return index;
  }, {});

export function getInlineCompletion(query) {
  const partialWord = query.match(/[A-Za-z][A-Za-z'-]*$/)?.[0] || "";
  if (partialWord.length < MINIMUM_PREFIX_LENGTH) return "";

  const normalizedPartial = partialWord.toLowerCase();
  const candidates =
    wordsByPrefix[normalizedPartial.slice(0, MINIMUM_PREFIX_LENGTH)] || [];
  const matchingWord = candidates.find(
    word =>
      word.length > normalizedPartial.length &&
      word.startsWith(normalizedPartial)
  );
  if (!matchingWord) return "";

  const suffix = matchingWord.slice(normalizedPartial.length);
  return partialWord === partialWord.toUpperCase()
    ? suffix.toUpperCase()
    : suffix;
}

function clearSuggestion(editor) {
  editor.storage.inlineSuggestion.data = {};
  editor.view.dispatch(editor.state.tr.setMeta("addToHistory", false));
}

function acceptSuggestion(editor) {
  const suggestion = editor.storage.inlineSuggestion.data.currentSuggestion;
  if (!suggestion) return false;

  editor.storage.inlineSuggestion.data = {};
  editor.chain().insertContent(suggestion).focus().run();
  return true;
}

function moveFocusFromEditor(editor, moveBackward) {
  const focusableElements = Array.from(
    document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])'
    )
  );
  const editorIndex = focusableElements.findIndex(
    element => element === editor.view.dom || element.contains(editor.view.dom)
  );
  const nextIndex = editorIndex + (moveBackward ? -1 : 1);
  const nextElement = focusableElements[nextIndex];

  if (nextElement) {
    nextElement.focus();
  } else {
    editor.commands.blur();
  }
}

const InlineAutocompleteControls = Extension.create({
  name: "inlineAutocompleteControls",
  priority: 200,

  addProseMirrorPlugins() {
    const editor = this.editor;
    let refreshScheduled = false;

    return [
      new Plugin({
        view() {
          return {
            update(view, previousState) {
              if (previousState.doc.eq(view.state.doc) || refreshScheduled) return;
              refreshScheduled = true;
              Promise.resolve().then(() => {
                refreshScheduled = false;
                editor.commands.fetchSuggestion();
              });
            },
          };
        },
        props: {
          handleDOMEvents: {
            keydown: (_view, event) => {
              const hasSuggestion = Boolean(
                editor.storage.inlineSuggestion.data.currentSuggestion
              );

              if (event.key === "Tab") {
                event.preventDefault();
                if (hasSuggestion) {
                  acceptSuggestion(editor);
                } else {
                  moveFocusFromEditor(editor, event.shiftKey);
                }
                return true;
              }

              if (event.key === "ArrowRight" && hasSuggestion) {
                event.preventDefault();
                acceptSuggestion(editor);
                return true;
              }

              if (event.key === "Escape" && hasSuggestion) {
                event.preventDefault();
                clearSuggestion(editor);
                return true;
              }

              if (hasSuggestion) {
                clearSuggestion(editor);
              }

              return false;
            },
          },
        },
      }),
    ];
  },
});

const InlineAutocompleteExtension = [
  InlineAutocompleteControls,
  InlineSuggestion.configure({
    fetchAutocompletion: async query => getInlineCompletion(query),
  }),
];

export default InlineAutocompleteExtension;
