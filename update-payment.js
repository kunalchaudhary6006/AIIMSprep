import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add purchasedBatches state to App
content = content.replace(
  `const [user, setUser] = useState<User | null>(null);`,
  `const [user, setUser] = useState<User | null>(null);\n  const [purchasedBatches, setPurchasedBatches] = useState<string[]>([]);`
);

// 2. Adjust Pricing component props & logic
content = content.replace(
  `const Pricing = ({ onAction }: { onAction: (title: string, type: string) => void }) => {`,
  `const Pricing = ({ onAction, purchasedBatches }: { onAction: (title: string, type: string) => void, purchasedBatches: string[] }) => {`
);

content = content.replace(
  `<button \n                onClick={() => onAction(\`Enroll in \${plan.name}\`, 'payment')}\n                className={\`w-full py-4 rounded-xl font-bold text-lg transition-colors \${plan.popular ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}\`}\n              >\n                Enroll Now\n              </button>`,
  `{purchasedBatches.includes(plan.name) ? (
                <button 
                  onClick={() => onAction(\`\${plan.name} Dashboard\`, 'dashboard')}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-colors bg-green-500 text-white hover:bg-green-600"
                >
                  Access Batch
                </button>
              ) : (
                <button 
                  onClick={() => onAction(\`Enroll in \${plan.name}\`, 'payment')}
                  className={\`w-full py-4 rounded-xl font-bold text-lg transition-colors \${plan.popular ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}\`}
                >
                  Enroll Now
                </button>
              )}`
);

// 3. Update Navbar to use 'course_info' for Courses dropdown items
// This is slightly tricky, let's find the Navbar navStructure map for courses and replace the type
content = content.replace(
  `onClick={() => onAction(sub, 'link')}`,
  `onClick={() => onAction(sub, ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course'].includes(sub) ? 'course_info' : 'link')}`
);
content = content.replace(
  `onClick={() => { setIsOpen(false); onAction(sub, 'link'); }}`,
  `onClick={() => { setIsOpen(false); onAction(sub, ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course'].includes(sub) ? 'course_info' : 'link'); }}`
);

// 4. Update App render for Pricing
content = content.replace(
  `<Pricing onAction={handleAction} />`,
  `<Pricing onAction={handleAction} purchasedBatches={purchasedBatches} />`
);


// 5. Update Modal Component Props
content = content.replace(
  `const Modal = ({ config, onClose, onGoogleSignIn }: { config: any, onClose: () => void, onGoogleSignIn: () => void }) => {`,
  `const Modal = ({ config, onClose, onGoogleSignIn, onPaymentSuccess, purchasedBatches, onAction }: { config: any, onClose: () => void, onGoogleSignIn: () => void, onPaymentSuccess: (batch: string) => void, purchasedBatches: string[], onAction: (t: string, ty: string) => void }) => {`
);

// 6. Update App render for Modal
content = content.replace(
  `function App() {\n  const [modalConfig, setModalConfig] = useState`,
  `function App() {\n  const [modalConfig, setModalConfig] = useState`
); // Anchor
content = content.replace(
  `<Modal config={modalConfig} onClose={closeModal} onGoogleSignIn={handleGoogleSignIn} />`,
  `<Modal config={modalConfig} onClose={closeModal} onGoogleSignIn={handleGoogleSignIn} onPaymentSuccess={(b) => { setPurchasedBatches(prev => [...prev, b]); closeModal(); handleAction('Payment Successful for ' + b, 'success'); }} purchasedBatches={purchasedBatches} onAction={handleAction} />`
);

// 7. Inject new Modal Types inside the Modal component.
// Before: "{['info', 'link', 'list', 'bio', 'pricing'].includes(config.type) && ("
const newModalContent = `
        {config.type === 'payment' && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="text-gray-600 text-center text-sm">Scan the QR code below via Google Pay, PhonePe, or any UPI app to pay for <strong>{config.title.replace('Enroll in ', '')}</strong>.</p>
            <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-md">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=aiimsprep@upi&pn=AIIMSprep" alt="UPI QR Code" className="w-48 h-48" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/qr/250/250'; }} />
            </div>
            <div className="w-full flex gap-3">
              <button onClick={() => onPaymentSuccess(config.title.replace('Enroll in ', ''))} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition shadow-sm">I have made the payment</button>
            </div>
            <p className="text-xs text-gray-400 text-center px-4">This is a simulated payment gateway. Clicking the button above grants instant access.</p>
          </div>
        )}

        {config.type === 'course_info' && (
          <div className="space-y-4">
             <div className="mb-6">
                 <p className="text-gray-600">Access exhaustive study materials, test series and video lectures carefully designed for <strong>{config.title}</strong>.</p>
             </div>
             {purchasedBatches.includes(config.title) ? (
               <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
                  <h4 className="text-green-800 font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> You have full access!</h4>
                  <p className="text-sm text-green-700 mb-4">Your enrolment in this batch is active.</p>
                  <button onClick={() => onAction(config.title + ' Dashboard', 'dashboard')} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-sm transition">Enter Course Dashboard</button>
               </div>
             ) : (
               <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl">
                  <h4 className="text-orange-800 font-bold mb-2 outline-none">This is a premium batch</h4>
                  <p className="text-sm text-orange-700 mb-4 leading-relaxed">Enroll now to unlock premium features including ad-free video lectures, unlimited test submissions, and NCERT flashcards.</p>
                  <button onClick={() => { onClose(); setTimeout(() => onAction('Enroll in ' + config.title, 'payment'), 150); }} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 shadow-sm transition">Buy Now</button>
               </div>
             )}
          </div>
        )}

        {config.type === 'dashboard' && (
           <div className="space-y-4">
             <div className="aspect-video bg-gray-900 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                <img src="https://picsum.photos/seed/biology/800/400" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <PlayCircle className="w-12 h-12 text-blue-400 mb-2 relative z-10" />
                <p className="text-white font-medium relative z-10 text-center">Resume Learning: {config.title.replace(' Dashboard', '')}</p>
             </div>
             <div className="bg-gray-50 rounded-xl p-4 mt-2">
                 <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Your Modules</h4>
                 <ul className="space-y-2">
                    <li onClick={() => onAction('Lecture Video Simulated', 'video')} className="p-3 bg-white border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-300 hover:shadow-sm transition">
                        <span className="text-sm font-semibold text-gray-700">1. Anatomy & Physiology</span> 
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                    </li>
                    <li onClick={() => onAction('Lecture Video Simulated', 'video')} className="p-3 bg-white border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-300 hover:shadow-sm transition">
                        <span className="text-sm font-semibold text-gray-700">2. Plant Biology</span> 
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                    </li>
                    <li onClick={() => onAction('Simulated Mock Test', 'info')} className="p-3 bg-white border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-300 hover:shadow-sm transition">
                        <span className="text-sm font-semibold text-gray-700">Unit Test 1</span> 
                        <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded">Pending</span>
                    </li>
                 </ul>
             </div>
           </div>
        )}

        {config.type === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 text-center">{config.title}</h4>
                <p className="text-gray-500 text-center text-sm">Thank you for your purchase. You can now access all your materials.</p>
                <div className="w-full pt-4">
                  <button onClick={onClose} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-sm">Go to Dashboard</button>
                </div>
            </div>
        )}

        {['info', 'link', 'list', 'bio', 'pricing'].includes(config.type) && (`;

content = content.replace(
  `{['info', 'link', 'list', 'bio', 'pricing'].includes(config.type) && (`,
  newModalContent
);

fs.writeFileSync('src/App.tsx', content);
console.log('App updated with payment gateway and batch access logic!');
