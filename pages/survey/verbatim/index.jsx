import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/th";
import CircularProgress from '@mui/material/CircularProgress';
import { AppLayout } from "@/themes";
import Memo from "@/components/Survey/Memo";

moment.locale('th');


const SurveyVerbatim = () => {
    const router = useRouter();
    const { teamGrop, chief_th, position, group, department, branch, startDate, endDate, value } = router.query;
    const [memoData, setMemoData] = useState([]);

    const fetchSurveyData = async () => {
        try {
            // Construct params dynamically
            const params = {
                startDate,
                endDate,
                teamGrop,
            };
            if (chief_th) params.chief_th = chief_th;
            if (position) params.position = position;
            if (group) params.group = group;
            if (department) params.department = department;
            if (branch) params.branch = branch;
            if (value) params.value = value;
    
            // Fetch memo data
            const memoResponse = await axios.get(`/api/survey/verbatim`, { params });
            const memoData = memoResponse.data.data;

            setMemoData(memoData);
        } catch (error) {
            console.error("Error fetching survey data or comments:", error);
        }
    };
    
    useEffect(() => {
        if (teamGrop && startDate && endDate) {
            fetchSurveyData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, teamGrop, group, department, branch]);

    return (
        (!memoData) ? (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        ): (
            <div>
                <Memo 
                    memoData={memoData}
                />
            </div>
        )
    );
}

export default SurveyVerbatim;

SurveyVerbatim.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyVerbatim.auth = true;
