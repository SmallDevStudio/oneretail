import React from "react";
import { AppLayout } from "@/themes";

export default function CampaignId() {
    return (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center ">
            <h1 className="text-3xl font-bold">
                Coming Soon
            </h1>
        </div>
    );
}

CampaignId.getLayout = (page) => <AppLayout>{page}</AppLayout>;
CampaignId.auth = true;