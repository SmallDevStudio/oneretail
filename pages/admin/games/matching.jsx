import React, { useState } from "react";
import { AdminLayout } from "@/themes";
import MatchingTable from "@/components/games/matching/MatchingTable";
import Header from "@/components/admin/global/Header";
import useSWR from "swr";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Matching = () => {

    const { data, isLoading, error, mutate } = useSWR('/api/games/matching', fetcher);

    if (error) return <div>Failed to load</div>;
    if (isLoading || !data) return <div><CircularProgress /></div>;

    return (
        <div className="flex flex-col">
            <div>
                <Header title="เกมส์จับคู่" subtitle="จัดการข้อมูลเกมส์จับคู่" />
            </div>
            <div className="flex px-5">
                <MatchingTable data={data} mutate={mutate}/>
            </div>
        </div>
    );
};

Matching.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
}

Matching.auth = true;

export default Matching;