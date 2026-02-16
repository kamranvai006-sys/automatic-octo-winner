
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, get, child, update, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAOChQ1nUytj0K3QLVIIxKbKJcceEPByKM",
  authDomain: "mr-club-51d50.firebaseapp.com",
  databaseURL: "https://mr-club-51d50-default-rtdb.firebaseio.com",
  projectId: "mr-club-51d50",
  storageBucket: "mr-club-51d50.firebasestorage.app",
  messagingSenderId: "563401746590",
  appId: "1:563401746590:web:b081bd0355e315ee69738f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Helper to get user data
export const getUserData = async (uid: string) => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `users/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
};
