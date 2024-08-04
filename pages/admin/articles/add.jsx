import React from "react";
import { AdminLayout } from "@/themes";
import AddArticleForm from "@/components/article/AddArticleForm";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";

const AddArticle = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col justify-center mt-5 p-2">
            <div className="flex flex-row items-center mb-4 gap-4">
                <IoIosArrowBack className="text-xl inline text-gray-700" 
                    onClick={() => router.back()}
                />
                <span className="text-xl font-bold text-[#0056FF]">เพิ่มบทความ</span>
            </div>

            <AddArticleForm />
        </div>
    );
};

AddArticle.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
AddArticle.auth = true;

export default AddArticle;