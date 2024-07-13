import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import sha1 from "crypto-js/sha1";


const AddMedia = () => {
    const[img, setImg] = useState("");
    const[imageData, setImageData] = useState({url: "", public_id: ""});
    console.log(img);
    console.log(imageData);

    const { data: session } = useSession();
    
    const updateImage = (event) => {
        setImg(event.target.files[0]);
    }

    const uploadImage = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Replace YOUR_UPLOAD_PRESET
        data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
        
        try {
            const resp = await axios.post(`https://api.cloudinary.com/v1_1/dxshvbc9c/image/upload`, data);  
            console.log(resp);

            setImageData({url: resp.data.secure_url, public_id: resp.data.public_id});
            setImg("");

        } catch (error) {
            console.log(error);
        }
    }

    const generateSHA1 = (data) => {
        const hash = sha1(data);
        return hash.toString();
    }

    const generateSignature = (publicId, apiSecret) => {
        const timestamp = new Date().getTime();
        const signature = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        return generateSHA1(signature);
    }

    const deleteImage = async (e) => {
        e.preventDefault();
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const publicId = imageData.public_id;
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
    }

    return (
        <div>
            <h1>Add Media</h1>
            <div className="mt-5 mb-5">
                {img && (
                    <Image src={URL.createObjectURL(img)} width={200} height={200} alt="Image" />
                )}
            </div>
            <input type="file" onChange={updateImage} />
            <button onClick={uploadImage}>Upload Image</button>
            <button onClick={deleteImage}>Delete Image</button>
        </div>
    )

}

export default AddMedia;