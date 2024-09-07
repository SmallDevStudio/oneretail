import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import ExaminationTable from "@/components/examinations/ExaminationTable";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";

moment.locale('th');

const ExamsPage = () => {

    return (
        <div>
            <div>
                <Header title="Examinations" subtitle="Examinations" />
            </div>
            <div>
                <ExaminationTable />
            </div>
        </div>
    );
};

export default ExamsPage;

ExamsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
ExamsPage.auth = true;