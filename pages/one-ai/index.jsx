import { useState, useRef } from "react";
import axios from "axios";

export default function VoiceChat() {
    const [text, setText] = useState("");
    const [response, setResponse] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const audioRef = useRef(null);

    // ฟังก์ชันเริ่มฟังเสียง (ใช้ Web Speech API)
    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "th-TH"; // หรือ "en-US" สำหรับภาษาอังกฤษ
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    // ฟังก์ชันหยุดฟังเสียง
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    // ฟังก์ชันส่งข้อความไปที่ AI (Firebase API)
    const handleSend = async () => {
        if (!text) return alert("โปรดพูดหรือพิมพ์ข้อความก่อนส่ง");

        try {
            // ส่งข้อความไปที่ Firebase API
            const res = await axios.post(
                "https://us-central1-oneretail-35482.cloudfunctions.net/api/chat",
                { message: text }
            );

            const aiReply = res.data.reply;
            setResponse(aiReply);

            // ขอไฟล์เสียงจาก Google Text-to-Speech
            const audioRes = await axios.post(
                "https://us-central1-oneretail-35482.cloudfunctions.net/api/tts",
                { text: aiReply }
            );

            if (audioRes.data.audioBase64) {
                const audioSrc = `data:audio/mp3;base64,${audioRes.data.audioBase64}`;
                audioRef.current.src = audioSrc;
                audioRef.current.play();
            }
            
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาดในการสื่อสารกับ AI");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
            <h1 className="text-2xl font-bold mb-4">🎙 AI Voice Chat</h1>

            {/* ปุ่มพูด */}
            <button
                onClick={isListening ? stopListening : startListening}
                className={`px-6 py-3 rounded-lg text-white text-lg ${isListening ? "bg-red-500" : "bg-blue-500"} transition`}
            >
                {isListening ? "⏹ หยุดพูด" : "🎤 กดเพื่อพูด"}
            </button>

            {/* แสดงข้อความที่พูด */}
            <p className="mt-4 text-lg">{text && `🗣 ${text}`}</p>

            {/* ปุ่มส่งข้อความไปที่ AI */}
            <button
                onClick={handleSend}
                className="mt-4 px-6 py-3 rounded-lg bg-green-500 text-white text-lg transition"
            >
                🚀 ส่งไปที่ AI
            </button>

            {/* แสดงผลลัพธ์จาก AI */}
            {response && <p className="mt-4 text-xl font-semibold">🤖 AI: {response}</p>}

            {/* เล่นเสียง AI ตอบกลับ */}
            <audio ref={audioRef} controls className="mt-4 hidden"></audio>
        </div>
    );
}
