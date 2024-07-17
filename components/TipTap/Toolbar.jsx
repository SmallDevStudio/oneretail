// components/Toolbar.js
import React, { useState } from "react";
import {
  Bold, Strikethrough, Italic, List, ListOrdered, Heading2,
  Underline, Quote, Undo, Redo, Code, Image as ImageIcon, Youtube,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, AArrowUp, AArrowDown 
} from "lucide-react";
import { SketchPicker } from "react-color";  // Import SketchPicker from react-color
import ImageUploadModal from "../media/ImageUploadModal";

const Toolbar = ({ editor }) => {
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");

  if (!editor) {
    return null;
  }

  const handleImageModalOpen = () => setImageModalOpen(true);
  const handleImageModalClose = () => setImageModalOpen(false);

  const handleAddYoutube = () => {
    const url = prompt("Enter YouTube URL:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    editor.chain().focus().setColor(color.hex).run();
  };

  const handleFontSizeChange = (size) => {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  const increaseFontSize = () => {
    const currentSize = parseInt(editor.getAttributes('textStyle').fontSize) || 16;
    handleFontSizeChange(`${currentSize + 2}px`);
  };

  const decreaseFontSize = () => {
    const currentSize = parseInt(editor.getAttributes('textStyle').fontSize) || 16;
    handleFontSizeChange(`${currentSize - 2}px`);
  };

  return (
    <div
      className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-start
        gap-5 w-full flex-wrap border border-gray-700"
    >
      <div className="flex justify-start items-center gap-5 w-full lg:w-10/12 flex-wrap ">
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('left').run();
          }}
          className={
            editor.isActive({ textAlign: 'left' })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('center').run();
          }}
          className={
            editor.isActive({ textAlign: 'center' })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('right').run();
          }}
          className={
            editor.isActive({ textAlign: 'right' })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <AlignRight className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign('justify').run();
          }}
          className={
            editor.isActive({ textAlign: 'justify' })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <AlignJustify className="w-5 h-5" />
        </button>

        <span className="text-gray-400">|</span>

        <select
          onChange={(e) => handleFontSizeChange(e.target.value)}
          defaultValue="16px"
          className="text-gray-400 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
        </select>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            increaseFontSize();
          }}
          className="text-gray-400 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
        >
          <AArrowUp className="w-5 h-5" />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            decreaseFontSize();
          }}
          className="text-gray-400 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
        >
          <AArrowDown className="w-5 h-5" />
        </button>

        <span className="text-gray-400">|</span>

        <button
          onClick={(e) => {
            e.preventDefault();
            setColorPickerVisible(!colorPickerVisible);
          }}
          className="text-gray-400 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: currentColor,
              borderRadius: "4px",
            }}
          />
        </button>

        {colorPickerVisible && (
          <div className="absolute z-10">
            <SketchPicker
              color={currentColor}
              onChange={handleColorChange}
              presetColors={["#0056FF", "#F68B1F", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]}
            />
          </div>
        )}


        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive("bold")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive("italic")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive("underline")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <Underline className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive("strike")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <Heading2 className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive("bulletList")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive("orderedList")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive("blockquote")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <Quote className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setCode().run();
          }}
          className={
            editor.isActive("code")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400"
          }
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleImageModalOpen();
          }}
          className="text-gray-400 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
        >
        <ImageIcon className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleAddYoutube();
          }}
          className="text-gray-400 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
        >
          <Youtube className="w-5 h-5" />
        </button>

        <span className="text-gray-400">|</span>
        
        
        
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            editor.isActive("undo")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            editor.isActive("redo")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-400 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Redo className="w-5 h-5" />
        </button>
        
      </div>
      <ImageUploadModal isOpen={isImageModalOpen} onClose={handleImageModalClose} editor={editor} />
    </div>
  );
};

export default Toolbar;
