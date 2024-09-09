import React from "react";
import Header from "@/components/admin/global/Header";
import { AdminLayout } from "@/themes";

const BadgesAdmin = () => {
    return (
        <div>
            <div>
                <Header
                    title="Badges"
                    subtitle="จัดการ Badges"
                />
            </div>
        </div>
    );
};

export default BadgesAdmin;

BadgesAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
BadgesAdmin.auth = true;