import React from "react";
import useSWR from "swr";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import SocialClubTable from "@/components/Custom/SocialClubTable";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";
import { RiFileExcel2Line, RiDeleteBinLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const SocialClubAdmin = () => {
    const { data, isLoading, error } = useSWR("/api/socialclub", fetcher);

    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="w-full">
            <Header title="Social Club" />
            <div className="flex flex-col p-5">
                <div className="flex justify-between mb-2">
                    <div className="flex flex-row border border-gray-300 p-1 rounded-full">
                        <input
                            type="text"
                            placeholder="ค้นหา"
                        />
                        <button>
                            <IoIosSearch size={20}/>
                        </button>
                    </div>

                    <div className="flex flex-row gap-2">
                        <button
                            className="bg-green-700 text-white font-bold py-1 px-4 rounded"
                        >
                            <div className="flex flex-row items-center gap-2">
                                <RiFileExcel2Line size={20}/>
                                <span>Export</span>
                            </div>
                        </button>
                    </div>
                </div>
            
                <div className="w-full">
                    <SocialClubTable data={data.data} />
                </div>
            </div>
        </div>
    );
};

export default SocialClubAdmin;

SocialClubAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
