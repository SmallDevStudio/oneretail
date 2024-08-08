import React, { useState, useEffect } from 'react';
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
import { IoIosArrowBack, IoMdSkipBackward ,IoIosArrowForward, IoMdSkipForward } from "react-icons/io";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ContentTable = () => {
    const [page, setPage] = useState(0);
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
            mutate();
        } catch (error) {
            console.error("Failed to update publisher status:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(Number(event.target.value));
    };

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

            {loading ? (
                <div className="flex justify-center items-center">
                    Loading...
                </div>
            ) : (
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thumbnail</th>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SubCategory</th>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Groups</th>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Publisher</th>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Created</th>
                            <th className="px-6  border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contents.map((content) => (
                            <tr key={content._id}>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">
                                    <Image src={content.thumbnailUrl} alt="thumbnail" width={100} height={100} style={{ width: 'auto', height: 'auto', objectFit: 'cover' }} />
                                </td>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">{content.title}</td>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">{content.categories?.title || ''}</td>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">{content.subcategories?.title || ''}</td>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">{content.groups?.name || ''}</td>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex justify-center items-center w-full">
                                        <button
                                            onClick={() => togglePublisher(content._id, content.publisher)}
                                            className={`flex w-20 h-15 rounded-xl ${content.publisher ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                        >
                                            <span className="flex m-auto font-bold">{content.publisher ? 'True' : 'False'}</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">
                                    {content.author?.pictureUrl ? (
                                        <Image src={content.author.pictureUrl} alt={content.author.fullname} width={50} height={50} className="rounded-full" />
                                    ) : ''}
                                </td>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">
                                    <TimeDisplay time={content.createdAt} />
                                </td>
                                <td className="px-6  whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex w-20 items-center justify-between">
                                        <button onClick={() => router.push(`/admin/contents/update?id=${content._id}`)}>
                                            <BorderColorOutlinedIcon />
                                        </button>
                                        <RemoveBtn id={content._id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="flex justify-between items-center ">
                <div></div>
                <div className="flex gap-8">
                    <button onClick={() => handlePageChange(0)} disabled={page === 0}>
                        <IoMdSkipBackward />
                    </button>
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                        <IoIosArrowBack />
                    </button>
                    <div>
                    Page{' '}
                    <strong>
                        {page + 1} of {Math.ceil(rowCount / limit)}
                    </strong>
                    </div>
                    <button onClick={() => handlePageChange(page + 1)} disabled={(page + 1) * limit >= rowCount}>
                        <IoIosArrowForward />
                    </button>
                    <button onClick={() => handlePageChange(Math.floor(rowCount / limit))} disabled={(page + 1) * limit >= rowCount}>
                        <IoMdSkipForward />
                    </button>
                </div>
                
                <div>
                    <select
                        value={limit}
                        onChange={handleLimitChange}
                    >
                        {[10, 20, 30].map(size => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default ContentTable;
