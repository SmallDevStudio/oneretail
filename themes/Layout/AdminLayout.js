import { useState } from 'react';
import Topbar from '@/components/admin/global/TopBar';
import SideBar from '@/components/admin/global/SideBar';

export default function AdminLayout({ children }) {
    const [isSidebar, setIsSidebar] = useState(true);

    return (
        <>
            <div className="app">
                <div className="flex flex-row">
                    <SideBar isSidebar={isSidebar}/>
                    <main className="flex flex-col w-full">
                        <Topbar setIsSidebar={setIsSidebar}/>
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}