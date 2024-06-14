import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Image from 'next/image';
import useSWR from 'swr';
import moment from 'moment';
import 'moment/locale/th';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data, error } = useSWR('/api/users/emp', fetcher, {
        onSuccess: (data) => {
            setUsers(data.data);
            setLoading(false);
        }
    });

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    const handleRoleChange = async (userId, newRole) => {
        await axios.put(`/api/users/${userId}`, { role: newRole });
        setUsers(prev =>
            prev.map(user => (user._id === userId ? { ...user, role: newRole } : user))
        );
    };

    const handleActiveToggle = async (userId, currentActive) => {
        const newActive = !currentActive;
        await axios.put(`/api/users/${userId}`, { active: newActive });
        setUsers(prev =>
            prev.map(user => (user._id === userId ? { ...user, active: newActive } : user))
        );
    };

    const columns = [
        {
            field: 'pictureUrl',
            headerName: 'Picture',
            width: 100,
            renderCell: (params) => (
                <Image src={params.value} alt={params.row.fullname} width="50" height="50" className='rounded-full'/>
            )
        },
        { field: 'fullname', headerName: 'Fullname', width: 200 },
        { field: 'empId', headerName: 'Emp ID', width: 150 },
        { field: 'teamGrop', headerName: 'Team Group', width: 150 },
        { field: 'position', headerName: 'Position', width: 150 },
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
            valueFormatter: (params) => moment(params.value).locale('th').format('LLL')
        }
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <h1 className='text-2xl font-bold mb-4 text-[#0056FF]'>จัดการผู้ใช้</h1>
           
            <DataGrid rows={users} columns={columns} pageSize={10} loading={loading} getRowId={(row) => row._id} />
        </div>
    );
};

export default UsersTable;
