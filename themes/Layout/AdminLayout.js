import { useState } from 'react';
import Topbar from '@/components/admin/global/TopBar';
import SideBar from '@/components/admin/global/SideBar';
import NextAuthProvider from '@/lib/next-auth/NextAuthProvider';

export default function AdminLayout({ children }) {
    const [isSidebar, setIsSidebar] = useState(true);

    return (
        <>
            <NextAuthProvider>
                <main className="flex flex-col min-h-screen">
                
                    <div className="flex flex-row">
                        <div>
                            <SideBar />
                        </div>
                        <div className="flex flex-col w-full">
                            <Topbar setIsSidebar={setIsSidebar}/>
                            {children}
                        </div>
                        
                    </div>
                </main>
            </NextAuthProvider>
        </>
    )
}