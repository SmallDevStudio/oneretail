import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '@/components/Post';

const PostList = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data.data);
      setHasMore(res.data.data.length > 0);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setLoading(false);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  return (
    <div className="post-list mt-10" onScroll={(e) => {
      if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
        loadPosts();
      }
    }}>
      {posts.map(post => (
        <Post key={post._id} post={post} user={user} onDelete={handleDeletePost} />
      ))}
    </div>
  );
};

export default PostList;