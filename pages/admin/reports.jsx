import React from "react";
import { AdminLayout } from "@/themes";
import UserRankReport from "@/components/reports/UserRankReport";
import UserContentViews from "@/components/reports/UserContentViews";

const Reports = () => {
    return (
        <div>
            <UserRankReport />
            <UserContentViews />
        </div>
    );
};

export default Reports;

Reports.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Reports.auth = true;