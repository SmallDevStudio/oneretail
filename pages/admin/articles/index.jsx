import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";
import ArticleTable from "@/components/article/ArticleTable";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const router = useRouter();

    const { data: session } = useSession();
    const { data: articlesData, error, mutate } = useSWR('/api/articles', fetcher, {
        onSuccess: (data) => {
            setArticles(data.data);
        },
    });

    const onDelete = async (id) => {
        await axios.delete(`/api/articles/${id}`);
        mutate('/api/articles');
    };

    const onStatusChange = async (article) => {
        const newStatus = article.status === "draft" ? "published" : "draft";
        await axios.put(`/api/articles?id=${article._id}`, { ...article, status: newStatus });
        mutate('/api/articles');
    };

    const onPublishedChange = async (article) => {
        const newPublished = !article.published;
        await axios.put(`/api/articles?id=${article._id}`, { ...article, published: newPublished });
        mutate('/api/articles');
    };

    if (!articlesData) return <div>Loading...</div>;
    if (error) return <div>Error loading articles</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col justify-center mt-5 p-2">
                <h1 className="text-xl text-[#0056FF] font-bold">จัดการบทความ</h1>
                <div className="flex justify-end">
                    <button className="text-white text-sm font-bold bg-[#0056FF] p-2 rounded-full"
                        onClick={() => router.push('/admin/articles/add')}
                    >
                        เพิ่มบทความ
                    </button>
                </div>
            </div>
            <ArticleTable articles={articles} onDelete={onDelete} onStatusChange={onStatusChange} onPublishedChange={onPublishedChange} />
        </div>
    );
}

Articles.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Articles.auth = true;

export default Articles;
