import PostList from "@/components/PostList";
import CreatePost from "@/components/CreatePost";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const ShareYourStory = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: userData, error } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher, {
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  const { data: postData, error: postError } = useSWR('/api/posts', fetcher, {
    refreshInterval: 2000,
    onSuccess: (data) => {
      setPosts(data.data);
    },
  });

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };


  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);

    // Fetch updated posts
    axios.get('/api/posts').then((response) => {
      setPosts(response.data.data);
      fetchPosts();
    });
  };

  return (
    <div className="home mb-20">
      {user ? (
        <>
          <CreatePost user={user} onPostCreated={handlePostCreated} />
          <PostList posts={posts} user={user} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShareYourStory;