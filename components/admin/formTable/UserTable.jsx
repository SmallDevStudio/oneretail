import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Image from 'next/image';
import useSWR from 'swr';
import moment from 'moment';
import 'moment/locale/th';
import * as XLSX from 'xlsx';
import { SiMicrosoftexcel } from "react-icons/si";

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
            renderCell: (params) => moment(params.value).locale('th').format('LLL')
        }
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <div className='flex justify-between mb-4'>
            <h1 className='text-2xl font-bold text-[#0056FF]'>จัดการผู้ใช้</h1>
            <button className="flex flex-row justify-center items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={exportToExcel}>
                <SiMicrosoftexcel />
                <span>Export</span>
            </button>
            </div>
           
            <DataGrid rows={users} columns={columns} pageSize={10} loading={loading} getRowId={(row) => row._id} />
        </div>
    );
};

export default UsersTable;
