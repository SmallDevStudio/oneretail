import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { AppLayout } from "@/themes";
import AppView from "@/components/forms/AppView";
import Loading from "@/components/Loading";

const fetcher = url => axios.get(url).then(res => res.data);

const Forms = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data, error } = useSWR(`/api/forms/${id}`, fetcher);

    if (error) return <div>Failed to load</div>;
    if (!data) return <Loading />;

    return (
        <div>
            <AppView 
                data={data.data} 
            />
        </div>
    );
}

export default Forms;
Forms.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Forms.auth = true;
