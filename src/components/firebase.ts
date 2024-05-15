// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const saveUsername = async (uid: string, username: string) => {
    await setDoc(doc(db, 'users', uid), { username });
};

const getUsername = async (uid: string) => {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? docSnap.data()?.username : null;
};

const saveDrawing = async (uid: string, drawing: string) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        drawings: arrayUnion(drawing)
    });
};

const getDrawings = async (uid: string) => {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? docSnap.data()?.drawings : [];
};

const deleteDrawing = async (uid: string, drawing: string) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        drawings: arrayRemove(drawing)
    });
};

export { saveUsername, getUsername, saveDrawing, getDrawings, deleteDrawing };
