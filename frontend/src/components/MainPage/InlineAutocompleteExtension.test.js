import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import InlineAutocompleteExtension, {
  getInlineCompletion,
} from "./InlineAutocompleteExtension";

function createEditor(content = "<p></p>") {
  const element = document.createElement("div");
  document.body.appendChild(element);

  return new Editor({
    element,
    content,
    extensions: [StarterKit, ...InlineAutocompleteExtension],
  });
}

async function typeAndWait(editor, text) {
  text.split("").forEach(character => {
    pressKey(editor, character);
    editor.commands.insertContent(character);
  });
  await Promise.resolve();
  await Promise.resolve();
}

function pressKey(editor, key) {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key,
  });
  editor.view.dom.dispatchEvent(event);
  return event;
}

describe("inline autocomplete", () => {
  let editor;

  afterEach(async () => {
    if (editor) {
      editor.storage.inlineSuggestion.data = {};
    }
    editor?.destroy();
    document.body.innerHTML = "";
    await new Promise(resolve => setTimeout(resolve, 80));
  });

  test("accepts an active suggestion with Tab", async () => {
    editor = createEditor();
    await typeAndWait(editor, "comp");

    pressKey(editor, "Tab");

    expect(editor.getText()).toBe("company");
  });

  test("accepts an active suggestion with Right Arrow", async () => {
    editor = createEditor();
    await typeAndWait(editor, "doc");

    pressKey(editor, "ArrowRight");

    expect(editor.getText()).toBe("doctor");
  });

  test("dismisses an active suggestion with Escape", async () => {
    editor = createEditor();
    await typeAndWait(editor, "aut");

    pressKey(editor, "Escape");

    expect(editor.getText()).toBe("aut");
    expect(editor.storage.inlineSuggestion.data.currentSuggestion).toBeUndefined();
  });

  test("replaces a suggestion as the user continues typing", async () => {
    editor = createEditor();
    await typeAndWait(editor, "sug");
    expect(editor.storage.inlineSuggestion.data.currentSuggestion).toBe("gest");

    await typeAndWait(editor, "g");
    await new Promise(resolve => setTimeout(resolve, 60));

    expect(editor.storage.inlineSuggestion.data.currentSuggestion).toBe("est");
  });

  test("returns no suggestion for unrelated text", () => {
    expect(getInlineCompletion("xyq")).toBe("");
  });

  test("matches only the current word", () => {
    expect(getInlineCompletion("A short comp")).toBe("any");
  });

  test("preserves uppercase input", () => {
    expect(getInlineCompletion("COM")).toBe("E");
  });

  test("preserves focus navigation for Tab with no active suggestion", () => {
    editor = createEditor();
    const nextButton = document.createElement("button");
    document.body.appendChild(nextButton);
    editor.commands.focus();

    pressKey(editor, "Tab");

    expect(document.activeElement).toBe(nextButton);
  });

  test("lets Space insert only a space when a suggestion is active", async () => {
    editor = createEditor();
    await typeAndWait(editor, "doc");

    const event = pressKey(editor, " ");
    editor.commands.insertContent(" ");

    expect(event.defaultPrevented).toBe(false);
    expect(editor.getText()).toBe("doc ");
    expect(editor.storage.inlineSuggestion.data.currentSuggestion).toBeUndefined();
  });

  test("preserves Right Arrow behavior with no active suggestion", () => {
    editor = createEditor();

    expect(pressKey(editor, "ArrowRight").defaultPrevented).toBe(false);
  });
});
