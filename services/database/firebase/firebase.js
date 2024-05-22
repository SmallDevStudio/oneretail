import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { dbConfig } from "@/config/database.config";

const firebaseConfig = dbConfig.provider.firebase;

const firebaseAdmin = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const firebase = firebaseAdmin
export const db = getFirestore(firebaseAdmin);
export const auth = getAuth(firebaseAdmin);