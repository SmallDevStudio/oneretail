import React from "react";
import AnswersTable from "@/components/admin/AnswersTable";
import { AdminLayout } from "@/themes";

export default function Answers() {
    return <div><AnswersTable /></div>;
}

Answers.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

Answers.auth = true;

