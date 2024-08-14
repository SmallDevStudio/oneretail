import { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import CarouselTable from "@/components/main/carousel/CarouselTable";
import CarouselForm from "@/components/main/carousel/CarouselForm";
import useSWR from "swr";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const HomeOptions = () => {
    const [loading, setLoading] = useState(false);

    const { data, isLoading, error, mutate } = useSWR("/api/main/carousel", fetcher);

    if (error) return <div>Failed to load</div>;
    if (isLoading || !data || loading) return <div><CircularProgress /></div>;

    return (
        <div className="flex flex-col p-10 w-full">
            <Header title="จัดการเนื้อหาหน้าแรก" subtitle="จัดการข้อมูลเนื้อหา เพิ่มเนื้อหา ลบเนื้อหา แก้ไขเนื้อหา" />
            <div className="flex mb-5">
                
            </div>
            <div className="flex flex-col p-5">
               <div className="flex text-lg font-bold text-[#0056FF]">
                    Carousel Management
               </div>
               <div>
                    <CarouselTable />
               </div>
               <div>
                    <CarouselForm data={data} mutate={mutate} setLoading={setLoading}/>
               </div>
            </div>
        </div>
    );
};

HomeOptions.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
HomeOptions.auth = true;

export default HomeOptions;
