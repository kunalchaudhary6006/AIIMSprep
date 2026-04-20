import fs from 'fs';

let content = fs.readFileSync('src/firebase.ts', 'utf8');

const targetImports = "import { getFirestore } from 'firebase/firestore';";
const newImports = "import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';";
content = content.replace(targetImports, newImports);

const newHelpers = `
export const ensureUserDocument = async (user: any) => {
  if (!user) return [];
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);
  
  if (docSnap.exists()) {
    return docSnap.data().purchasedBatches || [];
  } else {
    // Create new document
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      createdAt: serverTimestamp(),
      purchasedBatches: []
    });
    return [];
  }
};

export const addPurchasedBatchToDB = async (uid: string, batchName: string) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    purchasedBatches: arrayUnion(batchName)
  });
};
`;

content += newHelpers;
fs.writeFileSync('src/firebase.ts', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  "import { auth, signInWithGoogle, logout, loginWithEmail, registerWithEmail, resetPassword } from './firebase';",
  "import { auth, signInWithGoogle, logout, loginWithEmail, registerWithEmail, resetPassword, ensureUserDocument, addPurchasedBatchToDB } from './firebase';"
);

const oldAuthEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);`;

const newAuthEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const batches = await ensureUserDocument(currentUser);
          setPurchasedBatches(batches);
        } catch(e) {
          console.error("Error fetching user data:", e);
        }
      } else {
        setPurchasedBatches([]);
      }
    });
    return () => unsubscribe();
  }, []);`;

appContent = appContent.replace(oldAuthEffect, newAuthEffect);

const oldModalUpdate = `onPaymentSuccess={(b) => { setPurchasedBatches(prev => [...prev, b]); closeModal(); handleAction('Payment Successful for ' + b, 'success'); }}`;
const newModalUpdate = `onPaymentSuccess={async (b) => { 
        if (user) {
          try {
            await addPurchasedBatchToDB(user.uid, b);
          } catch(e) {
            console.error("Failed to save to db:", e);
          }
        }
        setPurchasedBatches(prev => [...prev, b]); 
        closeModal(); 
        handleAction('Payment Successful for ' + b, 'success'); 
      }}`;

appContent = appContent.replace(oldModalUpdate, newModalUpdate);

fs.writeFileSync('src/App.tsx', appContent);
