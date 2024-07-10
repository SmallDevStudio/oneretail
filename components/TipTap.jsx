import { useState, useEffect } from "react";
import { BubbleMenu, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';


const TipTap = () => {
    const editor = useEditor({
        // register extensions
        extensions: [
            StarterKit, Document, Paragraph, Text
        ],
        content: `<p>Example Text</p>`,
        // place the cursor in the editor after initialization
        autofocus: true,
        // make the text editable (but that’s the default anyway)
        editable: true,
        // disable the loading of the default CSS (which is not much anyway)
        injectCSS: false,
    });

    const [isEditable, setIsEditable] = useState(true)

    useEffect(() => {
        if (editor) {
          editor.setEditable(isEditable)
        }
      }, [isEditable, editor])

    return (
        <>
        <div className="control-group">
            <label>
            <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)} />
            Editable
            </label>
        </div>

        {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="bubble-menu">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
            >
                Strike
            </button>
            </div>
        </BubbleMenu>}
        <EditorContent editor={editor} />
        </>
    );
};

export default TipTap;