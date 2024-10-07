import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/th";
import CircularProgress from '@mui/material/CircularProgress';
import { AppLayout } from "@/themes";
import Memo from "@/components/Survey/Memo";

moment.locale('th');

const SurveyMemo = () => {
    const router = useRouter();
    const { chief_th, group, department, startDate, endDate } = router.query;
    const teamGrop = 'AL';

    const [memoData, setMemoData] = useState([]);


    const fetchSurveyData = async () => {
        try {
            // Fetch memo data
            const memoResponse = await axios.get(`/api/survey/board/al/memo`, {
                params: { startDate, endDate, teamGrop, chief_th, group, department},
            });
            const memoData = memoResponse.data.data;
    
            // Fetch comments data
            const commentsResponse = await axios.get(`/api/survey/board/comments`);
            let comments = commentsResponse.data.data;
    
            // Ensure comments is an array
            if (!Array.isArray(comments)) {
                comments = Object.values(comments);  // Convert to array if it's not
            }
    
            // Combine memo data with comments based on surveyId (which is memo.id)
            const combinedMemoData = memoData.map(memo => ({
                ...memo,
                comments: comments.filter(comment => comment.surveyId === memo.id) // Add comments to each memo
            }));
    
            setMemoData(combinedMemoData);
        } catch (error) {
            console.error("Error fetching survey data or comments:", error);
        }
    };

    useEffect(() => {
        if (teamGrop && chief_th && group && department ) {
            fetchSurveyData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, teamGrop, chief_th, group, department]);

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

export default SurveyMemo;

SurveyMemo.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SurveyMemo.auth = true;
