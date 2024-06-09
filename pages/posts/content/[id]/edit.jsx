import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const EditContent = () => {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [publisher, setPublisher] = useState(true);
  const [point, setPoint] = useState(0);
  const [coins, setCoins] = useState(0);
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/api/content/${id}`)
        .then(res => {
          const data = res.data.data;
          console.log('Content data:', data);
          setContent(data);
          setTitle(data.title);
          setDescription(data.description);
          setYoutubeUrl(data.youtubeUrl);
          setThumbnailUrl(data.thumbnailUrl);
          setSelectedCategory(data.categories?._id || '');
          setSelectedSubcategory(data.subcategories?._id || '');
          setSelectedGroup(data.groups?._id || '');
          setPublisher(data.publisher);
          setPoint(data.point);
          setCoins(data.coins);
          setTags(Array.isArray(data.tags) ? data.tags.join(' ') : ''); // Convert tags array to space-separated string
          setLoading(false);
        })
        .catch(err => {
          setError(err.response ? err.response.data.error : err.message);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => {
        console.log('Categories data:', res.data.data);
        setCategories(res.data.data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setError(err.response ? err.response.data.error : err.message);
      });

    axios.get('/api/subcategories')
      .then(res => {
        console.log('Subcategories data:', res.data.data);
        setSubcategories(res.data.data);
      })
      .catch(err => {
        console.error('Error fetching subcategories:', err);
        setError(err.response ? err.response.data.error : err.message);
      });

    axios.get('/api/groups')
      .then(res => {
        console.log('Groups data:', res.data.data);
        setGroups(res.data.data);
      })
      .catch(err => {
        console.error('Error fetching groups:', err);
        setError(err.response ? err.response.data.error : err.message);
      });
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(`/api/content/edit/${id}`, {
        title,
        description,
        youtubeUrl,
        thumbnailUrl,
        categories: selectedCategory,
        subcategories: selectedSubcategory,
        groups: selectedGroup,
        publisher,
        point,
        coins,
        tags: tags.split(' ').filter(tag => tag), // Convert space-separated string to array
      });
      router.push(`/content/${id}`);
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Edit Content</h1>
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div>
        <label>YouTube URL</label>
        <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
      </div>
      <div>
        <label>Thumbnail URL</label>
        <input type="text" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
      </div>
      <div>
        <label>Categories</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Subcategories</label>
        <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
          <option value="">Select a subcategory</option>
          {subcategories.map(subcategory => (
            <option key={subcategory._id} value={subcategory._id}>
              {subcategory.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Groups</label>
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">Select a group</option>
          {groups.map(group => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Publisher</label>
        <input type="checkbox" checked={publisher} onChange={(e) => setPublisher(e.target.checked)} />
      </div>
      <div>
        <label>Point</label>
        <input type="number" value={point} onChange={(e) => setPoint(Number(e.target.value))} />
      </div>
      <div>
        <label>Coins</label>
        <input type="number" value={coins} onChange={(e) => setCoins(Number(e.target.value))} />
      </div>
      <div>
        <label>Tags (separate with space)</label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditContent;