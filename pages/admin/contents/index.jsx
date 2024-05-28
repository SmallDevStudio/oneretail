import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import ContentTable from "@/components/admin/formTable/ContentTable";


const Contents = () => {
    return (
        <div className="flex flex-col p-10 w-full">
            <Header title="จัดการเนื้อหา" subtitle="จัดการข้อมูลเนื้อหา เพิ่มเนื้อหา ลบเนื้อหา แก้ไขเนื้อหา" />
            <div className="flex mb-5">
                
            </div>
            <div className="p-5">
                <Suspense fallback={<Loading />}>
                  <ContentTable />
                </Suspense>
            </div>
        </div>
    );
};

Contents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Contents;
