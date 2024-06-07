import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import OneRetailIcon from "@/resources/icons/OneRetailIcon";
import LeaderIcon from "@/resources/icons/LeaderIcon";

const tabs = ["learning", "stores", "main", "club", "profile"];

export default function AppMenu() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("main");
    const [prevTab, setPrevTab] = useState(null);

    useEffect(() => {
        const path = router.pathname.split("/")[1];
        if (tabs.includes(path)) {
            setActiveTab(path);
        } else {
            setActiveTab(null);
        }
    }, [router.pathname]);

    const indexOfActiveTab = tabs.indexOf(activeTab);

    const handleSwipe = (delta) => {
        const newIndex = indexOfActiveTab + delta;
        if (newIndex >= 0 && newIndex < tabs.length) {
            router.push(`/${tabs[newIndex]}`);
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe(1),
        onSwipedRight: () => handleSwipe(-1),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const renderContent = () => {
        switch (activeTab) {
            case "learning":
                return <Learning setActiveTab={setActiveTab} />;
            case "stores":
                return <Stores setActiveTab={setActiveTab} />;
            case "main":
                return <Main setActiveTab={setActiveTab} />;
            case "club":
                return <Club setActiveTab={setActiveTab} />;
            case "profile":
                return <Profile setActiveTab={setActiveTab} />;
            default:
                return <Games setActiveTab={setActiveTab} setPrevTab={setPrevTab} />;
        }
    };

    return (
        <>
            <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow-lg" style={{ boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)", fontFamily: "ttb" }}>
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${activeTab === tab ? "text-blue-600" : ""}`}
                            onClick={() => router.push(`/${tab}`)}
                        >
                            {/* Render icons and labels based on tab */}
                        </button>
                    ))}
                </div>
                {activeTab === null && (
                    <button
                        type="button"
                        className="fixed top-4 left-4 bg-gray-200 p-2 rounded-full"
                        onClick={() => router.push(`/${prevTab || "main"}`)}
                    >
                        Back
                    </button>
                )}
            </nav>
            <div className="content" {...swipeHandlers}>
                {renderContent()}
            </div>
        </>
    );
}

// Learning.js
function Learning({ setActiveTab }) {
    return (
        <div>
            <h1>Learning</h1>
            <button onClick={() => setActiveTab("stores")}>Go to Stores</button>
            {/* Your other content */}
        </div>
    );
}

// Stores.js
function Stores({ setActiveTab }) {
    return (
        <div>
            <h1>Stores</h1>
            <button onClick={() => setActiveTab("main")}>Go to Main</button>
            {/* Your other content */}
        </div>
    );
}

// Main.js
function Main({ setActiveTab }) {
    return (
        <div>
            <h1>Main</h1>
            <button onClick={() => setActiveTab("games")}>Go to Games</button>
            {/* Your other content */}
        </div>
    );
}

// Games.js
function Games({ setActiveTab, setPrevTab }) {
    useEffect(() => {
        setPrevTab("main");
    }, [setPrevTab]);

    return (
        <div>
            <h1>Games</h1>
            {/* Your other content */}
        </div>
    );
}

// Club.js
function Club({ setActiveTab }) {
    return (
        <div>
            <h1>Club</h1>
            {/* Your other content */}
        </div>
    );
}

// Profile.js
function Profile({ setActiveTab }) {
    return (
        <div>
            <h1>Profile</h1>
            {/* Your other content */}
        </div>
    );
}