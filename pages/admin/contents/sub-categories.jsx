import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import SubCategoryTable from "@/components/admin/formTable/SubCategoryTable";


const CategoryPage = () => {
    return (
        <div className="flex flex-col p-10 w-full">
            <Header title="จัดการหมวดหมู่ย่อย" subtitle="จัดการข้อมูลหมวดหมู่ย่อย เพิ่มหมวดหมู่ย่อย ลบหมวดหมู่ย่อย แก้ไขหมวดหมู่ย่อย" />
            <div className="flex mb-5">
                
            </div>
            <div className="p-5">
                <Suspense fallback={<Loading />}>
                    <SubCategoryTable />
                </Suspense>
            </div>
        </div>
    );
};

CategoryPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default CategoryPage;
