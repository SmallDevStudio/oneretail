import './dist/css/app.module.css';
import AppMenu from '@/components/menu/AppMenu';

export default function AppLayout({ children }) {
    return (
        <>
            <div className="app">
                {children}
            </div>
            <nav className="nav">
                <AppMenu />
            </nav>
        </>
    )
}