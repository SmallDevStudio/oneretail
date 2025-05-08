import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { IoChevronBack } from "react-icons/io5";
import { Dialog, Slide, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function BudgetForm({ onClose, budget, mutate }) {
  const [form, setForm] = useState({
    branch: "",
    rh: "",
    zone: "",
    br: "",
    budget: 0,
  });
  const [permission, setPermission] = useState(null);
  const [userData, setUserData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [searchUser1, setSearchUser1] = useState("");
  const [searchUser2, setSearchUser2] = useState("");
  const [filteredUsers1, setFilteredUsers1] = useState([]);
  const [filteredUsers2, setFilteredUsers2] = useState([]);

  const { data, error } = useSWR("/api/users", fetcher, {
    onSuccess: (data) => {
      setUserData(data.users);
    },
  });

  useEffect(() => {
    if (budget) {
      setForm({
        branch: budget.branch,
        rh: budget.rh,
        zone: budget.zone,
        br: budget.br,
        budget: budget.budget,
      });
      setPermission(budget.permission);
      setIsEdit(true);
    }
  }, [budget]);

  useEffect(() => {
    if (searchUser1.trim() !== "") {
      const result = userData.filter(
        (u) =>
          u.empId?.toLowerCase().includes(searchUser1.toLowerCase()) ||
          u.fullname?.toLowerCase().includes(searchUser1.toLowerCase())
      );
      setFilteredUsers1(result);
    } else {
      setFilteredUsers1([]);
    }
  }, [searchUser1, userData]);

  useEffect(() => {
    if (searchUser2.trim() !== "") {
      const result = userData.filter(
        (u) =>
          u.empId?.toLowerCase().includes(searchUser2.toLowerCase()) ||
          u.fullname?.toLowerCase().includes(searchUser2.toLowerCase())
      );
      setFilteredUsers2(result);
    } else {
      setFilteredUsers2([]);
    }
  }, [searchUser2, userData]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectUser = (key, user) => {
    setPermission((prev) => ({
      ...prev,
      [key]: { userId: user._id, status: true },
    }));
    if (key === "user1") {
      setSearchUser1(`${user.empId} - ${user.fullname}`);
      setFilteredUsers1([]);
    } else {
      setSearchUser2(`${user.empId} - ${user.fullname}`);
      setFilteredUsers2([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newData = {
      ...form,
      permission: permission ? permission : null,
    };

    try {
      if (isEdit) {
        await axios.put(`/api/gift/budget/${budget._id}`, newData);
        toast.success("แก้ไขสาขาสําเร็จ");
      } else {
        await axios.post("/api/gift/budget", newData);
        toast.success("เพิ่มสาขาสําเร็จ");
      }
      mutate();
      handleClear();
    } catch (error) {
      console.log(error);
      toast.error("บันทึกสาขาไม่สําเร็จ");
    }
  };

  const handleClear = () => {
    setForm({ branch: "", rh: "", zone: "", br: "", budget: 0 });
    setPermission(null);
    setIsEdit(false);
    onClose();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row items-center bg-[#0056FF] text-white p-4 gap-4">
        <IoChevronBack className="text-lg cursor-pointer" onClick={onClose} />
        <h2 className="text-lg font-bold">
          {isEdit ? "แก้ไขสาขา" : "เพิ่มขสาขา"}
        </h2>
      </div>
      {/* Form */}
      <div className="flex flex-col p-4 gap-2">
        <div>
          <label htmlFor="branch" className="font-bold">
            ชื่อสาขา
          </label>
          <input
            type="text"
            name="branch"
            value={form.branch}
            onChange={handleFormChange}
            className="border border-gray-300 rounded-lg px-2 py-1 w-full"
            placeholder="ชื่อสาขา"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="rh" className="font-bold">
              RH
            </label>
            <input
              type="text"
              name="rh"
              value={form.rh}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg px-2 py-1 w-full"
              placeholder="RH"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="zone" className="font-bold">
              Zone
            </label>
            <input
              type="text"
              name="zone"
              value={form.zone}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg px-2 py-1 w-full"
              placeholder="Zone"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="br" className="font-bold">
              BR
            </label>
            <input
              type="number"
              name="br"
              value={form.br}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg px-2 py-1 w-full"
              placeholder="BR"
            />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <label htmlFor="budget" className="font-bold">
            งบประมาณ
          </label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleFormChange}
            className="border border-gray-300 rounded-lg px-2 py-1 w-32"
            placeholder="งบประมาณ"
          />
        </div>
        <Divider textAlign="left" flexItem className="my-2">
          <span className="text-[#0056FF] font-bold">Permission</span>
        </Divider>
        <div className="flex flex-col gap-2">
          {/* User 1 */}
          <div>
            <label className="font-bold">User1</label>
            <input
              type="text"
              value={searchUser1}
              onChange={(e) => setSearchUser1(e.target.value)}
              placeholder="ค้นหา empId หรือชื่อ"
              className="border border-gray-300 rounded-lg px-2 py-1 w-full"
            />
            {filteredUsers1.length > 0 && (
              <div className="border max-h-40 overflow-y-auto bg-white shadow-lg z-50 absolute w-full rounded-md">
                {filteredUsers1.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectUser("user1", user)}
                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                  >
                    {user.empId} - {user.fullname}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User 2 */}
          <div>
            <label className="font-bold">User2</label>
            <input
              type="text"
              value={searchUser2}
              onChange={(e) => setSearchUser2(e.target.value)}
              placeholder="ค้นหา empId หรือชื่อ"
              className="border border-gray-300 rounded-lg px-2 py-1 w-full"
            />
            {filteredUsers2.length > 0 && (
              <div className="border max-h-40 overflow-y-auto bg-white shadow-lg z-50 absolute w-full rounded-md">
                {filteredUsers2.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectUser("user2", user)}
                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                  >
                    {user.empId} - {user.fullname}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mt-5">
          <button
            className="bg-[#0056FF] text-white px-2 py-2 rounded-lg w-36"
            onClick={(e) => handleSubmit(e)}
          >
            {isEdit ? "แก้ไข" : "เพิ่ม"}
          </button>
          <button
            className="bg-red-500 text-white px-2 py-2 rounded-lg w-36"
            onClick={onClose}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
