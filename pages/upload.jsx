import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { IoIosCloseCircle } from 'react-icons/io';
import { useSession } from 'next-auth/react';

export default function Upload() {
  const [files, setFiles] = useState([]); // เปลี่ยนจาก file เป็น array ของ files
  const [folder, setFolder] = useState('');
  const [uploadProgress, setUploadProgress] = useState({}); // จัดการ progress ของแต่ละไฟล์
  const [media, setMedia] = useState([]); // เก็บ media ที่อัปโหลดสำเร็จ
  const [uploadedImagesUrls, setUploadedImagesUrls] = useState({}); // เก็บ URL ของไฟล์ที่อัปโหลดเสร็จ
  const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด

  const { data: session } = useSession();
  const userId = session?.user?.id;

  console.log('media', media);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    for (let file of selectedFiles) {
      try {
        // สร้าง Signed URL สำหรับแต่ละไฟล์
        const res = await axios.post('/api/generate-signed-url', {
          fileName: file.name,
          fileType: file.type,
        });

        const { url, fileName } = res.data;

        // อัปโหลดไฟล์ไปยัง Signed URL
        await axios.put(url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        setMedia((prevMedia) => [...prevMedia, { url: `https://storage.googleapis.com/your-bucket-name/posts/${fileName}`, type: file.type }]);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsUploading(true); // เริ่มการอัปโหลด
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('folder', 'posts');
      formData.append('userId', userId);

      try {
        const res = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [i]: percentCompleted, // อัปเดต progress ของไฟล์ปัจจุบัน
            }));
          },
        });

        setMedia((prevMedia) => [...prevMedia, ...res.data]); // อัปเดต media ด้วยข้อมูลจาก API
        // อัปเดต URL ที่อัปโหลดสำเร็จ

      } catch (error) {
        console.error(`Error uploading file ${i + 1}:`, error);
      }
    }

    setIsUploading(false); // หยุดการอัปโหลดเมื่อครบทุกไฟล์
  };

  const handleDelete = async (index) => {
    const fileUrl = media[index].url;
    try {
      await axios.delete(`/api/library?fileUrl=${fileUrl}`);
      setMedia(media.filter((_, i) => i !== index)); // ลบจาก state
    } catch (error) {
      console.error(`Error deleting file:`, error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          multiple // ทำให้ input รองรับการเลือกหลายไฟล์
        />
        <input
          type="text"
          placeholder="Folder name"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        />
        <button type="submit" disabled={isUploading}>
          Upload
        </button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {files.map((file, index) => (
          <div key={index} style={{ position: 'relative', width: '100px', height: '100px', margin: '10px' }}>
            {/* แสดง progress bar ถ้ายังอัปโหลดไม่เสร็จ */}
            {uploadProgress[index] !== 100 ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <CircularProgressbar
                  value={uploadProgress[index] || 0}
                  text={`${uploadProgress[index] || 0}%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: '#4caf50',
                    textColor: '#fff',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
            ) : (
              // เมื่ออัปโหลดเสร็จแสดงรูปแทน
              <Image
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${index}`}
                width={100}
                height={100}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            )}

            {/* ปุ่มลบ */}
            {uploadProgress[index] === 100 && (
              <IoIosCloseCircle
                className="absolute top-0 right-0 text-xl cursor-pointer"
                style={{ position: 'absolute', top: '0px', right: '0px', fontSize: '18px', cursor: 'pointer' }}
                onClick={() => handleDelete(index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
