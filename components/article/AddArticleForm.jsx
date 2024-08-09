import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import PreviewModal from "./PreviewModal";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import ArticleQuiz from "./ArticleQuiz";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const CKEditor = dynamic(() => import("@/components/Editor/CKEditor"), {
  ssr: false,
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

const AddArticleForm = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [medias, setMedias] = useState([]);
  const [thumbnail, setThumbnail] = useState();
  const [article, setArticle] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // Change to null
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizEdit, setQuizEdit] = useState({});
  const [edit, setEdit] = useState(false);

  const router = useRouter();

  const { data, error: swrError } = useSWR(
    session?.user?.id ? `/api/users/${session?.user?.id}` : null,
    fetcher
  );

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
    };
  
    try {
      // Save the article
      const res = await axios.post("/api/articles", newArticle);
  
      // Prepare quiz data
      const quizData = {
        articleId: res.data.data._id,
        question: questions.map(q => ({
          question: q.quiz,
          options: q.options,
          correctAnswer: q.answer,
        })),
      };
  
      // Save the quiz
      const resQuiz = await axios.post("/api/articles/quiz", quizData);
  
      setLoading(false);
      router.push("/admin/articles");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
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

  const handleContentChange = (value) => {
    console.log("Content:", value);
    setContent(value);
  };

  const handleQuizClose = () => {
    setQuizOpen(false);
    setQuizEdit({});
    setEdit(false);
  };

  const saveQuiz = (questionData) => {
    const newQuestions = [...questions, questionData];
    console.log("New Questions:", newQuestions);
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
  if (!data) return <div>Loading...</div>;
  if (loading) return <div>Loading...</div>;

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
              id="new"
              name="new"
              type="checkbox"
              checked={article.new || false}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
            />
            <label htmlFor="new" className="ms-2 text-md font-bold text-gray-900">
              ใหม่
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="popular"
              name="popular"
              type="checkbox"
              checked={article.popular || false}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
            />
            <label htmlFor="popular" className="ms-2 text-md font-bold text-gray-900">
              Popular
            </label>
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
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex w-full justify-start items-center ml-4">
        <CKEditor data={article.content} onChange={handleContentChange}/>
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
              <span className="text-black">{question.quiz}</span> {/* Correctly render the question text */}
              <FaRegEdit
                className="text-gray-500"
                onClick={() => handleQuizEdit(index)}
              />
              <RiDeleteBin5Line
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
