import React from "react";
import VoteNameTable from "@/components/campaign/VoteNameTable";
import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";

export default function VoteNames() {
    return (
        <React.Fragment>
            <Header title="ส่งรายชื่อประกวด" subtitle="ส่งรายชื่อประกวด"/>
            <VoteNameTable />
        </React.Fragment>
    );
}

VoteNames.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
VoteNames.auth = true