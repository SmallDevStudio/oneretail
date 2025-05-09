import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import { Dialog, Slide, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function OrderSection() {
  const [branch, setBranch] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  const { data, error } = useSWR("/api/gift/budget", fetcher, {
    onSuccess: (data) => {
      setBranch(data.data);
    },
  });

  const getStatus = (status) => {
    if (status === "order") {
      return "สาขาคลิกเพื่อสั่งจองของขวัญ";
    } else if (status === "draft") {
      return "แบบร่าง";
    } else if (status === "pending") {
      return "รอการอนุมัติ";
    } else if (status === "approve") {
      return "อนุมัติแล้ว";
    }
  };

  const getButton = (branch) => {
    if (branch.status === "order") {
      return (
        <button
          className="bg-gray-300 text-gray-800 px-2 py-2 rounded-lg"
          onClick={() => router.push(`/gifts/order?branchId=${branch._id}`)}
        >
          สั่งของขวัญ
        </button>
      );
    } else if (branch.status === "draft") {
      return (
        <button
          className="bg-red-500 text-white px-2 py-2 rounded-lg"
          onClick={() => router.push(`/gifts/order?branchId=${branch._id}`)}
        >
          แบบร่าง
        </button>
      );
    } else if (branch.status === "pending") {
      return (
        <button className="bg-[#FFC107] text-white px-2 py-2 rounded-lg">
          รอการอนุมัติ
        </button>
      );
    } else if (branch.status === "approve") {
      return (
        <button className="bg-green-500 text-white px-2 py-2 rounded-lg">
          อนุมัติแล้ว
        </button>
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex bg-gray-400 rounded-full items-center justify-center text-white px-4 py-1 w-2/3">
        <h2 className="font-bold">สาขาสั่งของของขวัญ</h2>
      </div>

      {/* table */}
      <div className="overflow-x-auto w-full">
        <table className="table-auto text-xs w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">สาขา</th>
              <th className="px-4 py-2">รายการ</th>
            </tr>
          </thead>
          <tbody>
            {branch.map((b, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 text-center align-top">
                  {index + 1}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex flex-col text-left">
                    <span className="text-[#0056FF] font-bold">{b.branch}</span>
                    <span>
                      งบประมาณ{" "}
                      <strong className="text-[#F2871F] font-bold text-sm">
                        {b.budget}
                      </strong>{" "}
                      บาท
                    </span>
                    <span>สถานะ {getStatus(b.status)}</span>
                  </div>
                </td>
                <td className="border px-4 py-2">{getButton(b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
