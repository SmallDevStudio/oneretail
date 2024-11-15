import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import Widgets from "@/components/dashboard/widgets";
import Points from "@/components/reports/Points";
import Coins from "@/components/reports/Coins";
const Admin = () => {
    return (
            <div className="flex flex-col p-5 w-full">
                <Header title="DASHBOARD" subtitle="รายงานการใช้งาน Application" />
                <div className="flex items-start justify-center flex-col w-full bg-gray-200 rounded-xl mb-2">
                    <Points />
                    <Coins />
                </div>
                <div className="flex mb-2">
                    <Widgets />
                </div>
                <div className="flex flex-row justify-evenly gap-4">
                    <div className="flex">
                        
                    </div>
                </div>
            </div>
    );
}

Admin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

Admin.auth = true

export default Admin;