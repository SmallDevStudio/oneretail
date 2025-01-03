import './dist/css/app.module.css';
import AppMenu from '@/components/AppMenu';

const AppLayout = ({ children }) => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                    {children}
                    <nav className="fixed bottom-0 w-full z-50">
                        <AppMenu />
                    </nav>
                </main>
                
            </div>
        </>
    );
};

export default AppLayout;
