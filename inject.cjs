const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/translations.js');
let content = fs.readFileSync(filePath, 'utf8');

const newKeys = {
  en: {
    wpMyHealthId: 'My Health ID',
    wpMedicines: 'My Medicines',
    wpVoiceCare: 'Voice Care',
    wpSchemes: 'Welfare Schemes',
    wpHealthPassport: 'Your Health at a Glance',
    wpUploadPrescription: 'Upload Prescription',
    wpExtractedInfo: 'Extracted Information',
    wpMedicalDiary: 'Medical Diary',
    wpCareNearYou: 'Care Near You',
    wpAboutVoiceCare: 'About Voice Care'
  },
  hi: {
    wpMyHealthId: 'मेरा स्वास्थ्य कार्ड',
    wpMedicines: 'मेरी दवाइयां',
    wpVoiceCare: 'वॉयस केयर',
    wpSchemes: 'कल्याणकारी योजनाएं',
    wpHealthPassport: 'एक नज़र में आपका स्वास्थ्य',
    wpUploadPrescription: 'पर्ची अपलोड करें',
    wpExtractedInfo: 'निकाली गई जानकारी',
    wpMedicalDiary: 'मेडिकल डायरी',
    wpCareNearYou: 'आपके पास स्वास्थ्य सुविधाएं',
    wpAboutVoiceCare: 'वॉयस केयर के बारे में'
  },
  bn: {
    wpMyHealthId: 'আমার স্বাস্থ্য আইডি',
    wpMedicines: 'আমার ওষুধ',
    wpVoiceCare: 'ভয়েস কেয়ার',
    wpSchemes: 'কল্যাণমূলক প্রকল্প',
    wpHealthPassport: 'এক নজরে আপনার স্বাস্থ্য',
    wpUploadPrescription: 'প্রেসক্রিপশন আপলোড করুন',
    wpExtractedInfo: 'উদ্ধৃত তথ্য',
    wpMedicalDiary: 'মেডিকেল ডায়েরি',
    wpCareNearYou: 'আপনার কাছাকাছি স্বাস্থ্যসেবা',
    wpAboutVoiceCare: 'ভয়েস কেয়ার সম্পর্কে'
  },
  ml: {
    wpMyHealthId: 'എന്റെ ഹെൽത്ത് ഐഡി',
    wpMedicines: 'എന്റെ മരുന്നുകൾ',
    wpVoiceCare: 'വോയ്സ് കെയർ',
    wpSchemes: 'ക്ഷേമ പദ്ധതികൾ',
    wpHealthPassport: 'നിങ്ങളുടെ ആരോഗ്യം ഒറ്റനോട്ടത്തിൽ',
    wpUploadPrescription: 'കുറിപ്പടി അപ്‌ലോഡ് ചെയ്യുക',
    wpExtractedInfo: 'വേർതിരിച്ച വിവരങ്ങൾ',
    wpMedicalDiary: 'മെഡിക്കൽ ഡയറി',
    wpCareNearYou: 'നിങ്ങളുടെ അടുത്തുള്ള ആരോഗ്യ കേന്ദ്രങ്ങൾ',
    wpAboutVoiceCare: 'വോയ്സ് കെയറിനെക്കുറിച്ച്'
  }
};

['en', 'hi', 'bn', 'ml'].forEach(lang => {
  const keysStr = Object.entries(newKeys[lang]).map(([k, v]) => `    ${k}: "${v}",`).join('\n');
  const regex = new RegExp(`(${lang}: \\{)`, 'g');
  content = content.replace(regex, `$1\n${keysStr}`);
});

fs.writeFileSync(filePath, content);
console.log('Translations injected successfully.');
