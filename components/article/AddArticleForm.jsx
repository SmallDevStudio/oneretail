import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Tiptap from "../TipTap/Tiptap";

const AddArticleForm = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState(null);
  const [article, setArticle] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChange = async (newContent) => {
    setContent(newContent);
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setArticle({ ...article, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newArticle = { 
        ...article, 
        content: content,
        userId: session.user.id,
    };
    console.log(newArticle);
    setLoading(false);
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    const newArticle = { 
        ...article, 
        content: content,
        userId: session.user.id,
    };
    console.log(newArticle);
  };

  return (
    <div className="flex flex-col w-full p-5 border-2 rounded-3xl">
        <label 
        className="text-black font-bold ml-4"
        htmlFor="title"
        >
            Title
            <span className="text-red-500">*</span>
        </label>
        <input
            type="text"
            placeholder="Title"
            name="title"
            className="text-black mb-4 border-2 p-2 rounded-xl w-2/3 ml-4"
            onChange={handleChange}
            required
        />
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-row w-full">
            <div className="flex flex-col w-1/3">
                <label
                className="text-black font-bold ml-4"
                htmlFor="channel"
                >
                    Channel
                </label>
                <input
                    type="text"
                    placeholder="Channel"
                    name="channel"
                    className="text-black mb-4 border-2 p-2 rounded-xl ml-4"
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col w-1/3">
                <label
                className="text-black font-bold ml-4"
                htmlFor="position"
                >
                    Positiion
                </label>
                <input
                    type="text"
                    placeholder="position"
                    name="position"
                    className="text-black mb-4 border-2 p-2 rounded-xl ml-4"
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col w-1/3">
                <label
                className="text-black font-bold ml-4"
                htmlFor="group"
                >
                    group
                </label>
                <input
                    type="text"
                    placeholder="group"
                    name="group"
                    className="text-black mb-4 border-2 p-2 rounded-xl ml-4"
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="flex flex-row w-full">
            <div className="flex flex-row w-1/3 gap-4 ml-4 mb-4 border-2 rounded-xl p-2 items-center">
                <div class="flex items-center">
                    <input id="pinned" name="pinned" type="checkbox" value={true} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 focus:ring-2" 
                        onChange={handleChange}
                    />
                    <label for="pinned" class="ms-2 text-sm font-bold text-gray-900 dark:text-gray-300">ปักหมุด</label>
                </div>
                <div class="flex items-center">
                    <input id="new" name="new" type="checkbox" value={true} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 focus:ring-2" 
                        onChange={handleChange}
                    />
                    <label for="new" class="ms-2 text-sm font-bold text-gray-900">ใหม่</label>
                </div>
                <div class="flex items-center">
                    <input id="popular" name="popular" type="checkbox" value={true} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 focus:ring-2" 
                        onChange={handleChange}
                    />
                    <label for="popular" class="ms-2 text-sm font-bold text-gray-900">Popular</label>
                </div>
            </div>
            <div>
                <label
                className="text-black font-bold ml-4"
                htmlFor="status"
                >
                    status
                </label>
                <select
                    name="status"
                    className="text-black mb-4 border-2 p-2 rounded-xl ml-4"
                    defaultValue="draft"
                    onChange={handleChange}
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>
            <div>
                <label
                className="text-black font-bold ml-4"
                htmlFor="published"
                >
                    published
                </label>
                <select
                    name="published"
                    defaultValue={true}
                    className="text-black mb-4 border-2 p-2 rounded-xl ml-4"
                    onChange={handleChange}
                >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>
        </div>
        <Tiptap onChange={onChange} />
        <div className="flex flex-row w-full justify-center items-center gap-4 m-4">
            <button
                className="bg-[#0056FF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                type="submit"
                onClick={handleSubmit}
            >
                {loading ? "Loading..." : "บันทึก"}
            </button>
            <button
                className="bg-[#F68B1F] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={handlePreview}
            >
                ดูตัวอย่าง
            </button>
        </div>
    </div>
  );
}

export default AddArticleForm;
