import { AdminLayout } from "@/themes";
const Admin = () => {
    return (
            <div className="flex p-5">
                <h1>Admin</h1>
            </div>
    );
}

Admin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Admin;