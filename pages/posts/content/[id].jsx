import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Content from '@/components/Content';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Loading from '@/components/Loading';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ContentPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); // You should fetch or provide the current user information here

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { data, error: swrError } = useSWR(userId ? `/api/users/${userId}` : null, fetcher, {
      onSuccess: (data) => {
        setUser(data.user);
      },
    });
  
    useEffect(() => {
      if (id) {
        const fetchContent = async () => {
          try {
            const res = await axios.get(`/api/content/${id}`);
            setContent(res.data.data);
          } catch (error) {
            setError(error.response ? error.response.data.error : error.message);
          } finally {
            setLoading(false);
          }
        };
  
        fetchContent();
      }
    }, [id]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  
    return (
      <div>
        {content && <Content content={content} user={user} />}
      </div>
    );
  };
  
  export default ContentPage;