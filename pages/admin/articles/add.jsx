import React from "react";
import { AdminLayout } from "@/themes";
import AddArticleForm from "@/components/article/AddArticleForm";

const AddArticle = () => {
    return (
        <div className="flex flex-col justify-center mt-5 p-2">
            <h1 className="text-xl font-bold text-[#0056FF]">เพิ่มบทความ</h1>

            <AddArticleForm />
        </div>
    );
};

AddArticle.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
AddArticle.auth = true;

export default AddArticle;