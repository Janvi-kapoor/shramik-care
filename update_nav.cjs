const fs = require('fs');

// DesktopSidebar
let desktop = fs.readFileSync('src/components/dashboard/DesktopSidebar.jsx', 'utf8');
desktop = desktop.replace(
  /const navItems = \[\s*[\s\S]*?\s*\];/,
  \const navItems = [
    {
      id: 'health-id',
      label: 'My Health ID',
      icon: QrCode,
    },
    {
      id: 'medicines',
      label: 'My Medicines',
      icon: Pill,
    },
    {
      id: 'voice-care',
      label: 'Voice Care',
      icon: Clock,
    },
    {
      id: 'schemes',
      label: 'Schemes & Benefits',
      icon: ShieldCheck,
    },
  ];\
);
// Remove sublabels from rendering
desktop = desktop.replace(/<span className=\{\	ext-\[10px\] block truncate \\\$\\{isActive \? 'text-teal-200' : 'text-slate-400'\\}\\}>[\s\S]*?<\/span>/g, '');
desktop = desktop.replace(/<span className="px-3 text-\[10px\] font-bold text-slate-400 uppercase tracking-wider block py-1">\s*Health Management\s*<\/span>/, '');
desktop = desktop.replace(/<div className="pt-3">[\s\S]*?<\/button>\s*<\/div>/, '');
fs.writeFileSync('src/components/dashboard/DesktopSidebar.jsx', desktop, 'utf8');

// BottomNavBar
let bottom = fs.readFileSync('src/components/dashboard/BottomNavBar.jsx', 'utf8');
bottom = bottom.replace(/Heart/g, 'Clock, ShieldCheck');
bottom = bottom.replace(
  /const tabs = \[\s*[\s\S]*?\s*\];/,
  \const tabs = [
    {
      id: 'health-id',
      label: 'My Health ID',
      icon: QrCode,
      activeColor: 'text-teal-800 bg-teal-50 border-teal-200/80',
    },
    {
      id: 'medicines',
      label: 'My Medicines',
      icon: Pill,
      activeColor: 'text-teal-800 bg-teal-50 border-teal-200/80',
    },
    {
      id: 'voice-care',
      label: 'Voice Care',
      icon: Clock,
      activeColor: 'text-teal-800 bg-teal-50 border-teal-200/80',
    },
    {
      id: 'schemes',
      label: 'Schemes & Benefits',
      icon: ShieldCheck,
      activeColor: 'text-teal-800 bg-teal-50 border-teal-200/80',
    },
  ];\
);
fs.writeFileSync('src/components/dashboard/BottomNavBar.jsx', bottom, 'utf8');
console.log('Navigation updated.');