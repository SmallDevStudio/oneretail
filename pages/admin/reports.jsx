import React from "react";
import { AdminLayout } from "@/themes";
import UserRankReport from "@/components/report/UserRankReport";
import ContentReport from "@/components/report/ContentReport";

const Reports = () => {
    return (
        <div>
            <UserRankReport />
            <ContentReport />
        </div>
    );
};

export default Reports;

Reports.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Reports.auth = true;