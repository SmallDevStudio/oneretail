import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Modal from '../Modal';

const RedeemReportTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalByPosition, setTotalByPosition] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/redeem/report');
        const rawData = response.data.data;

        // Process data for grouping by rewardCode and teamGroup/position
        const groupedData = processData(rawData);
        setData(groupedData);
        setTotalByPosition(calculateTotals(groupedData));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const processData = (rawData) => {
    const grouped = {};
  
    rawData.forEach((item) => {
      const rewardCode = item.redeemId?.rewardCode || "Unknown";
      const rewardName = item.redeemId?.name || "Unknown Reward";
      const fullRewardCode = `${rewardCode} - ${rewardName}`; // รวม rewardCode กับ rewardName
      const teamGroup = item.emp?.teamGrop || "Unknown";
      const position = item.emp?.position || "Unknown";
  
      if (!grouped[fullRewardCode]) {
        grouped[fullRewardCode] = { rewardCode: fullRewardCode, total: 0 };
      }
  
      if (!grouped[fullRewardCode][teamGroup]) {
        grouped[fullRewardCode][teamGroup] = {};
      }
  
      if (!grouped[fullRewardCode][teamGroup][position]) {
        grouped[fullRewardCode][teamGroup][position] = 0;
      }
  
      grouped[fullRewardCode][teamGroup][position] += 1;
      grouped[fullRewardCode].total += 1;
    });
  
    // Sort by total descending (มากไปน้อย)
    return Object.values(grouped).sort((a, b) => b.total - a.total);
  };

  const generateHeader = (data) => {
    const teamGroups = {};
    const positions = [];
  
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== "rewardCode" && key !== "total") {
          if (!teamGroups[key]) {
            teamGroups[key] = new Set();
          }
  
          Object.keys(row[key]).forEach((position) => {
            teamGroups[key].add(position);
            if (!positions.includes(position)) {
              positions.push(position);
            }
          });
        }
      });
    });
  
    return { teamGroups, positions };
  };
  
  const { teamGroups, positions } = generateHeader(data);

  const calculateTotals = (groupedData) => {
    const totals = {};

    groupedData.forEach((item) => {
      Object.keys(item).forEach((teamGroup) => {
        if (teamGroup !== 'rewardCode' && teamGroup !== 'total') {
          Object.keys(item[teamGroup]).forEach((position) => {
            totals[position] = (totals[position] || 0) + item[teamGroup][position];
          });
        }
      });
    });

    return totals;
  };

  const handleExport = () => {
    const worksheetData = [];
  
    data.forEach((row) => {
      const rowData = { rewardCode: `${row.rewardCode} (${row.rewardName})` }; // รวม rewardName
      Object.keys(row).forEach((teamGroup) => {
        if (teamGroup !== "rewardCode" && teamGroup !== "rewardName" && teamGroup !== "total") {
          Object.keys(row[teamGroup]).forEach((position) => {
            rowData[`${teamGroup}-${position}`] = row[teamGroup][position];
          });
        }
      });
      rowData["Total"] = row.total;
      worksheetData.push(rowData);
    });
  
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Redeem Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "redeem-report.xlsx");
  };

  const handleOpenModal = async (row, teamGroup, position, count) => {
    if (count === 0) {
      return; // ห้ามเปิด Modal หากจำนวนเป็น 0
    }
  
    try {
      const response = await axios.get('/api/redeem/report/filter', {
        params: {
          rewardCode,
          teamGroup,
          position,
        },
      });
  
      setSelectedRow({
        rewardCode,
        teamGroup,
        position,
        users: response.data.data, // เก็บข้อมูล user ในตำแหน่งนี้
      });
  
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  console.log('selectedRow', selectedRow);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log('selectedRow', selectedRow);

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
       <div className="flex justify-end mb-4">
         <button
           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
           onClick={handleExport}
         >
           Export to Excel
         </button>
       </div>
     <table className="table-auto border-collapse border border-gray-200 w-full text-sm">
        <thead className="bg-gray-100">
            <tr>
            <th rowSpan="2" className="border border-gray-300 px-2 py-1">Reward Code</th>
            {Object.keys(teamGroups).map((teamGroup) => (
                <th
                key={teamGroup}
                colSpan={teamGroups[teamGroup].size}
                className="border border-gray-300 px-2 py-1"
                >
                {teamGroup}
                </th>
            ))}
            <th rowSpan="2" className="border border-gray-300 px-2 py-1">Total</th>
            </tr>
            <tr>
            {Object.keys(teamGroups).map((teamGroup) =>
                Array.from(teamGroups[teamGroup]).map((position) => (
                <th key={position} className="border border-gray-300 px-2 py-1">
                    {position}
                </th>
                ))
            )}
            </tr>
        </thead>
        <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                {/* Reward Code และ Reward Name รวมกัน */}
                <td className="border border-gray-300 px-2 py-1">{row.rewardCode}</td>
                {Object.keys(teamGroups).map((teamGroup) =>
                    Array.from(teamGroups[teamGroup]).map((position) => {
                    const count = row[teamGroup]?.[position] || 0;
                    return (
                        <td key={`${teamGroup}-${position}`} className="border border-gray-300 px-2 py-1">
                        <div
                            onClick={() => handleOpenModal(row.rewardCode, teamGroup, position, count)}
                            className={count === 0 ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-blue-500'}
                        >
                            {count}
                        </div>
                        </td>
                    );
                    })
                )}
                <td className="border border-gray-300 px-2 py-1 font-bold">{row.total}</td>
                </tr>
            ))}
            <tr className="font-bold bg-gray-100">
            <td className="border border-gray-300 px-2 py-1">Total</td>
            {Object.keys(teamGroups).map((teamGroup) =>
                Array.from(teamGroups[teamGroup]).map((position) => (
                <td key={`total-${teamGroup}-${position}`} className="border border-gray-300 px-2 py-1 ">
                    {data.reduce((sum, row) => sum + (row[teamGroup]?.[position] || 0), 0)}
                </td>
                ))
            )}
            <td className="border border-gray-300 px-2 py-1">
                {data.reduce((sum, row) => sum + row.total, 0)}
            </td>
            </tr>
        </tbody>
    </table>
    {openModal && (
        <Modal open={openModal} onClose={handleCloseModal}>
            <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                รายละเอียดการแลก - {selectedRow?.rewardCode}
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">empId</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TeamGroup</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {selectedRow?.users?.map((user, index) => (
                    <tr key={index}>
                    <td className="px-6 whitespace-nowrap">{user?.emp?.empId}</td>
                    <td className="px-6 whitespace-nowrap">{user.user.fullname}</td>
                    <td className="px-6 whitespace-nowrap">{user?.emp?.teamGrop? user?.emp?.teamGrop : '-'}</td>
                    <td className="px-6 whitespace-nowrap">{user?.emp?.position? user?.emp?.position : '-'}</td>
                    <td className="px-6 whitespace-nowrap">{user?.emp?.group? user?.emp?.group : '-'}</td>
                    <td className="px-6 whitespace-nowrap">{user?.emp?.department? user?.emp?.department : '-'}</td>
                    <td className="px-6 whitespace-nowrap">{user?.emp?.branch? user?.emp?.branch : '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </Modal>
    )}
    </div>
  );
};

export default RedeemReportTable;
