import React from "react";
import { AdminLayout } from "@/themes";
import UserRankReport from "@/components/reports/UserRankReport";

const Reports = () => {
    return (
        <div>
            <UserRankReport />
        </div>
    );
};

export default Reports;

Reports.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Reports.auth = true;