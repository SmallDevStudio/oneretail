import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from 'swr';
import UserTable from "@/components/admin/formTable/UserTable";
import EmpTable from "@/components/users/empTable";
import { AdminLayout } from "@/themes";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function UsersAdmin() {
    const [activeTab, setActiveTab] = useState('users');
    const [userData, setUserData] = useState([]);

    const { data, error, mutate } = useSWR('/api/users/emp', fetcher, {
            onSuccess: (data) => {
                setUserData(data.data);
            }
        });

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        window.history.pushState(null, "", `?tab=${tab}`);
    }

    return (
            <div className="flex flex-col px-5 w-full">
                <div className="flex items-center justify-center mb-2">
                    <ul className="flex flex-row items-center gap-6">
                        <li className={`flex cursor-pointer 
                        ${activeTab === 'users' ?
                            'border-[#0056FF] border-b-2 font-bold'
                            :
                            ''
                        }`}
                        onClick={() => handleTabClick('users')}
                        >
                            Users
                        </li>
                        <li className={`flex cursor-pointer
                        ${activeTab === 'emp' ?
                            'border-[#0056FF] border-b-2 font-bold'
                            :
                            ''
                        }`}
                        onClick={() => handleTabClick('emp')}
                        >
                            Employee
                        </li>
                    </ul>
                </div>
                
                {/* Tabs */}
               {activeTab === 'users' && 
                <UserTable 
                    users={userData}
                    setUsers={setUserData}
                />
               }
               {activeTab === 'emp' && <EmpTable />}

            </div>
    );
}

UsersAdmin.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;