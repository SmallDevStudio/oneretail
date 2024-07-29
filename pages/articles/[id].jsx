import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import ArticleView from "@/components/article/ArticleView";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import axios from "axios";
import { AppLayout } from "@/themes";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Article = () => {
    const [article, setArticle] = useState({});
    const [comments, setComments] = useState([]);
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [likes, setLikes] = useState(article.likes || []);
    const [userHasLiked, setUserHasLiked] = useState(Array.isArray(likes) && likes.includes(userId));
    const router = useRouter();
    const { id } = router.query;

    const { data, error, mutate } = useSWR(`/api/articles/${id}`, fetcher, {
        onSuccess: (data) => {
            setArticle(data.data.article);
            setComments(data.data.comments);
        },
    });

    const handleLike = async () => {
        try {
            const res = await axios.put(`/api/articles/${id}`, { likes: [...article.likes, userId] });
            if (res.data.success) {
                setLikes(res.data.data.likes || []);
                setUserHasLiked(res.data.data.likes.includes(userId));
            }
        } catch (error) {
            console.error('Error liking article:', error);
        }
    };

    const handleComment = () => {
        mutate();
    };

    if (!data) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <ArticleView 
                article={article} 
                handleLike={handleLike} 
                userHasLiked={userHasLiked}
                comments={comments}
                handleComment={handleComment}
                userId={userId}
            />
        </div>
    );
};

export default Article;

Article.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Article.auth = true;