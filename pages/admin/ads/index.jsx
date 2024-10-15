import { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";

const Ads = () => {
    return (
        <div>
            <h1>Ads</h1>
        </div>
    );
};

export default Ads;

Ads.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Ads.auth = true;