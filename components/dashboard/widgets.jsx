import React from "react";
import Widget from "./section/Widget";
import { FaUser } from "react-icons/fa";
import { MdContentPaste, MdOutlineEventNote } from "react-icons/md";
import { IoGiftOutline } from "react-icons/io5";
import useSWR from "swr";
import CircularProgress from '@mui/material/CircularProgress';

const fetcher = (url) => fetch(url).then((res) => res.json());
const Widgets = () => {

    const { data: users, error: userError } = useSWR('/api/users', fetcher);
    const { data: emps, error: empError } = useSWR('/api/emp', fetcher);
    const { data: contents, error: contentError } = useSWR('/api/content', fetcher);
    const { data: redeems, error: redeemError } = useSWR('/api/redeem', fetcher);
    const { data: events, error: eventError } = useSWR('/api/events', fetcher);

    if (userError) return <div>Error loading user data</div>;
    if (!users || !emps || !contents || !redeems || !events) return <CircularProgress />;

    return (
        <div className="flex flex-row gap-4 w-full p-2">
            <div className="flex w-1/4" style={{
                cursor: 'pointer',
            }}>
                <Widget icon={<FaUser />} title="Users" value={`${users?.length} / ${emps?.data?.length}`} url={"/admin/users"} color={"#3DC2EC"}/>
            </div>

            <div className="flex w-1/4">
                <Widget icon={<MdContentPaste />} title="Contents" value={contents?.data?.length} url={"/admin/contents"} color={"#F4CE14"}/>
            </div>

            <div className="flex w-1/4">
                <Widget icon={<IoGiftOutline />} title="Redeems" value={redeems?.data?.length} url={"/admin/redeem"} color={"#615EFC"} />
            </div>

            <div className="flex w-1/4">
                <Widget icon={<MdOutlineEventNote />} title="Events" value={events?.data?.length} url={"/admin/events"} color={"#C80036"} />
            </div>
            
        </div>
    );
};

export default Widgets;