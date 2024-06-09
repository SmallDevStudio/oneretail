import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Image from 'next/image';
import CommentList from '@/components/content/CommentList';

const Content = ({ content, user }) => {
  const [likes, setLikes] = useState(content.likes || []);
  const [userHasLiked, setUserHasLiked] = useState(Array.isArray(likes) && likes.includes(user.userId));

  console.log('user:', user.userId);

  useEffect(() => {
    setUserHasLiked(Array.isArray(likes) && likes.includes(user.userId));
  }, [likes, user.userId]);

  const handleLike = async () => {
    try {
      const res = await axios.put(`/api/content/${content._id}`, { userId: user.userId });
      if (res.data.success) {
        setLikes(res.data.data.likes || []);
      }
    } catch (error) {
      console.error('Error liking content:', error);
    }
  };

  return (
    <div className="content">
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      {content.youtubeUrl && <iframe src={content.youtubeUrl} frameBorder="0" allowFullScreen></iframe>}
      {content.thumbnailUrl && <Image src={content.thumbnailUrl} alt={content.title} width={100} height={100}/>}
      <div>
        <p><strong>Category:</strong> {content.categories?.title || 'N/A'} - {content.categories?.subtitle || 'N/A'}</p>
        <p><strong>Subcategory:</strong> {content.subcategories?.title || 'N/A'} - {content.subcategories?.subtitle || 'N/A'}</p>
        <p><strong>Group:</strong> {content.groups?.name || 'N/A'} - {content.groups?.description || 'N/A'}</p>
        <p><strong>Author:</strong> {content.author?.fullname || 'N/A'}</p> {/* Ensure this displays the full author data */}
        <p><strong>Publisher:</strong> {content.publisher ? "Yes" : "No"}</p>
        <p><strong>Points:</strong> {content.point}</p>
        <p><strong>Coins:</strong> {content.coins}</p>
        <p><strong>Views:</strong> {content.views}</p>
        <p><strong>Likes:</strong> {Array.isArray(likes) ? likes.length : 0}</p>
        <p><strong>Tags:</strong> {content.tags}</p>
      </div>
      <button onClick={handleLike}>
        {userHasLiked ? 'Unlike' : 'Like'} ({Array.isArray(likes) ? likes.length : 0})
      </button>
      <CommentList comments={content.comments} contentId={content._id} user={user} />
    </div>
  );
};

export default Content;