import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";
import MessageWindows from "@/components/messager/messagewindow";
import { AppLayout } from "@/themes";
import { CircularProgress, Typography, Button } from "@mui/material";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase"; // Firebase setup file

const ChatRoom = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { chatId } = router.query;
    const [loading, setLoading] = useState(true);
    const [chatExists, setChatExists] = useState(null); // ตรวจสอบว่ามี chatId หรือไม่

    const handleClose = () => {
        router.push("/messager");
    };

    useEffect(() => {
        if (!chatId) return;
    
        setLoading(true);
        get(ref(database, `chats/${chatId}`)).then((snapshot) => {
            setChatExists(snapshot.exists());
        }).catch((error) => {
            console.error("Error checking chat existence:", error);
            setChatExists(false);
        }).finally(() => {
            setLoading(false);
        });
    }, [chatId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (chatExists === false) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Typography variant="h6" color="textSecondary">
                    ไม่มีห้องแชท
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClose}
                    style={{ marginTop: "16px" }}
                >
                    กลับไปหน้าห้องแชท
                </Button>
            </div>
        );
    }

    return (
        <div>
            <MessageWindows
                selectedChat={chatId}
                handleClose={handleClose}
            />
        </div>
    );
};

export default ChatRoom;
