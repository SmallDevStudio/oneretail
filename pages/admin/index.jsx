import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
const Admin = () => {
    return (
            <div className="flex p-5">
                <Header title="Dashboard" subtitle="" />
            </div>
    );
}

Admin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Admin;