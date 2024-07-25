import React from "react";
import useSWR from "swr";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import Image from "next/image";
import { RiDeleteBinLine, RiPushpinFill } from "react-icons/ri";
import { MdFiberNew } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ArticleList = () => {
    const { data: session } = useSession();
    const { data, error, mutate } = useSWR('/api/articles/list', fetcher);
    const { data: user } = useSWR(session?.user?.id ? `/api/users/${session?.user?.id}` : null, fetcher);

    const handleCommentDelete = async (articleId) => {
        try {
            const res = await axios.delete(`/api/articles/${articleId}`);
            mutate('/api/articles/list');
        } catch (error) {
            console.error(error);
        }
    };

    if (error) return <div>Error loading articles</div>;
    if (!data) return <div>Loading...</div>;

    const { data: articles } = data;

    return (
        <div className="flex flex-col w-full p-2">
            {articles.map((article) => (
                <div key={article._id} className="border-2 border-gray-200 rounded-xl p-4 mb-4">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                            {article.pinned && (
                                <RiPushpinFill className="text-lg text-red-500 mr-2" />
                            )}
                            {article.popular && (
                                <FaStar className="text-lg text-yellow-500 mr-2" />
                            )}
                            {article.new && (
                                <MdFiberNew className="text-lg text-green-500 mr-2" />
                            )}
                            <h2 className="text-lg font-bold">{article.title}</h2>
                        </div>
                        <div className="flex flex-row items-center">
                            <p className="text-sm text-gray-500">{moment(article.createdAt).fromNow()}</p>
                            {user?.user?.role === 'admin' && (
                                <button onClick={() => handleCommentDelete(article._id)}>
                                    <RiDeleteBinLine className="text-lg text-gray-500 ml-2" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        {/* footer */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArticleList;
