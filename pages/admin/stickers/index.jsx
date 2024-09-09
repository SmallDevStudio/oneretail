import React from "react";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";

const StickerAdmin = () => {
    return (
        <div>
            <div>
                <Header title="Stickers" subtitle="จัดการ Stickers" />
            </div>
        </div>
    );
};

export default StickerAdmin;

StickerAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
StickerAdmin.auth = true;