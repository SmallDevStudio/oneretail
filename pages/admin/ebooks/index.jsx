import React, { useState, useEffect } from "react";
import axios from "axios";
import { Slide, Dialog } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { LuNotebookText } from "react-icons/lu";
import { FiUpload } from "react-icons/fi";
import EbookForm from "@/components/ebooks/EbookForm";
import { useSession } from "next-auth/react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Ebooks() {
  const [openUpload, setOpenUpload] = useState(false);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
  }, [session, status]);

  const handleOpenUpload = () => {
    setOpenUpload(true);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
  };

  return (
    <div className="flex flex-col w-full p-4">
      {/* Header */}
      <div className="flex flex-row items-center gap-2">
        <LuNotebookText size={30} className="text-[#0056FF]" />
        <h2 className="text-2xl font-bold text-[#0056FF]">Files Managements</h2>
      </div>

      {/* Tools */}
      <div className="flex flex-row items-center justify-between gap-2 mt-4">
        <div>
          <div
            className=" flex flex-row items-center px-6 py-2 bg-[#0056FF] text-white rounded-lg gap-2 cursor-pointer"
            onClick={handleOpenUpload}
          >
            <FiUpload size={20} className="font-bold" />
            <span className="font-bold">Upload</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div></div>

      <Dialog
        open={openUpload}
        onClose={handleCloseUpload}
        TransitionComponent={Transition}
        className="flex items-center justify-center"
        sx={{
          "& .MuiDialog-paper": {
            width: "50vw",
            height: "auto",
            maxWidth: "100% !important",
            maxHeight: "100% !important",
          },
        }}
      >
        <EbookForm onClose={handleCloseUpload} userId={userId} />
      </Dialog>
    </div>
  );
}
