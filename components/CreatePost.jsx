import { useState } from 'react';
import axios from 'axios';
import getEmbedPreview from '@/utils/getEmbedPreview';
import Image from 'next/image';
import { FiSend } from "react-icons/fi";

const CreatePost = ({ user, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;
    
    const extractedLink = extractLink(content);
    const textContent = extractedLink ? content.replace(extractedLink, '').trim() : content;

    const posts = {
      content: textContent,
      link: extractedLink,
      user: user._id,
    };

    try {
      const res = await axios.post('/api/posts', posts);
      onPostCreated(res.data.data);
      setContent('');
      setLink('');
      setPreview(null);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleContentChange = (e) => {
    const inputValue = e.target.value;
    setContent(inputValue);
    const extractedLink = extractLink(inputValue);
    setLink(extractedLink);
    if (extractedLink) {
      setPreview(extractedLink);
    } else {
      setPreview(null);
    }
  };

  const extractLink = (text) => {
    const urlPattern = new RegExp(
      'https?://[a-zA-Z0-9-._~:/?#@!$&()*+,;=%]+', 'g'
    );
    const matches = text.match(urlPattern);
    return matches ? matches[0] : null;
  };

  return (
    <>
    <div className=" bg-gray-50 rounded-md p-2 shadow-xl" style={{
      position: 'sticky',
      width: '100%',
    }}>
      <div className="flex flex-row w-full text-center justify-center items-center">
      <Image
        className="rounded-full mr-2 w-[50px] h-[50px]"
        src={user.pictureUrl}
        width={50}
        height={50}
        alt="Profile picture"
        style={{ objectFit: 'contain' }}
      />
      <form onSubmit={handleSubmit} className="w-full flex min-w-[250px]">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="What's on your mind?"
          className="w-full bg-gray-100 rounded-md p-2 shadow-inner focus:outline-none"
        />
        <button type="submit">
          <div className="flex p-1">
            <FiSend 
              className="flex text-[#0056FF] text-2xl ml-2"
            />
          </div>
        </button>
      </form>
      </div>
    </div>
    <div className="bg-gray-50 rounded-md p-1 shadow-xl min-w-[350px] max-w-[350px]">
      {preview && (
          <div className="flex items-center justify-center mt-2">
            {getEmbedPreview(preview)}
          </div>
        )}
    </div>
    </>
  );
};

export default CreatePost;