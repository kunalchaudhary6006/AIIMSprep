import fs from 'fs';

let firebaseContent = fs.readFileSync('src/firebase.ts', 'utf8');
firebaseContent = firebaseContent.replace(
    "import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';",
    "import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';"
);
firebaseContent += `
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
`;
fs.writeFileSync('src/firebase.ts', firebaseContent);


let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import { auth, signInWithGoogle, logout } from './firebase';",
  "import { auth, signInWithGoogle, logout, loginWithEmail, registerWithEmail, resetPassword } from './firebase';"
);

const modalSignatureOld = "const Modal = ({ config, onClose, onGoogleSignIn, onPaymentSuccess, purchasedBatches, onAction }: { config: any, onClose: () => void, onGoogleSignIn: () => void, onPaymentSuccess: (batch: string) => void, purchasedBatches: string[], onAction: (t: string, ty: string) => void }) => {";
const modalSignatureNew = "const Modal = ({ config, onClose, onGoogleSignIn, onPaymentSuccess, purchasedBatches, onAction, onEmailAuth, onResetPassword }: { config: any, onClose: () => void, onGoogleSignIn: () => void, onPaymentSuccess: (batch: string) => void, purchasedBatches: string[], onAction: (t: string, ty: string) => void, onEmailAuth: (mode: 'login' | 'register', e: string, p: string) => void, onResetPassword: (e: string) => void }) => {";
content = content.replace(modalSignatureOld, modalSignatureNew);

const oldLoginBlock = `{config.type === 'login' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4 text-center">Please verify your identity to securely log in.</p>
            <button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}`;

const newLoginBlock = `{config.type === 'login' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4 text-center">Please verify your identity to securely log in.</p>
            <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; onEmailAuth('login', t.email.value, t.password.value); }} className="space-y-3">
              <input type="email" name="email" required placeholder="Email Address" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              <input type="password" name="password" required placeholder="Password" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Login</button>
            </form>
            <div className="flex justify-center">
              <button type="button" onClick={() => onAction('Reset Password', 'forgot_password')} className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {config.type === 'forgot_password' && (
          <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; onResetPassword(t.email.value); }} className="space-y-4">
            <p className="text-gray-600 text-sm mb-4 text-center">Enter your email address to receive an SMTP link to securely change your password.</p>
            <div>
              <input type="email" name="email" required className="w-full text-base sm:text-sm border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="you@example.com" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 sm:py-2.5 rounded-lg hover:bg-blue-700">Send Reset Link</button>
            <div className="text-center mt-2">
               <button type="button" onClick={() => onAction('Login to your account', 'login')} className="text-sm text-gray-500 hover:text-gray-800">Back to Login</button>
            </div>
          </form>
        )}`;

content = content.replace(oldLoginBlock, newLoginBlock);

const oldRegisterBlock = `{config.type === 'register' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4 text-center">Create a new account securely using Google Authenticator.</p>
            <button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        )}`;

const newRegisterBlock = `{config.type === 'register' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4 text-center">Create a new account securely.</p>
            <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; onEmailAuth('register', t.email.value, t.password.value); }} className="space-y-3">
              <input type="email" name="email" required placeholder="Email Address" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              <input type="password" name="password" required placeholder="Choose a Password" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2.5 rounded-lg hover:bg-orange-600">Create Account</button>
            </form>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        )}`;

content = content.replace(oldRegisterBlock, newRegisterBlock);


const oldAppHandlers = `  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };`;

const newAppHandlers = `  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailAuth = async (mode: 'login' | 'register', email: string, pass: string) => {
    try {
      if (mode === 'login') {
        await loginWithEmail(email, pass);
      } else {
        await registerWithEmail(email, pass);
      }
      closeModal();
    } catch (err: any) {
      alert("Auth Error: " + err.message);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
      alert("Password reset email sent via SMTP! Please check your inbox.");
      closeModal();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };`;
content = content.replace(oldAppHandlers, newAppHandlers);

const oldModalCall = `<Modal config={modalConfig} onClose={closeModal} onGoogleSignIn={handleGoogleSignIn} onPaymentSuccess={(b) => { setPurchasedBatches(prev => [...prev, b]); closeModal(); handleAction('Payment Successful for ' + b, 'success'); }} purchasedBatches={purchasedBatches} onAction={handleAction} />`;
const newModalCall = `<Modal config={modalConfig} onClose={closeModal} onGoogleSignIn={handleGoogleSignIn} onPaymentSuccess={(b) => { setPurchasedBatches(prev => [...prev, b]); closeModal(); handleAction('Payment Successful for ' + b, 'success'); }} purchasedBatches={purchasedBatches} onAction={handleAction} onEmailAuth={handleEmailAuth} onResetPassword={handleResetPassword} />`;

content = content.replace(oldModalCall, newModalCall);

fs.writeFileSync('src/App.tsx', content);
