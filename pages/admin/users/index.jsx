import UserTable from "@/components/admin/formTable/UserTable";
import { AdminLayout } from "@/themes";
export default function UsersAdmin() {

    return (
            <div className="flex flex-col p-10 w-full">
                <div className="flex mb-5">
                    
                </div>
                <div className="p-5">
                    <UserTable />
                </div>
            </div>
    );
}

UsersAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;