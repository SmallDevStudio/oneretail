import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";
import ArticleTable from "@/components/article/ArticleTable";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Articles = () => {
    const { data: session } = useSession();
    const [articles, setArticles] = useState([]);

    const router = useRouter();

    const { data, error } = useSWR('/api/articles', fetcher, {
        onSuccess: (data) => {
            setArticles(data.data);
        },
    });

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
            <ArticleTable articles={articles}/>
        </div>
    );
}

Articles.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Articles.auth = true;

export default Articles;