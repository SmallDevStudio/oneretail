import React, { useCallback } from 'react';
import Script from 'next/script';

const UploadWidget = ({ onUpload }) => {
  const handleUpload = useCallback(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        unsigned: true,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          onUpload(result.info.secure_url);
        }
      }
    );
    widget.open();
  }, [onUpload]);

  return (
    <>
    <Script src="https://widget.cloudinary.com/v2.0/global/all.js" />
    <button type="button" onClick={handleUpload}>
      Upload Image
    </button>
    </>
  );
};

export default UploadWidget;