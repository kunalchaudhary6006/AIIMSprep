import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending reset email: ", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerWithEmail = async (email: string, pass: string) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const ensureUserDocument = async (user: any) => {
  if (!user) return { purchasedBatches: [], trialEndsAt: 0 };
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);
  
  if (docSnap.exists()) {
    let data = docSnap.data();
    if (!data.trialEndsAt) {
        const trialEndsAt = Date.now() + 2 * 24 * 60 * 60 * 1000;
        await updateDoc(userRef, { trialEndsAt });
        return { purchasedBatches: data.purchasedBatches || [], trialEndsAt };
    }
    return { purchasedBatches: data.purchasedBatches || [], trialEndsAt: data.trialEndsAt };
  } else {
    // Create new document
    const trialEndsAt = Date.now() + 2 * 24 * 60 * 60 * 1000;
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      createdAt: serverTimestamp(),
      purchasedBatches: [],
      trialEndsAt: trialEndsAt
    });
    return { purchasedBatches: [], trialEndsAt };
  }
};

export const addPurchasedBatchToDB = async (uid: string, batchName: string) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    purchasedBatches: arrayUnion(batchName)
  });
};
