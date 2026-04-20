import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Test Series from navStructure
content = content.replace(
  `  {
    title: 'Test Series',
    subItems: ['High Yield Test (All India)', 'Chapter-wise Tests', 'Previous Year Papers', 'Custom Test Generator']
  },
`,
  ''
);

// 2. Remove Test Series from Offerings
const targetOffering = `    {
      title: 'All India Test Series',
      description: 'Compete with the best. Detailed analytics to find your weak areas.',
      icon: <PenTool className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
      border: 'border-green-100'
    }`;
content = content.replace(targetOffering, '');
// And update grid columns from lg:grid-cols-4 to lg:grid-cols-3 since we only have 3 offerings now
content = content.replace(`<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">`, `<div className="grid md:grid-cols-3 gap-8">`);


// 3. Update Footer (Remove Test Series link)
content = content.replace(
  `<li><button onClick={() => onAction('Navigate to Test Series', 'link')} className="hover:text-white transition-colors text-left">Test Series</button></li>`,
  ''
);

// 4. Make handleAction scroll to anchors for 'pricing' and 'list'
const targetHandleAction = `  const handleAction = (title: string, type: string = 'info') => {
    setModalConfig({ isOpen: true, title, type });
  };`;

const replaceHandleAction = `  const handleAction = (title: string, type: string = 'info') => {
    if (type === 'pricing') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (type === 'list' && title.includes('Faculty')) {
      document.getElementById('faculty')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (type === 'link' || type === 'info') {
      // Basic simulation, we will still show modal
    }
    setModalConfig({ isOpen: true, title, type });
  };`;
content = content.replace(targetHandleAction, replaceHandleAction);

// Add IDs to Faculty
content = content.replace(
  `const Faculty = ({ onAction }: { onAction: (title: string, type: string) => void }) => {`,
  `const Faculty = ({ onAction }: { onAction: (title: string, type: string) => void }) => {` // Keep same
);
content = content.replace(
  `<div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">`,
  `<div className="py-24 bg-white" id="faculty">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">`
);


// 5. Update Payment Gateway Modal inside App.tsx
const targetPayment = `{config.type === 'payment' && (
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="w-full flex items-center justify-center gap-2 pb-4 border-b border-gray-100">
              <span className="bg-blue-800 text-white font-bold px-3 py-1 rounded-md text-xs tracking-wider">KNITPAY</span>
              <span className="text-gray-800 font-semibold text-sm">UPI Plugin</span>
            </div>
            <p className="text-gray-600 text-center text-sm">Scan the QR code below via Google Pay, PhonePe, or any UPI app to pay for <strong>{config.title.replace('Enroll in ', '')}</strong>.</p>
            <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-md">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=aiimsprep@upi&pn=AIIMSprep" alt="KnitPay UPI QR Code" className="w-48 h-48" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/qr/250/250'; }} />
            </div>
            <div className="w-full flex gap-3">
              <button onClick={() => onPaymentSuccess(config.title.replace('Enroll in ', ''))} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition shadow-sm">I have made the payment</button>
            </div>
            <p className="text-xs text-gray-400 text-center px-4 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Secured by KnitPay
            </p>
          </div>
        )}`;

const replacePayment = `{config.type === 'payment' && (
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="w-full flex items-center justify-center gap-2 pb-4 border-b border-gray-100">
              <span className="bg-blue-800 text-white font-bold px-3 py-1 rounded-md text-xs tracking-wider">KNITPAY</span>
              <span className="text-gray-800 font-semibold text-sm">UPI Plugin</span>
            </div>
            <p className="text-gray-600 text-center text-sm">Scan the QR code below via Google Pay, PhonePe, or any UPI app to pay for <strong>{config.title.replace('Enroll in ', '')}</strong>.</p>
            <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-md">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=aiimsprep@upi&pn=AIIMSprep" alt="KnitPay UPI QR Code" className="w-48 h-48" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/qr/250/250'; }} />
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl w-full text-center">
                <p className="text-sm text-gray-800 font-medium mb-3">After payment, send your screenshot to our official Telegram:</p>
                <a 
                   href="https://t.me/aiimsprep" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onClick={() => onPaymentSuccess(config.title.replace('Enroll in ', ''))}
                   className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-3.5 rounded-lg hover:bg-blue-600 transition shadow-sm mb-2"
                >
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.539.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                   Send Screenshot on Telegram
                </a>
                <p className="text-xs text-orange-700">Admin will verify and grant batch access within minutes.</p>
                <p className="text-xs text-gray-500 mt-2 italic">(Demo Note: Clicking automatically grants access to test the flow)</p>
            </div>

            <p className="text-xs text-gray-400 text-center px-4 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Secured by KnitPay
            </p>
          </div>
        )}`;
content = content.replace(targetPayment, replacePayment);


// 6. Add Bio Modal and remove 'bio' from generic simulated array
const genericTarget = `{['info', 'link', 'list', 'bio', 'pricing'].includes(config.type) && (`;
const genericReplace = `{config.type === 'bio' && (
           <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto overflow-hidden border-4 border-white shadow-lg">
                <img src={\`https://ui-avatars.com/api/?name=\${config.title.replace(' Bio', '')}&background=random&size=128\`} alt="Faculty" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{config.title.replace(' Bio', '')}</h4>
              <p className="text-blue-600 font-bold">Senior AIIMS Faculty Member</p>
              <p className="text-gray-600 text-sm leading-relaxed px-4">With immense passion and years of teaching experience, they have helped thousands of students secure top ranks in medical entrance exams. Their teaching methodology specifically focuses on NCERT decoding and rigorous practice.</p>
              <div className="flex justify-center gap-8 py-4 border-t border-gray-100">
                  <div className="text-center">
                     <span className="block font-extrabold text-2xl text-gray-900">50k+</span>
                     <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Students</span>
                  </div>
                  <div className="text-center">
                     <span className="block font-extrabold text-2xl text-gray-900">4.9</span>
                     <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Rating</span>
                  </div>
              </div>
              <button onClick={onClose} className="w-full font-bold bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition">Close Bio</button>
           </div>
        )}

        {['info', 'link', 'list', 'pricing'].includes(config.type) && (`
content = content.replace(genericTarget, genericReplace);


fs.writeFileSync('src/App.tsx', content);
console.log('App updated with telegram flow, faculty info, and removed test series!');
