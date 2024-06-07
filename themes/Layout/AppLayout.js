import './dist/css/app.module.css';
import AppMenu from '@/components/AppMenu';

const AppLayout = ({ children }) => {
    return (
        <>
            <div className="flex flex-col h-full">
                {children}
            </div>
            <nav className="nav">
                <AppMenu />
            </nav>
        </>
    )
}

export default AppLayout;