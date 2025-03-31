import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import BadgeForm from "./BadgeForm";
import { Divider, Slide, Dialog, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

const BadgeTable = () => {
  const [badges, setBadges] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: badgesData, mutate } = useSWR("/api/badges", fetcher, {
    onSuccess: (data) => {
      setBadges(data.data);
    },
  });

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this badge? This process cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/badges/${id}`);
        toast.success("ลบ Badges เรียบร้อย");
        mutate();
      } catch (error) {
        console.error("Error deleting badge:", error);
        toast.error("ลบ Badges ไม่สําเร็จ");
      }
    }
  };

  const handleEdit = async (data) => {
    setSelectedData(data);
    setShowForm(true);
  };

  const handleopen = () => {
    setShowForm(true);
  };

  const handleclose = () => {
    setSelectedData(null);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col p-2">
      {/* Tools */}
      <div className="flex flex-row justify-between mb-2">
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={showForm ? handleclose : handleopen}
          >
            เพิ่ม Badges
          </button>
        </div>
      </div>

      {/* Table */}
      <div>
        <table className="table-auto w-full">
          <thead className="bg-gray-200 border border-gray-300">
            <tr>
              <th className="border border-gray-300 px-2">ลำดับ</th>
              <th className="border border-gray-300 px-2">ชื่อ</th>
              <th className="border border-gray-300 px-2">รายละเอียด</th>
              <th className="border border-gray-300 px-2">ไอคอน</th>
              <th className="border border-gray-300 px-2">สถานะ</th>
              <th className="border border-gray-300 px-2">วันที่สร้าง</th>
              <th className="border border-gray-300 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <tr key={badge.id}>
                  <td>{index + 1}</td>
                  <td>{badge.name}</td>
                  <td>{badge.description}</td>
                  <td>
                    <div className="flex items-center justify-center">
                      <Image
                        src={badge.image.url}
                        alt={badge.name}
                        width={50}
                        height={50}
                        priority
                      />
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-center">
                      <button
                        className={
                          badge.active
                            ? "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                            : "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                        }
                      >
                        {badge.active ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </td>
                  <td>{moment(badge.createdAt).locale("th").format("LLL")}</td>
                  <td>
                    <div className="flex flex-row items-center gap-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleEdit(badge)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(badge.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center" colSpan="7">
                  No badges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {badges.length > 0 && (
        <div className="flex flex-row justify-between mt-2">
          <div>
            <span className="font-bold text-xs">row data: {badges.length}</span>
          </div>
          <div></div>
          <div></div>
        </div>
      )}

      {/* Form */}
      <Dialog
        open={showForm}
        onClose={handleclose}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: "50%",
          },
        }}
      >
        <BadgeForm
          mutate={mutate}
          onClose={handleclose}
          data={selectedData}
          newData={!selectedData}
        />
      </Dialog>
    </div>
  );
};

export default BadgeTable;
