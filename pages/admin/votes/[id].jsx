import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/themes';
import moment from 'moment';
import "moment/locale/th";
import Image from 'next/image';
import Header from '@/components/admin/global/Header';
import { IoIosArrowBack } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from 'xlsx';

moment.locale('th');

const VoteId = () => {
    const [votesData, setVotesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [appLoading, setAppLoading] = useState(true);

    const router = useRouter();
    const { id } = router.query;

    const fetchVotes = async () => {
        setAppLoading(true);
        const { data } = await axios.get(`/api/votes/${id}`);
        setVotesData(data.data);
        setAppLoading(false);
    };

    useEffect(() => {
        if (id) {
            fetchVotes();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const exportToExcel = async () => {
        setLoading(true);
        setProgress(0);

       try {
            const rawData = await axios.get(`/api/votes/${id}`);

            // Format dates using moment before exporting
            const formattedData = Array.isArray(rawData.data.data) ? rawData.data.data.map(item => ({
                empId: item.user.empId,
                fullname: item.user.fullname,
                voteId: item._id,
                topicId: item.topicId,
                title: item.title,
                optionDisplay: item.optionDisplay,
                createdAt: moment(item.createdAt).locale('th').format('LLLL'),
            })) : [];

            setProgress(100);

            // Create Excel Workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Export to Excel
            XLSX.writeFile(workbook, `vote-report.xlsx`);

            setLoading(false);
        } catch (error) {
            console.error('Error exporting data:', error);
            setLoading(false);
        }

    }

    return (
        <>
        {appLoading ? (
            <CircularProgress />
        ): (
            <div className="flex flex-col w-full">
            <div className="flex flex-row items-center p-2">
                <IoIosArrowBack 
                    className="text-xl inline text-gray-700" 
                    onClick={() => router.back()} 
                    size={25}
                />
                <Header title={votesData[0].title} subtitle="รายงานการใช้งาน Vote" />
            </div>

            <div className="flex flex-col px-5">
                {/* Tools */}
                <div className="flex justify-end px-4">
                    <button
                        className="bg-[#0056FF] text-white rounded-lg py-2 px-4 font-bold"
                        onClick={exportToExcel}
                    >
                        {loading ? <CircularProgress /> : 'Export'}
                    </button>
                </div>

                {/* Table */}
                <div>
                    <table className="w-full mt-5 table-auto">
                        <thead className="bg-[#FF9800]/50">
                            <tr className="text-center">
                                <th className="py-2">ลําดับ</th>
                                <th className="py-2">รหัสพนักงาน</th>
                                <th className="py-2">รูป</th>
                                <th className="py-2">ชื่อ</th>
                                <th className="py-2">ตัวเลือก</th>
                                <th className="py-2">วันที่สร้าง</th>
                            </tr>
                        </thead>
                        <tbody>
                            {votesData && votesData.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 w-[50px]">{index + 1}</td>
                                    <td className="py-2 w-[150px]">{item.user.empId}</td>
                                    <td className="flex py-2 items-center text-center justify-center w-[80px]">
                                        <div className="flex items-center justify-center w-full">
                                            <Image 
                                                src={item.user.pictureUrl} 
                                                alt={item.user.fullname}
                                                width={50} 
                                                height={50} 
                                                className="rounded-full"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2 w-[350px]">{item.user.fullname}</td>
                                    <td className="py-2">{item.optionDisplay}</td>
                                    <td className="py-2">{moment(item.createdAt).locale('th').format('LLLL')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div></div>
            </div>
        </div>
    )}
    </>
    );
}

export default VoteId;

VoteId.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
VoteId.auth = true;