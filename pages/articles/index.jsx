import React from "react";
import ArticleList from "@/components/article/ArticleList";
import { AppLayout } from "@/themes";

const ArticlesPage = () => {
    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold my-4">Articles</h1>
            <ArticleList />
        </div>
    );
};

export default ArticlesPage;

