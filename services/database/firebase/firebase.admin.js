import admin from "firebase-admin";
import serviceAccount from './serviceAccountKey.json';

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