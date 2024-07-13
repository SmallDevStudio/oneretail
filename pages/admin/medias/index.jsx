import React from "react";
import { AdminLayout } from "@/themes";
import AddMedia from "@/components/media/AddMedia";

const Medias = () => {
    return (
        <div className="flex flex-col justify-center mt-5 p-2">
            <h1 className="text-xl text-[#0056FF] font-bold">จัดการ Media</h1>

            <AddMedia />
        </div>
    );
};

Medias.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Medias.auth = true

export default Medias;