import { useEffect, useState } from "react";
import axios from "axios";

export default function Points() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/reports/points');
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
                    รายงานผลคะแนน
                </h1>
                <div className="flex flex-row items-center gap-2 ml-5">
                    <span>
                        คะแนนทั้งหมด
                    </span>
                    <span className="text-2xl font-bold text-[#F2871F]">
                            {data?.earn}
                    </span>
                    <span className="ml-2">
                        คะแนนที่ใช้จ่าย
                    </span>
                    <span className="text-2xl font-bold text-[#F2871F]">
                            {data?.pay}
                    </span>
                    <span className="ml-5">
                        คะแนนคงเหลือให้ระบบ
                    </span>
                    <span className="text-3xl font-bold text-red-600">
                            {data?.totalpoint}
                    </span>
                </div>
            </div>
        </div>
    );
};