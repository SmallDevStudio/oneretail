import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ArticleView from "@/components/article/ArticleView";
import { AppLayout } from "@/themes";

const Article = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className="flex bg-black/40 min-h-[100vh] mb-20">
            <ArticleView articleId={id} />
        </div>
    );
};

export default Article;

Article.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Article.auth = true;