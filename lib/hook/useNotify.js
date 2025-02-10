import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LINE_ACCESS_TOKEN = process.env.LIFF_CHANNEL_ACCESS_TOKEN;

export const useNotify = () => {
    const toastify = (message, type, option = {}) => {
        toast(message, {
            type: type,
            ...option
        });
    };

    const sendLineMessage = async (userId, message) => {
        try {
            await axios.post(
            'https://api.line.me/v2/bot/message/push',
            {
                to: userId,
                messages: [
                    {
                        type: 'text',
                        text: message,
                    },
                ],
            },
            {
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
                },
            }
            );
        } catch (error) {
            console.error('Error sending message to LINE:', error);
        }
    };

    return {
        toastify,
        sendLineMessage
    }
}
