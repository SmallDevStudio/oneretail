import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Avatar from "@/components/utils/Avatar";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function NewLeaderBoard() {
  const [expandedDepartments, setExpandedDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data, error, isLoading } = useSWR("/api/newleaderboard", fetcher);

  if (status === "loading" || isLoading || !data) return <Loading />;

  const groupData = data.data.groupByRH;
  const departmentData = data.data.departmentSummary;

  const toggleDepartment = (departmentName) => {
    setExpandedDepartments((prev) =>
      prev.includes(departmentName)
        ? prev.filter((d) => d !== departmentName)
        : [...prev, departmentName]
    );
  };

  const customRankOrder = [1, 2, 3, 4, 5];
  const sortedGroupData = customRankOrder
    .map((targetRank) => groupData.find((g) => g.rank === targetRank))
    .filter(Boolean);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredDepartments = departmentData
    .map((dept) => {
      const filteredUsers = dept.users.filter(
        (u) =>
          u.empId.toLowerCase().includes(searchTerm) ||
          u.fullname.toLowerCase().includes(searchTerm) ||
          dept.department.toLowerCase().includes(searchTerm)
      );
      return { ...dept, users: filteredUsers };
    })
    .filter((dept) => dept.users.length > 0);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Group By RH */}
      <div className="bg-[#0056FF] text-white px-4 py-4 rounded-b-xl">
        <div className="grid grid-cols-5 gap-4 text-center text-sm font-bold">
          {sortedGroupData.map((group) => (
            <div
              key={group.group}
              className="flex flex-col items-center gap-1 leading-none"
            >
              <span className="text-white">อันดับ {group.rank}</span>
              <div>
                <Image
                  src={`/images/wally/2${group.rank}.jpg`}
                  alt="wally"
                  width={100}
                  height={100}
                  className="object-contain bg-white w-[60px] h-[60px] rounded-full"
                />
              </div>
              <span className="text-lg font-bold text-white bg-[#F2871F] rounded-md px-4 py-0.5 leading-none">
                {group.group}
              </span>
              <span className="text-sm font-bold">
                {group.totalPoints.toLocaleString()}
              </span>
              <span className="text-[11px]">
                Users: {group.userCount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mt-4 px-4 w-full">
        <input
          type="text"
          placeholder="ค้นหา"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-1 rounded-2xl border w-full"
        />
      </div>

      {/* Department Leaderboard */}
      <div className="mt-4 px-2">
        {filteredDepartments.map((dept) => (
          <div
            key={dept.department}
            className="mb-2 border rounded-md overflow-hidden shadow-sm"
          >
            <div
              className="flex justify-between items-center px-4 py-2 bg-gray-100 cursor-pointer"
              onClick={() => toggleDepartment(dept.department)}
            >
              <div className="flex flex-col text-sm">
                <span className="font-bold text-[#0056FF]">
                  อันดับ {dept.rank}: {dept.department}{" "}
                  <span className="text-xs text-[#F2871F]">({dept.group})</span>
                </span>
                <span className="text-xs text-gray-600">
                  คะแนนรวม: {dept.totalPoints.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {expandedDepartments.includes(dept.department) ? "▲" : "▼"}
              </div>
            </div>

            {expandedDepartments.includes(dept.department) && (
              <div className="bg-white px-4 py-2">
                {dept.users.map((user) => (
                  <div
                    key={user.userId}
                    className="flex justify-between items-center border-b py-1"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#0056FF]">
                        {user.rank}
                      </span>
                      <Avatar
                        src={user.pictureUrl}
                        size={40}
                        userId={user.userId}
                      />
                      <span className="text-xs">{user.empId}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#0056FF]">
                          {user.fullname}
                        </span>
                        <div
                          className={`text-[10px] text-gray-600 text-center
                          `}
                        >
                          (
                          {user.emp.teamGrop === "Retail"
                            ? "BBD"
                            : user.emp.teamGrop}
                          )
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {user.totalPoints.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
