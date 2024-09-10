import { useState, useEffect } from "react";
import axios from "axios";
import ExaminationTable from "@/components/examinations/ExaminationTable";
import ExamAnswerTable from "@/components/examinations/ExamAnswerTable";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";
import { useRouter } from "next/router";
import Link from "next/link";

const ExamsPage = () => {
    const [activeTab, setActiveTab] = useState("exams");
    const router = useRouter();

    useEffect(() => {
        const tab = router.query.tab || "exams";
        setActiveTab(tab);
    }, [router.query.tab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        window.history.pushState(null, "", `?tab=${tab}`);
    };

    return (
        <div>
            <div>
                <Header title="ข้อสอบ" subtitle="จัดการข้อสอบ" />
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-4 text-sm">
                <ul className="flex flex-wrap gap-6">
                
                    <li className="me-2">
                        <Link
                            href="#exams"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'exams' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('exams')}
                        >
                            คำถาม
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            href="#answers"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'answers' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('answers')}
                        >
                            คำตอบ Users
                        </Link>
                    </li>
                    
                </ul>
            </div>

            <div>
                {activeTab === 'exams' && (
                    <>
                        <ExaminationTable />
                    </>
                )}

                {activeTab === 'answers' && (
                    <>
                        <ExamAnswerTable />
                    </>
                )}
            </div>
        </div>
    );
};

export default ExamsPage;

ExamsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
ExamsPage.auth = true;