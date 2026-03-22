import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

function ToolbarButton({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      className={`noteEditorToolbarBtn${active ? " is-active" : ""}`}
      onMouseDown={e => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default function NoteEditor({
  initialHtml,
  onChange,
  placeholder = "What is on your mind?",
  editable = true,
}) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
          codeBlock: false,
          horizontalRule: false,
        }),
        Underline,
        Placeholder.configure({
          placeholder,
        }),
      ],
      content: initialHtml?.trim() ? initialHtml : "<p></p>",
      editable,
      editorProps: {
        attributes: {
          class: "noteEditorProse",
          spellcheck: "true",
        },
      },
      onUpdate: ({ editor: ed }) => {
        onChange(ed.getHTML());
      },
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  if (!editor) {
    return <div className="noteEditor noteEditorLoading" aria-hidden="true" />;
  }

  return (
    <div className="noteEditor">
      <div className="noteEditorToolbar" role="toolbar" aria-label="Text formatting">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <span className="noteEditorToolbarIcon noteEditorToolbarIconBold">
            B
          </span>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="noteEditorToolbarIcon noteEditorToolbarIconItalic">
            I
          </span>
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="noteEditorToolbarIcon noteEditorToolbarIconUnderline">
            U
          </span>
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="noteEditorToolbarIcon">S̶</span>
        </ToolbarButton>
        <span className="noteEditorToolbarSep" aria-hidden="true" />
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolbarButton>
        <span className="noteEditorToolbarSep" aria-hidden="true" />
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “
        </ToolbarButton>
        <span className="noteEditorToolbarSep" aria-hidden="true" />
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↺
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↻
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="noteEditorSurface" />
    </div>
  );
}
