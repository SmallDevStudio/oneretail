import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import { Divider, Slide, Dialog } from "@mui/material";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";
import Swal from "sweetalert2";
import NewGroupForm from "./NewGroupForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function NewGroup() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("select");
  const [open, setOpen] = useState(false);

  const { data, error, mutate } = useSWR("/api/news/group", fetcher, {
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
    setSelectedGroup("select");
    setOpen(true);
  };
  const handleClose = (value) => {
    if (value) {
      setSelectedGroup(value);
      setOpen(false);
    } else {
      setSelectedGroup("select");
      setOpen(false);
    }
  };

  if (error) return <div>failed to load</div>;
  if (!data) return <Loading />;

  console.log(selectedGroup);

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
        <option value="select">--กรุณาเลือกกลุ่ม--</option>
        {groups.map((group) => (
          <option key={group?._id} value={group?.value}>
            {group?.name}
          </option>
        ))}
        <Divider />
        <option value="create">+ สร้างกลุ่มใหม่</option>
      </select>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <NewGroupForm
          onClose={handleClose}
          groups={groups}
          mutate={mutate}
          setGroup={setSelectedGroup}
        />
      </Dialog>
    </div>
  );
}
