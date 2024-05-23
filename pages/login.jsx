import { useState } from "react";
import axios from "axios";
import liff from "@line/liff";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        try {
            await liff.init({ liffId: process.env.LINE_LIFF_ID });
            if (!liff.isLoggedIn()) {
                liff.login();
            }

            const idToken = liff.getIDToken();
            await axios.post("/api/auth/login", { idToken });

            window.location.href = "/register";
        } catch (error) {
            console.error(error);
            alert("Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login with LINE"}
            </button>
        </div>
    );
}