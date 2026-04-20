import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update the Question Bank dropdown in navStructure
content = content.replace(
  `subItems: ['Physics MCQs', 'Chemistry MCQs', 'Biology MCQs', 'NCERT Audio/Text Flashcards']`,
  `subItems: ['Oswaal Physics Question Bank PDF', 'Oswaal Chemistry Question Bank PDF', 'Oswaal Biology Question Bank PDF', 'Oswaal Complete NEET Package PDF']`
);

// 2. Add helper for routing based on title and replace standard desktop/mobile clicks
const targetDesktopClick = `onClick={() => onAction(sub, ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course'].includes(sub) ? 'course_info' : 'link')}`;
const customDesktopClick = `onClick={() => onAction(sub, sub.includes('Oswaal') ? 'pdf_info' : ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course'].includes(sub) ? 'course_info' : 'link')}`;
content = content.replace(targetDesktopClick, customDesktopClick);

const targetMobileClick = `onClick={() => { setIsOpen(false); onAction(sub, ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course'].includes(sub) ? 'course_info' : 'link'); }}`;
const customMobileClick = `onClick={() => { setIsOpen(false); onAction(sub, sub.includes('Oswaal') ? 'pdf_info' : ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course'].includes(sub) ? 'course_info' : 'link'); }}`;
content = content.replace(targetMobileClick, customMobileClick);

// 3. Add pdf_info and pdf_viewer to the Modal
const targetModalEnd = `{config.type === 'dashboard' && (`;
const replaceModalInjection = `{config.type === 'pdf_info' && (
         <div className="space-y-4">
            <div className="mb-6">
                <p className="text-gray-600">Download the official High-Yield <strong>{config.title}</strong> directly to your device for offline practice.</p>
            </div>
            {purchasedBatches.includes(config.title) ? (
              <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
                 <h4 className="text-green-800 font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> You have full access!</h4>
                 <p className="text-sm text-green-700 mb-4">Your purchase is confirmed.</p>
                 <button onClick={() => onAction(config.title + ' Viewer', 'pdf_viewer')} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-sm transition">Open PDF</button>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
                 <h4 className="text-blue-800 font-bold mb-2 outline-none">Premium PDF Content</h4>
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-blue-700 leading-relaxed">Secure your copy instantly.</p>
                    <span className="text-xl font-black text-blue-900">
                      ₹{config.title.includes('Complete') ? '999' : config.title.includes('Biology') ? '699' : config.title.includes('Chemistry') ? '499' : '349'}
                    </span>
                 </div>
                 <button onClick={() => { onClose(); setTimeout(() => onAction('Enroll in ' + config.title, 'payment'), 150); }} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 shadow-sm transition">Buy Now</button>
              </div>
            )}
         </div>
      )}

      {config.type === 'pdf_viewer' && (
         <div className="space-y-4">
            <div className="aspect-[1/1.414] bg-gray-900 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden group">
               <img src="https://picsum.photos/seed/document/800/1131" className="absolute inset-0 w-full h-full object-cover opacity-20" />
               <FileJson className="w-16 h-16 text-blue-400 mb-4 relative z-10" />
               <h3 className="text-white font-bold text-xl relative z-10 text-center mb-2 text-balance">{config.title.replace(' Viewer', '')}</h3>
               <p className="text-gray-300 text-sm relative z-10 text-center">Page 1 of 450</p>
               <button className="mt-6 bg-white text-gray-900 px-6 py-2 rounded-full font-bold relative z-10 hover:bg-gray-100 cursor-pointer">Download PDF</button>
            </div>
         </div>
      )}

      {config.type === 'dashboard' && (`

content = content.replace(targetModalEnd, replaceModalInjection);

fs.writeFileSync('src/App.tsx', content);

