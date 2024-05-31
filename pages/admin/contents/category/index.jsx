import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import CategoryTable from "@/components/admin/formTable/CategoryTable";


const CategoryPage = () => {
    return (
        <div className="flex flex-col p-10 w-full">
            <Header title="จัดการหมวดหมู่" subtitle="จัดการข้อมูลหมวดหมู่ เพิ่มหมวดหมู่ ลบหมวดหมู่ แก้ไขหมวดหมู่" />
            <div className="flex mb-5">
                
            </div>
            <div className="p-5">
                <Suspense fallback={<Loading />}>
                    <CategoryTable />
                </Suspense>
            </div>
        </div>
    );
};

CategoryPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default CategoryPage;
