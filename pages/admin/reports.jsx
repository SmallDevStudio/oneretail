import React from "react";
import { AdminLayout } from "@/themes";
import UserRankReport from "@/components/reports/UserRankReport";
import UserContentViews from "@/components/reports/UserContentViews";
import ContentReport from "@/components/reports/ContentReport";
import UsersReport from "@/components/reports/UsersReport";
import RedeemReport from "@/components/reports/RedeemReport";
import RegisterReport from "@/components/reports/RegisterReport";
import LoginReport from "@/components/reports/LoginReport";
import ShareYourStory from "@/components/reports/ShareYourStory";
import Leaderboard from "@/components/reports/Leaderboard";
import Points from "@/components/reports/Points";

const Reports = () => {
    return (
        <div>
            <Points />
            <UserRankReport />
            <UserContentViews />
            <ContentReport />
            <UsersReport />
            <RedeemReport />
            <RegisterReport />
            <LoginReport />
            <ShareYourStory />
            <Leaderboard />
        </div>
    );
};

export default Reports;

Reports.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Reports.auth = true;