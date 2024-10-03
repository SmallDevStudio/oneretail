import { useState } from "react";
import StickerForm from "@/components/stickers/StickerForm";
import StickerTable from "@/components/stickers/StickerTable";
import Header from "@/components/admin/global/Header";
import Modal from "@/components/Modal"; // Import the new Modal component
import { AdminLayout } from "@/themes";

const StickerAdmin = () => {
    const [openForm, setOpenForm] = useState(false);

    const handleOpen = () => {
        setOpenForm(true);
    };

    const handleClose = () => {
        setOpenForm(false);
    };

    return (
        <div>
            <div>
                <Header title="Stickers" subtitle="จัดการ Stickers" />
            </div>
            <div className="flex flex-col p-5">
                <div className="flex flex-row items-center mb-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={openForm ? handleClose : handleOpen}
                    >
                        สร้าง Sticker
                    </button>
                </div>
                <div>
                    <StickerTable />
                </div>
                {/* Modal for StickerForm */}
                {openForm && (
                    <Modal
                        open={openForm}
                        onClose={handleClose}
                        title="สร้าง Sticker"
                    >
                        <StickerForm handleClose={handleClose}/>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default StickerAdmin;

StickerAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
StickerAdmin.auth = true;
