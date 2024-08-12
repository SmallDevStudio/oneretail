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
import { useRouter } from "next/router";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ArticleList = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { data, error, mutate } = useSWR('/api/articles', fetcher);
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
        <div className="flex flex-col w-full overflow-x-hidden">
            <div className="relative items-center justify-center w-full">
                <Image 
                    src="/images/Article.jpg" 
                    alt="article" 
                    width={1000} 
                    height={100} 
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </div>
            <div className="px-2">
            <div className="flex flex-col w-full p-1 border-2 bg-gray-200 rounded-xl mt-2">
                    {Array.isArray(data.data) && data.data.map((article, index) => (
                        <div 
                        key={index} 
                        className="flex flex-row rounded-lg"
                        onClick={() => router.push(`/articles/${article._id}`)}
                    >
                        <div className="flex max-w-[130px] min-w-[130px]">
                        {article.thumbnail ? (
                            <Image
                            src={article.thumbnail}
                            alt={article.title}
                            width={150}
                            height={100}
                            loading="lazy"
                            className="rounded-xl"
                            style={{
                                width: "auto",
                                height: "90px",
                                cursor: "pointer",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                        ): (
                            article.medias.length > 0 && (
                                article.medias[0].type === 'image' ? (
                                    <Image
                                        src={article.medias[0].url}
                                        alt={article.title}
                                        width={150}
                                        height={100}
                                        loading="lazy"
                                        className="rounded-xl"
                                        style={{
                                            width: "auto",
                                            height: "90px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}
                                    />
                                ) : (
                                    <div className="relative">
                                        <video width="150" height="90" controls style={{
                                            width: "auto",
                                            height: "90px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}>
                                            <source src={article.medias[0].url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                        </video>
                                            <FaRegPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-3xl" />
                                    </div>
                                )
                            )
                        )}
                        </div>
                        <div className="flex flex-col text-left px-2">
                            <span className="font-bold text-sm">{article.title}</span>
                            <span className="text-xs font-light text-black">{moment(article.createdAt).fromNow()}</span>
                            <span className="text-xs font-light text-black line-clamp-2">{article.description}</span>
                        </div>
                    </div>
                    ))}
            </div>
            </div>
        </div>
    );
};

export default ArticleList;
