import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import CustomJoditEditor from "@/components/CustomJoditEditor";
import axios from "axios";
import { useRouter } from "next/router";

const EditArticleForm = ({ articleId }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [article, setArticle] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${articleId}`);
        setArticle(res.data.data);
        setContent(res.data.data.content);
      } catch (error) {
        console.error(error);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, type, checked } = e.target;
    setArticle({
      ...article,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedArticle = {
      ...article,
      content: content,
      pinned: article.pinned ? true : false,
      new: article.new ? true : false,
      popular: article.popular ? true : false,
    };
    try {
      console.log("Updated Article: ", updatedArticle);  // เพิ่ม console log เพื่อตรวจสอบข้อมูล
      const res = await axios.put(`/api/articles/${articleId}`, updatedArticle);
      console.log(res.data);
      router.push('/admin/articles');
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    const updatedArticle = {
      ...article,
      content: content,
    };
    console.log("article", updatedArticle);
  };

  return (
    <div className="flex flex-col w-full p-5 border-2 rounded-3xl">
        <div>
            <label className="text-black font-bold ml-4" htmlFor="title">
                Title
                <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                placeholder="Title"
                name="title"
                className="text-black mb-4 border-2 p-2 rounded-xl w-2/3 ml-4"
                value={article.title || ''}
                onChange={handleChange}
                required
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="flex flex-row w-full items-center gap-4">
            <div>
                <label className="text-black font-bold ml-4" htmlFor="channel">
                    Channel
                </label>
                <input
                    type="text"
                    placeholder="Channel"
                    name="channel"
                    className="text-black mb-4 border-2 p-2 rounded-xl w-2/3 ml-4"
                    value={article.channel || ''}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="text-black font-bold ml-4" htmlFor="position">
                    Position
                </label>
                <input
                    type="text"
                    placeholder="Position"
                    name="position"
                    className="text-black mb-4 border-2 p-2 rounded-xl w-2/3 ml-4"
                    value={article.position || ''}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="text-black font-bold ml-4" htmlFor="group">
                    Group
                </label>
                <input
                    type="text"
                    placeholder="Group"
                    name="group"
                    className="text-black mb-4 border-2 p-2 rounded-xl w-2/3 ml-4"
                    value={article.group || ''}
                    onChange={handleChange}
                />
            </div>
        </div>

        <div className="flex flex-row w-2/3 gap-4 ml-4">
            <div className="flex flex-row w-1/2 p-4 border-2 rounded-2xl gap-4 items-center mb-4 justify-between">
                <div className="flex items-center">
                    <input 
                        id="pinned" 
                        name="pinned" 
                        type="checkbox" 
                        value={article.pinned || false}
                        checked={article.pinned || false}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                    />
                    <label htmlFor="pinned" className="ms-2 text-md font-bold text-gray-900">ปักหมุด</label>
                </div>
                <div className="flex items-center">
                    <input 
                        id="new" 
                        name="new" 
                        type="checkbox" 
                        value={article.new || false}
                        checked={article.new || false}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                    />
                    <label htmlFor="new" className="ms-2 text-md font-bold text-gray-900">ใหม่</label>
                </div>
                <div className="flex items-center">
                    <input 
                        id="popular" 
                        name="popular" 
                        type="checkbox"
                        value={article.popular || false}
                        checked={article.popular || false}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                    />
                    <label htmlFor="popular" className="ms-2 text-md font-bold text-gray-900">Popular</label>
                </div>
            </div>

            <div className="flex flex-row w-1/2 border-2 p-2 rounded-2xl gap-4 items-center mb-4 justify-between">
                <div>
                    <label className="text-black font-bold ml-4" htmlFor="point">
                        Point
                    </label>
                    <input
                        type="text"
                        placeholder="point"
                        name="point"
                        className="text-black border-2 p-2 rounded-xl w-2/3 ml-4"
                        value={article.point || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="text-black font-bold ml-4" htmlFor="coins">
                        Coins
                    </label>
                    <input
                        type="text"
                        placeholder="Coins"
                        name="coins"
                        className="text-black border-2 p-2 rounded-xl w-2/3 ml-4"
                        value={article.coins || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>

        <div className="flex flex-row w-full items-center gap-4">
            <div className="flex flex-row w-1/3 items-center gap-4">
                <div className="flex-row">
                    <label className="text-black font-bold ml-4" htmlFor="status">
                        Status
                    </label>
                    <select
                        name="status"
                        className="text-black mb-4 border-2 p-2 rounded-xl w-30 ml-4"
                        value={article.status || 'draft'}
                        onChange={handleChange}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <div>
                    <label className="text-black font-bold ml-4" htmlFor="published">
                        Published
                    </label>
                    <select
                        name="published"
                        className="text-black mb-4 border-2 p-2 rounded-xl w-30 ml-4"
                        value={article.published ? 'true' : 'false'}
                        onChange={handleChange}
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>
            <div className="flex-row w-full items-center">
                <label className="text-black font-bold ml-4" htmlFor="tags">
                    Tags
                </label>
                <input
                    type="text"
                    placeholder="Tags"
                    name="tags"
                    className="text-black mb-4 border-2 p-2 rounded-xl ml-4 w-1/3"
                    value={article.tags || ''}
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="flex w-full justify-start items-center ml-4">
            <CustomJoditEditor value={content} onChange={setContent} />
        </div>

        <div className="flex flex-row w-full justify-center items-center gap-4 m-4">
            <button
            className="bg-[#0056FF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleSubmit}
            >
            {loading ? "Loading..." : "Save"}
            </button>
            <button
            className="bg-[#F68B1F] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handlePreview}
            >
            Preview
            </button>
        </div>
    </div>
  );
};

export default EditArticleForm;
