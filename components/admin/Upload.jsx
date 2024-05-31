import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import Alert from '../notification/Alert';
import { useRouter } from 'next/router';

const Upload = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch('/api/images');
      const data = await res.json();
      setImages(data.data);
    };

    fetchImages();
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    const formData = new FormData();
    formData.append('image', data.Image);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const image = await response.json();
      setLoading(false);
      router.reload();
    } else {
      setLoading(false);
      new Alert("ผิดพลาด", "เพิ่มข้อมูลไม่สําเร็จ", "error");
      console.error('Error uploading image');
    }
 
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" {...register('image', { required: true })} />
          {errors.image && <span>กรุณาเลือกไฟล์รูปภาพ</span>}
        <button type="submit">อัปโหลด</button>
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