import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Image from 'next/image';
import useSWR from 'swr';
import moment from 'moment';
import 'moment/locale/th';
import * as XLSX from 'xlsx';
import { SiMicrosoftexcel } from "react-icons/si";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Autocomplete, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import '@/styles/CategoryTable.module.css';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);

    const { data, error } = useSWR('/api/users/emp', fetcher, {
        onSuccess: (data) => {
            setUsers(data.data);
            setLoading(false);
        }
    });

    useEffect(() => {
        setFilteredUsers(
            users.filter(user =>
                user.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    const handleRoleChange = async (userId, newRole) => {
        await axios.put(`/api/users/update?userId=${userId}`, { role: newRole });
        setUsers(prev =>
            prev.map(user => (userId === userId ? { ...user, role: newRole } : user))
        );
    };

    const handleActiveToggle = async (userId, currentActive) => {
        const newActive = !currentActive;
        await axios.put(`/api/users/${userId}`, { active: newActive });
        setUsers(prev =>
            prev.map(user => (user._id === userId ? { ...user, active: newActive } : user))
        );
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setOpenViewModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await axios.delete(`/api/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        }
    };

    const exportToExcel = () => {
        const maxLength = 32767;
        const trimmedUsers = users.map(user => {
            const trimmedUser = { ...user };
            for (let key in trimmedUser) {
                if (typeof trimmedUser[key] === 'string' && trimmedUser[key].length > maxLength) {
                    trimmedUser[key] = trimmedUser[key].substring(0, maxLength);
                }
            }
            return trimmedUser;
        });

        const maxRows = 10000; // กำหนดจำนวนแถวสูงสุดต่อแผ่นงาน
        const workbook = XLSX.utils.book_new();
        let sheetIndex = 1;

        for (let i = 0; i < trimmedUsers.length; i += maxRows) {
            const chunk = trimmedUsers.slice(i, i + maxRows);
            const worksheet = XLSX.utils.json_to_sheet(chunk);
            XLSX.utils.book_append_sheet(workbook, worksheet, `Users_${sheetIndex}`);
            sheetIndex++;
        }

        XLSX.writeFile(workbook, 'users.xlsx');
    };

    const columns = [
        {
            field: 'pictureUrl',
            headerName: 'Picture',
            width: 100,
            renderCell: (params) => (
                <Image src={params.value} alt={params.row.fullname} width="50" height="50" className='rounded-full' style={{ width: '50px', height: '50px'}}/>
            )
        },
        { field: 'fullname', headerName: 'Fullname', width: 200 },
        { field: 'empId', headerName: 'Emp ID', width: 150 },
        { field: 'teamGrop', headerName: 'Team Group', width: 150 },
        {
            field: 'role',
            headerName: 'Role',
            width: 150,
            renderCell: (params) => (
                <select
                    value={params.value}
                    onChange={(e) => handleRoleChange(params.row._id, e.target.value)}
                >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                </select>
            )
        },
        {
            field: 'active',
            headerName: 'Active',
            width: 100,
            renderCell: (params) => (
                <button onClick={() => handleActiveToggle(params.row._id, params.value)}>
                    {params.value ? 'Active' : 'Inactive'}
                </button>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 200,
            renderCell: (params) => moment(params.value).locale('th').format('LLL')
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <button onClick={() => handleViewUser(params.row)} className="text-gray-800 font-bold py-2 px-4 rounded-full mr-2"><FaRegEye /></button>
                    <button onClick={() => handleDeleteUser(params.row._id)} className="text-gray-800 font-bold py-2 px-4 rounded-full "><RiDeleteBinLine /></button>
                </>
            )
        }
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            
            <h1 className='text-2xl font-bold text-[#0056FF] mb-4'>จัดการผู้ใช้</h1>

            <div className='flex justify-between mb-4 w-full'>
            <Autocomplete
                freeSolo
                options={users.map(user => `${user.empId} - ${user.fullname}`)}
                onInputChange={(event, newInputValue) => {
                    const [empId] = newInputValue.split(' - ');
                    setSearchTerm(empId);
                }}
                renderInput={(params) => (
                    <TextField {...params} label="ค้นหาโดย Emp ID หรือ Fullname" variant="outlined" />
                )}
                style={{ width: '30%', marginRight: '10px', fontFamily: 'ttb', fontSize: '10px', borderRadius: '15px' }} 
                sx={{
                    '& .MuiAutocomplete-inputRoot': {
                        fontFamily: 'ttb',
                        fontSize: '10px',
                        borderRadius: '25px',
                    },
                    '& .MuiAutocomplete-endAdornment': {
                        fontFamily: 'ttb',
                        fontSize: '10px',
                    },
                }}
            />

            <button className="flex flex-row justify-center items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={exportToExcel}>
                <SiMicrosoftexcel />
                <span>Export</span>
            </button>
            </div>
           
            <DataGrid 
                rows={filteredUsers} 
                columns={columns} 
                pageSize={10} 
                loading={loading} 
                getRowId={(row) => row._id} 
            />

            <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)}>
                <DialogTitle>
                    <span className="text-2xl font-bold text-[#0056FF]" style={{
                        fontFamily: "ttb"
                    }}>
                    ข้อมูลผู้ใช้
                    </span>
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Image src={selectedUser.pictureUrl} alt={selectedUser.fullname} width="100" height="100" className='rounded-full' style={{ width: '100px', height: '100px', objectFit: 'cover'}}/>
                            <div className='flex flex-col text-sm mt-2'>
                            <p><strong>Fullname:</strong> {selectedUser.fullname}</p>
                            <p><strong>LineID:</strong> {selectedUser.userId}</p>
                            <p><strong>EmpID:</strong> {selectedUser.empId}</p>
                            <p><strong>Sex:</strong> {selectedUser.sex === 'M'? 'Male' : 'Female'}</p>
                            <p><strong>BirthDate:</strong> {selectedUser.birthdate}</p>
                            <p><strong>Address:</strong> {selectedUser.address}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone}</p>
                            <p><strong>Team Group:</strong> {selectedUser.teamGrop}</p>
                            <p><strong>Department:</strong> {selectedUser.department}</p>
                            <p><strong>Group:</strong> {selectedUser.group}</p>
                            <p><strong>Position:</strong> {selectedUser.position}</p>
                            <p><strong>Chief_th:</strong> {selectedUser.chief_th}</p>
                            <p><strong>Chief_eng:</strong> {selectedUser.chief_eng}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            <p><strong>Active:</strong> {selectedUser.active ? 'Active' : 'Inactive'}</p>
                            <p><strong>Created At:</strong> {moment(selectedUser.createdAt).locale('th').format('LLL')}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <div className="flex justify-center items-center w-full mb-5">
                    <Button onClick={() => setOpenViewModal(false)}
                        className='bg-[#0056FF] hover:bg-[#0056FF]/80 text-white font-bold py-2 px-4 rounded-full'    
                    >Close</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UsersTable;
