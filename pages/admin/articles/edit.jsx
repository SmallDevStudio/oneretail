import React from "react";
import { AdminLayout } from "@/themes";
import EditArticleForm from "@/components/article/EditArticleForm";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";

const EditArticlePage = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center">
                <button
                    onClick={() => router.back()}
                    className="text-xl text-[#0056FF] font-bold mb-4 mr-4"
                >
                    <IoIosArrowBack />
                </button>
                <h1 className="text-xl text-[#0056FF] font-bold mb-4">แก้ไขบทความ</h1>
                </div>
            {id && <EditArticleForm articleId={id} />}
        </div>
    );
};

EditArticlePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
EditArticlePage.auth = true;

export default EditArticlePage;
