import React from "react";
import ExaminationTable from "@/components/examinations/ExaminationTable";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";

const ExamsPage = () => {
    return (
        <div>
            <div>
                <Header title="Examinations" subtitle="Examinations" />
            </div>
            <div>
                <ExaminationTable />
            </div>
        </div>
    );
};

export default ExamsPage;

ExamsPage.getlayout = (page) => <AdminLayout>{page}</AdminLayout>;
ExamsPage.auth = true;