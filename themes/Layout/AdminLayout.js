import { useState } from 'react';
import Topbar from '@/components/admin/global/TopBar';
import SideBar from '@/components/admin/global/SideBar';
import NextAuthProvider from '@/lib/next-auth/NextAuthProvider';

export default function AdminLayout({ children }) {
    const [isSidebar, setIsSidebar] = useState(true);

    return (
        <>
            <NextAuthProvider>
                <div className="app">
                    <div className="flex flex-row">
                        <SideBar isSidebar={isSidebar}/>
                        <main className="flex flex-col w-full">
                            <Topbar setIsSidebar={setIsSidebar}/>
                            {children}
                        </main>
                    </div>
                </div>
            </NextAuthProvider>
        </>
    )
}