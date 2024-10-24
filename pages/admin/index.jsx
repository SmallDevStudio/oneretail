import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import Widgets from "@/components/dashboard/widgets";
import ContentWidget from "@/components/dashboard/ContentWidget";
import Points from "@/components/reports/Points";
const Admin = () => {
    return (
            <div className="flex flex-col p-5">
                <Header title="DASHBOARD" subtitle="รายงานการใช้งาน Application" />
                <Points />
                <div className="flex mb-2">
                    <Widgets />
                </div>
                <div className="flex flex-row justify-evenly gap-4">
                    <div className="flex">
                        <ContentWidget />
                    </div>
                </div>
            </div>
    );
}

Admin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

Admin.auth = true

export default Admin;