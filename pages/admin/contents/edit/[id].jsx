import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import ContentFormUpdate from "@/components/admin/formTable/ContentFormUpdate";

const AddContents = () => {
    return (
        <div className="flex flex-col p-10 w-full">
            <Header title="แก้ไขเนื้อหา" subtitle="แก้ไขเนื้อหา" />
            <div className="p-5">
                <Suspense fallback={<Loading />}>
                   <ContentFormUpdate />
                </Suspense>
            </div>
        </div>
    );
};

AddContents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AddContents;
