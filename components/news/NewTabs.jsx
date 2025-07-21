import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import { Divider, Slide, Dialog } from "@mui/material";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import NewTabForm from "./NewTabForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function NewTabs({ setTab, tab }) {
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState("select");
  const [open, setOpen] = useState(false);

  const { data, error, mutate } = useSWR("/api/news/tabs", fetcher, {
    onSuccess: (data) => setTabs(data.data),
  });

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (tab) {
      setSelectedTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (selectedTab === "create") {
      handleOpen();
    } else if (selectedTab !== "select") {
      setTab(selectedTab);
    }
  }, [selectedTab, setTab]);

  const handleOpen = () => {
    setSelectedTab(null);
    setOpen(true);
  };
  const handleClose = (value) => {
    if (value) {
      setSelectedTab(value);
      setOpen(false);
    } else {
      setSelectedTab("select");
      setOpen(false);
    }
  };

  if (error) return <div>failed to load</div>;
  if (!data) return <Loading />;

  return (
    <div>
      <label htmlFor="tab" className="font-bold">
        แท็บข่าวสาร:
      </label>
      <select
        name="tab"
        id="tab"
        className="w-full p-2 text-black border border-gray-300 rounded-md"
        value={selectedTab}
        onChange={(e) => setSelectedTab(e.target.value)}
      >
        <option value="">-- เลือกแท็บข่าวสาร --</option>
        {tabs.map((tab) => (
          <option key={tab._id} value={tab.value}>
            {tab.name}
          </option>
        ))}
        <Divider />
        <option value="create">+ เพิ่มแท็บข่าวสาร</option>
      </select>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <NewTabForm
          onClose={handleClose}
          tab={tabs}
          mutate={mutate}
          setTab={setSelectedTab}
        />
      </Dialog>
    </div>
  );
}
