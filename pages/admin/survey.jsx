import React from "react";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";
import SurveyTable from "@/components/admin/SurveyTable";

export default function Survey() {
    return (
        <div>
            <SurveyTable />
        </div>
    );
}

Survey.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Survey.auth = true;