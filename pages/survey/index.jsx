import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { AppLayout } from "@/themes";
import { IoIosArrowBack } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';
import Loading from "@/components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Survey = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);

    const managerGroup = [
        '10483', '11544', '12857', '22590', '80220'
    ];

    const managerAL = [
        '81195', '81200'
    ]

    useEffect(() => {
        if (status === "loading" || !user) return;

        if (managerGroup.includes(user.user.empId)) {
            const group = user.user.group;
            router.push("/survey/group?group=" + group);
        } else if (managerAL.includes(user.user.empId)) {
            const chief_th = user.user.chief_th;
            router.push("/survey/algroup?chief_th=" + chief_th);
        }else {
            router.push("/survey/team");
            return;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, status, user]);

    if (status === "loading" || !user) return <Loading />;
    return (
        <React.Fragment>
            <Loading />
        </React.Fragment>
    );
};

export default Survey;

Survey.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Survey.auth = true;
