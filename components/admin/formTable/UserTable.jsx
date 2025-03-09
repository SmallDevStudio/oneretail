import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/th';
import * as XLSX from 'xlsx';
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Autocomplete, TextField, Dialog, Slide, DialogTitle, DialogContent, DialogActions, Button, Divider } from '@mui/material';
import '@/styles/CategoryTable.module.css';
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const UsersTable = ({ users, setUsers, mutate }) => {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [form, setForm] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const { data: session, loading: loadingSession } = useSession();

    const userId = session?.user.id;

    useEffect(() => {
        if (loadingSession) return;
    }, [loadingSession]);
    
    useEffect(() => {
        if (!users) return;

        if (searchTerm) {
            setFilteredUsers(
                users.filter(user =>
                    user.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredUsers(users);
        }
        
    }, [searchTerm, users]);

    useEffect(() => {
        if (isEdit && selectedUser) {
            setForm(selectedUser);
        }
    }, [isEdit, selectedUser]);

    const handleRoleChange = async (userId, newRole) => {
        await axios.put(`/api/users/update?userId=${userId}`, { role: newRole });
        mutate();
        setUsers(prev =>
            prev.map(user => (user._id === userId ? { ...user, role: newRole } : user)) // ใช้ user._id ในการเปรียบเทียบ
        );
    };

    const handleActiveToggle = async (userId, currentActive) => {
        const newActive = !currentActive;
        await axios.put(`/api/users/${userId}`, { active: newActive });
        setUsers(prev =>
            prev.map(user => (user._id === userId ? { ...user, active: newActive } : user))
        );
        mutate();
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
                <div className="flex justify-center items-center" style={{ width: '50px', height: '50px' }}>
                    <Image 
                        src={params.value} 
                        alt={params.row.fullname} 
                        width="50" 
                        height="50" 
                        className='rounded-full' 
                        style={{ width: '50px', height: '50px'}}
                    />
                </div>
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
                <div className="flex items-center justify-center h-12">
                    <button 
                        onClick={() => handleActiveToggle(params.row.userId, params.value)}
                        className={`px-2 py-1 rounded-full text-sm ${params.value ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                        {params.value ? 'Active' : 'Inactive'}
                    </button>
                </div>
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
                    <button onClick={() => handleOpenForm(params.row)} className="text-gray-800 font-bold py-2 px-4 rounded-full "><FaEdit /></button>
                    <button onClick={() => handleViewUser(params.row)} className="text-gray-800 font-bold py-2 px-4 rounded-full mr-2"><FaRegEye /></button>
                    <button onClick={() => handleDeleteUser(params.row._id)} className="text-gray-800 font-bold py-2 px-4 rounded-full "><RiDeleteBinLine /></button>
                   
                </>
            )
        }
    ];

    const handleOpenForm = (user) => {
        setSelectedUser(user);
        setIsEdit(true);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedUser(null);
        setIsEdit(false);
        setOpenForm(false);
    };

    const handleUpdateUser = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/users/${selectedUser.userId}`, form);
            if (response.status === 200) {
                await axios.post('/api/userlog', { 
                    userId: userId, 
                    targetId: selectedUser.userId, 
                    action: 'อัปเดตผู้ใช้' 
                });
                toast.success('อัปเดตผู้ใช้สําเร็จ');
                handleCloseForm();
                mutate();
            } else {
                toast.error('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้');
        } finally {
            setLoading(false);
        }
        
    };


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

            <Dialog
                open={openForm}
                onClose={handleCloseForm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                TransitionComponent={Transition}
            >
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row bg-[#0056FF] text-white items-center justify-between p-2 gap-4 w-full'>
                        <h1 className='text-xl font-bold'>แก้ไขข้อมูล User</h1>
                        <IoClose size={30} onClick={handleCloseForm}/>
                    </div>

                    <div className='flex flex-col text-sm gap-2 p-4'>
                        {form && form.pictureUrl && (
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <Image
                                    src={form.pictureUrl}
                                    alt={form.fullname}
                                    width="150"
                                    height="150"
                                    className='rounded-full'
                                    style={{ width: '150px', height: '150px', objectFit: 'cover'}}
                                />
                            </div>
                        )}

                        <div className='flex flex-row items-center gap-1'>
                            <label htmlFor="userId" className='font-bold w-1/6'>รหัสผู้ใช้</label>
                            <input 
                                type="text"
                                id="userId"
                                name="userId"
                                placeholder='กรุณากรอกรหัสพนักงาน'
                                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0056FF] focus:border-[#0056FF]'
                                value={form.userId}
                                onChange={(e) => setForm({...form, userId: e.target.value})} 
                            />
                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <label htmlFor="empId" className='font-bold w-1/6'>รหัสพนักงาน</label>
                            <input 
                                type="text"
                                id="empId"
                                name="empId"
                                placeholder='กรุณากรอกรหัสพนักงาน'
                                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0056FF] focus:border-[#0056FF]'
                                value={form.empId}
                                onChange={(e) => setForm({...form, empId: e.target.value})} 
                            />
                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <label htmlFor="fullname" className='font-bold w-1/6'>ชื่อ</label>
                            <input 
                                type="text"
                                id="fullname"
                                name="fullname"
                                placeholder='กรุณากรอกรหัสพนักงาน'
                                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0056FF] focus:border-[#0056FF]'
                                value={form.fullname}
                                onChange={(e) => setForm({...form, fullname: e.target.value})} 
                            />
                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <label htmlFor="phone" className='font-bold w-1/6'>เบอร์โทร</label>
                            <input 
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder='กรุณากรอกชื่อ'
                                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0056FF] focus:border-[#0056FF]'
                                value={form.phone}
                                onChange={(e) => setForm({...form, phone: e.target.value})} 
                            />
                        </div>

                        <div className='flex flex-row gap-1'>
                            <label htmlFor="address" className='font-bold w-1/6'>ที่อยู่</label>
                            <textarea
                                id="address"
                                name="address"
                                placeholder='กรุณากรอกรที่อยู่'
                                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0056FF] focus:border-[#0056FF]'
                                value={form.address}
                                onChange={(e) => setForm({...form, address: e.target.value})} 
                                rows={4}
                            />
                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <label htmlFor="role" className='font-bold w-1/6'>บทบาท</label>
                            <select 
                                name="role" 
                                id="role"
                                className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0056FF] focus:border-[#0056FF]'
                                value={form.role}
                                onChange={(e) => setForm({...form, role: e.target.value})}
                            >
                                <option value="">กรุณาเลือกบทบาท</option>
                                <option value="admin">admin</option>
                                <option value="user">user</option>
                                <option value="guest">manager</option>
                            </select>
                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <label htmlFor="active" className='font-bold w-1/6'>ใช้งาน</label>
                            <div>
                                <span
                                    className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-medium cursor-pointer ${form.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                    onClick={() => handleActiveToggle(form.userId, form.active)}
                                >
                                    {form.active === true ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                                </span>
                            </div>
                        </div>

                        <Divider className='flex my-2 w-full'/>

                        <div className='flex flex-row items-center justify-center gap-8'>
                            <button
                                className='bg-[#0056FF] font-bold text-white p-2 rounded-lg'
                                onClick={handleUpdateUser}
                            >
                                บันทึก
                            </button>

                            <button
                                className='bg-red-500 font-bold text-white p-2 rounded-lg'
                                onClick={handleCloseForm}
                            >
                                ยกเลิก
                            </button>
                        </div>

                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default UsersTable;
