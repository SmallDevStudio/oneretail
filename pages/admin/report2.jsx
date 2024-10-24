import React from "react";
import { AdminLayout } from "@/themes";
import Leaderboard from "@/components/reports/Leaderboard";

const Reports = () => {
    return (
        <div>
           <div>
                <Leaderboard />
           </div>
        </div>
    );
};

export default Reports;

Reports.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Reports.auth = true;