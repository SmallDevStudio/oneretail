// pages/admin/campaign.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AdminLayout } from '@/themes';

const AdminCampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    banner: '',
    link: '',
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const response = await axios.get('/api/campaign');
    setCampaigns(response.data.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (data) => {
    setFormData({ ...formData, description: data });
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace YOUR_UPLOAD_PRESET

    const response = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, { // Replace YOUR_CLOUD_NAME
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    setFormData({ ...formData, [fieldName]: data.secure_url });

    if (fieldName === 'image') {
      setImagePreview(URL.createObjectURL(file));
    } else if (fieldName === 'banner') {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/campaign', formData);
    fetchCampaigns();
    setShowForm(false);
  };

  return (
    <div className="flex flex-col w-full p-5">
      <h1 className='text-3xl uppercase font-bold text-[#0056FF] mb-2'>Campaign</h1>
      <div className='flex justify-start mb-2'>
      <button onClick={() => setShowForm(!showForm)}
        className='bg-[#0056FF] text-white p-2 rounded-lg'
        >Add Campaign</button>
        </div>
      <table className="table-auto border-collapse border border-slate-500 text-sm ">
        <thead className='bg-gray-200'>
          <tr className='bg-gray-200 font-bold'>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Banner</th>
            <th>Link</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='bg-white text-sm'>
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.title}</td>
              <td>{campaign.description}</td>
              <td><Image src={campaign.image} alt={campaign.title} width={50} height={50} style={{ width: '50px', height: '50px' }} /></td>
              <td><Image src={campaign.banner} alt={campaign.title} width={50} height={50} style={{ width: '50px', height: '50px' }} /></td>
              <td>{campaign.link}</td>
              <td>{campaign.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                {/* Add edit and delete buttons */}
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
        }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} className='p-4 gap-2'>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className='border-2 rounded-3xl p-2'
            />
            <div className='flex w-full justify-center items-center'>
                {imagePreview && <Image src={imagePreview} alt="Image Preview" width={100} height={100} style={{ width: '100px', height: '100px' }}/>}
            </div>
            <input
                type="file"
                name="image"
                onChange={(e) => handleImageUpload(e, 'image')}
            />
            <div className='flex w-full justify-center items-center'>
                {bannerPreview && <Image src={bannerPreview} alt="Banner Preview" width={100} height={100} style={{ width: '100px', height: '100px' }} />}
            </div>
            <input
                type="file"
                name="banner"
                onChange={(e) => handleImageUpload(e, 'banner')}
                className='mb-5'
            />
            
            <input
                type="text"
                name="link"
                placeholder="Link"
                value={formData.link}
                onChange={handleInputChange}
                className='border-2 rounded-3xl p-2 mb-2'
            />
            <div className="flex items-center mb-4">
                <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-900">
                Is Active
                </label>
            </div>
            <div className='flex justify-center'>
            <button type="submit"
                className='bg-[#0056FF] text-white p-2 rounded-full'
            >Submit</button>
            </div>
            </form>
        </div>
      )}
    </div>
  );
};

AdminCampaignPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminCampaignPage;
