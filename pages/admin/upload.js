import { useEffect, useState } from 'react';
import Image from 'next/image';

const Upload = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch('/api/images');
      const data = await res.json();
      setImages(data.data);
    };

    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setImages([...images, data.data]);
      setFile(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image) => (
            <tr key={image._id}>
              <td>
                <Image src={image.url} alt={image.name} width={100} height={100} />
              </td>
              <td>{image.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Upload;