import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";
import ArticleTable from "@/components/article/ArticleTable";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Pagination from '@mui/material/Pagination';
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Articles = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, error, mutate } = useSWR(`/api/articles/list?page=${page}&pageSize=${pageSize}&search=${searchTerm}`, fetcher);

    const onDelete = async (id) => {
        await axios.delete(`/api/articles/${id}`);
        mutate();
    };

    const onStatusChange = async (article) => {
        const newStatus = article.status === "draft" ? "published" : "draft";
        await axios.put(`/api/articles?id=${article._id}`, { ...article, status: newStatus });
        mutate();
    };

    const onPublishedChange = async (article) => {
        const newPublished = !article.published;
        await axios.put(`/api/articles?id=${article._id}`, { ...article, published: newPublished });
        mutate();
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPage(1); // reset to first page on search
    };

    if (error) return <div>Error loading articles</div>;
    if (!data) return <div>Loading...</div>;

    const { articles, totalRecords } = data;

    if (!data) return <div>Loading...</div>;
    if (error) return <div>Error loading articles</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col justify-center mt-5 p-2">
                <h1 className="text-xl text-[#0056FF] font-bold">จัดการบทความ</h1>
                <div className="flex justify-end">
                    
                </div>
            </div>
            <ArticleTable 
                articles={articles} 
                onDelete={onDelete} 
                onStatusChange={onStatusChange} 
                onPublishedChange={onPublishedChange} 
                onSearch={handleSearch}
            />
            <div className="flex items-center w-full">
                <div className="flex mt-4 text-sm text-gray-500 justify-start w-1/2">Total Records: {totalRecords}</div>
                <Pagination
                    count={Math.ceil(totalRecords / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    className="flex mt-4 justify-start w-1/2"
                />
                
            </div>
        </div>

    );
}

Articles.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Articles.auth = true;

export default Articles;
