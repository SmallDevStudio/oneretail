import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/th';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import RemoveBtn from "@/components/btn/removePage";
import TimeDisplay from "@/components/TimeDisplay";
import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ContentTable = () => {
    const [page, setPage] = useState(0); // Note: DataGrid uses zero-based indexing
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    const { data, error, mutate } = useSWR(`/api/contents?page=${page + 1}&limit=${limit}&search=${searchTerm}`, fetcher, {
        revalidateOnFocus: false
    });

    const loading = !data && !error;
    const rowCount = data ? data.totalItems : 0;
    const contents = data ? data.data : [];

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const togglePublisher = async (id, currentStatus) => {
        try {
            await axios.put(`/api/contents/${id}`, { publisher: !currentStatus });
            mutate(); // Re-fetch the data after updating publisher status
        } catch (error) {
            console.error("Failed to update publisher status:", error);
        }
    };

    const columns = [
        {
            field: 'thumbnailUrl',
            headerName: 'Thumbnail',
            width: 130,
            renderCell: (params) => (
                <Image src={params.value} alt="thumbnail" width={100} height={100} style={{ width: 'auto', height: 'auto', objectFit: 'cover' }} />
            )
        },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'categories', headerName: 'Category', width: 120, renderCell: (params) => params.row.categories?.title || '' },
        { field: 'subcategories', headerName: 'SubCategory', width: 120, renderCell: (params) => params.row.subcategories?.title || '' },
        { field: 'groups', headerName: 'Groups', width: 120, renderCell: (params) => params.row.groups?.name || '' },
        {
            field: 'publisher',
            headerName: 'Publisher',
            width: 100,
            renderCell: (params) => (
                <div className="flex justify-center items-center w-full">
                    <button
                        onClick={() => togglePublisher(params.row._id, params.row.publisher)}
                        className={`flex w-20 h-15 rounded-xl ${params.row.publisher ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                        <span className="flex m-auto font-bold">{params.row.publisher ? 'True' : 'False'}</span>
                    </button>
                </div>
            )
        },
        { field: 'point', headerName: 'Point', width: 50 },
        { field: 'coins', headerName: 'Coins', width: 50 },
        {
            field: 'author',
            headerName: 'Author',
            width: 100,
            renderCell: (params) => (
                params.row.author?.pictureUrl ? <Image src={params.row.author.pictureUrl} alt={params.row.author.fullname} width={50} height={50} className="rounded-full" /> : ''
            )
        },
        {
            field: 'createdAt',
            headerName: 'Date Created',
            width: 180,
            renderCell: (params) => <TimeDisplay time={params.value} />
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <div className="flex w-20 items-center justify-between">
                    <button onClick={() => router.push(`/admin/contents/update?id=${params.row._id}`)}>
                        <BorderColorOutlinedIcon />
                    </button>
                    <RemoveBtn id={params.row._id} />
                </div>
            )
        }
    ];

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full p-5">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
                <div className="flex">
                    <Link href="/admin/contents/add">
                        <button type="button"
                            className="border border-[#0056FF] text-[#0056FF] hover:bg-[#0056FF]/10 hover:text-[#0056FF] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#06C755]/50"
                        >
                            เพิ่มเนื้อหา
                        </button>
                    </Link>
                </div>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Search by title"
                        className="border border-gray-300 rounded-lg p-2"
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <DataGrid
                rows={contents}
                columns={columns}
                page={page}
                pageSize={limit}
                rowCount={rowCount}
                pagination
                paginationMode="server"
                loading={loading}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newLimit) => setLimit(newLimit)}
                rowsPerPageOptions={[10, 20, 30]}
                getRowId={(row) => row._id}
            />
        </div>
    );
}

export default ContentTable;
