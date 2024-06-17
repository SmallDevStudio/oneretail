import './dist/css/app.module.css';
import AppMenu from '@/components/AppMenu';

const AppLayout = ({ children }) => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                    {children}
                </div>
                <nav className="nav">
                    <AppMenu />
                </nav>
            </div>
        </>
    );
};

export default AppLayout;
