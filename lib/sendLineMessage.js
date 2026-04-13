import axios from "axios";

const LINE_ACCESS_TOKEN = process.env.LIFF_CHANNEL_ACCESS_TOKEN;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const sendLineMessage = async (userId, message, imagePath) => {
  try {
    let messages = [];

    // ถ้า message เป็น string → ส่งเป็น text message
    if (typeof message === "string") {
      messages.push({ type: "text", text: message });
    }
    // ถ้า message เป็น object (เช่น flex) → ส่งตรงไปเลย
    else if (typeof message === "object") {
      messages.push(message);
    }

    // เพิ่มรูปภาพถ้ามี
    if (imagePath) {
      messages.push({
        type: "image",
        originalContentUrl: `${baseUrl.replace(/\/$/, "")}/${imagePath.replace(
          /^\//,
          "",
        )}`,
        previewImageUrl: `${baseUrl.replace(/\/$/, "")}/${imagePath.replace(
          /^\//,
          "",
        )}`,
      });
    }

    const payload = {
      to: userId,
      messages,
    };

    console.log("📤 Sending message to LINE:", payload);
  } catch (error) {
    console.error(
      "❌ Error sending message to LINE:",
      error.response?.data || error.message,
    );
  }
};

export default sendLineMessage;
