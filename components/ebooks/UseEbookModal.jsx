import { useState, useEffect } from "react";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import * as XLSX from "xlsx";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

export default function UseEbookModal({ onClose, useEbook }) {
  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // แถวแรกเป็นชื่อ ebook
    const titleRow = [[`ชื่อไฟล์: ${useEbook.title}`]];

    // Header
    const headers = [
      "ลำดับ",
      "รหัสพนักงาน",
      "ชื่อ",
      "TeamGroup",
      "Group",
      "ตำแหน่ง",
      "สาขา",
      "แผนก",
      "วันที่ใช้งาน",
    ];

    // ข้อมูล rows
    const dataRows = useEbook.useEbook.map((user, index) => [
      index + 1,
      user.empId || "",
      user.name || "",
      user.teamGrop || "",
      user.group || "",
      user.position || "",
      user.branch || "",
      user.department || "",
      moment(user.createdAt).format("lll"),
    ]);

    // รวมทั้งหมดเข้า sheet
    const sheetData = [...titleRow, [], headers, ...dataRows];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ebook Usage");

    // บันทึกไฟล์
    XLSX.writeFile(workbook, `ใช้ไฟล์-${useEbook.title}.xlsx`);
  };

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex flex-row items-center p-2 gap-4 bg-[#0056FF]">
        <IoIosArrowBack
          className="text-3xl text-white cursor-pointer"
          onClick={onClose}
        />
        <h2 className="text-xl font-bold text-white">{useEbook.title}</h2>
      </div>
      {/* body */}
      <div className="flex flex-row items-end justify-end px-4 py-2 gap-4">
        <span className="text-sm font-bold">
          จำนวน{" "}
          <span className="text-[#F2871F] text-lg">
            {useEbook.useEbook.length}
          </span>{" "}
          รายการ
        </span>
        <button
          onClick={handleExport}
          className="bg-green-500 font-bold text-white px-4 py-2 rounded-md"
        >
          Export
        </button>
      </div>
      <div className="px-4 py-2">
        <table className="w-full table-auto">
          <thead className="bg-[#FF9800]/50">
            <tr>
              <th className="border border-gray-600 ">ลําดับ</th>
              <th className="border border-gray-600 ">รูป</th>
              <th className="border border-gray-600 ">รหัสพนักงาน</th>
              <th className="border border-gray-600 ">ชื่อ</th>
              <th className="border border-gray-600 ">TeamGroup</th>
              <th className="border border-gray-600 ">Group</th>
              <th className="border border-gray-600 ">วันที่</th>
            </tr>
          </thead>
          <tbody className="text-center text-sm">
            {useEbook.useEbook.map((user, index) => (
              <tr key={index}>
                <td className="border border-gray-600">{index + 1}</td>
                <td className="border border-gray-600">
                  {user.pictureUrl && (
                    <div className="flex items-center justify-center">
                      <Image
                        src={user.pictureUrl}
                        width={50}
                        height={50}
                        alt="Picture"
                        className="w-10 h-10 rounded-full object-contain"
                      />
                    </div>
                  )}
                </td>
                <td className="border border-gray-600">{user.empId}</td>
                <td className="border border-gray-600">{user.name}</td>
                <td className="border border-gray-600">{user.teamGrop}</td>
                <td className="border border-gray-600">{user.group}</td>
                <td className="border border-gray-600">
                  {moment(user.createdAt).format("lll")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
