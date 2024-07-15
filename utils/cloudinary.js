import React from "react";
import axios from "axios";
import sha1 from "crypto-js/sha1";


const AddImage = async (img) => {
  
    const data = {
        file: img,
        upload_preset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
        cloud_name: process.env.REACT_APP_CLOUD_NAME
    }
    console.log('data', data);

    try {
      const resp = await axios.post(
        `https://api.cloudinary.com/v1_1/dxshvbc9c/image/upload`,
        data
      );
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
};

const generateSHA1 = (data) => {
  const hash = sha1(data);
  return hash.toString();
}

const generateSignature = (publicId, apiSecret) => {
  const timestamp = new Date().getTime();
  const signature = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  return generateSHA1(signature);
}

const DeleteImage = async(public_id) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const publicId = public_id;
        const timestemp = new Date().getTime();
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

        try {
          const resp = await axios.post(url, {
              public_id: publicId,
              signature: generateSignature(publicId, apiSecret),
              api_key: apiKey,
              timestamp: timestemp,
          });
          console.log(resp);

          setImageData({url: "", public_id: ""});

      } catch (error) {
          console.log(error);
      }
  
};

export { AddImage, DeleteImage };