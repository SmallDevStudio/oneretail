// components/SendPointsCoins.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import Loading from './Loading';
import { IoCloseCircle } from "react-icons/io5";
import { toast } from 'react-toastify';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const SendPointsCoins = () => {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [point, setPoint] = useState(0);
  const [coins, setCoins] = useState(0);
  const [ref, setRef] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({
    taggedUsers: '',
    ref: '',
    point: '',
  });

  const userId = session?.user?.id;

  const { data: userData, isLoading: userLoading } = useSWR("/api/users", fetcher, {
    onSuccess: (data) => {
        setUsers(data.users);
    }
  });

  useEffect(() => {
    if (err && err.taggedUsers && inputValue.trim() !== '') {
      setErr((prevErr) => ({ ...prevErr, taggedUsers: '' }));
    }
  }, [err, inputValue]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const ids = inputValue.split(',').map(id => id.trim()).filter(id => id);
      const validIds = ids.filter(id => users.some(user => user.empId === id)); // ตรวจสอบ empId ที่มีใน users
      const newTags = validIds.filter(id => !taggedUsers.includes(id));
      setTaggedUsers([...taggedUsers, ...newTags]);
      setInputValue('');
    }
  };

  const handleTagClick = (user) => {
    if (!taggedUsers.includes(user.empId)) {
      setTaggedUsers([...taggedUsers, user.empId]);
    }
    setInputValue('');
  };

  const handleRemoveUser = (index) => {
    setTaggedUsers(taggedUsers.filter((_, i) => i !== index));
  };

  const handleRefChange = (e) => {
    setErr({
      taggedUsers: '',
      ref: '',
      point: '',
    });
    setRef(e.target.value);
  };

  const handleSend = async () => {
    if (taggedUsers.length === 0) {
      setErr((prevErr) => ({ ...prevErr, taggedUsers: 'กรุณากรอก taggedUsers' }));
      toast.error('กรุณากรอก taggedUsers', { position: "top-right", autoClose: 3000 });
      return;
    };
  
    if (!point && !coins) {
      setErr((prevErr) => ({ ...prevErr, point: 'กรุณากรอก point หรือ coins' }));
      toast.error('กรุณากรอก point หรือ coins', { position: "top-right", autoClose: 3000 });
      return;
    };
  
    if (ref.trim() === '') {
      setErr((prevErr) => ({ ...prevErr, ref: 'กรุณากรอก ref' }));
      toast.error('กรุณากรอก ref', { position: "top-right", autoClose: 3000 });
      return;
    };
  
    setLoading(true);
  
    try {
      const requests = taggedUsers.map(async (taggedUser) => {
        const payload = {
          userId: userId,
          empId: taggedUser,
          point: point,
          coins: coins,
          ref: ref,
          remark: remark
        };
  
        const response = await axios.post('/api/sendpointcoins', payload);
        return response.data;
      });
  
      const results = await Promise.all(requests);
      
      setLoading(false);
      toast.success(`ส่ง Point/Coins สำเร็จ ${results.length} รายการ`, { position: "top-right", autoClose: 3000 });
      handleClear(); // เคลียร์ค่าเมื่อส่งสำเร็จ
    } catch (error) {
      setLoading(false);
      console.error("Error sending points/coins:", error);
      toast.error("เกิดข้อผิดพลาดในการส่ง Point/Coins", { position: "top-right", autoClose: 3000 });
    }
  };
  

  const handleClear = () => {
    setTaggedUsers([]);
    setInputValue('');
    setPoint(0);
    setCoins(0);
    setRef('');
    setRemark('');
    setErr({
      taggedUsers: '',
      ref: '',
      point: '',
    });
  };

  if(loading) return <Loading />;

  return (
    <div className="p-4">
        <div className="flex justify-center items-center">
        <h2 className="text-2xl font-bold text-[#0056FF] mb-3">
            Send Points and Coins
        </h2>
        </div>
       <div className='flex flex-col w-full'>
        <textarea
          type="text" 
          name='Tags'
          id='Tags'
          className={`border rounded-md text-sm p-2 w-full ${err.taggedUsers ? "border-red-500" : ""}`}
          placeholder="พิมพ์ empId เลือก User หรือวาง empId ตัวอย่าง: 1234, 1235, 1236 แล้วกด Enter" 
          rows={4}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        {taggedUsers.length > 0 && 
          <div className='flex justify-end mt-1'>
            <span className='text-sm'><strong>จำนวนผู้ใช้:</strong> {taggedUsers.length}</span>
          </div>
        }
        <div className='flex flex-row flex-wrap items-center w-full gap-1 p-1 max-h-[200px] overflow-y-auto'>
          {taggedUsers.map((id, index) => (
            <div 
              key={index} 
              className="flex flex-row gap-1 items-center bg-gray-300 px-2 py-0.5 rounded-full text-sm"
            >
              <span>{id}</span>
              <IoCloseCircle 
                size={14}
                className="text-red-500"
                onClick={() => handleRemoveUser(index)}
              />
            </div>
          ))}
        </div>
        {inputValue && (
          <div >
            <div className="absolute bg-white border rounded-md z-[9999] max-h-[300px] overflow-y-auto">
              {users.filter(u => u.empId.includes(inputValue)).map(u => (
                <div key={u.empId} 
                  onClick={() => handleTagClick(u)} 
                  className="p-2 text-sm hover:bg-gray-100 cursor-pointer">
                  {u.empId} - {u.fullname}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        <div className='flex flex-col text-sm w-full border rounded-xl p-2 mt-5'>
          <div className="flex flex-row">
            <div className="flex flex-row items-center">
                <label className='font-bold'>Points:</label>
                <input
                type="number"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
                className={`w-1/2 border-2 ml-2 rounded-xl text-center
                ${err.point !== '' ? 'border-red-500 bg-red-50' : ''}`}
                />
            </div>
            <div className="flex flex-row items-center">
                <label className='font-bold'>Coins:</label>
                <input
                type="number"
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                className={`w-1/2 border-2 ml-2 rounded-xl text-center
                  ${err.point !== '' ? 'border-red-500 bg-red-50' : ''}`}
                />
            </div>
          </div>
          <div className="flex flex-row mt-2 items-center">
            <label className='font-bold'>
              Reference:<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ref}
              onChange={(e) => handleRefChange(e)}
              className={`w-full border-2 ml-2 rounded-xl px-2 py-1 
                ${err.ref !== '' ? 'border-red-500 bg-red-50' : ''}`}
              placeholder="ใส่รายละเอียดการให้ (จำเป็น)"
              required
            />
          </div>
          <div className="flex flex-row mt-2 items-center">
            <label className='font-bold'>Remark:</label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full border-2 ml-2 rounded-xl px-2 py-1"
              placeholder="หมายเหตุ"
            />
          </div>
        </div>
        <div className="flex flex-row items-center mt-5 gap-4 justify-center">
          <button 
            className="bg-[#0056FF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleSend}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>

          <button 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleClear}
          >
            Cancel
          </button>
        </div>
      
    </div>
  );
};

export default SendPointsCoins;
