import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';\nimport { auth, signInWithGoogle, logout } from './firebase';\nimport { onAuthStateChanged, User } from 'firebase/auth';"
);

// 2. Update Navbar props and component implementation
content = content.replace(
  "const Navbar = ({ onAction }: { onAction: (title: string, type: string) => void }) => {",
  "const Navbar = ({ onAction, user, onLogout }: { onAction: (title: string, type: string) => void, user: User | null, onLogout: () => void }) => {"
);

// Replace Navbar desktop Auth
const targetDesktopAuth = `<button onClick={() => onAction('Login to your account', 'login')} className="text-sm font-bold text-blue-600 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">Login</button>
            <button onClick={() => onAction('Create a new account', 'register')} className="text-sm font-bold bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all">
              Register
            </button>`;

const replacementDesktopAuth = `{user ? (
              <>
                <div className="flex items-center gap-2">
                  <img src={user.photoURL || \`https://ui-avatars.com/api/?name=\${user.displayName || 'User'}\`} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                  <span className="text-sm font-bold text-gray-700">{user.displayName}</span>
                </div>
                <button onClick={onLogout} className="text-sm font-bold text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => onAction('Login to your account', 'login')} className="text-sm font-bold text-blue-600 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">Login</button>
                <button onClick={() => onAction('Create a new account', 'register')} className="text-sm font-bold bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all">
                  Register
                </button>
              </>
            )}`;
content = content.replace(targetDesktopAuth, replacementDesktopAuth);

// Replace Navbar Mobile Auth
const targetMobileAuth = `<button onClick={() => { setIsOpen(false); onAction('Login to your account', 'login'); }} className="w-full text-center text-blue-600 font-bold py-3 border border-blue-600 rounded-lg">Login</button>
                <button onClick={() => { setIsOpen(false); onAction('Create a new account', 'register'); }} className="w-full text-center bg-orange-500 text-white font-bold py-3 rounded-lg">Register</button>`;

const replacementMobileAuth = `{user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-50">
                      <img src={user.photoURL || \`https://ui-avatars.com/api/?name=\${user.displayName || 'User'}\`} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                      <span className="text-base font-bold text-gray-800">{user.displayName}</span>
                    </div>
                    <button onClick={() => { setIsOpen(false); onLogout(); }} className="w-full text-center text-gray-600 font-bold py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setIsOpen(false); onAction('Login to your account', 'login'); }} className="w-full text-center text-blue-600 font-bold py-3 border border-blue-600 rounded-lg">Login</button>
                    <button onClick={() => { setIsOpen(false); onAction('Create a new account', 'register'); }} className="w-full text-center bg-orange-500 text-white font-bold py-3 rounded-lg">Register</button>
                  </>
                )}`;
content = content.replace(targetMobileAuth, replacementMobileAuth);


// 3. Update Modal Props and logic
content = content.replace(
  "const Modal = ({ config, onClose }: { config: any, onClose: () => void }) => {",
  "const Modal = ({ config, onClose, onGoogleSignIn }: { config: any, onClose: () => void, onGoogleSignIn: () => void }) => {"
);

// Replace 1st Google Login button logic
content = content.replace(
  `<button onClick={onClose} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg`,
  `<button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg`
);

// Replace 2nd Google Login button logic
content = content.replace(
  `<button onClick={onClose} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg`,
  `<button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg`
);


// 4. Update App component with Auth State
const targetAppFn = `export default function App() {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '' });

  const handleAction = (title: string, type: string = 'info') => {
    setModalConfig({ isOpen: true, title, type });
  };

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });`;

const replacementAppFn = `export default function App() {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '' });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = (title: string, type: string = 'info') => {
    setModalConfig({ isOpen: true, title, type });
  };

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };`;

content = content.replace(targetAppFn, replacementAppFn);


// Fix App returns to pass the new props
content = content.replace(
  `<Navbar onAction={handleAction} />`,
  `<Navbar onAction={handleAction} user={user} onLogout={logout} />`
);

content = content.replace(
  `<Modal config={modalConfig} onClose={closeModal} />`,
  `<Modal config={modalConfig} onClose={closeModal} onGoogleSignIn={handleGoogleSignIn} />`
);


fs.writeFileSync('src/App.tsx', content);
console.log('Done integrating firebase google login!');

