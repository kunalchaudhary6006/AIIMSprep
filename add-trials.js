import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetEffect = `  useEffect(() => {
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

const replaceEffect = `  const [trialEndsAt, setTrialEndsAt] = useState<number>(0);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const data = await ensureUserDocument(currentUser);
          setPurchasedBatches(data.purchasedBatches);
          setTrialEndsAt(data.trialEndsAt);
        } catch(e) {
          console.error("Error fetching user data:", e);
        }
      } else {
        setPurchasedBatches([]);
        setTrialEndsAt(0);
      }
    });
    return () => unsubscribe();
  }, []);`;
content = content.replace(targetEffect, replaceEffect);

// Add Free Practice button to hero
const heroTarget = `<button onClick={() => onAction('Book your free trial', 'trial')} className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5">
                Book Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>`;

const heroReplace = `<button onClick={() => onAction('Free Trial Practice', 'practice')} className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5">
                Free Trial Practice
                <ArrowRight className="w-5 h-5" />
              </button>`;
content = content.replace(heroTarget, heroReplace);
content = content.replace(/Book your free trial/g, 'Free Trial Practice');
content = content.replace(/Book Free Trial Now/g, 'Free Trial Practice');
content = content.replace(/'trial'/g, "'practice'");


// Modify Modal to accept trialEndsAt and user
const oldModalSig = `const Modal = ({ config, onClose, onGoogleSignIn, onPaymentSuccess, purchasedBatches, onAction, onEmailAuth, onResetPassword }: { config: any, onClose: () => void, onGoogleSignIn: () => void, onPaymentSuccess: (batch: string) => void, purchasedBatches: string[], onAction: (t: string, ty: string) => void, onEmailAuth: (mode: 'login' | 'register', e: string, p: string) => void, onResetPassword: (e: string) => void }) => {`;

const newModalSig = `const Modal = ({ config, onClose, onGoogleSignIn, onPaymentSuccess, purchasedBatches, onAction, onEmailAuth, onResetPassword, trialEndsAt, user }: { config: any, onClose: () => void, onGoogleSignIn: () => void, onPaymentSuccess: (batch: string) => void, purchasedBatches: string[], onAction: (t: string, ty: string) => void, onEmailAuth: (mode: 'login' | 'register', e: string, p: string) => void, onResetPassword: (e: string) => void, trialEndsAt: number, user: any }) => {`;

content = content.replace(oldModalSig, newModalSig);

// Replace trial modal with practice modal
const oldTrialModal = `{config.type === 'practice' && (
          <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">Enter your email address to get access to your free trial.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" required className="w-full text-base sm:text-sm border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="you@example.com" />
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 sm:py-2.5 rounded-lg hover:bg-orange-600">Start Free Trial</button>
          </form>
        )}`;

const newPracticeModal = `{config.type === 'practice' && (
          <div className="space-y-4">
            {!user ? (
               <div className="text-center p-4">
                  <h4 className="text-xl font-bold mb-2">Login Required</h4>
                  <p className="text-sm text-gray-600 mb-4">You need to log in to access your 2-day free trial for questions practice.</p>
                  <button onClick={() => { onClose(); onAction("Login to your account", "login"); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Login to Start Trial</button>
               </div>
            ) : trialEndsAt > Date.now() ? (
               <div className="text-center p-4">
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 font-bold text-sm">
                     <CheckCircle2 className="inline-block w-5 h-5 mr-1 align-sub"/> Trial Active
                  </div>
                  <p className="text-gray-600 text-sm mb-4">You have {( (trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)).toFixed(1)} days left in your free trial.</p>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-left mb-4">
                      <h5 className="font-bold text-gray-800 mb-2">Sample Question (NEET Level)</h5>
                      <p className="text-sm text-gray-700 mb-3">Which of the following is responsible for the transport of water and minerals from roots to stems and leaves?</p>
                      <div className="space-y-2">
                         <label className="block bg-white border p-2 rounded cursor-pointer hover:bg-blue-50"><input type="radio" name="q1" className="mr-2"/> Phloem</label>
                         <label className="block bg-white border p-2 rounded cursor-pointer hover:bg-blue-50"><input type="radio" name="q1" className="mr-2"/> Xylem</label>
                         <label className="block bg-white border p-2 rounded cursor-pointer hover:bg-blue-50"><input type="radio" name="q1" className="mr-2"/> Cortex</label>
                         <label className="block bg-white border p-2 rounded cursor-pointer hover:bg-blue-50"><input type="radio" name="q1" className="mr-2"/> Epidermis</label>
                      </div>
                  </div>
                  <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 shadow-sm transition">Submit Answer</button>
               </div>
            ) : (
               <div className="text-center p-4">
                  <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 font-bold text-sm">
                     Your 2-Day Trial Has Expired
                  </div>
                  <p className="text-gray-600 text-sm mb-4">To continue practicing questions and accessing premium batches, please purchase a subscription.</p>
                  <button onClick={() => { onClose(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-sm transition">View Pricing</button>
               </div>
            )}
          </div>
        )}`;

content = content.replace(oldTrialModal, newPracticeModal);

// Modify modal call in App.tsx
const oldModalCall = `<Modal config={modalConfig} onClose={closeModal} onGoogleSignIn={handleGoogleSignIn} onPaymentSuccess={(b) => { 
        if (user) {
          try {
            addPurchasedBatchToDB(user.uid, b);
          } catch(e) {
            console.error("Failed to save to db:", e);
          }
        }
        setPurchasedBatches(prev => [...prev, b]); 
        closeModal(); 
        handleAction('Payment Successful for ' + b, 'success'); 
      }} purchasedBatches={purchasedBatches} onAction={handleAction} onEmailAuth={handleEmailAuth} onResetPassword={handleResetPassword} />`;

const newModalCall = `<Modal config={modalConfig} onClose={closeModal} onGoogleSignIn={handleGoogleSignIn} onPaymentSuccess={async (b) => { 
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
      }} purchasedBatches={purchasedBatches} onAction={handleAction} onEmailAuth={handleEmailAuth} onResetPassword={handleResetPassword} trialEndsAt={trialEndsAt} user={user} />`;

content = content.replace(oldModalCall, newModalCall);

// Just to make sure we caught the old Modal call properly, as we used a multiline match that could be flaky, let's use a simpler replace 
content = content.replace(/<Modal config=\{modalConfig\}.*?\/>/s, newModalCall);


// Add a trial banner to the top of the Navbar if logged in and trial active
const navReturnTarget = `return (
    <nav className="fixed w-full z-50 bg-white border-b border-gray-100 shadow-sm">`;

const navReturnReplace = `return (
    <>
    {user && trialEndsAt > Date.now() && (
      <div className="bg-green-600 text-white text-center py-2 text-sm font-semibold relative z-[60]">
         Your 2-Day Free Trial is Active! {Math.ceil((trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24))} Days Remaining. <button onClick={() => onAction('Free Trial Practice', 'practice')} className="underline hover:text-green-200 ml-2">Practice Now</button>
      </div>
    )}
    <nav className={\`fixed w-full z-50 bg-white border-b border-gray-100 shadow-sm \${user && trialEndsAt > Date.now() ? 'top-9' : 'top-0'}\`}>`;

content = content.replace(navReturnTarget, navReturnReplace);

// Don't forget to pass trialEndsAt to Navbar
const navbarSigOld = `const Navbar = ({ onAction, user, onLogout }: { onAction: (title: string, type: string) => void, user: User | null, onLogout: () => void }) => {`;
const navbarSigNew = `const Navbar = ({ onAction, user, onLogout, trialEndsAt }: { onAction: (title: string, type: string) => void, user: User | null, onLogout: () => void, trialEndsAt: number }) => {`;
content = content.replace(navbarSigOld, navbarSigNew);

const navbarRenderOld = `<Navbar onAction={handleAction} user={user} onLogout={handleLogout} />`;
const navbarRenderNew = `<Navbar onAction={handleAction} user={user} onLogout={handleLogout} trialEndsAt={trialEndsAt} />`;
content = content.replace(navbarRenderOld, navbarRenderNew);

// Since the header shifted, we might need to adjust Hero padding, but it's okay for now since we used `top-9`. Let's actually just let Navbar shift down.
// BUT we also need to close the empty fragment in Navbar. Let's fix that block.

const navEndOld = `</AnimatePresence>
    </nav>`;
const navEndNew = `</AnimatePresence>
    </nav>
    </>`;
content = content.replace(navEndOld, navEndNew);


fs.writeFileSync('src/App.tsx', content);

