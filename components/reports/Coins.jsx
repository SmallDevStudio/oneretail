import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

export default function Coins() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/reports/coins');
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    console.log('data:', data);

    return (
        <div className="px-5 py-2">
            <div className="flex flex-row items-center gap-2">
                <h1 className="text-xl font-bold text-[#0056FF]">
                    รายงานผลเหรียญ
                </h1>
                <div className="flex flex-row items-center gap-2 ml-5">
                    <span>
                        เหรียญทั้งหมด
                    </span>
                    <span className="text-2xl font-bold text-[#F2871F]">
                            {!data?.earn ? <CircularProgress /> : data?.earn}
                    </span>
                    <span className="ml-2">
                        เหรียญที่ใช้จ่าย
                    </span>
                    <span className="text-2xl font-bold text-[#F2871F]">
                            {!data?.pay ? <CircularProgress /> : data?.pay}
                    </span>
                    <span className="ml-5">
                        เหรียญคงเหลือให้ระบบ
                    </span>
                    <span className="text-3xl font-bold text-red-600">
                            {!data?.totalCoins ? <CircularProgress /> : data?.totalCoins}
                    </span>
                </div>
            </div>
        </div>
    );
};