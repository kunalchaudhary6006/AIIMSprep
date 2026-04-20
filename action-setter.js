import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Prop types to components
content = content.replace(/const Navbar = \(\) => \{/g, "const Navbar = ({ onAction }: { onAction: (title: string, type: string) => void }) => {");
content = content.replace(/const Hero = \(\) => \{/g, "const Hero = ({ onAction }: { onAction: (title: string, type: string) => void }) => {");
content = content.replace(/const Offerings = \(\) => \{/g, "const Offerings = ({ onAction }: { onAction: (title: string, type: string) => void }) => {");
content = content.replace(/const Features = \(\) => \{/g, "const Features = ({ onAction }: { onAction: (title: string, type: string) => void }) => {");
content = content.replace(/const Faculty = \(\) => \{/g, "const Faculty = ({ onAction }: { onAction: (title: string, type: string) => void }) => {");
content = content.replace(/const CTA = \(\) => \{/g, "const CTA = ({ onAction }: { onAction: (title: string, type: string) => void }) => {");
content = content.replace(/const Footer = \(\) => \{/g, "const Footer = ({ onAction }: { onAction: (title: string, type: string) => void }) => {");

// 2. Navbar fixes
content = content.replace(/<button className="text-sm font-bold text-blue-600/g, `<button onClick={() => onAction('Login to your account', 'login')} className="text-sm font-bold text-blue-600`);
content = content.replace(/<button className="text-sm font-bold bg-orange-500 text-white px-5/g, `<button onClick={() => onAction('Create a new account', 'register')} className="text-sm font-bold bg-orange-500 text-white px-5`);
content = content.replace(/<button className="w-full text-center text-blue-600/g, `<button onClick={() => onAction('Login to your account', 'login')} className="w-full text-center text-blue-600`);
content = content.replace(/<button className="w-full text-center bg-orange-500/g, `<button onClick={() => onAction('Create a new account', 'register')} className="w-full text-center bg-orange-500`);

content = content.replace(/<a key=\{item\} href="#" className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">\s*\{item\}\s*<ChevronDown className="ml-1 w-4 h-4 text-gray-400" \/>\s*<\/a>/g, `<button key={item} onClick={() => onAction('Explore ' + item, 'info')} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">\n                  {item}\n                  <ChevronDown className="ml-1 w-4 h-4 text-gray-400" />\n                </button>`);

content = content.replace(/<a key=\{item\} href="#" className="block px-3 py-3 text-base font-medium text-gray-800 border-b border-gray-50">\s*\{item\}\s*<\/a>/g, `<button key={item} onClick={() => onAction('Explore ' + item, 'info')} className="w-full text-left block px-3 py-3 text-base font-medium text-gray-800 border-b border-gray-50">\n                  {item}\n                </button>`);

// 3. Hero fixes
content = content.replace(/<button className="flex items-center justify-center gap-2 bg-orange-500 text-white px-8/g, `<button onClick={() => onAction('Book your free trial', 'trial')} className="flex items-center justify-center gap-2 bg-orange-500 text-white px-8`);
content = content.replace(/<button className="flex items-center justify-center gap-2 bg-white text-gray-800/g, `<button onClick={() => onAction('Watch Platform Demo', 'video')} className="flex items-center justify-center gap-2 bg-white text-gray-800`);

// 4. Offerings
content = content.replace(/<div className="flex items-center text-blue-600 font-semibold/g, `<div onClick={() => onAction('Know more about ' + item.title, 'info')} className="flex items-center text-blue-600 font-semibold`);

// 5. Features
content = content.replace(/<button className="mt-10 bg-blue-700 text-white px-8/g, `<button onClick={() => onAction('Explore All Features', 'info')} className="mt-10 bg-blue-700 text-white px-8`);

// 6. Faculty
content = content.replace(/<button className="flex-shrink-0 text-blue-700 font-bold/g, `<button onClick={() => onAction('View All Faculty Members', 'list')} className="flex-shrink-0 text-blue-700 font-bold`);
content = content.replace(/<div key=\{idx\} className="group cursor-pointer">/g, `<div key={idx} onClick={() => onAction(teacher.name + ' Bio', 'bio')} className="group cursor-pointer">`);

// 7. CTA
content = content.replace(/<button className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold/g, `<button onClick={() => onAction('Book your free trial', 'trial')} className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold`);
content = content.replace(/<button className="bg-white\/10 backdrop-blur-md text-white border border-white\/30 px-8/g, `<button onClick={() => onAction('View Pricing Plans', 'pricing')} className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8`);

// 8. Footer HTML replaced correctly
content = content.replace(/<li><a href="#" className="hover:text-white transition-colors">([^<]+)<\/a><\/li>/g, `<li><button onClick={() => onAction('Navigate to $1', 'link')} className="hover:text-white transition-colors text-left">$1</button></li>`);

fs.writeFileSync('src/App.tsx', content);
console.log('Done mapping actions!');
