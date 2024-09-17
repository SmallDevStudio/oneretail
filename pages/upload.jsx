import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { IoIosCloseCircle } from 'react-icons/io';
import { useSession } from 'next-auth/react';

export default function Upload() {
  const [files, setFiles] = useState([]); // Array ของไฟล์ที่ต้องการอัปโหลด
  const [folder, setFolder] = useState('posts');
  const [uploadProgress, setUploadProgress] = useState({}); // เก็บ progress ของแต่ละไฟล์
  const [media, setMedia] = useState([]); // เก็บข้อมูลไฟล์ที่อัปโหลดสำเร็จ
  const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // แปลง FileList เป็น array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Step 1: Get Signed URL from server
        const { data } = await axios.post('/api/upload', {
          fileName: file.name,
          fileType: file.type,
          folder: 'posts',
          userId: userId, // Replace with actual user ID
        });

        const { uploadUrl, public_id, url, type } = data;

        // Step 2: Upload file to Google Cloud using the Signed URL
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [i]: percentCompleted,
            }));
          },
        });

        // Step 3: After upload, store the media details
        uploadedUrls.push({ public_id, url, type });

        // Update media with the response data
        setMedia((prevMedia) => [...prevMedia, { public_id, url, type }]);
      } catch (error) {
        console.error(`Error uploading file ${i + 1}:`, error);
      }
    }

    setIsUploading(false); // Stop upload state
  };

  const handleDelete = async (index) => {
    const fileUrl = media[index].url;
    const publicId = media[index].public_id;
    
    try {
      await axios.delete(`/api/upload?publicId=${publicId}&url=${fileUrl}`);
      setMedia(media.filter((_, i) => i !== index)); // ลบข้อมูลใน state เมื่อไฟล์ถูกลบ
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
          multiple // รองรับการเลือกหลายไฟล์
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
              <Image
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${index}`}
                width={100}
                height={100}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            )}

            {uploadProgress[index] === 100 && (
              <IoIosCloseCircle
                className="absolute top-0 right-0 text-xl cursor-pointer"
                style={{ position: 'absolute', top: '0px', right: '0px', fontSize: '18px', cursor: 'pointer' }}
                onClick={() => handleDelete(index)}
              />
            )}
          </div>
        ))}

        {/* แสดง media ที่อัปโหลดสำเร็จ */}
        {media.map((item, index) => (
          <div key={index} style={{ position: 'relative', width: '100px', height: '100px', margin: '10px' }}>
            <Image
              src={item.url}
              alt={`Media ${index}`}
              width={100}
              height={100}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <IoIosCloseCircle
              className="absolute top-0 right-0 text-xl cursor-pointer"
              style={{ position: 'absolute', top: '0px', right: '0px', fontSize: '18px', cursor: 'pointer' }}
              onClick={() => handleDelete(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
