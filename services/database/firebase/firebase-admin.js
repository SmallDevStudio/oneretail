import admin from "firebase-admin";
import serviceAccount from './serviceAccountKey.json';

if(!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://oneretail-35482-default-rtdb.asia-southeast1.firebasedatabase.app"
        });
    } catch (error) {
        console.log('Firebase admin initialization error', error.stack);
        process.exit(1);
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;