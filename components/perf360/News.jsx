import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { FaPlusSquare } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Slide, Dialog } from "@mui/material";
import NewsForm from "./NewsForm";
import moment from "moment";
import "moment/locale/th";
import Swal from "sweetalert2";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function News() {
  const [news, setNews] = useState([]);
  const [filterData, setFilterData] = useState(news);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate } = useSWR(
    `/api/perf360/news`,
    fetcher,
    {
      onSuccess: (data) => setNews(data.data),
    }
  );

  const {
    data: categoryData,
    error: categoryError,
    mutate: mutateCategory,
  } = useSWR("/api/perf360/news/category", fetcher);

  useEffect(() => {
    if (
      categoryData?.data &&
      categoryData.data.length > 0 &&
      filterData.length === 0
    ) {
      // ตั้งค่า default แสดงทุก category
      setFilterData(categoryData.data.map((cat) => cat.name));
    }
  }, [categoryData, filterData.length]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (data) => {
    setSelected(data);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจใช่ไหม?",
      text: "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ฉันต้องการลบ!",
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`/api/perf360/news/${id}`);
        console.log(response.data);
        toast.success("ลบข้อมูลเรียบร้อย");
        mutate();
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Failed to delete.",
          "error"
        );
      }
    }
  };

  const handleChangeActive = async (id, currentActive) => {
    try {
      const updated = { active: currentActive }; // toggle value ถูกส่งมาแล้ว
      await axios.put(`/api/perf360/news/${id}`, updated);
      toast.success("อัพเดทสถานะการใช้งานสำเร็จ");
      mutate();
    } catch (error) {
      toast.error("อัพเดทสถานะการใช้งานไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col w-full mt-2 px-4">
      {/* filter */}
      <div className="mt-2 px-2 py-2 border border-gray-200 rounded-lg mx-2">
        <div className="flex flex-row items-center justify-between gap-4 w-full flex-wrap">
          {categoryData &&
            categoryData.data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={item.name}
                  checked={filterData.includes(item.name)} // ✅ checked
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    if (checked) {
                      setFilterData([...filterData, value]);
                    } else {
                      setFilterData(filterData.filter((cat) => cat !== value));
                    }
                  }}
                />
                <label>{item.name}</label>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center py-4 w-full">
        <h2 className="text-xl font-bold">รายการข่าวสาร</h2>
        <FaPlusSquare
          size={25}
          className="text-[#0056FF]"
          onClick={handleClickOpen}
        />
      </div>

      {/* Content */}
      <div>
        {Object.entries(news)
          .filter(([category]) => filterData.includes(category)) // ✅ filter
          .map(([category, items]) => (
            <div key={category} className="mb-6">
              <h2 className="text-lg font-bold text-[#0056FF] mb-2">
                {category}
              </h2>
              {items.map((item, index) => (
                <ul key={index} className="flex flex-col px-4 py-2 list-disc">
                  <li className="text-sm">
                    <h2 className="text-[#F2871F] text-md font-bold">
                      {item.title}
                    </h2>
                    <p>เริ่ม {moment(item.start_date).format("lll")}</p>
                    <p>สิ้นสุด {moment(item.end_date).format("lll")}</p>
                    <p className="font-bold">
                      การแสดงผล:{" "}
                      <span className="uppercase text-[#F2871F]">
                        {item.display}
                      </span>
                    </p>

                    <div className="flex flex-row gap-1 flex-wrap">
                      {item.group?.map((g, index) => (
                        <span key={index} className="text-sm font-bold">
                          {g} |
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-row gap-1 mt-1">
                      <button
                        className={`text-sm font-bold ${
                          item.active ? "text-green-500" : "text-red-500"
                        }`}
                        onClick={() =>
                          handleChangeActive(item._id, !item.active)
                        }
                      >
                        {item.active ? "เปิดใช้งาน" : "ไม่เปิดใช้งาน"}
                      </button>
                      <span>| View: {item.views || 0}</span> |
                      <span> Click: {item.click || 0}</span> |
                      <span
                        className="text-[#0056FF] cursor-pointer"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </span>{" "}
                      |
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </span>{" "}
                      |
                    </div>
                  </li>
                </ul>
              ))}
            </div>
          ))}
      </div>

      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* Content */}
        <NewsForm
          onClose={handleClose}
          data={selected}
          mutate={mutate}
          newData={!selected}
        />
      </Dialog>
    </div>
  );
}
