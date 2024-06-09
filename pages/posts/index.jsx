import PostList from "@/components/PostList";
import CreatePost from "@/components/CreatePost";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  console.log('userId:', userId);

  const { data, error } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher, {
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts');
        setPosts(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [userId]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="home">
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

export default Home;