import json
import re

# Read current translations (just hardcoding the base dicts to append to them)
translations = {
    'en': {
        'authModalTitle': 'KERALA MIGRANT HEALTH ECOSYSTEM',
        'wizardTitle': '1-Minute Enrollment',
        'portalLogin': 'Portal Login',
        'wizardSubtitle': 'Generate ABHA & Digital Health Passport instantly',
        'authModalSubtitle': 'Access your ShramikCare digital dashboard',
        'tabWorker': 'Worker',
        'tabDoctor': 'Doctor',
        'tabAdmin': 'Admin',
        'tabRegister': 'Register',
        'inputWorkerMobileOrId': 'Mobile Number or KL-MIG ID',
        'inputWorkerMobilePlaceholder': 'Enter 10-digit mobile or ID...',
        'btnWorkerLogin': 'Access Health Passport',
        'demoQuickLogin': 'Demo Logins',
        'btnDemoRamesh': 'Ramesh Kumar',
        'btnDemoBikash': 'Bikash Mondal',
        'inputDoctorId': 'Doctor ID',
        'inputDoctorIdPlaceholder': 'Enter Doctor ID...',
        'inputKmcLicense': 'KMC License',
        'inputKmcPlaceholder': 'Enter KMC License...',
        'btnDoctorLogin': 'Secure Doctor Login',
        'btnDemoDoctor': 'Dr. Sarah (Aluva Hub)',
        'inputOfficerId': 'Officer ID',
        'inputOfficerIdPlaceholder': 'Enter Officer ID...',
        'inputAdminPin': '4-Digit Security PIN',
        'inputAdminPinPlaceholder': '••••',
        'btnAdminLogin': 'Access Admin Panel',
        'btnDemoAdmin': 'Nodal Officer Demo',
        'kioskGateTitle': 'Kiosk Security Gate',
        'kioskGateSubtitle': 'Enter camp kiosk PIN to proceed',
        'inputKioskPin': 'Kiosk PIN',
        'inputKioskPinPlaceholder': 'Enter PIN...',
        'btnUnlockKiosk': 'Unlock Kiosk',
        'btnQuickKioskDemo': 'Demo PIN (1234)'
    },
    'hi': {
        'authModalTitle': 'केरल प्रवासी स्वास्थ्य प्रणाली',
        'wizardTitle': '1-मिनट पंजीकरण',
        'portalLogin': 'पोर्टल लॉगिन',
        'wizardSubtitle': 'तुरंत ABHA और डिजिटल हेल्थ पासपोर्ट बनाएं',
        'authModalSubtitle': 'अपने ShramikCare डैशबोर्ड तक पहुंचें',
        'tabWorker': 'श्रमिक',
        'tabDoctor': 'डॉक्टर',
        'tabAdmin': 'एडमिन',
        'tabRegister': 'रजिस्टर',
        'inputWorkerMobileOrId': 'मोबाइल नंबर या KL-MIG आईडी',
        'inputWorkerMobilePlaceholder': '10 अंकों का मोबाइल या आईडी दर्ज करें...',
        'btnWorkerLogin': 'हेल्थ पासपोर्ट देखें',
        'demoQuickLogin': 'डेमो लॉगिन',
        'btnDemoRamesh': 'रमेश कुमार',
        'btnDemoBikash': 'बिकाश मोंडल',
        'inputDoctorId': 'डॉक्टर आईडी',
        'inputDoctorIdPlaceholder': 'डॉक्टर आईडी दर्ज करें...',
        'inputKmcLicense': 'KMC लाइसेंस',
        'inputKmcPlaceholder': 'KMC लाइसेंस दर्ज करें...',
        'btnDoctorLogin': 'सुरक्षित डॉक्टर लॉगिन',
        'btnDemoDoctor': 'डॉ. सारा (अलुवा हब)',
        'inputOfficerId': 'अधिकारी आईडी',
        'inputOfficerIdPlaceholder': 'अधिकारी आईडी दर्ज करें...',
        'inputAdminPin': '4-अंकीय सुरक्षा पिन',
        'inputAdminPinPlaceholder': '••••',
        'btnAdminLogin': 'एडमिन पैनल एक्सेस करें',
        'btnDemoAdmin': 'नोडल अधिकारी डेमो',
        'kioskGateTitle': 'कियोस्क सुरक्षा गेट',
        'kioskGateSubtitle': 'आगे बढ़ने के लिए कैंप कियोस्क पिन दर्ज करें',
        'inputKioskPin': 'कियोस्क पिन',
        'inputKioskPinPlaceholder': 'पिन दर्ज करें...',
        'btnUnlockKiosk': 'कियोस्क अनलॉक करें',
        'btnQuickKioskDemo': 'डेमो पिन (1234)'
    },
    'bn': {
        'authModalTitle': 'কেরালা প্রবাসী স্বাস্থ্য ইকোসিস্টেম',
        'wizardTitle': '১-মিনিট নিবন্ধন',
        'portalLogin': 'পোর্টাল লগইন',
        'wizardSubtitle': 'অবিলম্বে ABHA এবং ডিজিটাল হেলথ পাসপোর্ট তৈরি করুন',
        'authModalSubtitle': 'আপনার ShramikCare ড্যাশবোর্ডে অ্যাক্সেস করুন',
        'tabWorker': 'শ্রমিক',
        'tabDoctor': 'ডাক্তার',
        'tabAdmin': 'অ্যাডমিন',
        'tabRegister': 'নিবন্ধন',
        'inputWorkerMobileOrId': 'মোবাইল নম্বর বা KL-MIG আইডি',
        'inputWorkerMobilePlaceholder': '১০-সংখ্যার মোবাইল বা আইডি লিখুন...',
        'btnWorkerLogin': 'হেলথ পাসপোর্ট দেখুন',
        'demoQuickLogin': 'ডেমো লগইন',
        'btnDemoRamesh': 'রমেশ কুমার',
        'btnDemoBikash': 'বিকাশ মন্ডল',
        'inputDoctorId': 'ডাক্তার আইডি',
        'inputDoctorIdPlaceholder': 'ডাক্তার আইডি লিখুন...',
        'inputKmcLicense': 'KMC লাইসেন্স',
        'inputKmcPlaceholder': 'KMC লাইসেন্স লিখুন...',
        'btnDoctorLogin': 'নিরাপদ ডাক্তার লগইন',
        'btnDemoDoctor': 'ডাঃ সারাহ (আলুভা হাব)',
        'inputOfficerId': 'অফিসার আইডি',
        'inputOfficerIdPlaceholder': 'অফিসার আইডি লিখুন...',
        'inputAdminPin': '৪-ডিজিটের পিন',
        'inputAdminPinPlaceholder': '••••',
        'btnAdminLogin': 'অ্যাডমিন প্যানেল অ্যাক্সেস করুন',
        'btnDemoAdmin': 'নোডাল অফিসার ডেমো',
        'kioskGateTitle': 'কিওস্ক নিরাপত্তা গেট',
        'kioskGateSubtitle': 'এগিয়ে যেতে ক্যাম্প কিওস্ক পিন লিখুন',
        'inputKioskPin': 'কিওস্ক পিন',
        'inputKioskPinPlaceholder': 'পিন লিখুন...',
        'btnUnlockKiosk': 'কিওস্ক আনলক করুন',
        'btnQuickKioskDemo': 'ডেমো পিন (1234)'
    },
    'ml': {
        'authModalTitle': 'കേരള കുടിയേറ്റ ആരോഗ്യ ആവാസവ്യവസ്ഥ',
        'wizardTitle': '1-മിനിറ്റ് രജിസ്ട്രേഷൻ',
        'portalLogin': 'പോർട്ടൽ ലോഗിൻ',
        'wizardSubtitle': 'എബിഎച്ച്എയും ഡിജിറ്റൽ ഹെൽത്ത് പാസ്‌പോർട്ടും ഉടനടി സൃഷ്ടിക്കുക',
        'authModalSubtitle': 'നിങ്ങളുടെ ShramikCare ഡാഷ്‌ബോർഡ് ആക്‌സസ് ചെയ്യുക',
        'tabWorker': 'തൊഴിലാളി',
        'tabDoctor': 'ഡോക്ടർ',
        'tabAdmin': 'അഡ്മിൻ',
        'tabRegister': 'രജിസ്റ്റർ ചെയ്യുക',
        'inputWorkerMobileOrId': 'മൊബൈൽ നമ്പർ അല്ലെങ്കിൽ KL-MIG ഐഡി',
        'inputWorkerMobilePlaceholder': '10-അക്ക മൊബൈൽ അല്ലെങ്കിൽ ഐഡി നൽകുക...',
        'btnWorkerLogin': 'ഹെൽത്ത് പാസ്‌പോർട്ട് ആക്സസ് ചെയ്യുക',
        'demoQuickLogin': 'ഡെമോ ലോഗിനുകൾ',
        'btnDemoRamesh': 'രമേഷ് കുമാർ',
        'btnDemoBikash': 'ബികാഷ് മണ്ഡൽ',
        'inputDoctorId': 'ഡോക്ടർ ഐഡി',
        'inputDoctorIdPlaceholder': 'ഡോക്ടർ ഐഡി നൽകുക...',
        'inputKmcLicense': 'കെഎംസി ലൈസൻസ്',
        'inputKmcPlaceholder': 'കെഎംസി ലൈസൻസ് നൽകുക...',
        'btnDoctorLogin': 'സുരക്ഷിത ഡോക്ടർ ലോഗിൻ',
        'btnDemoDoctor': 'ഡോ. സാറ (ആലുവ ഹബ്)',
        'inputOfficerId': 'ഓഫീസർ ഐഡി',
        'inputOfficerIdPlaceholder': 'ഓഫീസർ ഐഡി നൽകുക...',
        'inputAdminPin': '4-അക്ക സെക്യൂരിറ്റി പിൻ',
        'inputAdminPinPlaceholder': '••••',
        'btnAdminLogin': 'അഡ്മിൻ പാനൽ ആക്സസ് ചെയ്യുക',
        'btnDemoAdmin': 'നോഡൽ ഓഫീസർ ഡെമോ',
        'kioskGateTitle': 'കിയോസ്ക് സെക്യൂരിറ്റി ഗേറ്റ്',
        'kioskGateSubtitle': 'തുടരുന്നതിന് ക്യാമ്പ് കിയോസ്ക് പിൻ നൽകുക',
        'inputKioskPin': 'കിയോസ്ക് പിൻ',
        'inputKioskPinPlaceholder': 'പിൻ നൽകുക...',
        'btnUnlockKiosk': 'കിയോസ്ക് അൺലോക്ക് ചെയ്യുക',
        'btnQuickKioskDemo': 'ഡെമോ പിൻ (1234)'
    }
}

import codecs
file_path = "src/pages/translations.js"
with codecs.open(file_path, "r", "utf-8") as f:
    content = f.read()

# We need to inject these new keys into the existing dictionaries in the JS file.
# The simplest way is to output a new JS file. Since we don't have a JS parser in python easily available,
# we'll use a regex to insert them.

for lang, keys in translations.items():
    insert_str = ""
    for k, v in keys.items():
        insert_str += f"    {k}: {json.dumps(v)},\n"
    
    # find where the language object starts: e.g. `en: {` or `  en: {`
    pattern = re.compile(r"(" + lang + r"\s*:\s*\{)")
    content = pattern.sub(r"\1\n" + insert_str, content)

with codecs.open(file_path, "w", "utf-8") as f:
    f.write(content)

print("Translations updated successfully.")
