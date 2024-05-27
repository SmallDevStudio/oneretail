import { AdminLayout } from "@/themes";
import { useState } from "react";
import Header from "@/components/admin/global/Header";
import LearningTable from "@/components/admin/learning/LearningTable";
import { Suspense } from "react";
import Loading from "@/components/Loading";
const PageData = () => {
    

    return (
        <>
            <div className="flex p-5">
                <Header title="จัดการการหน้า" subtitle="จัดการข้อมูลหน้า ลบหน้า แก้ไขหน้า" />
            </div>

            <div className="p-5">
                <Suspense fallback={<Loading />}>
                    <LearningTable />
                </Suspense>
            </div>
        </>
    );
}

export default PageData;

PageData.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;