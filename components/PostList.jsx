import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '@/components/Post';

const PostList = ({ initialPosts, user }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get('/api/posts', {
        params: { offset: posts.length }
      });
      setPosts(prevPosts => [...prevPosts, ...res.data.data]);
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
    <div className="flex flex-col w-[100vw] gap-2" onScroll={(e) => {
      if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
        loadMorePosts();
      }
    }}>
      {posts.map(post => (
        <Post key={post._id} post={post} user={user} onDelete={handleDeletePost} />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default PostList;