import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";

const Ads = () => {
    return (
        <div>
            <Header
                title="ADS"
                subtitle="จัดการ ADS"
            />
            
            {/* AdsTable */}
            <div></div>

            {/* AdsForm */}
            <div>
                <div>
                    <label htmlFor="name">ชื่อ:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default Ads;

Ads.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Ads.auth = true;