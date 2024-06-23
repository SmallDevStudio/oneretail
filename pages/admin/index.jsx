import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import Widgets from "@/components/dashboard/widgets";
import LeaderboardWidget from "@/components/dashboard/LeaderBoardWidget";
import ContentWidget from "@/components/dashboard/ContentWidget";
const Admin = () => {
    return (
            <div className="flex flex-col p-5">
                <Header title="DASHBOARD" subtitle="รายงานการใช้งาน Application" />
                <div className="flex mb-2">
                    <Widgets />
                </div>
                <div className="flex flex-row justify-evenly gap-4">
                    <div className="flex">
                        <LeaderboardWidget />
                    </div>
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