import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

const TipTap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
        ],
        content: `
        <p>Start writing here</p>
    `,
    });
    return <EditorContent editor={editor} />;
};

export default TipTap;