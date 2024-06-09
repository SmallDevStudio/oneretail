import { useState, useEffect } from 'react';
import axios from 'axios';
import ContentList from '@/components/ContentList';

const Content = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await axios.get('/api/content');
        setContents(res.data.data);
      } catch (error) {
        setError(error.response ? error.response.data.error : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Content List</h1>
      {contents.length > 0 ? <ContentList contents={contents} /> : <p>No content available.</p>}
    </div>
  );
};
  
  export default Content;