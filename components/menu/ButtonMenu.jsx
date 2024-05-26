import { ThemeSwitcher } from "../btn/ThemeSwitcher";
import BtnNotification from "../btn/ButtonNotification"

export default function ButtonMenu() {
    return (
        <div className="flex flex-row absolute top-0 right-0">
            <div>
                <ThemeSwitcher />
            </div>
            <div className="flex mt-1 text-gray-500 dark:text-white">
                <BtnNotification />
            </div>
        </div>
    )
}