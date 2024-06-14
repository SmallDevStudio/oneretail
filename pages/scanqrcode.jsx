import React from "react";
import ScanQRCode from "@/components/ScanQRCode";
import { AppLayout } from "@/themes";

export default function ScanQRPage() {
    return (
       
            <ScanQRCode />

    );
}

ScanQRCode.getLayout = (page) => <AppLayout>{page}</AppLayout>;