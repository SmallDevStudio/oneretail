import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { storage } from "@/lib/firebase";

export const uploadFileToFirebase = async (file, chatId) => {
  if (!file) return null;

  try {
    const fileId = nanoid(10); // สร้าง unique ID
    const fileRef = ref(storage, `uploads/${chatId}/${fileId}_${file.name}`); // เก็บไว้ที่ uploads/

    // กำหนด metadata เพื่อป้องกัน Error 403
    const metadata = {
      contentType: file.type, // ระบุประเภทไฟล์ เช่น image/png, application/pdf
    };

    // ใช้ uploadBytesResumable เพื่อรองรับการอัปโหลดขนาดใหญ่
    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    // รอให้อัปโหลดเสร็จ
    await uploadTask;

    // ดึง URL ของไฟล์ที่อัปโหลดแล้ว
    const fileURL = await getDownloadURL(fileRef);

    // เก็บข้อมูลไฟล์
    const fileData = {
      url: fileURL,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      file_id: fileId,
    };

    return fileData;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
