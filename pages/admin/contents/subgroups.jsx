import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import SubGroupTable from "@/components/admin/formTable/SubGroupTable";


const CategoryPage = () => {
    return (
        <div className="flex flex-col p-10 w-full">
            <Header title="จัดการGroup" subtitle="จัดการข้อมูลGroup เพิ่มGroup ลบGroup แก้ไขGroup" />
            <div className="flex mb-5">
                
            </div>
            <div className="p-5">
                <Suspense fallback={<Loading />}>
                    <SubGroupTable />
                </Suspense>
            </div>
        </div>
    );
};

CategoryPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default CategoryPage;
