import { useState } from 'react';
import axios from 'axios';
import { FiSend } from "react-icons/fi";

const InputComment = ({ contentId, userId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/content/comments', {
        contentId: contentId,
        content: comment,
        user: userId,
      });
      setComment('');
      onCommentAdded();
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <div className="relative bg-gray-50 m-2 rounded-md p-2 shadow-xl ml-2 mr-2 mb-2">
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit} className="w-full flex flex-row">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comment"
          required
          className="w-full bg-gray-100 rounded-md p-2 shadow-inner focus:outline-none"
        ></textarea>
        <button type="submit">
          <div className="flex p-1">
            <FiSend 
              className="flex text-[#0056FF] text-2xl ml-2"
            />
          </div>
        </button>
      </form>
    </div>
  );
};

export default InputComment;