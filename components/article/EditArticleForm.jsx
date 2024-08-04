import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import PreviewModal from "./PreviewModal";
import dynamic from "next/dynamic";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import ArticleQuiz from "./ArticleQuiz";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const CKEditor = dynamic(() => import("@/components/Editor/CKEditor"), {
  ssr: false,
});

const EditArticleForm = ({ articleId }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [article, setArticle] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizEdit, setQuizEdit] = useState({});
  const [edit, setEdit] = useState(false);

  const router = useRouter();

  console.log('questions:', questions);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${articleId}`);
        setArticle(res.data.data.article);
        setContent(res.data.data.article.content);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchArticleQuiz = async () => {
      try {
        const res = await axios.get(`/api/articles/quiz?articleId=${articleId}`);
        setQuestions(res.data.data.question);
      } catch (error) {
        console.error(error);
      }
    }

    if (articleId) {
      fetchArticle();
      fetchArticleQuiz();
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

      // Save the quiz questions
      const quizData = {
        articleId: articleId,
        question: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      };

      await axios.put(`/api/articles/quiz?articleId=${articleId}`, quizData);

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
    setLoading(true);
    const updatedArticle = {
      ...article,
      content: content,
    };
    setPreview(updatedArticle);
    setLoading(false);
    setPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setPreviewModal(false);
  };

  const handleQuizClose = () => {
    setQuizOpen(false);
    setQuizEdit({});
    setEdit(false);
  };

  const saveQuiz = (questionData) => {
    if (edit) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q, i) =>
          i === quizEdit.index ? questionData : q
        )
      );
    } else {
      setQuestions((prevQuestions) => [...prevQuestions, questionData]);
    }
    setQuizOpen(false);
    setQuizEdit({});
    setEdit(false);
  };

  const handleQuizDelete = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(index, 1);
      return updatedQuestions;
    });
  };

  const handleQuizEdit = (index) => {
    setQuizEdit({ ...questions[index], index });
    setEdit(true);
    setQuizOpen(true);
  };


  if (loading) return <p>Loading...</p>;

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
              className="text-black mb-4 border-2 p-2 rounded-xl w-2/3 ml-4"
              value={article.point || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-black font-bold ml-4" htmlFor="coin">
              Coin
            </label>
            <input
              type="text"
              placeholder="coin"
              name="coin"
              className="text-black mb-4 border-2 p-2 rounded-xl w-2/3 ml-4"
              value={article.coin || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-black font-bold ml-4" htmlFor="content">
          Content
          <span className="text-red-500">*</span>
        </label>
        <div className="text-black mb-4 p-2 rounded-xl ml-4">
          <CKEditor data={content} onChange={(data) => setContent(data)} />
        </div>
      </div>

      <div className="flex flex-col w-full mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-700">Quiz Questions</h2>
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setQuizOpen(true)}
          >
            <FaPlusCircle className="inline-block mr-2" />
            Add Question
          </button>
        </div>

        {questions.map((q, index) => (
          <div key={index} className="flex flex-col bg-gray-100 p-2 mb-2 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-medium">{q.question}</p>
              <div className="flex items-center">
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => handleQuizEdit(index)}
                >
                  <FaRegEdit />
                </button>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleQuizDelete(index)}
                >
                  <RiDeleteBin5Line />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row w-full gap-4 justify-center mb-4">
        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded-xl w-1/4 hover:bg-green-700"
          onClick={handleSubmit}
        >
          Save
        </button>
        <button
          className="bg-yellow-500 text-white p-3 rounded-xl w-1/4 hover:bg-yellow-700"
          onClick={handlePreview}
        >
          Preview
        </button>
        <button
          className="bg-red-500 text-white p-3 rounded-xl w-1/4 hover:bg-red-700"
          onClick={() => router.push('/admin/articles')}
        >
          Cancel
        </button>
      </div>

      {previewModal && (
        <PreviewModal
          article={preview}
          onClose={handleClosePreviewModal}
        />
      )}
      {quizOpen && (
        <ArticleQuiz
          onClose={handleQuizClose}
          saveQuiz={saveQuiz}
          edit={quizEdit}
        />
      )}
    </div>
  );
};

export default EditArticleForm;
