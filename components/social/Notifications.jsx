import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

export default function Notifications() {
    const { data: session } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);

    return (
        <div className="flex flex-col gap-4 bg-white px-4 py-2 pb-20">
            <h1 className="text-xl font-bold text-[#0056FF]">แจ้งเตือน</h1>
        </div>
    )
}