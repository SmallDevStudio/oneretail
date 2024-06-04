import './dist/css/app.module.css';
import AppMenu from '@/components/menu/AppMenu';

export default function AppLayout({ children }) {
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