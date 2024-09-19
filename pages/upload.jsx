import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { IoIosCloseCircle } from 'react-icons/io';
import { useSession } from 'next-auth/react';
import ReactPlayer from 'react-player';

export default function Upload() {
  const [files, setFiles] = useState([]); // เปลี่ยนจาก file เป็น array ของ files
  const [folder, setFolder] = useState('');
  const [uploadProgress, setUploadProgress] = useState({}); // จัดการ progress ของแต่ละไฟล์
  const [media, setMedia] = useState([]); // เก็บ media ที่อัปโหลดสำเร็จ
  const [isUploading, setIsUploading] = useState(false); // จัดการสถานะการอัปโหลด

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // แปลง FileList เป็น array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsUploading(true); // เริ่มการอัปโหลด
    const uploadedFiles = [];
  
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('folder', 'posts');
      formData.append('userId', userId);
  
      try {
        // ขอ Signed URL สำหรับอัปโหลดไฟล์
        const { data: signedUrls } = await axios.post('/api/upload', formData, {
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
  
        for (const { public_id, uploadUrl, file_name, type } of signedUrls) {
          try {
            // อัปโหลดไฟล์ไปที่ Signed URL
            const res = await axios.put(uploadUrl, files[i], {
              headers: {
                'Content-Type': files[i].type,
              },
            });

            if (res.status !== 200) {
              throw new Error('Failed to upload file');
            };

            const url = `https://storage.googleapis.com/${'oneretail-35482.appspot.com'}/${file_name}`;
  
            // เมื่อการอัปโหลดเสร็จสิ้น ให้ทำการบันทึกข้อมูลลงใน MongoDB
            const saveResponse = await axios.post('/api/upload/save', {
              public_id,
              file_name,
              file_size: files[i].size,
              file_type: type,
              mime_type: files[i].type,
              folder: 'posts',
              userId, // บันทึก userId
              url,
              type,
            });
  
            const { publicUrl } = saveResponse.data;
  
            uploadedFiles.push({ public_id, publicUrl, file_name, type }); // เพิ่มไฟล์ที่อัปโหลดแล้ว
  
          } catch (error) {
            console.error(`Error uploading file ${file_name}:`, error);
          }
        }
  
        setMedia((prevMedia) => [...prevMedia, ...uploadedFiles]); // อัปเดต media ด้วยไฟล์ที่อัปโหลดเสร็จแล้ว
  
      } catch (error) {
        console.error(`Error fetching signed URL for file ${i + 1}:`, error);
      }
    }
  
    setIsUploading(false); // หยุดการอัปโหลดเมื่อครบทุกไฟล์
  };

  const handleDelete = async (index) => {
    const fileUrl = media[index].publicUrl;
    try {
      await axios.delete(`/api/library?fileUrl=${fileUrl}&publicId=${media[index].public_id}`);
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
        {media.map((file, index) => (
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
                src={file.publicUrl}
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
      {media.length > 0 && media.map((item, index) => (
        <div key={index}>
          <ReactPlayer
            url={item.publicUrl}
            controls
            width={350}
            height={200}
          />
        </div>
      ))}
      <div>
        
      </div>
    </div>
  );
}
