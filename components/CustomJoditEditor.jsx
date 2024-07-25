import React, { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const JoditEditor = dynamic(() => import('jodit-pro-react'), { ssr: false });

const CustomJoditEditor = ({ onChange, value }) => {
  const editor = useRef(null);
  const { data: session } = useSession();

  const uploadFileToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, data);
      return response.data;
    } catch (error) {
      console.error("Error uploading file: ", error);
      return null;
    }
  };

  const saveFileToDatabase = async (fileData, fileType) => {
    try {
      const res = await axios.post('/api/media', {
        url: fileData.secure_url,
        publicId: fileData.public_id,
        name: session.user.id,
        userId: session.user.id,
        type: fileType,
        path: 'article',
        isTemplate: false,
      });
      return res.data;
    } catch (error) {
      console.error("Error saving file to database: ", error);
      return null;
    }
  };

  const handleFileUpload = async (files) => {
    const file = files[0];
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      const fileData = await uploadFileToCloudinary(file);
      if (fileData && editor.current) {
        await saveFileToDatabase(fileData, fileType);
        const insertHTML = fileType === 'image' 
          ? `<img src="${fileData.secure_url}" alt="Image"/>` 
          : `<a href="${fileData.secure_url}" target="_blank">${file.name}</a>`;
        editor.current.selection.insertHTML(insertHTML);
      }
    }
  };

  const config = useMemo(() => ({
    insertImageAsBase64URI: true,
    toolbarButtonSize: 'small',
  }), []);

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => onChange(newContent)}
        onChange={(newContent) => {}}
      />
    </div>
  );
};

export default CustomJoditEditor;
