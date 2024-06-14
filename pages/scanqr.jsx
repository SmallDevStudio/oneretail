import React from "react";
import ScanQRCode from "@/components/ScanQRCode";
import { AppLayout } from "@/themes";

const ScanQR = () => {
    return (
        <div>
            <ScanQRCode />
        </div>
    );
};

ScanQR.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
};

export default ScanQR;