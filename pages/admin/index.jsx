import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import Widgets from "@/components/dashboard/widgets";
const Admin = () => {
    return (
            <div className="flex flex-col p-5">
                <Header title="Dashboard" subtitle="" />
                <div>
                    <Widgets />
                </div>
            </div>
    );
}

Admin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

Admin.auth = true

export default Admin;