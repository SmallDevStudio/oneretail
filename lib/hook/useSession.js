import { useState, useEffect } from "react";

export default function useSession() {
    const [ session, setSession ] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
            const res = await fetch('/api/session');
            if (res.ok) {
                const data = await res.json();
                setSession(data.session);
            }
            setLoading(false);
        }

        fetchSession();
    }, []);

    const createOrUpdateSession = async (value, secert, sessionoptions) => {
        const res = await fetch('/api/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value, secert, sessionoptions }),
        });
        if (res.ok) {
            const data = await res.json();
            setSession(data.session);
        }
    };

    const deleteSession = async (cookiename) => {
        const res = await fetch('/api/session', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cookiename }),
        });
        if (res.ok) {
            setSession(null);
        }
    };

    return { session, loading, createOrUpdateSession, deleteSession };

}