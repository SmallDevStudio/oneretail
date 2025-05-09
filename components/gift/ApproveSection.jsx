import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Dialog, Slide, Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import SummeryModel from "./SummeryModel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ApproveSection({ active }) {
  const [branch, setBranch] = useState([]);
  const [filter, setFilter] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const { data, error, mutate } = useSWR("/api/gift/budget", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    onSuccess: (data) => {
      setBranch(data.data);
    },
  });

  useEffect(() => {
    if (active) {
      mutate(); // ดึงข้อมูลใหม่เมื่อ tab ถูกเปิด
    }
  }, [active, mutate]);

  useEffect(() => {
    if (branch.length > 0) {
      setFilter(
        branch.filter(
          (branch) =>
            branch.status === "pending" || branch.status === "approved"
        )
      );
    }
  }, [branch]);

  const getStatus = (status) => {
    if (status === "order") {
      return (
        <span className="bg-gray-500 font-bold">
          สาขาคลิกเพื่อสั่งจองของขวัญ
        </span>
      );
    } else if (status === "draft") {
      return <span className="text-red-500 font-bold">แบบร่าง</span>;
    } else if (status === "pending") {
      return <span className="text-yellow-500 font-bold">รอการอนุมัติ</span>;
    } else if (status === "approved") {
      return <span className="text-green-500 font-bold">อนุมัติแล้ว</span>;
    }
  };

  const getButton = (branch) => {
    if (branch.status === "order") {
      return (
        <button
          className="bg-gray-300 font-bold text-gray-800 px-2 py-2 rounded-lg"
          onClick={() => router.push(`/gifts/order?branchId=${branch._id}`)}
        >
          สั่งของขวัญ
        </button>
      );
    } else if (branch.status === "draft") {
      return (
        <button
          className="bg-red-500 font-bold text-white px-2 py-2 rounded-lg"
          onClick={() => router.push(`/gifts/order?branchId=${branch._id}`)}
        >
          แบบร่าง
        </button>
      );
    } else if (branch.status === "pending") {
      return (
        <button
          className="bg-[#FFC107] font-bold text-white px-2 py-2 rounded-lg"
          onClick={() => handleOpen(branch._id)}
        >
          รอการอนุมัติ
        </button>
      );
    } else if (branch.status === "approved") {
      return (
        <button className="bg-green-500 font-bold text-white px-2 py-2 rounded-lg">
          อนุมัติแล้ว
        </button>
      );
    }
  };

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedId(null);
    setOpen(false);
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
            {filter.length > 0 ? (
              filter.map((b, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center align-top">
                    {index + 1}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[#0056FF] font-bold">
                        {b.branch}
                      </span>
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
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border px-4 py-2 text-center">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
      >
        <SummeryModel
          onClose={handleClose}
          branchId={selectedId}
          mutate={mutate}
        />
      </Dialog>
    </div>
  );
}
