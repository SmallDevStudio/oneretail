import React from "react";
import Header from "@/components/admin/global/Header";
import BadgeTable from "@/components/badges/BadgeTable";
import BadgeForm from "@/components/badges/BadgeForm";
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

            <div className="p-5">
                <div>

                </div>

                <BadgeTable />
            </div>

        </div>
    );
};

export default BadgesAdmin;

BadgesAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
BadgesAdmin.auth = true;