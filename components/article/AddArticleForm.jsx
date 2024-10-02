import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import PreviewModal from "./PreviewModal";
import useSWR from "swr";
import { FaPlusCircle, FaMinusCircle, FaRegPlayCircle, FaRegEdit } from "react-icons/fa";
import ArticleQuiz from "./ArticleQuiz";
import { ImFilePicture } from "react-icons/im";
import { IoIosCloseCircle } from "react-icons/io";
import Image from "next/image";
import sha1 from "crypto-js/sha1";
import CircularProgress from '@mui/material/CircularProgress'; 
import useMedia from "@/lib/hook/useMedia";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const AddArticleForm = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [article, setArticle] = useState({});
  const [tags, setTags] = useState([]); // State to manage tags
  const [inputTag, setInputTag] = useState(""); // State to manage input for tags
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // Change to null
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizEdit, setQuizEdit] = useState({});
  const [edit, setEdit] = useState(false);
  const { add } = useMedia();

  const router = useRouter();

  const fileUploadRef = useRef(null);
  const fileThumbnailRef = useRef(null);

  const { data, error: swrError } = useSWR(
    session?.user?.id ? `/api/users/${session?.user?.id}` : null,
    fetcher
  );

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    try {
      const result = await add(file, session?.user?.id, "article");
      setThumbnail(result);
    } catch (error) {
      console.error(error);
    }
  }

  const handleUploadChange = async (e) => {
    const fileArray = Array.from(e.target.files); // Convert FileList to an array

    try {
        // Use Promise.all to upload all files concurrently
        const uploadResults = await Promise.all(
            fileArray.map(file => add(file, session?.user?.id, "article"))
        );

        // Update media state with the uploaded results
        setMedia((prevMedia) => [...prevMedia, ...uploadResults]);
    } catch (error) {
        console.error('Error uploading files:', error);
    }
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    if (value.includes(" ")) {
      const newTag = value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputTag(""); // Reset the input field
    } else {
      setInputTag(value);
    }
  };

  const handleRemoveMedia = async (url, public_id) => {
    try {
        await axios.delete(`/api/blob/delete`, {
            params: { url },
        });
        
        // Update the media state after successful deletion
        setMedia((prevMedia) => prevMedia.filter((m) => m.public_id !== public_id));
    } catch (error) {
        console.error('Error deleting media:', error);
    }
  };

  const handleRemoveThumbnail = async(url) => {
    try {
      await axios.delete(`/api/blob/delete?url=${url}`);
      setThumbnail(null);
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticle({ ...article, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newArticle = {
        ...article,
        content: content,
        userId: session.user.id,
        tags: tags,
        medias: media,
        thumbnail: thumbnail,
    };

    try {
        // Save the article
        const res = await axios.post("/api/articles", newArticle);

        console.log('Article saved:', res.data);

        // Check if the article was saved successfully and the articleId is defined
        const articleId = res.data._id;
        if (!articleId) {
            throw new Error('Article ID is undefined. Article might not have been saved correctly.');
        }

        console.log('Article saved with ID:', articleId);

        // Save quiz data
        for (const q of questions) {
            const quizData = {
                articleId: articleId, // Ensure articleId is used here
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
            };

            console.log('Saving quiz:', quizData);

            await axios.post("/api/articles/quiz", quizData);
        }

        setLoading(false);
        router.push("/admin/articles");
    } catch (error) {
        console.error('Error saving article or quiz:', error.message);
        setLoading(false);
    }
};

  const handlePreview = (e) => {
    setLoading(true);
    e.preventDefault();
    const newArticle = {
      ...article,
      content: content,
      user: data.user,
    };
    setPreview(newArticle);
    setLoading(false);
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const handleContentChange = (e) => {
    const inputValue = e.target.value;
    setContent(inputValue);
  };

  const handleQuizClose = () => {
    setQuizOpen(false);
    setQuizEdit({});
    setEdit(false);
  };

  const saveQuiz = (questionData) => {
    const newQuestions = [...questions, questionData];
    setQuestions(newQuestions);
    setQuizOpen(false);
  };

  const handleQuizDelete = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(index, 1);
      return updatedQuestions;
    });
  };

  const handleQuizEdit = (index) => {
    setQuizEdit({ ...questions[index] });
    setEdit(true);
    setQuizOpen(true);
  };



  if (swrError) return <div>Failed to load</div>;
  if (!data) return <CircularProgress />;
  if (loading) return <CircularProgress />;

  return (
    <div className="flex flex-col w-full p-5 border-2 rounded-3xl text-sm">

      <div className="flex flex-row w-full gap-2 items-center mb-2">
        <label className="text-black font-bold" htmlFor="title">
          Title
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Title"
          name="title"
          className="block text-black border-2 p-1 rounded-xl w-2/3 text-xs"
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>


      <div className="flex flex-row w-full justify-between items-center gap-4 mb-2">
        <div className="flex flex-row w-full gap-2 items-center">
          <label className="text-black font-bold" htmlFor="position">
            Position:
          </label>
          <input
            type="text"
            placeholder="Position"
            name="position"
            className="block text-black border-2 p-1 rounded-xl w-2/3 text-xs"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row w-full gap-2 items-center">
          <label className="text-black font-bold" htmlFor="group">
            Group:
          </label>
          <input
            type="text"
            placeholder="Group"
            name="group"
            className="block text-black border-2 p-1 rounded-xl w-2/3 text-xs"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row w-full gap-2 items-center">
          <label className="text-black font-bold" htmlFor="subgroup">
            SubGroup:
          </label>
          <input
            type="text"
            placeholder="subgroup"
            name="subgroup"
            className="block text-black border-2 p-1 rounded-xl w-2/3 text-xs"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-row w-full items-center justify-between gap-4 mb-2">
        <div className="flex flex-row w-1/3 border-2 rounded-2xl items-center justify-evenly px-4 py-1">
          <div className="flex items-center">
            <input
              id="pinned"
              name="pinned"
              type="checkbox"
              checked={article.pinned || false}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
            />
            <label htmlFor="pinned" className="ms-2 text-md font-bold text-gray-900">
              ปักหมุด
            </label>
          </div>
         
          <div className="flex items-center">
            <input
              id="recommend"
              name="recommend"
              type="checkbox"
              checked={article.recommend || false}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
            />
            <label htmlFor="recommend" className="ms-2 text-md font-bold text-gray-900">
              แนะนำ
            </label>
          </div>
        </div>

        <div className="flex flex-row w-1/3 border-2 rounded-2xl gap-4 items-center justify-between px-4 py-1">
          <div className="flex flex-row w-full gap-2 items-center">
            <label className="text-black font-bold" htmlFor="point">
              Point:
            </label>
            <input
              type="text"
              placeholder="Point"
              name="point"
              className="block text-black border-2 p-1 rounded-xl w-2/3 text-xs"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-row w-full gap-2 items-center">
            <label className="text-black font-bold" htmlFor="coins">
              Coins:
            </label>
            <input
              type="text"
              placeholder="Coins"
              name="coins"
              className="block text-black border-2 p-1 rounded-xl w-2/3 text-xs"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-row w-1/3 items-center">
          <div className="flex flex-row items-center gap-2">
            <label className="text-black font-bold " htmlFor="status">
              Status:
            </label>
            <select
              name="status"
              className="block text-black border-2 p-1 rounded-xl w-2/3 text-xs"
              value={article.status || 'draft'}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

      </div>
      
      <div className="flex flex-row w-full items-center gap-2">
        <div className="flex flex-col w-1/2 gap-2">
            {/* Thumbnail Preview */}
            {thumbnail ? (
              <div className="relative flex flex-col p-2 border-2 rounded-xl">
                <IoIosCloseCircle
                  className="absolute top-0 right-0 text-xl cursor-pointer"
                  onClick={() => handleRemoveThumbnail(thumbnail.url)}
                  />
                <Image
                  src={thumbnail.url}
                  alt="Thumbnail Preview"
                  width={200}
                  height={200}
                  className=""
                  style={{ maxWidth: 'auto', maxHeight: '150px' }}
                />
              </div>
            ): null}
          <div className="flex flex-row items-center gap-2">
            <span className="text-black font-bold">Thumbnail:</span>
            <div className="flex flex-row w-full mb-2 border-2 p-1 rounded-3xl px-2">
              <button
                onClick={() => fileThumbnailRef.current.click()}
                className="flex flex-row items-center gap-2 cursor-pointer"
              >
              <ImFilePicture className="text-xl text-[#0056FF]" />
                  <div className="flex flex-row text-left">
                    <span className="text-sm font-bold">อัพโหลดรูปภาพ</span>
                  
                  </div>
                  <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
              </button>
              {/* ซ่อน input file แต่ใช้ ref เพื่อให้มันทำงานเมื่อกดปุ่ม */}
              <input
                  ref={fileThumbnailRef}
                  type="file"
                  name="thumbnail"
                  accept="image/*" // จำกัดชนิดของไฟล์
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }} // ซ่อน input file
                />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-1/2 gap-2">
            {/* Media Preview */}
            <div className="flex flex-row items-center w-full">
                        {media.map((item, index) => (
                            <div key={index} className="flex gap-2 ml-2">
                                <div className="relative flex flex-col p-2 border-2 rounded-xl">
                                    <IoIosCloseCircle
                                        className="absolute top-0 right-0 text-xl cursor-pointer"
                                        onClick={() => handleRemoveMedia(media[index].url, media[index].public_id)}
                                    />
                                    {item.type === 'image' ? (
                                        <Image
                                            src={item.url}
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            className="rounded-lg object-cover"
                                            style={{ width: 'auto', height: '50px' }}
                                        />
                                    ) : (
                                        <div className="relative">
                                            <video width="50" height="50" controls>
                                                <source src={item.url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            <FaRegPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-3xl" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
          <div className="flex flex-row items-center gap-2">
            <span className="block text-black font-bold">images:</span>
            <div className="flex flex-row w-full mb-2 border-2 p-1 rounded-3xl px-2">
              <button
                onClick={() => fileUploadRef.current.click()}
                className="flex flex-row items-center gap-2 cursor-pointer"
              >
              <ImFilePicture className="text-xl text-[#0056FF]" />
                  <div className="flex flex-row text-left">
                    <span className="text-sm font-bold">อัพโหลดรูปภาพ/วิดีโอ</span>
                    <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
                  </div>
              </button>
              {/* ซ่อน input file แต่ใช้ ref เพื่อให้มันทำงานเมื่อกดปุ่ม */}
              <input
                  ref={fileUploadRef}
                  type="file"
                  name="upload"
                  multiple
                  accept="image/*, video/*" // จำกัดชนิดของไฟล์
                  onChange={handleUploadChange}
                  style={{ display: 'none' }} // ซ่อน input file
                />
            </div>
          </div>
        </div>

      </div>

      <div className="flex w-full justify-start items-center">
        <textarea
          name="content"
          value={content}
          className="text-black mb-4 border-2 p-2 rounded-xl w-full"
          onChange={handleContentChange}
          placeholder="Content"
          rows={4}
        ></textarea>
      </div>

      <div className="flex flex-row w-full items-center gap-2 mb-2">
        <label className="flex text-black font-bold" htmlFor="tags">
          Tags:
        </label>
        <input
          type="text"
          placeholder="Enter tags and press space"
          name="tags"
          value={inputTag}
          className="block text-black border-2 p-1 rounded-xl w-2/3 text-xs"
          onChange={handleTagInputChange}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-[#F2F2F2] px-2 py-1 rounded-full"
          >
            {tag}
            <IoIosCloseCircle
              className="ml-1 text-red-500 cursor-pointer"
              onClick={() => handleRemoveTag(tag)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col w-full gap-4 mt-4">
        <div className="flex flex-row w-full items-center gap-2">
          <span className="text-xl font-bold text-left">เพิ่มคำถาม</span>
          {quizOpen ? (
            <FaMinusCircle
              className="text-xl font-bold text-left text-[#F68B1F] cursor-pointer"
              onClick={handleQuizClose}
            />
          ) : (
            <FaPlusCircle 
            className="text-xl font-bold text-left text-[#0056FF] cursor-pointer"
            onClick={() => setQuizOpen(true)}
          />
          )}
        </div>
        {/* Quiz table */}
          {questions.map((question, index) => (
            <div key={index} className="flex flex-row items-center gap-4">
              <span className="text-black font-bold">{index + 1}</span>
              <span className="text-black">{question.question}</span> {/* Correctly render the question text */}
              <FaRegEdit
                className="text-gray-500"
                onClick={() => handleQuizEdit(index)}
              />
              <IoIosCloseCircle
                className="text-red-500"
                onClick={() => handleQuizDelete(index)}
              />
            </div>
          ))}
        {/* Quiz form */}
        {quizOpen && (
            <ArticleQuiz 
              saveQuiz={saveQuiz}
              handleQuizClose={handleQuizClose}
              data={quizEdit}
              edit={edit}
            />
        )}
        

      </div>

      <div className="flex flex-row w-full justify-center items-center gap-4 m-4">
        <button
          className="bg-[#0056FF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          type="submit"
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

      {showModal && <PreviewModal article={preview} onClose={onClose} />}
    </div>
  );
};

export default AddArticleForm;
