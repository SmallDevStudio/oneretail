import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ExaminationsTable from "@/components/examinations/ExaminationsTable";
import ExaminationsForm from "@/components/examinations/ExaminationsForm";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";


const Examinations = () => {
    const [examinations, setExaminations] = useState([]);
    const [openForm, setOpenForm] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    const handleOpenForm = () => {
        setOpenForm(true);
    }

    const handleCloseForm = () => {
        setOpenForm(false);
    }

    return (
        <div className="flex flex-col p-5 w-full">

            <Header title="EXAMINATIONS" subtitle="ข้อสอบ" />
            <div className="flex flex-row w-full">
                <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                    onClick={handleOpenForm}
                >
                    เพิ่มข้อสอบ
                </button>
            </div>

            <ExaminationsTable />

            {openForm && 
                <Modal 
                    open={openForm}
                    title="เพิ่มข้อสอบ"
                    onClose={handleCloseForm}
                >
                    <ExaminationsForm />
                </Modal>
            }
        </div>
    );

}

export default Examinations;

Examinations.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

