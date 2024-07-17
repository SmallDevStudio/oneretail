"use client";

import React from "react";
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Underline,
    Quote,
    Undo,
    Redo,
    Code,
  } from "lucide-react";

  const Toolbar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div
          className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-start
        gap-5 w-full flex-wrap border border-gray-700"
        >
          <div className="flex justify-start items-center gap-5 w-full lg:w-10/12 flex-wrap ">
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
        </div>
      );
    };
    
    export default Toolbar;