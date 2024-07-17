// components/Tiptap.js
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import YoutubeVideo from './YoutubeVideo';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import FontSize from './FontSize';  // Import FontSize extension
import Image from '@tiptap/extension-image'


const Tiptap = ({ onChange }) => {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle.configure({ types: ['textStyle'] }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),  // Configure TextAlign for heading and paragraph
            YoutubeVideo,
            Color,
            FontSize.configure({ types: ['textStyle'] }),  // Add FontSize extension
            Image,
        ],
        editorProps: {
          attributes: {
            class: "prose flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
          },
        },
        onUpdate: ({ editor }) => {
          onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full px-4">
          <Toolbar editor={editor} />
            <EditorContent 
                style={{ whiteSpace: "pre-line", cursor: "text", outline: "none", width: "100%", height: "100%", border: "none" }} 
                editor={editor} 
            />
        </div>
    );
};

export default Tiptap;
