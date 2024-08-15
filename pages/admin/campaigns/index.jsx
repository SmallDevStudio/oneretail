// pages/admin/campaign.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { AdminLayout } from '@/themes';
import { ImFilePicture } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const AdminCampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [smallBanner, setSmallBanner] = useState(null);
  const [url, setUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [smallBannerPreview, setSmallBannerPreview] = useState(null);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null); // New state to track editing

  const { data: session } = useSession();

  const { data, error: swrError, mutate } = useSWR('/api/campaigns', fetcher, {
    onSuccess: (data) => {
      setCampaigns(data.data);
    },
  });

  console.log(campaigns);

  const handleUploadImage = () => {
    setError(null);
    window.cloudinary.openUploadWidget(
        {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            sources: ['local', 'url', 'camera', 'image_search'],
            multiple: true,
            resourceType: 'auto', // Automatically determines if it's image or video
        },
        (error, result) => {
            if (result.event === 'success') {
                setImage(
                    { url: result.info.secure_url, public_id: result.info.public_id, type: result.info.resource_type }
                );
                setImagePreview(result.info.secure_url);
              }
          }
      );
  };  

  const handleUploadBanner = () => {
    setError(null);
    window.cloudinary.openUploadWidget(
        {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            sources: ['local', 'url', 'camera', 'image_search'],
            multiple: true,
            resourceType: 'auto', // Automatically determines if it's image or video
        },
        (error, result) => {
            if (result.event === 'success') {
                setBanner(
                    { url: result.info.secure_url, public_id: result.info.public_id, type: result.info.resource_type }
                );
                setBannerPreview(result.info.secure_url);
              }
          }
      );
  };  

  const handleUploadSmallBanner = () => {
    setError(null);
    window.cloudinary.openUploadWidget(
        {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            sources: ['local', 'url', 'camera', 'image_search'],
            multiple: true,
            resourceType: 'auto', // Automatically determines if it's image or video
        },
        (error, result) => {
            if (result.event === 'success') {
                setSmallBanner(
                    { url: result.info.secure_url, public_id: result.info.public_id, type: result.info.resource_type }
                );
                setSmallBannerPreview(result.info.secure_url);
              }
          }
      );
  };  


  const handleEditorChange = (data) => {
    setDescription(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = {
      title,
      description,
      image,
      banner,
      smallbanner: smallBanner,
      url,
      userId: session.user.id
    };

    try {
      if (editId) {
        // Update the campaign if editing
        await axios.put(`/api/campaigns/${editId}`, newData);
      } else {
        // Create a new campaign
        await axios.post('/api/campaigns', newData);
      }

      // Reset the form
      setShowForm(false);
      setTitle('');
      setDescription('');
      setImage(null);
      setBanner(null);
      setSmallBanner(null);
      setImagePreview(null);
      setBannerPreview(null);
      setSmallBannerPreview(null);
      setEditId(null); // Reset editId
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this post? This process cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`/api/campaigns/${id}`);
        console.log(response.data);
        mutate();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (campaign) => {
    setTitle(campaign.title);
    setDescription(campaign.description);
    setUrl(campaign.url || '');
    setImage(campaign.image || null);
    setBanner(campaign.banner || null);
    setSmallBanner(campaign.smallbanner || null);
    setImagePreview(campaign.image ? campaign.image.url : null);
    setBannerPreview(campaign.banner ? campaign.banner.url : null);
    setSmallBannerPreview(campaign.smallbanner ? campaign.smallbanner.url : null);
    setEditId(campaign._id); // Set editId to the campaign being edited
    setShowForm(true);
  };
  

  return (
    <div className="flex flex-col w-full p-5">
      <h1 className='text-3xl uppercase font-bold text-[#0056FF] mb-2'>Campaign</h1>
      <div className='flex justify-start mb-2'>
      <button onClick={() => setShowForm(!showForm)}
        className='bg-[#0056FF] text-white p-2 rounded-lg'
        >{editId ? 'Edit Campaign' : 'Add Campaign'}</button>
        </div>
      <table className="table-auto border-collapse border border-slate-500 text-sm ">
        <thead className='bg-gray-200'>
          <tr className='bg-gray-200 font-bold'>
            <th>Banner</th>
            <th>Title</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='bg-white text-sm'>
          {campaigns && campaigns.map((campaign, index) => (
            <tr key={index}>
              <td className='w-1/6'>
                {campaign.banner && (
                  <Image 
                    src={campaign.banner.url} 
                    alt={campaign.title} 
                    width={200} 
                    height={200} 
                    style={{ width: '200px', height: 'auto' }} 
                  />
                )}
              </td>
              <td className='text-center'>
                {campaign.title}
              </td>
              <td className='text-center'>
                {campaign.isActive ? 'Active' : 'Inactive'}
              </td>
              <td>
                {/* Add edit and delete buttons */}
                <div className="flex justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEdit(campaign)}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleDelete(campaign._id)}
                  >
                    < RiDeleteBin5Line />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showForm && (
        <div className='flex border-2 rounded-3xl p-2 m-5 w-1/2 justify-center' style={{
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '15px',
            padding: '20px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            width: '500px',
        }}>
            <div className="flex flex-col w-full gap-2 text-sm">
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='border-2 rounded-3xl p-2'
            />
           
            <div className='flex w-full justify-center items-center'>
                {bannerPreview && <Image src={bannerPreview} alt="Banner Preview" width={200} height={200} style={{ width: '200px', height: 'auto' }} />}
            </div>

            <div className='flex flex-row w-full items-center gap-2'>
              <span className="text-sm font-bold">Banner:</span>
              <div className='border rounded-xl shadow'>
              <button
                      onClick={handleUploadBanner}
                      className="flex flex-row items-center gap-2 p-2 cursor-pointer"
                  >
                      <ImFilePicture className="text-xl text-[#0056FF]" />
                      <div className="flex flex-col text-left">
                          <span className="text-sm font-bold">อัพโหลดรูปภาพสำหรับ Banner</span>
                          <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
                      </div>
              </button>
              </div>
            </div>

            <div className='flex w-full justify-center items-center'>
                {smallBannerPreview && <Image src={smallBannerPreview} alt="Small Banner Preview" width={200} height={200} style={{ width: '200px', height: 'auto' }} />}
            </div>
            <div className='flex flex-row w-full items-center gap-2'>
              <span className="text-sm font-bold">SmallBanner:</span>
              <div className='border rounded-xl shadow'>
              <button
                      onClick={handleUploadSmallBanner}
                      className="flex flex-row items-center gap-2 p-2 cursor-pointer"
                  >
                      <ImFilePicture className="text-xl text-[#0056FF]" />
                      <div className="flex flex-col text-left">
                          <span className="text-sm font-bold">อัพโหลดรูปภาพสำหรับ SmallBanner</span>
                          <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
                      </div>
              </button>
              </div>
            </div>

            <div className='flex w-full justify-center items-center'>
                {imagePreview && <Image src={imagePreview} alt="Image Preview" width={200} height={200} style={{ width: '200px', height: 'auto' }}/>}
            </div>

            <div className='flex flex-row w-full items-center gap-2'>
              <span className="text-sm font-bold">Image:</span>
              <div className='border rounded-xl shadow'>
              <button
                      onClick={handleUploadImage}
                      className="flex flex-row items-center gap-2 p-2 cursor-pointer"
                  >
                      <ImFilePicture className="text-xl text-[#0056FF]" />
                      <div className="flex flex-col text-left">
                          <span className="text-sm font-bold">อัพโหลดรูปภาพสำหรับ Page</span>
                          <span className="text-[10px] text-red-500 ">* สามารถอัพโหลดได้ไม่เกิน 100MB</span>
                      </div>
              </button>
              </div>
            </div>
                <textarea
                    type="text"
                    name="description"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='border-2 rounded-3xl p-2 mb-2'
                    rows={4}
                />

            <input
                type="text"
                name="url"
                placeholder="Url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className='border-2 rounded-3xl p-2'
            />
            
            <div className='flex justify-center'>
            <button 
              type="submit"
              className='bg-[#0056FF] text-white p-2 rounded-full'
              onClick={handleSubmit}
            >{editId ? 'Update' : 'Submit'}</button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

AdminCampaignPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminCampaignPage;
