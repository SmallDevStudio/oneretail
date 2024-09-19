'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function AvatarUploadPage() {
  const [files, setFiles] = useState(null);
  const [media, setMedia] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const inputRef = useRef(null); // ใช้ useRef เพื่อเข้าถึง input

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    const fileArray = Array.from(files); // เปลี่ยนเป็น array เพื่อให้ง่ายต่อการวนลูป

    // วนลูปอัปโหลดไฟล์ทีละไฟล์และใช้ Promise.all เพื่อจัดการทั้งหมดพร้อมกัน
    const uploadPromises = fileArray.map(async (file) => {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/blob/upload',
      });

      const mediaEntry = {
        url: newBlob.url,
        public_id: nanoid(10),
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        type: file.type.startsWith('image') ? 'image' : 'video',
        userId, // เชื่อมโยงกับ userId ของผู้ใช้
        folder: '', // สามารถแก้ไขเพิ่มเติมถ้าต้องการจัดเก็บใน folder
      };

      // ส่งข้อมูลไฟล์ไปยัง API /api/upload/save เพื่อบันทึกลงในฐานข้อมูล
      await axios.post('/api/upload/save', mediaEntry);

      return mediaEntry;
    });

    // รอการอัปโหลดทั้งหมดเสร็จสิ้น
    const uploadedMedia = await Promise.all(uploadPromises);

    // เพิ่มไฟล์ที่อัปโหลดทั้งหมดใน state media
    setMedia((prevMedia) => [...prevMedia, ...uploadedMedia]);

    setFiles(null);
    setIsUploading(false);
    setUploadProgress({});

    // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์ใหม่ได้หลังการอัปโหลดเสร็จ
    inputRef.current.value = '';
  };

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form onSubmit={handleUpload}>
        <input
          ref={inputRef} // ใช้ useRef เพื่อเข้าถึง input
          name="file"
          type="file"
          onChange={handleFileChange}
          multiple // อนุญาตให้เลือกหลายไฟล์
          required
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {isUploading && (
        <div style={{ marginTop: '20px' }}>
          <CircularProgress />
        </div>
      )}

      {media.length > 0 && (
        <div>
          <h2>Uploaded Media</h2>
          <ul>
            {media.map((item) => (
              <li key={item.public_id}>
                {item.type === 'image' ? (
                  <Image src={item.url} alt={item.public_id} width={100} height={100} />
                ) : (
                  <video src={item.url} width={100} controls />
                )}
                <p>{item.public_id}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
