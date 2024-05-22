import admin from "firebase-admin";
import { dbConfig } from "@/config/database.config";

const serviceAccount = dbConfig.provider.firebase-admin;

if(!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.log('Firebase admin initialization error', error.stack);
        process.exit(1);
    }
}

export const db = admin.firestore();
export default admin;
