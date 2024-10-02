import { useState } from "react";
import StickerForm from "@/components/stickers/StickerForm";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";

const StickerAdmin = () => {
    
    return (
        <div>
            <div>
                <Header title="Stickers" subtitle="จัดการ Stickers" />
            </div>
            <div className="flex flex-col p-5">
                <div className="flex flex-row items-center mb-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        สร้าง Sticker
                    </button>
                </div>
                <div>

                </div>
                <div>
                    <StickerForm />
                </div>
            </div>
        </div>
    );
};

export default StickerAdmin;

StickerAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
StickerAdmin.auth = true;