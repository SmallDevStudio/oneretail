import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Image from 'next/image';
import debounce from 'lodash/debounce';

const TagUsers = ({ isOpen, handleCloseModal, setSelectedUser }) => {
  const [options, setOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState([]);

  const fetchUsers = debounce(async (query) => {
    try {
      const res = await fetch(`/api/users/tag?search=${query}`);
      const data = await res.json();
      setOptions(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, 300);

  useEffect(() => {
    if (searchQuery) {
      fetchUsers(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = (event, value) => {
    setSearchQuery(value);
  };

  const handleChange = (event, value) => {
    setSelected(value);
    setSelectedUser(value); // ส่งข้อมูลกลับไปที่ CommentInput
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseModal}>
      <div className="modal-header">
        <div className='flex justify-end w-full'>
          <button onClick={handleCloseModal} className='text-black text-xl'>
            <svg className='w-6 h-6 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
              <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-4">
        <p className="text-xl font-bold text-[#0056FF] mb-2">แท็กผู้คน</p>
        <Autocomplete
          multiple
          options={options}
          getOptionLabel={(option) => `${option.empId} - ${option.fullname}`}
          onInputChange={handleSearch}
          onChange={handleChange}
          value={selected}
          sx={{ width: 300 }} // เพิ่มขนาดความกว้าง
          renderOption={(props, option) => (
            <li {...props} className="flex items-center">
              <Image
                src={option.pictureUrl}
                alt={option.fullname}
                width={20}
                height={20}
                className="rounded-full mr-2"
                style={{ borderRadius: '50%', width: '20px', height: '20px' }}
              />
              <ListItemText primary={`${option.empId} - ${option.fullname}`} />
              <Checkbox checked={selected.includes(option)} />
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="ค้นหาชื่อผู้ใช้" variant="outlined" />
          )}
        />
      </div>
    </Dialog>
  );
};

export default TagUsers;
