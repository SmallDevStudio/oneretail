"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import RemoveBtn from "@/components/btn/removePage";
import TimeDisplay from "@/components/TimeDisplay";

const ContentTable = () => {
    const router = useRouter();
    const [contents, setContents] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchContents = async (page, pageSize) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/content`, {
                params: {
                    page: page + 1, // MUI DataGrid uses 0-based index, so increment by 1
                    pageSize: pageSize
                }
            });
            const data = res.data;
            setContents(data.data);
            setRowCount(data.totalItems); // Adjust this based on your API's response
        } catch (error) {
            console.error("Failed to fetch contents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContents(page, pageSize);
    }, [page, pageSize]);

    const columns = [
        { field: 'thumbnailUrl', headerName: 'Thumbnail', width: 130, renderCell: (params) => (
            <Image src={params.value} alt="thumbnail" width={100} height={100} />
        )},
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'categories', headerName: 'Category', width: 120, renderCell: (params) => params.row.categories?.title || '' },
        { field: 'subcategories', headerName: 'SubCategory', width: 120, renderCell: (params) => params.row.subcategories?.title || '' },
        { field: 'groups', headerName: 'Groups', width: 120, renderCell: (params) => params.row.groups?.name || '' },
        { field: 'publisher', headerName: 'Publisher', width: 50, renderCell: (params) => params.row.publisher ? 'Yes' : 'No' },
        { field: 'point', headerName: 'Point', width: 50 },
        { field: 'coins', headerName: 'Coins', width: 50 },
        { field: 'author', headerName: 'Author', width: 100, renderCell: (params) => (
            params.row.author?.pictureUrl ? <Image src={params.row.author.pictureUrl} alt={params.row.author.fullname} width={50} height={50} className="rounded-full" /> : ''
        )},
        { field: 'createdAt', headerName: 'Date Created', width: 180, renderCell: (params) => (
            <TimeDisplay time={params.value} />
        )},
        {
            field: 'action', headerName: 'Action', width: 150, renderCell: (params) => (
                <div className="flex w-20 items-center justify-between">
                    <button onClick={() => router.push(`/admin/contents/update?id=${params.row._id}`)}>
                        <BorderColorOutlinedIcon/>
                    </button>
                    <RemoveBtn id={params.row._id} />
                </div>
            )
        }
    ];

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-[100vw]">
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
            </div>

            <DataGrid
                rows={contents}
                columns={columns}
                page={page}
                pageSize={pageSize}
                rowCount={rowCount}
                pagination
                paginationMode="server"
                loading={loading}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 30]}
                getRowId={(row) => row._id}
            />
        </div>
    );
}

export default ContentTable;