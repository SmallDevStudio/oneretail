import admin from "firebase-admin";

if(!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                type: 'service_account',
                private_key_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY_ID,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
                clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
                privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVARE_KEY.replace(/\\n/g, '\n'),
                client_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_ID,
                token_uri: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_TOKEN_URI,
                auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
                databaseURL: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_DATABASE_URL,
            }),
        });
    } catch (error) {
        console.log('Firebase admin initialization error', error.stack);
        process.exit(1);
    }
}

export const db = admin.firestore();
export default admin;
