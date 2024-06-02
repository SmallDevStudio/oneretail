import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import FormAdd from "@/components/admin/formTable/contents/FormAdd";

const AddContents = () => {
    return (
        <div className="flex flex-col p-10 w-full">
            <Header title="เพิ่มเนื้อหา" subtitle="ข้อมูลเนื้อหา เพิ่มเนื้อหา ลบเนื้อหา แก้ไขเนื้อหา" />
            <div className="p-5">
                <Suspense fallback={<Loading />}>
                   <FormAdd />
                </Suspense>
            </div>
        </div>
    );
};

AddContents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AddContents;
