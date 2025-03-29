import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { FaPlusSquare } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Slide, Dialog, CircularProgress } from "@mui/material";
import PopUpForm from "./PopUpForm";
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

export default function PopUp() {
  const [popup, setPopup] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate } = useSWR(
    `/api/perf360/popup`,
    fetcher,
    {
      onSuccess: (data) => setPopup(data.data),
    }
  );

  console.log("popup", popup);

  useEffect(() => {
    const normalize = (val) => val.toLowerCase().trim();

    const mapKeywordToGroup = (keyword) => {
      const lower = normalize(keyword);
      if (["bbd", "retail"].includes(lower)) return "retail";
      if (["al"].includes(lower)) return "al";
      if (["tcon"].includes(lower)) return "tcon";
      if (["pb"].includes(lower)) return "pb";
      if (["all", "*"].includes(lower)) return "*";
      return lower;
    };

    if (search) {
      const keyword = mapKeywordToGroup(search);

      const filter = popup.filter((pop) => {
        if (keyword === "*") return true;

        return (
          pop.title.toLowerCase().includes(keyword) ||
          (Array.isArray(pop.group) && pop.group.includes(keyword))
        );
      });

      setFilterData(filter);
    } else {
      setFilterData(popup);
    }
  }, [popup, search]);

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
        const response = await axios.delete(`/api/perf360/popup/${id}`);
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
      await axios.put(`/api/perf360/popup/${id}`, updated);
      toast.success("อัพเดทสถานะการใช้งานสำเร็จ");
      mutate();
    } catch (error) {
      toast.error("อัพเดทสถานะการใช้งานไม่สำเร็จ");
    }
  };

  if (!data) return <CircularProgress />;

  return (
    <div className="flex flex-col w-full mt-2 px-4">
      {/* Search */}
      <div className="mt-2">
        <div className="relative">
          <input
            type="text"
            name="search"
            className="border border-gray-300 rounded-lg p-2 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center py-4 w-full">
        <h2 className="text-xl font-bold">รายการ Popup</h2>
        <FaPlusSquare
          size={25}
          className="text-[#0056FF]"
          onClick={handleClickOpen}
        />
      </div>

      {/* Content */}
      <div>
        {isLoading ? (
          <CircularProgress />
        ) : (
          filterData &&
          filterData.map((item, index) => (
            <ul key={index} className="flex flex-col px-4 py-2 list-disc">
              <li className="text-sm">
                <h2 className="text-[#F2871F] text-md font-bold">
                  {item.title}
                </h2>
                <p>เริ่ม {moment(item.start_date).format("lll")}</p>
                <p>สิ้นสุด {moment(item.end_date).format("lll")}</p>
                <div className="flex flex-row gap-1">
                  {item.group && item.group.length > 0
                    ? item.group.map((g, index) => (
                        <span key={index} className="text-sm font-bold">
                          {g} |
                        </span>
                      ))
                    : null}
                </div>

                <div className="flex flex-row gap-1">
                  <button
                    className={`text-sm font-bold ${
                      item.active ? "text-green-500" : "text-red-500"
                    }`}
                    onClick={() => handleChangeActive(item._id, !item.active)}
                  >
                    {item.active ? "เปิดใช้งาน" : "ไม่เปิดใช้งาน"}
                  </button>
                  <span>| View: {item.views ? item.views : 0}</span> |
                  <span> Click: {item.click ? item.click : 0}</span> |
                  <span
                    className="text-[#0056FF] cursor-point"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </span>{" "}
                  |
                  <span
                    className="text-red-500 cursor-point"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </span>{" "}
                  |
                </div>
              </li>
            </ul>
          ))
        )}
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
        <PopUpForm onClose={handleClose} data={selected} mutate={mutate} />
      </Dialog>
    </div>
  );
}
