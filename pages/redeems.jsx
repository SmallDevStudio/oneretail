"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import Image from 'next/image';

const RedeemPage = () => {
  const [redeems, setRedeems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    stock: 0,
    expire: '',
    coins: 0,
    point: 0,
    creator: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    fetchRedeems();
  }, []);

  const fetchRedeems = async () => {
    const res = await axios.get('/api/redeem');
    setRedeems(res.data.data);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = (result) => {
    if (result.event === 'success') {
      setForm({ ...form, image: result.info.secure_url });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form:', form);

    if (isEdit) {
        await axios.put('/api/redeem', { ...form, id: editId });
      } else {
        await axios.post('/api/redeem', {
          ...form,
          creator: userId,
        });
      }
      fetchRedeems();
      setForm({ name: '', description: '', image: '', stock: 0, expire: '', coins: 0, point: 0 });
      setIsEdit(false);
      setEditId(null);
    };


  const handleEdit = (redeem) => {
    setForm({
      name: redeem.name,
      description: redeem.description,
      image: redeem.image,
      stock: redeem.stock,
      expire: redeem.expire,
      coins: redeem.coins,
      point: redeem.point,
    });
    setIsEdit(true);
    setEditId(redeem._id);
  };

  const handleDelete = async (id) => {
    await axios.delete('/api/redeem', { data: { id } });
    fetchRedeems();
  };

  return (
    <div>
      <h1>Manage Redeem</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="text" name="description" value={form.description} onChange={handleInputChange} placeholder="Description" required />
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onUpload={handleUpload}
        >
          {({ open }) => (
            <button type="button" onClick={open}>
              Upload Image
            </button>
          )}
          </CldUploadWidget>
        <input type="number" name="stock" value={form.stock} onChange={handleInputChange} placeholder="Stock" required />
        <input type="date" name="expire" value={form.expire} onChange={handleInputChange} placeholder="Expire Date"  />
        <input type="number" name="coins" value={form.coins} onChange={handleInputChange} placeholder="Coins"  />
        <input type="number" name="point" value={form.point} onChange={handleInputChange} placeholder="Points"  />
        <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
      </form>
      <div>
        <h2>Redeem List</h2>
        {redeems.map((redeem) => (
          <div key={redeem._id}>
            <h3>{redeem.name}</h3>
            <p>{redeem.description}</p>
            <CldImage src={redeem.image} width="100" height="100" alt={redeem.name} />
            <p>Stock: {redeem.stock}</p>
            <p>Expire: {new Date(redeem.expire).toLocaleDateString()}</p>
            <p>Coins: {redeem.coins}</p>
            <p>Points: {redeem.point}</p>
            <button onClick={() => handleEdit(redeem)}>Edit</button>
            <button onClick={() => handleDelete(redeem._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedeemPage;