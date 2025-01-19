import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ExaminationsTable from "@/components/examinations/ExaminationsTable";
import ExaminationsForm from "@/components/examinations/ExaminationsForm";
import AnswerTable from "@/components/examinations/AnswerTable";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Examinations = () => {
    const [activeTab, setActiveTab] = useState("examinations");
    const [examinations, setExaminations] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [isEditExamination, setIsEditExamination] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    const { data, error, mutate } = useSWR('/api/examinations2', fetcher, {
        onSuccess: (data) => {
            setExaminations(data.data);
        },
    });

    const { data: answerData, error: answerError, mutate: answerMutate } = useSWR('/api/examinations2/answers', fetcher, {
        onSuccess: (data) => {
            setAnswers(data.data);
        },
    });

    const handleOpenForm = () => {
        setOpenForm(true);
    }

    const handleCloseForm = () => {
        setOpenForm(false);
    }

    const handleEditExamination = (examination) => {
        setIsEditExamination(examination);
        setOpenForm(true);
    }

    if (!examinations || !answers) return <Loading />;

    return (
        <div className="flex flex-col p-5 w-full">

            <Header title="EXAMINATIONS" subtitle="ข้อสอบ" />
            <div className="flex flex-row justify-center items-center mb-4 gap-4">
                <button
                    className={`px-4 text-black ${activeTab === "examinations" ? "border-b-2 border-b-[#F2871F] font-bold" : ""}`}
                    onClick={() => setActiveTab("examinations")}
                >
                    ข้อสอบ
                </button>

                <button
                    className={`px-4 text-black ${activeTab === "answers" ? "border-b-2 border-b-[#F2871F] font-bold" : ""}`}
                    onClick={() => setActiveTab("answers")}
                >
                    ทำข้อสอบ
                </button>
            </div>
            {activeTab === "examinations" && (
                <div>
                    <div className="flex flex-row w-full">
                        <button
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                            onClick={handleOpenForm}
                        >
                            เพิ่มข้อสอบ
                        </button>
                    </div>

                    <ExaminationsTable 
                        examinations={examinations}
                        handleEditExamination={handleEditExamination}
                        mutate={mutate}
                    />

                    {openForm && 
                        <Modal 
                            open={openForm}
                            title="เพิ่มข้อสอบ"
                            onClose={handleCloseForm}
                        >
                            <ExaminationsForm 
                                handleCloseForm={handleCloseForm}
                                isEditExamination={isEditExamination}
                                mutate={mutate}
                            />
                        </Modal>
                    }
                </div>
            )}

            {activeTab === "answers" && (
                <div>
                    <AnswerTable 
                        answers={answers}
                    />
                </div>
            )}
        </div>
    );

}

export default Examinations;

Examinations.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

