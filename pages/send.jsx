import React, { useState } from "react";
import SendPointsCoins from "@/components/SendPointsCoins";
import GenerateQRCode from "@/components/GenerateQRCode";
import { Tabs, Tab, Box } from "@mui/material";
import { AppLayout } from "@/themes";
import Link from "next/link";

export default function Send() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <Link href="/profile" className="text-white">
        <div className="flex mb-5 w-5 h-5 text-gray-500 mt-2 ml-2">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69.31 117.25">
            <path class="cls-1" d="M58.62,117.25c-2.74,0-5.47-1.04-7.56-3.13L3.13,66.18c-4.17-4.17-4.17-10.94,0-15.12L51.07,3.13c4.17-4.17,10.94-4.17,15.11,0,4.17,4.17,4.17,10.94,0,15.12L25.8,58.62l40.38,40.38c4.17,4.17,4.17,10.94,0,15.12-2.09,2.09-4.82,3.13-7.56,3.13Z"/>
          </svg>
        </div>
      </Link>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Point & Coins" />
        <Tab label="สร้าง QR Code" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && <SendPointsCoins />}
        {activeTab === 1 && <GenerateQRCode />}
      </Box>
    </div>
  );
}

Send.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Send.auth = true;