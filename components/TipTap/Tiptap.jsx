// components/Tiptap.js
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import ImageResize from 'tiptap-extension-resize-image';
import YouTube from './YoutubeVideo';

const Tiptap = ({ onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      Image,
      ImageResize,
      YouTube.configure({
        controls: true,
        nocookie: false,
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-black items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none cursor-text",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content: '<p style="color: black;">&nbsp;</p>',
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full px-4">
      <Toolbar editor={editor} />
      <EditorContent
        className="editor"
        style={{ whiteSpace: "pre-wrap", cursor: "text", outline: "none", width: "100%", height: "100%", border: "none" }} 
        editor={editor} 
      />
    </div>
  );
};

export default Tiptap;
