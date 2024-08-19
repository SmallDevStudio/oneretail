import React from "react";
import { AdminLayout } from "@/themes";
import UserRankReport from "@/components/reports/UserRankReport";
import UserContentViews from "@/components/reports/UserContentViews";
import ContentReport from "@/components/reports/ContentReport";
import UsersReport from "@/components/reports/UsersReport";
import RedeemReport from "@/components/reports/RedeemReport";
import RegisterReport from "@/components/reports/RegisterReport";


const Reports = () => {
    return (
        <div>
            <UserRankReport />
            <UserContentViews />
            <ContentReport />
            <UsersReport />
            <RedeemReport />
            <RegisterReport />
        </div>
    );
};

export default Reports;

Reports.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Reports.auth = true;