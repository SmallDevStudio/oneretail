import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";  // Import Thai locale
import Image from "next/image";

moment.locale('th'); // Set locale globally

const VoteNameTable = () => {
    const [voteNames, setVoteNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/campaigns/votename?page=${page}`);
                setVoteNames(response.data.data.voteNames);
                setTotalPages(response.data.data.totalPages);
                setLoading(false);
            } catch (error) {
                setError("An unexpected error occurred");
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="overflow-x-auto p-10">
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">รูปผู้ใช้</th>
                        <th className="px-4 py-2">ชื่อผู้ใช้</th>
                        <th className="px-4 py-2">รหัสพนักงาน</th>
                        <th className="px-4 py-2">ชื่อมาสคอต</th>
                        <th className="px-4 py-2">คำอธิบาย</th>
                        <th className="px-4 py-2">วันที่สร้าง</th>
                    </tr>
                </thead>
                <tbody>
                    {voteNames.map((vote) => (
                        <tr key={vote._id}>
                            <td className="border px-4 py-2">
                                <Image src={vote.user?.pictureUrl} alt="user" width="50" height="50" style={{ borderRadius: '50%', objectFit: 'cover', width: '50px', height: '50px'}}/>
                            </td>
                            <td className="border px-4 py-2">{vote.user?.fullname}</td>
                            <td className="border px-4 py-2">{vote.user?.empId}</td>
                            <td className="border px-4 py-2">{vote.name}</td>
                            <td className="border px-4 py-2">{vote.description}</td>
                           
                            <td className="border px-4 py-2">{moment(vote.createdAt).format('LLL')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-300 text-gray-700 p-2 rounded"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    className="bg-gray-300 text-gray-700 p-2 rounded"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default VoteNameTable;
