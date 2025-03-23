import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontSize from "@/components/Tiptap/extensions/FontSize";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import ImageResize from "tiptap-extension-resize-image";
import Image from "@tiptap/extension-image";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdTextFields,
  MdFormatColorText,
  MdAdd,
  MdAddPhotoAlternate,
  MdTableChart,
  MdUndo,
  MdRedo,
  MdCode,
  MdVisibility,
} from "react-icons/md";
import { GrBlockQuote } from "react-icons/gr";
import { BiCodeBlock } from "react-icons/bi";
import { FaYoutube } from "react-icons/fa6";
import {
  Divider,
  Tooltip,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import Upload from "../utils/Upload";
import { Dialog, Slide } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TiptapEditor = ({ content, onChange }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [fontSize, setFontSize] = useState("16px");
  const [fontColor, setFontColor] = useState("#000000");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [heading, setHeading] = useState("paragraph");
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(
    content || "<p>Start typing here...</p>"
  );
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [files, setFiles] = useState(null);
  const [selectedImagePos, setSelectedImagePos] = useState(null); // ตำแหน่งของภาพที่เลือก
  const [showImageAlignMenu, setShowImageAlignMenu] = useState(false);
  const imageAlignOptions = [
    { label: "ชิดซ้าย", className: "float-left mr-4" },
    { label: "อยู่กลาง", className: "mx-auto block" },
    { label: "ชิดขวา", className: "float-right ml-4" },
  ];
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [selectedCellPos, setSelectedCellPos] = useState(null);
  const [showTableBorderMenu, setShowTableBorderMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5] }), // รองรับ H1 - H5
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      FontSize,
      Blockquote,
      CodeBlock,
      Table.configure({ resizable: true }), // เปิดให้ปรับขนาดตาราง
      TableRow,
      TableCell,
      TableHeader,
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: null,
            },
            style: {
              default: null,
            },
          };
        },
      }),
      ImageResize,
    ],
    content: editorContent || "<p>Start typing here...</p>",
    onUpdate: ({ editor }) => {
      if (!isHtmlMode) {
        onChange(editor.getHTML());
        setHtmlContent(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    setEditorContent(content); // ✅ อัปเดตค่าทุกครั้งที่เปลี่ยนภาษา
    if (editor) {
      editor.commands.setContent(content, false); // ✅ รีเซ็ตค่าตามภาษาใหม่
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // ตรวจสอบ Heading ปัจจุบันเมื่อมีการเปลี่ยนแปลง selection
  useEffect(() => {
    if (!editor) return;

    const updateHeadingState = () => {
      if (editor.isActive("paragraph")) {
        setHeading("paragraph");
      } else {
        for (let level = 1; level <= 5; level++) {
          if (editor.isActive("heading", { level })) {
            setHeading(`h${level}`);
            return;
          }
        }
      }
    };

    editor.on("selectionUpdate", updateHeadingState);

    return () => {
      editor.off("selectionUpdate", updateHeadingState);
    };
  }, [editor]);

  useEffect(() => {
    if (files && files.url) {
      editor
        .chain()
        .focus()
        .setImage({
          src: files.url,
          class: "float-right ml-4 w-1/2", // 👈 ใช้ tailwind หรือ custom CSS ได้เลย
        })
        .run();
    }
  }, [files, editor]);

  useEffect(() => {
    if (!editor) return;

    const handleClick = ({ event }) => {
      const imageEl = event?.target?.closest("img");
      if (imageEl) {
        setSelectedImagePos(editor.state.selection.from);
        setShowImageAlignMenu(true);
      } else {
        setShowImageAlignMenu(false);
      }
    };

    editor.on("click", handleClick);

    return () => {
      editor.off("click", handleClick);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleClick = ({ event }) => {
      const cell = event?.target?.closest("td, th");
      if (cell) {
        setSelectedCellPos(editor.state.selection.from);
        setShowTableBorderMenu(true);
      } else {
        setShowTableBorderMenu(false);
      }
    };

    editor.on("click", handleClick);

    return () => {
      editor.off("click", handleClick);
    };
  }, [editor]);

  if (!editor) return null;

  const applyImageAlignment = (className) => {
    if (!selectedImagePos) return;

    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const node = tr.doc.nodeAt(selectedImagePos);
        if (node.type.name === "image") {
          tr.setNodeMarkup(selectedImagePos, undefined, {
            ...node.attrs,
            class: className,
          });
          return true;
        }
        return false;
      })
      .run();

    setShowImageAlignMenu(false);
  };

  // อัปโหลดรูปภาพไปที่ Firebase Storage
  const handleImageUpload = (image) => {
    if (image && image.length > 0) {
      setFiles(image[0]); // เก็บค่าภาพที่อัปโหลด
    }
  };

  const handleImageDialogOpen = () => {
    setFiles(null);
    setOpenImageDialog(true);
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
  };

  // เปลี่ยน Heading
  const handleHeadingChange = (value) => {
    console.log(value);
    console.log(editor.isActive("heading"));
    setHeading(value);
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: parseInt(value.replace("h", "")) })
        .run();
    }
  };

  // Toggle HTML Mode
  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // กลับมาเป็น WYSIWYG และอัปเดตเนื้อหา
      editor.commands.setContent(htmlContent);
    }
    setIsHtmlMode(!isHtmlMode);
  };

  const setTableBorderColor = (color) => {
    if (!selectedCellPos) return;

    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const node = tr.doc.nodeAt(selectedCellPos);
        if (
          node.type.name === "tableCell" ||
          node.type.name === "tableHeader"
        ) {
          tr.setNodeMarkup(selectedCellPos, undefined, {
            ...node.attrs,
            style: `border: 1px solid ${color}`,
          });
          return true;
        }
        return false;
      })
      .run();

    setShowTableBorderMenu(false);
  };

  return (
    <div className="editor-wrapper">
      {/* Toolbar */}
      <div className="toolbar items-center bg-gray-100 w-full dark:bg-gray-700 dark:text-white">
        <Tooltip title="undo" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <MdUndo />
          </button>
        </Tooltip>
        <Tooltip title="redo" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <MdRedo />
          </button>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {/* Heading Dropdown */}
        <Select
          value={heading}
          onChange={(e) => handleHeadingChange(e.target.value)}
          sx={{ height: "30px", minHeight: "30px" }} // ปรับความสูงของ Select
        >
          <MenuItem value="paragraph">
            <p style={{ fontSize: "16px", margin: 0 }}>Paragraph</p>
          </MenuItem>
          {[1, 2, 3, 4, 5].map((level) => (
            <MenuItem key={level} value={`h${level}`}>
              <span
                style={{
                  fontSize: `${24 - level * 2}px`,
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                Heading {level}
              </span>
            </MenuItem>
          ))}
        </Select>

        <Divider orientation="vertical" flexItem />

        {/* Text Align */}
        <Tooltip title="alignleft" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={editor.isActive({ textAlign: "left" }) ? "active" : ""}
          >
            <MdFormatAlignLeft />
          </button>
        </Tooltip>
        <Tooltip title="aligncenter" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={editor.isActive({ textAlign: "center" }) ? "active" : ""}
          >
            <MdFormatAlignCenter />
          </button>
        </Tooltip>
        <Tooltip title="alignright" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={editor.isActive({ textAlign: "right" }) ? "active" : ""}
          >
            <MdFormatAlignRight />
          </button>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {/* Font Style Buttons */}
        <Tooltip title="bold" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "active" : ""}
          >
            <MdFormatBold />
          </button>
        </Tooltip>
        <Tooltip title="italic" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "active" : ""}
          >
            <MdFormatItalic />
          </button>
        </Tooltip>
        <Tooltip title="underline" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "active" : ""}
          >
            <MdFormatUnderlined />
          </button>
        </Tooltip>

        {/* Font Size Dropdown */}
        <Tooltip title="fontsize" placement="bottom" arrow>
          <select
            className="text-sm rounded-xl bg-white px-2 py-0.5 text-black dark:bg-gray-900 dark:text-white"
            onChange={(e) => {
              setFontSize(e.target.value);
              editor.chain().focus().setFontSize(e.target.value).run();
            }}
            value={fontSize}
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>
        </Tooltip>

        {/* Font Size Increment/Decrement */}
        <Tooltip title="decreasefontsize" placement="bottom" arrow>
          <button
            onClick={() => {
              const newSize = `${parseInt(fontSize) - 1}px`;
              setFontSize(newSize);
              editor.chain().focus().setFontSize(newSize).run();
            }}
          >
            A−
          </button>
        </Tooltip>

        <Tooltip title="increasefontsize" placement="bottom" arrow>
          <button
            onClick={() => {
              const newSize = `${parseInt(fontSize) + 1}px`;
              setFontSize(newSize);
              editor.chain().focus().setFontSize(newSize).run();
            }}
          >
            A+
          </button>
        </Tooltip>

        {/* Font Color Picker */}
        <Tooltip title="fontcolor" placement="bottom" arrow>
          <input
            type="color"
            onChange={(e) => {
              setFontColor(e.target.value);
              editor.chain().focus().setColor(e.target.value).run();
            }}
            value={fontColor}
            className="color-picker"
          />
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {/* Bullet List */}
        <Tooltip title="bulletlist" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "active" : ""}
          >
            <MdFormatListBulleted />
          </button>
        </Tooltip>

        {/* Ordered List */}
        <Tooltip title="numberlist" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "active" : ""}
          >
            <MdFormatListNumbered />
          </button>
        </Tooltip>

        {/* Create Table */}
        <Tooltip title="table" placement="bottom" arrow>
          <button onClick={() => setOpenTableDialog(true)}>
            <MdTableChart />
          </button>
        </Tooltip>

        <Tooltip title="youtube" placement="bottom" arrow>
          <button onClick={() => alert("Embed Youtube!")}>
            <FaYoutube />
          </button>
        </Tooltip>
        {/* Upload Image */}
        <Tooltip title="upload" placement="bottom" arrow>
          <label htmlFor="upload-image">
            <button onClick={handleImageDialogOpen}>
              <MdAddPhotoAlternate />
            </button>
          </label>
        </Tooltip>
        <Tooltip title="blockquote" placement="bottom" arrow>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <GrBlockQuote />
          </button>
        </Tooltip>

        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <BiCodeBlock />
        </button>

        <button onClick={toggleHtmlMode}>
          {isHtmlMode ? <MdVisibility /> : <MdCode />}
        </button>
      </div>

      {/* Toggle ระหว่าง WYSIWYG และ HTML Mode */}
      <div className="editor-container bg-white text-black">
        {isHtmlMode ? (
          <TextareaAutosize
            className="html-editor w-full p-2 border border-gray-300 rounded"
            minRows={10}
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
          />
        ) : (
          <EditorContent
            editor={editor}
            className="tiptap select-text w-full"
          />
        )}
      </div>
      <Dialog
        open={openImageDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleImageDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Upload
          handleCloseForm={handleImageDialogClose}
          setFiles={(image) => handleImageUpload(image)}
          newUpload={!files}
          onClose={handleImageDialogClose}
        />
      </Dialog>
      {showImageAlignMenu && (
        <div className="absolute top-16 left-4 z-50 bg-white shadow-md border rounded-md p-2 space-y-1">
          {imageAlignOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => applyImageAlignment(opt.className)}
              className="block w-full text-left px-4 py-1 hover:bg-gray-100"
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => {
              editor.chain().focus().deleteNode("image").run();
              setShowImageAlignMenu(false);
            }}
            className="block w-full text-left px-4 py-1 text-red-600 hover:bg-red-50"
          >
            ลบรูปภาพ
          </button>
        </div>
      )}
      <Dialog open={openTableDialog} onClose={() => setOpenTableDialog(false)}>
        <div className="p-4 w-[300px] space-y-3">
          <h3 className="font-bold text-lg">สร้างตาราง</h3>
          <div className="flex flex-col gap-2">
            <label>
              แถว (rows):
              <input
                type="number"
                min="1"
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1"
              />
            </label>
            <label>
              คอลัมน์ (columns):
              <input
                type="number"
                min="1"
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1"
              />
            </label>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .insertTable({
                    rows: tableRows,
                    cols: tableCols,
                    withHeaderRow: true,
                  })
                  .run();
                setOpenTableDialog(false);
              }}
            >
              สร้างตาราง
            </button>
          </div>
        </div>
      </Dialog>
      {showTableBorderMenu && (
        <div className="absolute top-20 left-4 z-50 bg-white shadow border rounded p-2">
          <h4 className="text-sm font-bold mb-1">เปลี่ยนสีเส้นตาราง</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setTableBorderColor("#000")}
              className="bg-black w-6 h-6 rounded border"
            />
            <button
              onClick={() => setTableBorderColor("#ccc")}
              className="bg-gray-300 w-6 h-6 rounded border"
            />
            <button
              onClick={() => setTableBorderColor("transparent")}
              className="bg-white w-6 h-6 border border-black rounded"
              title="ไม่มีเส้น"
            />
          </div>
          <h4 className="text-sm font-bold">จัดการตาราง</h4>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="text-red-600 hover:underline"
            >
              ลบแถว
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="text-red-600 hover:underline"
            >
              ลบคอลัมน์
            </button>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="text-red-600 hover:underline"
            >
              ลบตาราง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;
