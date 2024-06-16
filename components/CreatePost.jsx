import { useState } from 'react';
import axios from 'axios';
import getEmbedPreview from '@/utils/getEmbedPreview';
import Image from 'next/image';
import PostModal from './PostModal';
import { mutate } from 'swr';

const CreatePost = ({ user, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [preview, setPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;
    
    const extractedLink = extractLink(content);
    const textContent = extractedLink ? content.replace(extractedLink, '').trim() : content;

    const finalContent = textContent || extractedLink;

    if (!finalContent) return;

    const posts = {
      content: finalContent,
      link: extractedLink,
      user: user._id,
    };

    console.log(posts);

    try {
      const res = await axios.post('/api/posts', posts);
      
      console.log(res.data);
      onPostCreated(res.data.data);  // อัพเดตข้อมูลทันที
      setContent('');
      setLink('');
      setPreview(null);
      setIsModalOpen(true);
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

  const onRequestClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-gray-50 rounded-md p-2 shadow-xl" style={{ position: 'sticky', width: '100%' }}>
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
              className="w-full bg-gray-100 rounded-3xl p-2 shadow-inner focus:outline-none border-2 border-gray-300 resize-none"
              rows="1"
            />
            <button type="submit">
              <div className="flex p-1">
                <svg className='w-6 h-6 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 267.09 267.09">
                  <path fill='currentColor' d="M175.59,267.09c-3.2,0-6.4-.62-9.43-1.88-8.5-3.53-12.96-12.45-21.85-30.23l-35.73-71.46c-.62-1.23-1.31-2.62-1.54-2.95-.16-.2-.33-.38-.51-.52-.29-.2-1.55-.83-2.77-1.44l-71.65-35.82c-17.77-8.89-26.7-13.35-30.22-21.85-3.05-7.35-2.35-15.77,1.87-22.52,4.88-7.8,14.41-10.74,33.4-16.58L220.49,5.42c15.24-4.69,22.89-7.04,30.7-4.17,6.81,2.5,12.15,7.84,14.65,14.65,2.86,7.8.51,15.45-4.17,30.68-.02.07-.04.13-.06.2l-56.36,183.17c-5.84,18.99-8.78,28.52-16.58,33.4-3.97,2.48-8.52,3.75-13.09,3.75ZM174.87,245.25c.64.17,1.32.11,1.93-.17,1.79-2.43,4.65-11.72,7.67-21.54l56.41-183.35c.02-.07.04-.13.06-.2,2.21-7.17,4.47-14.53,4.38-16.85-.29-.61-.78-1.09-1.38-1.38-2.34-.08-9.81,2.22-17.05,4.44L43.54,82.62c-9.82,3.02-19.11,5.88-21.54,7.67-.27.61-.33,1.29-.16,1.93,2.11,2.17,10.8,6.51,19.99,11.11l71.03,35.52,62.35-62.35c4.25-4.25,11.13-4.25,15.38,0,4.25,4.25,4.25,11.13,0,15.38l-62.35,62.35,35.52,71.03c4.39,8.79,8.93,17.86,11.11,19.99ZM176.61,245.32h0s0,0,0,0ZM21.76,90.48s0,0,0,0c0,0,0,0,0,0Z"/>
                </svg>
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
        <PostModal isOpen={isModalOpen} onRequestClose={onRequestClose} score={20} />
      </div>
    </>
  );
};

export default CreatePost;
