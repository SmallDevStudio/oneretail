import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/admin/global/Header";
import ContentForm from "@/components/personalized/Form";
import QuestionsForm from "@/components/personalized/QuestionsForm";
import { AdminLayout } from "@/themes";
import CircularProgress from '@mui/material/CircularProgress';
import { Divider } from "@mui/material";


const Personalized = () => {
    const [activeTab, setActiveTab] = useState("contents");
    const router = useRouter();

    useEffect(() => {
        const tab = router.query.tab || "contents";
        setActiveTab(tab);
    }, [router.query.tab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        window.history.pushState(null, "", `?tab=${tab}`);
    };

    return (
       <div>
             {/* Header */}
             <div>
                <Header title="Personalized" subtitle="Personalized" />
            </div>
            <div className="flex justify-center text-sm">
                <ul className="flex flex-wrap gap-6">
                
                    <li className="me-2">
                        <Link
                            href="#contents"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'contents' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('contents')}
                        >
                            เนื้อหา
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            href="#quetions"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'questions' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('questions')}
                        >
                            คำถาม
                        </Link>
                    </li>
                </ul>
            </div>
            <Divider />
            <div>
                {activeTab === 'contents' && (
                    <div>
                        <ContentForm />
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div>
                        <QuestionsForm />
                    </div>
                )}
            </div>
           
       </div>
    );

};

export default Personalized;

Personalized.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Personalized.auth = true;