import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={cn(
      "px-2 py-1 rounded text-sm font-medium transition-colors min-w-[28px] h-7 flex items-center justify-center",
      active
        ? "bg-[#E63950] text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    )}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-0.5" />;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your article...",
  minHeight = 400,
}: RichTextEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: "language-" },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#E63950] underline cursor-pointer" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none prose prose-sm max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: url }).run();
    }
    setLinkUrl("");
    setLinkDialogOpen(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setImageDialogOpen(false);
  }, [editor, imageUrl]);

  if (!editor) return null;

  return (
    <div className="border border-input rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#E63950]/30 focus-within:border-[#E63950]/50 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b bg-gray-50/80 sticky top-0 z-10">
        {/* Text style */}
        <select
          title="Paragraph style"
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: parseInt(val) as 1 | 2 | 3 }).run();
          }}
          value={
            editor.isActive("heading", { level: 1 }) ? "1" :
            editor.isActive("heading", { level: 2 }) ? "2" :
            editor.isActive("heading", { level: 3 }) ? "3" : "p"
          }
          className="h-7 text-sm border border-gray-200 rounded px-1.5 bg-white text-gray-700 cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="p">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <Divider />

        {/* Inline formatting */}
        <ToolbarButton title="Bold (⌘B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton title="Italic (⌘I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton title="Underline (⌘U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <span className="font-mono text-xs">{"`"}</span>
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="2" cy="4" r="1" fill="currentColor" stroke="none" />
            <circle cx="2" cy="8" r="1" fill="currentColor" stroke="none" />
            <circle cx="2" cy="12" r="1" fill="currentColor" stroke="none" />
            <line x1="5" y1="4" x2="13" y2="4" />
            <line x1="5" y1="8" x2="13" y2="8" />
            <line x1="5" y1="12" x2="13" y2="12" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <text x="0.5" y="5.5" fontSize="5" fill="currentColor" stroke="none" fontFamily="monospace">1.</text>
            <text x="0.5" y="9.5" fontSize="5" fill="currentColor" stroke="none" fontFamily="monospace">2.</text>
            <text x="0.5" y="13.5" fontSize="5" fill="currentColor" stroke="none" fontFamily="monospace">3.</text>
            <line x1="6" y1="4" x2="13" y2="4" />
            <line x1="6" y1="8" x2="13" y2="8" />
            <line x1="6" y1="12" x2="13" y2="12" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M1 3h3l-2 4h2v4H1V7l2-4zm6 0h3l-2 4h2v4H7V7l2-4z" opacity="0.8" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="4,3 1,7 4,11" />
            <polyline points="10,3 13,7 10,11" />
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor">
            <rect y="0" width="13" height="1.5" rx="0.75" />
            <rect y="3" width="9" height="1.5" rx="0.75" />
            <rect y="6" width="13" height="1.5" rx="0.75" />
            <rect y="9" width="7" height="1.5" rx="0.75" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor">
            <rect y="0" width="13" height="1.5" rx="0.75" />
            <rect x="2" y="3" width="9" height="1.5" rx="0.75" />
            <rect y="6" width="13" height="1.5" rx="0.75" />
            <rect x="3" y="9" width="7" height="1.5" rx="0.75" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor">
            <rect y="0" width="13" height="1.5" rx="0.75" />
            <rect x="4" y="3" width="9" height="1.5" rx="0.75" />
            <rect y="6" width="13" height="1.5" rx="0.75" />
            <rect x="6" y="9" width="7" height="1.5" rx="0.75" />
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton title="Insert link" active={editor.isActive("link")} onClick={() => {
            const prev = editor.getAttributes("link").href || "";
            setLinkUrl(prev);
            setLinkDialogOpen((o) => !o);
            setImageDialogOpen(false);
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5.5 8.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L6.5 2.5" />
              <path d="M8.5 5.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" />
            </svg>
          </ToolbarButton>
          {linkDialogOpen && (
            <div className="absolute top-9 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72 flex gap-2">
              <input
                autoFocus
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addLink(); if (e.key === "Escape") setLinkDialogOpen(false); }}
                placeholder="https://example.com"
                className="flex-1 text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#E63950]"
              />
              <button type="button" onClick={addLink} className="bg-[#E63950] text-white text-sm px-3 py-1.5 rounded font-medium hover:bg-[#B52C3E] transition-colors">
                {linkUrl ? "Add" : "Remove"}
              </button>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="relative">
          <ToolbarButton title="Insert image" active={false} onClick={() => {
            setImageDialogOpen((o) => !o);
            setLinkDialogOpen(false);
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="2" width="12" height="10" rx="1.5" />
              <circle cx="4.5" cy="5.5" r="1" />
              <path d="M1 10l3-3 2 2 2.5-3 3.5 4" />
            </svg>
          </ToolbarButton>
          {imageDialogOpen && (
            <div className="absolute top-9 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72 flex gap-2">
              <input
                autoFocus
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addImage(); if (e.key === "Escape") setImageDialogOpen(false); }}
                placeholder="https://example.com/image.jpg"
                className="flex-1 text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#E63950]"
              />
              <button type="button" onClick={addImage} className="bg-[#E63950] text-white text-sm px-3 py-1.5 rounded font-medium hover:bg-[#B52C3E] transition-colors">
                Insert
              </button>
            </div>
          )}
        </div>

        <Divider />

        {/* Horizontal rule */}
        <ToolbarButton title="Horizontal rule" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <span className="text-gray-500 text-xs">—</span>
        </ToolbarButton>

        <Divider />

        {/* History */}
        <ToolbarButton title="Undo (⌘Z)" active={false} onClick={() => editor.chain().focus().undo().run()}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 5h7a4 4 0 010 8H4" />
            <polyline points="4,2 1,5 4,8" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Redo (⌘⇧Z)" active={false} onClick={() => editor.chain().focus().redo().run()}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5H5a4 4 0 000 8h4" />
            <polyline points="9,2 12,5 9,8" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div
        className="px-5 py-4 cursor-text"
        style={{ minHeight }}
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Word count */}
      <div className="px-4 py-2 border-t bg-gray-50/60 flex justify-end">
        <span className="text-xs text-gray-400">
          {editor.storage.characterCount?.words?.() ?? 0} words · {editor.storage.characterCount?.characters?.() ?? 0} chars
        </span>
      </div>

      {/* Popover overlay to close dialogs */}
      {(linkDialogOpen || imageDialogOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setLinkDialogOpen(false); setImageDialogOpen(false); }}
        />
      )}

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          min-height: ${minHeight - 60}px;
        }
        .ProseMirror h1 { font-size: 2em; font-weight: 800; margin-bottom: 0.5em; margin-top: 1em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin-bottom: 0.4em; margin-top: 1em; }
        .ProseMirror h3 { font-size: 1.25em; font-weight: 600; margin-bottom: 0.3em; margin-top: 0.8em; }
        .ProseMirror p { margin-bottom: 0.75em; line-height: 1.7; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5em; margin-bottom: 0.75em; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5em; margin-bottom: 0.75em; }
        .ProseMirror li { margin-bottom: 0.25em; }
        .ProseMirror blockquote { border-left: 3px solid #E63950; padding-left: 1em; color: #555; margin: 1em 0; font-style: italic; }
        .ProseMirror code { background: #f4f4f5; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.875em; font-family: monospace; color: #E63950; }
        .ProseMirror pre { background: #1e1e2e; color: #cdd6f4; padding: 1em 1.25em; border-radius: 8px; overflow-x: auto; margin-bottom: 0.75em; }
        .ProseMirror pre code { background: none; color: inherit; padding: 0; font-size: 0.875em; }
        .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1.5em 0; }
        .ProseMirror img { max-width: 100%; border-radius: 8px; margin: 0.75em 0; }
        .ProseMirror a { color: #E63950; text-decoration: underline; cursor: pointer; }
      `}</style>
    </div>
  );
}
