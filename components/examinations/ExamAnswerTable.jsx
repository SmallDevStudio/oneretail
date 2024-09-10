import React from "react";
import moment from "moment";
import "moment/locale/th";
import { AdminLayout } from "@/themes";

moment.locale('th');

const ExamAnswerTable = () => {

    return (
        <div>
            Exams Answers Table
        </div>
    );
}

export default ExamAnswerTable;

ExamAnswerTable.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

ExamAnswerTable.auth = true;
