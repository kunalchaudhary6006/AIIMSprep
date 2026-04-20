import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update navStructure by removing the Faculty section
const oldNavStructure = `const navStructure = [
  {
    title: 'Courses',
    subItems: ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course']
  },
  {
    title: 'Question Bank',
    subItems: ['Oswaal Physics Question Bank PDF', 'Oswaal Chemistry Question Bank PDF', 'Oswaal Biology Question Bank PDF', 'Oswaal Complete NEET Package PDF']
  },
  {
    title: 'Faculty',
    subItems: ['Dr. Vivek Jain', 'Dr. NK Sharma', 'Sir Vipin Agarwal', 'Sir S.S. Bhatia']
  }
];`;

const newNavStructure = `const navStructure = [
  {
    title: 'Courses',
    subItems: ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course']
  },
  {
    title: 'Question Bank',
    subItems: ['Oswaal Physics Question Bank PDF', 'Oswaal Chemistry Question Bank PDF', 'Oswaal Biology Question Bank PDF', 'Oswaal Complete NEET Package PDF']
  }
];`;

content = content.replace(oldNavStructure, newNavStructure);

// 2. Set all course prices to ₹1,999
content = content.replace(/price: "₹3,999"/g, 'price: "₹1,999"');
content = content.replace(/price: "₹4,999"/g, 'price: "₹1,999"');

// Optional: you can uniformly update originalPrice to "₹2,999" if you want it all consistent
content = content.replace(/originalPrice: "₹5,999"/g, 'originalPrice: "₹2,999"');
content = content.replace(/originalPrice: "₹7,999"/g, 'originalPrice: "₹2,999"');

// 3. Remove Faculty component from App rendering completely
content = content.replace(/<Faculty onAction=\{handleAction\} \/>/g, '');

// 4. Remove 'Our Faculties' link from the footer
content = content.replace(/<li><button onClick=\{\(\) => onAction\('Navigate to Our Faculties', 'link'\)\} className="hover:text-white transition-colors text-left">Our Faculties<\/button><\/li>/g, '');

fs.writeFileSync('src/App.tsx', content);
