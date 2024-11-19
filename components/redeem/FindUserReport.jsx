import { useState } from "react";
import axios from "axios";
import { Divider } from "@mui/material";
import * as XLSX from 'xlsx';

export default function FindUserReport() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = async () => {
        if (!searchTerm) {
            console.error("No empId provided");
            return;
        }

        const empIdArray = searchTerm.split(',').map((id) => id.trim());

        try {
            const userResponses = await Promise.all(
                empIdArray.map(async (empId) => {
                    const response = await axios.get(`/api/redeem/address?empId=${empId}`);
                    return response.data.data;
                })
            );

            const validUsers = userResponses.filter((user) => user !== null);
            setUsers(validUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleExport = () => {
        const rowData = users.map((user) => ({
            empId: user.empId,
            fullname: user.fullname,
            address: user.address,
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(rowData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "address.xlsx");
    };

    return (
        <div>
            <div className="mb-4 mt-2">
                <h1 className="text-2xl font-bold">Find User Report</h1>
            </div>
            <div className="flex flex-row items-center gap-4 mb-2">
                <textarea
                    placeholder="Enter empIds separated by commas"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-xl p-2 w-1/2"
                />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
            <Divider className="mb-4 mt-8" />
            {users.length > 0 && (
                <>
                    <div className="flex flex-row items-center justify-end gap-4 mb-2 mt-2">
                        <button 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleExport}
                        >
                            Export
                        </button>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-0.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    empId
                                </th>
                                <th className="px-6 py-0.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-0.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Address
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.empId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.empId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.fullname}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.address}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
