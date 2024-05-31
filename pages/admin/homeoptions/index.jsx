import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import Upload from "@/components/admin/Upload";


const HomeOptions = () => {
    return (
        <div className="flex flex-col p-10 w-full">
            <Header title="จัดการเนื้อหาหน้าแรก" subtitle="จัดการข้อมูลเนื้อหา เพิ่มเนื้อหา ลบเนื้อหา แก้ไขเนื้อหา" />
            <div className="flex mb-5">
                
            </div>
            <div className="p-5">
               <div className="mb-5 flex text-lg font-bold text-[#0056FF]" style={{
                    fontFamily: "Ekachon"
               }}>
                    Carousel Management
               </div>
               <div>
                    <Suspense fallback={<Loading />}>
                        <Upload />
                    </Suspense>
               </div>
            </div>
        </div>
    );
};

HomeOptions.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
HomeOptions.auth = true;

export default HomeOptions;
