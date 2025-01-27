import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useFirebaseChat } from "@/lib/hook/useFirebaseChat";
import MessageWindows from "@/components/messager/messagewindow";
import { AppLayout } from "@/themes";
import { CircularProgress } from "@mui/material";

const ChatRoom = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { chatId } = router.query;
    const [loading, setLoading] = useState(true);

    const handleClose = () => {
        router.push("/messager");
    };

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
