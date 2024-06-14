import React, { useState } from "react";
import SendPointsCoins from "@/components/SendPointsCoins";
import GenerateQRCode from "@/components/GenerateQRCode";
import { Tabs, Tab, Box } from "@mui/material";
import { AppLayout } from "@/themes";

export default function Send() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
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