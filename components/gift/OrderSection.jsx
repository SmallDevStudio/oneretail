import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "../Loading";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function OrderSection({ active }) {
  const [branch, setBranch] = useState([]);
  const [filterBranch, setFilterBranch] = useState([]);
  const [user, setUser] = useState({});
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  const { data, error, mutate } = useSWR(
    `/api/gift/budget/${userId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      onSuccess: (data) => {
        setBranch(data.data);
      },
    }
  );

  const {
    data: userData,
    error: userError,
    mutate: userMutate,
  } = useSWR(`/api/users/${userId}`, fetcher, {
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  useEffect(() => {
    if (active) {
      mutate(); // ดึงข้อมูลใหม่เมื่อ tab ถูกเปิด
      userMutate();
    }
  }, [active, mutate, userMutate]);

  useEffect(() => {
    if (search) {
      const lowerSearch = search.toLowerCase();
      const filteredBranch = branch.filter((b) => {
        const branchName = b.branch ? b.branch.toLowerCase() : "";
        const rhName = b.rh ? b.rh.toLowerCase() : "";

        return branchName.includes(lowerSearch) || rhName.includes(lowerSearch);
      });
      setFilterBranch(filteredBranch);
    } else {
      setFilterBranch(branch);
    }
  }, [branch, search]);

  const getStatus = (status) => {
    if (status === "order") {
      return (
        <span className="text-gray-600 font-bold">
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
        <button className="bg-[#FFC107] font-bold text-white px-2 py-2 rounded-lg">
          รอการอนุมัติ
        </button>
      );
    } else if (branch.status === "approved") {
      return (
        <button className="bg-green-500 font-bold text-white px-2 py-2 rounded-lg">
          อนุมัติแล้ว
        </button>
      );
    } else if (branch.status === "notApprove") {
      return (
        <button
          className="bg-red-500 font-bold text-white px-2 py-2 rounded-lg"
          onClick={() => router.push(`/gifts/order?branchId=${branch._id}`)}
        >
          ไม่อนุมัติ
        </button>
      );
    }
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "0.00";
    }
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!data || !branch || !session || !userData) return <Loading />;

  return (
    <div className="flex flex-col items-center gap-4 w-full pb-20">
      <div className="flex bg-gray-400 rounded-full items-center justify-center text-white px-4 py-1 w-2/3">
        <h2 className="font-bold">สาขาสั่งของของขวัญ</h2>
      </div>

      {user && user?.role === "admin" && (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-bold bg-[#0056FF] text-white px-4 py-1 rounded-full">
              Admin User
            </h3>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="font-bold text-sm">ค้นหา:</span>
            <input
              type="text"
              id="search"
              className="w-full p-1 border border-gray-300 rounded-full text-sm"
              placeholder="ค้นหาสาขา"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

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
            {filterBranch.map((b, index) => (
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
                        {formatNumber(b.budget)}
                      </strong>{" "}
                      บาท
                    </span>
                    {b.usedBudget > 0 && (
                      <span>
                        ยอดงบที่ใช้ไป{" "}
                        <strong className="text-red-500 font-bold text-sm">
                          {formatNumber(b.usedBudget)}
                        </strong>{" "}
                        บาท
                      </span>
                    )}
                    {b.remainingBudget > 0 && (
                      <span>
                        ยอดงบคงเหลือ{" "}
                        <strong className="text-[#0056FF] font-bold text-sm">
                          {formatNumber(b.remainingBudget)}
                        </strong>{" "}
                        บาท
                      </span>
                    )}

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
