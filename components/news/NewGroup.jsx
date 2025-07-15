import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import { Divider, Slide, Dialog } from "@mui/material";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";
import Upload from "../utils/Upload";
import Image from "next/image";
import Swal from "sweetalert2";
import NewGroupForm from "./NewGroupForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function NewGroup() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [open, setOpen] = useState(false);

  const { data, error } = useSWR("/api/news/group", fetcher, {
    onSuccess: (data) => setGroups(data.data),
  });

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (selectedGroup === "create") {
      handleOpen();
    }
  }, [selectedGroup]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <label htmlFor="group" className="font-bold">
        กลุ่ม
      </label>
      <select
        name="group"
        id="group"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
      >
        <option value="">--กรุณาเลือกกลุ่ม--</option>
        {groups.map((group) => (
          <option key={group?._id} value={group?.value}>
            {group?.name}
          </option>
        ))}
        <Divider />
        <option value="create">สร้างกลุ่มใหม่</option>
      </select>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <NewGroupForm onClose={handleClose} />
      </Dialog>
    </div>
  );
}
