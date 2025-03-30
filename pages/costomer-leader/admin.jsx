import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import PostPanel from "@/components/costomer-leader/PostPanel";
import { IoIosArrowBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { Divider } from "@mui/material";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function CostomerLeaderAdmin() {
  const [permissionUser, setPermissionUser] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [err, setErr] = useState({
    taggedUsers: "",
  });
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: userData, isLoading: userLoading } = useSWR(
    "/api/users",
    fetcher,
    {
      onSuccess: (data) => {
        setUsers(data.users);
      },
    }
  );

  const { data, error, mutate } = useSWR("/api/costomer-leader", fetcher, {
    onSuccess: (data) => {
      setPermissionUser(data.data.users);
    },
  });

  useEffect(() => {
    if (search.trim() !== "") {
      const result = permissionUser.filter(
        (user) =>
          user.users.fullname.toLowerCase().includes(query.toLowerCase()) ||
          user.users.empId.toLowerCase().includes(query.toLowerCase())
      );
      setFilter(result);
    } else {
      setFilter(permissionUser);
    }
  }, [permissionUser, search]);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const ids = inputValue
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);
      const validIds = ids.filter((id) =>
        users.some((user) => user.empId === id)
      ); // ตรวจสอบ empId ที่มีใน users
      const newTags = validIds.filter((id) => !taggedUsers.includes(id));
      setTaggedUsers([...taggedUsers, ...newTags]);
      setInputValue("");
    }
  };

  const handleTagClick = (user) => {
    if (!taggedUsers.includes(user.empId)) {
      setTaggedUsers([...taggedUsers, user.empId]);
    }
    setInputValue("");
  };

  const handleRemoveUser = (index) => {
    setTaggedUsers(taggedUsers.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (taggedUsers.length === 0) {
      setErr({ taggedUsers: "กรุณาเพิ่มผู้ใช้งาน" });
      return;
    }

    // รวม taggedUsers และ filter (ที่มี empId ใหม่)
    const updateTaggedUsers = [
      ...taggedUsers,
      ...filter
        .filter((user) => !taggedUsers.includes(user.empId)) // เลือกเฉพาะ empId ที่ไม่มีใน taggedUsers
        .map((user) => user.empId),
    ];

    try {
      const response = await axios.post("/api/costomer-leader", {
        users: updateTaggedUsers,
      });

      if (response.data.success) {
        toast.success("เพิ่มผู้ใช้งานสําเร็จ");
        setTaggedUsers([]); // รีเซ็ต taggedUsers หลังจากบันทึก
        setInputValue("");
        mutate(); // รีเฟรชข้อมูล
      } else {
        toast.error("เพิ่มผู้ใช้งานไม่สําเร็จ");
      }
    } catch (error) {
      toast.error("เพิ่มผู้ใช้งานไม่สําเร็จ");
    }
  };

  const handleRemoveAndUpdate = async (index) => {
    const userToRemove = filter[index];
    const updatedUsers = filter.filter((_, i) => i !== index); // ลบผู้ใช้จาก filter

    // ส่งเฉพาะ empId ที่เหลือไปยัง API
    const updatedEmpIds = updatedUsers.map((user) => user.empId);

    try {
      const res = await axios.post(`/api/costomer-leader`, {
        users: updatedEmpIds, // ส่งอาร์เรย์ที่มี empId เท่านั้น
      });

      if (res.data.success) {
        toast.success("ลบผู้ใช้งานสําเร็จ");
        setFilter(updatedUsers); // อัพเดท filter ที่ถูกลบ
        mutate(); // รีเฟรชข้อมูล
      } else {
        toast.error("ลบผู้ใช้งานไม่สําเร็จ");
      }
    } catch (error) {
      toast.error("ลบผู้ใช้งานไม่สําเร็จ");
    }
  };

  const handleCancel = () => {
    setTaggedUsers([]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col pb-20 min-h-screen overflow-x-hidden w-full">
      {/* Header */}
      <div className="flex flex-row items-center p-2 bg-[#0056FF] text-white gap-4">
        <IoIosArrowBack size={25} onClick={() => router.back()} />
        <h2 className="text-xl font-bold">User Permission Control</h2>
      </div>
      {/* Body */}
      <div className="flex flex-col p-5 w-full">
        <h2 className="text-xl font-bold">จัดการการเข้าถึง Costomer Leader</h2>
        <div className="flex flex-col mt-2 w-full">
          <div className="flex flex-row gap-2">
            <input
              type="text"
              placeholder="ค้นหา"
              className="border rounded-full text-sm p-2 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* User List */}
        <span className="text-sm mt-2 w-full text-end">
          ผู้ใช้ทั้งหมด: {filter.length}
        </span>
        <div className="grid grid-cols-2 mt-2">
          {filter &&
            filter.map((user, index) => (
              <div
                key={index}
                className="flex flex-row items-center gap-2 text-xs border-b p-2"
                onClick={() => handleRemoveAndUpdate(index)}
              >
                <IoCloseCircle size={20} className="text-red-500" />
                <div className="flex flex-col">
                  <span>{user.empId}</span>
                  <span>{user.fullname}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Form */}
      <div className="flex flex-col p-5 w-full">
        <h2 className="text-xl font-bold">เพิ่ม User</h2>
        <div className="flex flex-col w-full">
          <div className="relative">
            <textarea
              type="text"
              name="Tags"
              id="Tags"
              className={`border rounded-md text-sm p-2 w-full ${
                err.taggedUsers ? "border-red-500" : ""
              }`}
              placeholder="พิมพ์ empId เลือก User หรือวาง empId ตัวอย่าง: 1234, 1235, 1236 แล้วกด Enter"
              rows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            {inputValue && (
              <div>
                <div className="absolute top-8 bg-white border rounded-md z-[9999] max-h-[300px] overflow-y-auto">
                  {users
                    .filter((u) => u.empId.includes(inputValue))
                    .map((u) => (
                      <div
                        key={u.empId}
                        onClick={() => handleTagClick(u)}
                        className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {u.empId} - {u.fullname}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          {taggedUsers.length > 0 && (
            <div className="flex justify-end mt-1">
              <span className="text-sm">
                <strong>จำนวนผู้ใช้:</strong> {taggedUsers.length}
              </span>
            </div>
          )}
          <div className="flex flex-row flex-wrap items-center w-full gap-1 p-1 max-h-[200px] overflow-y-auto">
            {taggedUsers.map((id, index) => (
              <div
                key={index}
                className="flex flex-row gap-1 items-center bg-gray-300 px-2 py-0.5 rounded-full text-sm"
              >
                <span>{id}</span>
                <IoCloseCircle
                  size={14}
                  className="text-red-500"
                  onClick={() => handleRemoveUser(index)}
                />
              </div>
            ))}
          </div>

          <Divider flexItem sx={{ width: "100%", marginTop: "1.5rem" }} />

          <div className="flex justify-center items-center">
            <button
              className={`bg-[#0056FF] text-white py-2 px-4 rounded-md mt-4
              ${taggedUsers.length === 0 && "opacity-50 cursor-not-allowed"}`}
              onClick={handleSubmit}
              disabled={taggedUsers.length === 0}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md mt-4 ml-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
