const fs = require('fs');
const path = require('path');

const files = [
  'AdminLibrarian.tsx',
  'AdminHermes.tsx',
  'AdminStudio.tsx',
  'AdminAutomation.tsx',
  'AdminSettings.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src/pages', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove import Header from "@/components/Header";
  content = content.replace(/import Header from "@\/components\/Header";?\n?/g, '');
  
  // Replace the wrapper div and Header
  // from: <div className="min-h-screen bg-background flex flex-col">\n      <Header darkTextOnTop />\n      \n      <main className="flex-grow pt-32 pb-16 px-6">
  // to: <div className="space-y-6 animate-fade-in">
  
  content = content.replace(/<div className="min-h-screen[^>]*>\s*<Header[^>]*>\s*<main[^>]*>/, '<div className="space-y-6 animate-fade-in">');
  content = content.replace(/<\/main>\s*<\/div>/, '</div>');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});
