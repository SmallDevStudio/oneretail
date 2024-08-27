import React from "react";
import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import SatisfactionTable from "@/components/Survey/SatisfactionTable";

const Satisfactions = () => {
    return (
        <div>
            <Header title="Satisfactions Survey" subtitle="Satisfactions Survey" />

            <div className="p-5">
                <SatisfactionTable />   
            </div>
        </div>
    );
};

export default Satisfactions;

Satisfactions.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
}