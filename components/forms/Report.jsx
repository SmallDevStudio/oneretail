import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import { Divider } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Report({ id, onClose }) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const { data, error, isLoading } = useSWR(`/api/forms/answers?formId=${id}`, fetcher);
    console.log('data', data);

    const handleExport = async () => {
    }

    const handleClose = () => {
        onClose();
    }

    return (
        <div className="flex flex-col w-full p-4">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-2">
                    <IoIosArrowBack 
                        size={30}
                        onClick={handleClose}
                    />
                    <h1 className="text-2xl font-bold ml-4">Report:</h1>
                    <span className="text-2xl font-bold text-[#0056FF]"></span>
                </div>
            </div>

            <div></div>
        </div>
    );
}