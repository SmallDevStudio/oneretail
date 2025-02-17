import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { storage } from "@/lib/firebase";

export const firebaseUploadFile = async (file, folder, onProgress) => {
  if (!file) return null;

    try {
        const fileId = nanoid(10);
        const fileRef = ref(storage, `uploads/${folder}/${fileId}_${file.name}`);
        const metadata = { contentType: file.type };

        const uploadTask = uploadBytesResumable(fileRef, file, metadata);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
        });

        await uploadTask;
        const fileURL = await getDownloadURL(fileRef);

        return {
            url: fileURL,
            file_name: file.name,
            mime_type: file.type,
            file_size: file.size,
            file_id: fileId,
        };
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
};

export const firebaseDeleteFile = async (fileId, folder, fileName) => {
  try {
      const fileRef = ref(storage, `uploads/${folder}/${fileId}_${fileName}`);
      await deleteObject(fileRef);
  } catch (error) {
      console.error("Error deleting file:", error);
  }
};
