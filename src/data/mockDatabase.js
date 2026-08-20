/**
 * ShramikCare - Mock Database (Phase 2 Upgrade)
 * Realistic dataset for Interstate Migrant Health Bridge (Kerala)
 */

export const INITIAL_WORKERS = [
  {
    id: "KL-MIG-78219",
    name: "Ramesh Kumar",
    nameNative: "रमेश कुमार",
    age: 28,
    gender: "Male",
    mobile: "9876543210",
    originState: "Bihar",
    originDistrict: "Muzaffarpur",
    district: "Ernakulam", // Standardized district key
    keralaDistrict: "Ernakulam",
    worksite: "Perumbavoor Plywood Cluster, Hub #4",
    occupation: "Wood Finishing & Veneer Processing",
    audioLanguage: "hi",
    bloodGroup: "B+",
    abhaId: "91-4820-1928-4410",
    awazCardNo: "AWZ-KL-2024-88190",
    isAwazLinked: true,
    awazCoverageLimit: 50000,
    awazUtilizedAmount: 7500,
    emergencyContact: {
      name: "Sanjay Kumar (Brother)",
      phone: "+91 94312 88410",
      relation: "Brother"
    },
    allergies: ["Penicillin / Amoxicillin", "Severe Dust & Silica"],
    conditions: ["Occupational Bronchitis (Mild)"],
    vaccinations: ["Covishield (2 doses + Booster)", "Tetanus (2024)"],
    vitals: {
      bp: "122/80 mmHg",
      bloodSugar: "98 mg/dL (Fasting)",
      pulse: "74 bpm",
      spO2: "99%",
      bmi: "22.4 (Normal)",
      lastUpdated: "12 Feb 2025"
    },
    lastCampCheckup: "12 Feb 2025 (Aluva Mobile Camp #2)",
    assignedFacility: "Perumbavoor Community Health Centre",
    registeredAt: "2024-11-15T09:30:00.000Z",
    qrCodeData: "SHRAMIKCARE://KL-MIG-78219/ABHA-91-4820-1928-4410/B-POS/ALLERGY-PENICILLIN"
  },
  {
    id: "KL-MIG-88412",
    name: "Bikash Mondal",
    nameNative: "বিকাশ মন্ডল",
    age: 34,
    gender: "Male",
    mobile: "9812345678",
    originState: "West Bengal",
    originDistrict: "Murshidabad",
    district: "Ernakulam",
    keralaDistrict: "Ernakulam",
    worksite: "Kaloor Kochi Metro Phase 2 Site",
    occupation: "Steel Fabrication & Rebar Tech",
    audioLanguage: "bn",
    bloodGroup: "O+",
    abhaId: "91-5512-8819-3301",
    awazCardNo: "AWZ-KL-2023-41299",
    isAwazLinked: true,
    awazCoverageLimit: 50000,
    awazUtilizedAmount: 12400,
    emergencyContact: {
      name: "Mousumi Mondal (Wife)",
      phone: "+91 98321 00192",
      relation: "Spouse"
    },
    allergies: ["Sulfa Antibiotics"],
    conditions: ["Type 2 Diabetes Mellitus (Under Metformin)"],
    vaccinations: ["Covaxin (2 doses)", "Tetanus (2024)"],
    vitals: {
      bp: "128/84 mmHg",
      bloodSugar: "138 mg/dL (Random)",
      pulse: "78 bpm",
      spO2: "98%",
      bmi: "24.1 (Normal)",
      lastUpdated: "04 Jan 2025"
    },
    lastCampCheckup: "04 Jan 2025 (Kaloor Night Outreach Camp)",
    assignedFacility: "Ernakulam General Hospital",
    registeredAt: "2024-08-20T14:15:00.000Z",
    qrCodeData: "SHRAMIKCARE://KL-MIG-88412/ABHA-91-5512-8819-3301/O-POS/DIABETES-T2"
  },
  {
    id: "KL-MIG-65120",
    name: "Mohammed Tariq",
    nameNative: "मोहम्मद तारिक़",
    age: 41,
    gender: "Male",
    mobile: "9745612300",
    originState: "Uttar Pradesh",
    originDistrict: "Gorakhpur",
    district: "Kollam",
    keralaDistrict: "Kollam",
    worksite: "Ayathil Cashew Processing Cluster",
    occupation: "Heavy Packaging & Loading",
    audioLanguage: "hi",
    bloodGroup: "A+",
    abhaId: "91-3341-9920-1188",
    awazCardNo: "AWZ-KL-2024-11048",
    isAwazLinked: false, // Unlinked to test Verification Gate
    awazCoverageLimit: 50000,
    awazUtilizedAmount: 0,
    emergencyContact: {
      name: "Zafar Ali (Cousin)",
      phone: "+91 95400 33218",
      relation: "Cousin"
    },
    allergies: ["None / Healthy Baseline"],
    conditions: ["Primary Hypertension (Stage 1)"],
    vaccinations: ["Covishield (2 doses)"],
    vitals: {
      bp: "135/88 mmHg",
      bloodSugar: "104 mg/dL (Fasting)",
      pulse: "80 bpm",
      spO2: "98%",
      bmi: "25.2 (Slightly Overweight)",
      lastUpdated: "28 Jan 2025"
    },
    lastCampCheckup: "28 Jan 2025 (Kollam Port Health Camp)",
    assignedFacility: "Kollam District Hospital",
    registeredAt: "2024-09-10T11:00:00.000Z",
    qrCodeData: "SHRAMIKCARE://KL-MIG-65120/ABHA-91-3341-9920-1188/A-POS/HYPERTENSION"
  }
];

export const INITIAL_DOCTORS = [
  {
    id: "DOC-ALUVA-01",
    name: "Dr. P.K. Thomas",
    nameMalayalam: "ഡോ. പി.കെ. തോമസ്",
    kmcLicense: "KMC-88214",
    facility: "Aluva Taluk Hospital & Camp Nodal Center",
    district: "Ernakulam",
    department: "General Medicine & Migrant Health",
    phone: "+91 94471 20011",
    email: "dr.pkthomas@health.kerala.gov.in",
    activeCampsManaged: 6,
    verifiedStatus: "KMC Verified Active",
    campsToday: "Perumbavoor Evening Triage Unit #2"
  },
  {
    id: "DOC-KOCHI-04",
    name: "Dr. Ananya Menon",
    nameMalayalam: "ഡോ. അനന്യ മേനോൻ",
    kmcLicense: "KMC-94301",
    facility: "Ernakulam General Hospital",
    district: "Ernakulam",
    department: "Community Medicine & Public Health",
    phone: "+91 98460 77142",
    email: "dr.ananya.menon@dhs.kerala.gov.in",
    activeCampsManaged: 4,
    verifiedStatus: "KMC Verified Active",
    campsToday: "Kaloor Metro Workers Night Camp"
  }
];

export const INITIAL_ADMIN = {
  id: "OFF-ERN-01",
  pin: "1234",
  name: "Shri. Rajesh V. IAS",
  designation: "District Labour & Health Nodal Officer",
  jurisdiction: "Ernakulam & Central Kerala Region",
  department: "Department of Labour and Skills, Govt. of Kerala",
  officeLocation: "Civil Station, Kakkanad, Kochi",
  accessLevel: "State Nodal Command",
  email: "nodal.ernakulam@labour.kerala.gov.in"
};

/**
 * Empanelled Kerala AWAZ & Govt Hospitals (Strictly Filtered by District)
 */
export const EMPANELLED_HOSPITALS = [
  // ERNAKULAM DISTRICT HOSPITALS
  {
    id: "HOSP-ERN-01",
    name: "Aluva Taluk Headquarters Hospital",
    nameMalayalam: "ആലുവ താലൂക്ക് ആശുപത്രി",
    district: "Ernakulam",
    type: "AWAZ Empanelled Govt Hub",
    distance: "1.8 km",
    address: "Bank Road, Near Railway Station, Aluva, Ernakulam - 683101",
    phone: "0484-2624020",
    emergencyPhone: "0484-2624021",
    cashlessAvailable: true,
    awazDesk: "Ground Floor Room 12 (Migrant Helpdesk)",
    departments: ["Emergency Triage", "General Medicine", "Pulmonology", "Orthopaedics", "24x7 Lab"],
    doctorInCharge: "Dr. P.K. Thomas (KMC-88214)",
    timings: "24x7 Emergency & AWAZ Desk",
    languagesSpoken: ["Hindi", "Bengali", "Malayalam", "English"]
  },
  {
    id: "HOSP-ERN-02",
    name: "Ernakulam General Hospital",
    nameMalayalam: "എറണാകുളം ജനറൽ ആശുപത്രി",
    district: "Ernakulam",
    type: "AWAZ Super Specialty Apex",
    distance: "4.2 km",
    address: "Hospital Road, Marine Drive, Kochi, Ernakulam - 682011",
    phone: "0484-2361251",
    emergencyPhone: "0484-2360055",
    cashlessAvailable: true,
    awazDesk: "Casualty Block Counter 4",
    departments: ["Cardiology", "Trauma Care", "Chest & TB Clinic", "Endocrinology", "Dialysis"],
    doctorInCharge: "Dr. Ananya Menon",
    timings: "24x7 Emergency & ICU",
    languagesSpoken: ["Hindi", "Bengali", "Odia", "Malayalam", "English"]
  },
  {
    id: "HOSP-ERN-03",
    name: "Perumbavoor Taluk Hospital",
    nameMalayalam: "പെരുമ്പാവൂർ താലൂക്ക് ആശുപത്രി",
    district: "Ernakulam",
    type: "AWAZ Migrant Health Special Outpost",
    distance: "2.1 km",
    address: "Main Central Road, Near KSRTC Stand, Perumbavoor - 683542",
    phone: "0484-2523244",
    emergencyPhone: "0484-2523245",
    cashlessAvailable: true,
    awazDesk: "Migrant Wellness Cell, Counter 2",
    departments: ["Occupational Health", "General Medicine", "Dermatology", "X-Ray"],
    doctorInCharge: "Dr. S. Radhakrishnan",
    timings: "24x7 Casualty & 08:00 AM - 08:00 PM OP",
    languagesSpoken: ["Hindi", "Bengali", "Assamese", "Malayalam"]
  },
  {
    id: "HOSP-ERN-04",
    name: "Govt. Medical College Kalamassery",
    nameMalayalam: "കളമശ്ശേരി ഗവ. മെഡിക്കൽ കോളേജ്",
    district: "Ernakulam",
    type: "AWAZ Tertiary Referral Centre",
    distance: "6.5 km",
    address: "HMT Colony, Kalamassery, Ernakulam - 683503",
    phone: "0484-2754000",
    emergencyPhone: "0484-2754444",
    cashlessAvailable: true,
    awazDesk: "Main Gate Kiosk & OP Block Counter 9",
    departments: ["Multi-Specialty ICU", "CT/MRI", "Surgical Emergency", "Burn Care"],
    doctorInCharge: "Dr. K. George",
    timings: "24x7 Level-1 Trauma Care",
    languagesSpoken: ["Hindi", "Bengali", "Odia", "Malayalam", "English"]
  },

  // KOZHIKODE DISTRICT HOSPITALS (For other workers)
  {
    id: "HOSP-KKD-01",
    name: "Kozhikode Beach Govt. General Hospital",
    nameMalayalam: "കോഴിക്കോട് ബീച്ച് ഗവ. ആശുപത്രി",
    district: "Kozhikode",
    type: "AWAZ Empanelled Centre",
    distance: "2.5 km",
    address: "Beach Road, Vellayil, Kozhikode - 673032",
    phone: "0495-2365431",
    emergencyPhone: "0495-2365432",
    cashlessAvailable: true,
    awazDesk: "Room 4 Migrant Desk",
    departments: ["General Medicine", "Emergency", "Pediatrics"],
    doctorInCharge: "Dr. M. Basheer",
    timings: "24x7",
    languagesSpoken: ["Hindi", "Bengali", "Malayalam"]
  },

  // KOLLAM DISTRICT HOSPITALS
  {
    id: "HOSP-KLM-01",
    name: "Kollam Victoria District Hospital",
    nameMalayalam: "കൊല്ലം വിക്ടോറിയ ജില്ലാ ആശുപത്രി",
    district: "Kollam",
    type: "AWAZ District Empanelled",
    distance: "1.9 km",
    address: "Hospital Road, Chinnakkada, Kollam - 691001",
    phone: "0474-2742055",
    emergencyPhone: "0474-2742056",
    cashlessAvailable: true,
    awazDesk: "AWAZ Facilitation Cell Counter 1",
    departments: ["Emergency Care", "General Medicine", "Chest Clinic"],
    doctorInCharge: "Dr. Jacob Varghese",
    timings: "24x7",
    languagesSpoken: ["Hindi", "Tamil", "Malayalam"]
  }
];

/**
 * Pradhan Mantri Bhartiya Jan Aushadhi Kendras (Strictly Filtered by District)
 */
export const JAN_AUSHADHI_KENDRAS = [
  // ERNAKULAM JAN AUSHADHI STORES
  {
    id: "JAK-ERN-01",
    name: "PM Jan Aushadhi Kendra - Perumbavoor",
    nameMalayalam: "ജൻ ഔഷധി കേന്ദ്രം - പെരുമ്പാവൂർ",
    district: "Ernakulam",
    distance: "0.8 km",
    address: "Shop No. 4, Municipal Complex, Private Bus Stand Road, Perumbavoor - 683542",
    phone: "+91 98471 33201",
    stockStatus: "98% Medicines In Stock",
    savingsAverage: "80% - 90% Cheaper",
    timings: "08:00 AM - 09:30 PM (All 7 Days)",
    popularGenerics: ["Paracetamol 650mg (₹0.80/tab)", "Amoxicillin+Clav (₹8/tab)", "Metformin 500mg (₹0.90/tab)", "Cetirizine 10mg (₹0.60/tab)"],
    googleMapsQuery: "Jan Aushadhi Kendra Perumbavoor"
  },
  {
    id: "JAK-ERN-02",
    name: "PM Jan Aushadhi Store - Aluva Railway Station",
    nameMalayalam: "ജൻ ഔഷധി സ്റ്റോർ - ആലുവ റെയിൽവേ സ്റ്റേഷൻ",
    district: "Ernakulam",
    distance: "1.4 km",
    address: "Near Post Office, Station Road, Aluva, Ernakulam - 683101",
    phone: "+91 94462 88190",
    stockStatus: "100% In Stock",
    savingsAverage: "85% Cheaper than Branded",
    timings: "07:30 AM - 10:00 PM (Daily)",
    popularGenerics: ["Azithromycin 500mg (₹12/tab)", "Pantoprazole 40mg (₹1.50/tab)", "Paracetamol 650mg (₹0.80/tab)"],
    googleMapsQuery: "Jan Aushadhi Store Aluva Station"
  },
  {
    id: "JAK-ERN-03",
    name: "PM Jan Aushadhi Kendra - Kaloor Metro Outpost",
    nameMalayalam: "ജൻ ഔഷധി കേന്ദ്രം - കലൂർ മെട്രോ",
    district: "Ernakulam",
    distance: "2.3 km",
    address: "Metro Pillar 584, Banerji Road, Kaloor, Kochi - 682017",
    phone: "+91 98950 44120",
    stockStatus: "In Stock",
    savingsAverage: "78% - 88% Discount",
    timings: "08:00 AM - 09:00 PM",
    popularGenerics: ["Metformin 500 (₹9/strip)", "Telmisartan 40 (₹14/strip)", "Multivitamins (₹18/strip)"],
    googleMapsQuery: "Jan Aushadhi Kaloor Metro"
  },
  {
    id: "JAK-ERN-04",
    name: "PM Jan Aushadhi Kendra - Kakkanad Civil Station",
    nameMalayalam: "ജൻ ഔഷധി കേന്ദ്രം - കാക്കനാട്",
    district: "Ernakulam",
    distance: "3.1 km",
    address: "Opposite Civil Station West Gate, Kakkanad - 682030",
    phone: "+91 94473 11099",
    stockStatus: "In Stock",
    savingsAverage: "82% Discount",
    timings: "08:30 AM - 08:30 PM",
    popularGenerics: ["Cough Syrups (₹22)", "Antibiotic Ointments (₹15)", "Pain Sprays (₹40)"],
    googleMapsQuery: "Jan Aushadhi Kakkanad"
  },

  // KOLLAM JAN AUSHADHI STORES
  {
    id: "JAK-KLM-01",
    name: "PM Jan Aushadhi Kendra - Chinnakkada Kollam",
    nameMalayalam: "ജൻ ഔഷധി കേന്ദ്രം - ചിന്നക്കട",
    district: "Kollam",
    distance: "1.1 km",
    address: "Near Clock Tower, Chinnakkada, Kollam - 691001",
    phone: "+91 94460 22119",
    stockStatus: "In Stock",
    savingsAverage: "85% Savings",
    timings: "08:00 AM - 09:00 PM",
    popularGenerics: ["Paracetamol 650mg", "Amlodipine 5mg", "Antacids"],
    googleMapsQuery: "Jan Aushadhi Chinnakkada"
  }
];

/**
 * Mock Prescriptions for Live AI Camera OCR Scanner Demo
 */
export const MOCK_PRESCRIPTION_SCANS = [
  {
    id: "RX-SCAN-01",
    title: "Viral Upper Respiratory Infection & Fever Rx",
    doctorName: "Dr. P.K. Thomas, MD (General Medicine)",
    hospitalName: "Aluva Taluk Headquarters Hospital",
    date: "Today, Morning OPD",
    diagnosis: "Acute Viral Pyrexia & Bronchial Irritation (Worksite Dust Exposure)",
    awazEligible: true,
    awazCoverageStatus: "100% Cashless Covered under Kerala AWAZ Scheme",
    doctorNotes: "Rest for 2 days. Drink boiled water. Collect free generic medicines from Jan Aushadhi / Hospital Pharmacy.",
    medicines: [
      {
        id: "MED-01",
        brandedName: "Dolo 650mg (Paracetamol)",
        genericName: "Paracetamol Tablet IP 650mg",
        dosage: "1 Tablet - Thrice Daily",
        timing: "After Food (सुबह ☀️, दोपहर 🌤️, रात 🌙)",
        timingSlot: "morning_noon_night",
        mealRelation: "after_meal",
        duration: "3 Days",
        brandedPrice: "₹34.00 (Strip of 15)",
        janAushadhiPrice: "₹11.20 (Strip of 15)",
        savings: "₹22.80 (67% Cheaper)",
        instructions: {
          en: "Take 1 tablet after food three times a day for fever.",
          hi: "बुखार के लिए दिन में 3 बार खाना खाने के बाद 1 गोली लें।",
          bn: "জ্বরের জন্য দিনে ৩ বার খাবার পর ১টি করে ট্যাবলেট খান।",
          ml: "പനിക്കായി ദിവസവും മൂന്ന് നേരം ഭക്ഷണത്തിന് ശേഷം 1 ഗുളിക കഴിക്കുക."
        }
      },
      {
        id: "MED-02",
        brandedName: "Augmentin 625 Duo",
        genericName: "Amoxicillin & Potassium Clavulanate 625mg",
        dosage: "1 Tablet - Twice Daily",
        timing: "After Food (Morning ☀️, Night 🌙)",
        timingSlot: "morning_night",
        mealRelation: "after_meal",
        duration: "5 Days",
        brandedPrice: "₹204.00 (Strip of 10)",
        janAushadhiPrice: "₹48.00 (Strip of 10)",
        savings: "₹156.00 (76% Cheaper)",
        instructions: {
          en: "Take 1 tablet after breakfast and 1 after dinner for infection.",
          hi: "संक्रमण के लिए सुबह नाश्ते के बाद और रात के खाने के बाद 1 गोली लें।",
          bn: "সংক্রমণের জন্য সকালে নাস্তার পর এবং রাতে খাবারের পর ১টি করে ট্যাবলেট খান।",
          ml: "അണുബാധയ്ക്ക് രാവിലെയും രാത്രിയും ഭക്ഷണത്തിന് ശേഷം 1 ഗുളിക കഴിക്കുക."
        }
      },
      {
        id: "MED-03",
        brandedName: "Allegra / Cetzine 10mg",
        genericName: "Cetirizine Hydrochloride 10mg",
        dosage: "1 Tablet - Night Only",
        timing: "Before Sleep with Water (Night 🌙)",
        timingSlot: "night_only",
        mealRelation: "before_sleep",
        duration: "5 Days",
        brandedPrice: "₹45.00 (Strip of 10)",
        janAushadhiPrice: "₹8.00 (Strip of 10)",
        savings: "₹37.00 (82% Cheaper)",
        instructions: {
          en: "Take 1 tablet at night before sleeping for allergy and cough.",
          hi: "एलर्जी और खांसी के लिए रात को सोने से पहले 1 गोली पानी के साथ लें।",
          bn: "অ্যালার্জি ও কাশির জন্য রাতে ঘুমানোর আগে ১টি ট্যাবলেট খান।",
          ml: "അലർജിക്കും ചുമയ്ക്കുമായി രാത്രി ഉറങ്ങുന്നതിന് മുൻപ് 1 ഗുളിക കഴിക്കുക."
        }
      }
    ],
    totalBrandedCost: "₹283.00",
    totalJanAushadhiCost: "₹67.20",
    totalSaved: "₹215.80 (76% Total Savings)"
  }
];

/**
 * Pill-Clock Schedule with Pictograms & Multi-lingual Speech Audio Text
 */
export const DAILY_PILL_SCHEDULE = [
  {
    id: "SLOT-MORNING",
    slotName: "Morning Dose",
    slotNative: {
      en: "Morning Dose (8:00 AM)",
      hi: "सुबह की खुराक (प्रातः 8:00 बजे)",
      bn: "সকালের ওষুধ (সকাল ৮:০০)",
      ml: "രാവിലത്തെ മരുന്ന് (രാവിലെ 8:00)"
    },
    icon: "☀️",
    time: "08:00 AM",
    mealIcon: "🍲",
    mealText: {
      en: "After Breakfast (Pet Bharke Khana)",
      hi: "नाश्ता या खाना खाने के बाद",
      bn: "সকালের খাবার খাওয়ার পর",
      ml: "പ്രഭാതഭക്ഷണത്തിന് ശേഷം"
    },
    waterIcon: "🥛",
    waterText: "1 Glass Water",
    color: "from-amber-500/20 to-teal-500/10 border-amber-400/40 text-amber-950",
    badgeColor: "bg-amber-500 text-slate-950 font-black",
    medicines: [
      {
        name: "Paracetamol 650mg",
        type: "Fever / Body Pain",
        dose: "1 Tablet",
        pillColor: "bg-emerald-500",
        instruction: "After Food 🍲"
      },
      {
        name: "Amoxicillin 625mg",
        type: "Antibiotic",
        dose: "1 Tablet",
        pillColor: "bg-blue-500",
        instruction: "After Food 🍲"
      }
    ],
    audioScript: {
      en: "Good morning! Please take one Paracetamol tablet and one Amoxicillin tablet after eating your breakfast with a full glass of water.",
      hi: "शुभ प्रभात! कृपया नाश्ता करने के बाद एक पैरासिटामोल और एक अमोक्सिसिलिन गोली पूरे एक गिलास पानी के साथ लें।",
      bn: "সুপ্রভাত! সকালের খাবার খাওয়ার পর একটি প্যারাসিটামল এবং একটি অ্যামোক্সিসিলিন ট্যাবলেট এক গ্লাস জল দিয়ে খান।",
      ml: "സുപ്രഭാതം! പ്രഭാതഭക്ഷണത്തിന് ശേഷം ഒരു പാരാസിറ്റമോൾ ഗുളികയും ഒരു അമോക്സിസിലിൻ ഗുളികയും ഒരു ഗ്ലാസ് വെള്ളത്തോടൊപ്പം കഴിക്കുക."
    }
  },
  {
    id: "SLOT-NOON",
    slotName: "Afternoon Dose",
    slotNative: {
      en: "Afternoon Dose (1:30 PM)",
      hi: "दोपहर की खुराक (दोपहर 1:30 बजे)",
      bn: "দুপুরের ওষুধ (দুপুর ১:৩০)",
      ml: "ഉച്ചയ്ക്കത്തെ മരുന്ന് (ഉച്ചയ്ക്ക് 1:30)"
    },
    icon: "🌤️",
    time: "01:30 PM",
    mealIcon: "🍲",
    mealText: {
      en: "After Lunch",
      hi: "दोपहर के भोजन के बाद",
      bn: "দুপুরের খাবারের পর",
      ml: "ഉച്ചഭക്ഷണത്തിന് ശേഷം"
    },
    waterIcon: "🥛",
    waterText: "1 Glass Water",
    color: "from-teal-500/20 to-emerald-500/10 border-teal-400/40 text-teal-950",
    badgeColor: "bg-teal-700 text-white font-bold",
    medicines: [
      {
        name: "Paracetamol 650mg",
        type: "Fever / Pain",
        dose: "1 Tablet",
        pillColor: "bg-emerald-500",
        instruction: "After Lunch 🍲"
      }
    ],
    audioScript: {
      en: "Afternoon reminder: Please take one Paracetamol tablet after your lunch with water.",
      hi: "दोपहर का रिमाइंडर: कृपया दोपहर का खाना खाने के बाद एक पैरासिटामोल गोली पानी के साथ लें।",
      bn: "দুপুরের ওষুধ: দুপুরের খাবারের পর একটি প্যারাসিটামল ট্যাবলেট জল দিয়ে খান।",
      ml: "ഉച്ചയ്ക്കത്തെ ഓർമ്മപ്പെടുത്തൽ: ഉച്ചഭക്ഷണത്തിന് ശേഷം ഒരു പാരാസിറ്റമോൾ ഗുളിക വെള്ളത്തോടൊപ്പം കഴിക്കുക."
    }
  },
  {
    id: "SLOT-NIGHT",
    slotName: "Night Dose",
    slotNative: {
      en: "Night Dose (9:00 PM)",
      hi: "रात की खुराक (रात 9:00 बजे)",
      bn: "রাতের ওষুধ (রাত ৯:০০)",
      ml: "രാത്രിയിലെ മരുന്ന് (രാത്രി 9:00)"
    },
    icon: "🌙",
    time: "09:00 PM",
    mealIcon: "🥛",
    mealText: {
      en: "Before Sleeping with Water",
      hi: "सोने से पहले पानी के साथ",
      bn: "ঘুমানোর আগে জলের সাথে",
      ml: "ഉറങ്ങുന്നതിന് മുൻപ് വെള്ളത്തോടൊപ്പം"
    },
    waterIcon: "🥛",
    waterText: "Full Glass Water",
    color: "from-indigo-500/20 to-slate-800/10 border-indigo-400/40 text-indigo-950",
    badgeColor: "bg-indigo-700 text-white font-bold",
    medicines: [
      {
        name: "Amoxicillin 625mg",
        type: "Antibiotic",
        dose: "1 Tablet",
        pillColor: "bg-blue-500",
        instruction: "After Dinner 🍲"
      },
      {
        name: "Cetirizine 10mg",
        type: "Cough & Allergy",
        dose: "1 Tablet",
        pillColor: "bg-purple-500",
        instruction: "Before Sleep 🌙"
      }
    ],
    audioScript: {
      en: "Night dose reminder: After dinner, take your Amoxicillin tablet. Then before sleeping, take your Cetirizine allergy tablet with water. Sleep well!",
      hi: "रात की खुराक: रात के खाने के बाद अमोक्सिसिलिन गोली लें, और सोने से पहले सिटिरिज़िन गोली पानी के साथ लें। शुभ रात्रि!",
      bn: "রাতের ওষুধ: রাতের খাবারের পর অ্যামোক্সিসিলিন খান এবং ঘুমানোর আগে সিট্রিজিন ট্যাবলেট জল দিয়ে খান। শুভ রাত্রি!",
      ml: "രാത്രിയിലെ മരുന്ന്: അത്താഴത്തിന് ശേഷം അമോക്സിസിലിൻ കഴിക്കുക. ഉറങ്ങുന്നതിന് മുൻപ് സെറ്റിറിസിൻ ഗുളിക വെള്ളത്തോടൊപ്പം കഴിക്കുക. ശുഭരാത്രി!"
    }
  }
];

/**
 * Kerala Government Migrant Welfare Schemes
 */
export const KERALA_GOVT_SCHEMES = [
  {
    id: "SCHEME-AWAZ",
    title: "AWAZ Health & Accidental Insurance Scheme",
    titleMalayalam: "ആവാസ് ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതി",
    department: "Department of Labour and Skills, Govt. of Kerala",
    badge: "100% Free for Guest Workers",
    healthCover: "₹50,000 / Year Cashless Treatment",
    accidentalCover: "₹2,00,000 Death / Disability Relief",
    eligibility: "Any registered interstate migrant worker in Kerala aged 18-60",
    howToApply: "Auto-linked via ShramikCare or at District Labour Office",
    helpline: "1800-425-1147",
    color: "from-teal-700 to-emerald-900",
    status: "Active & Enrolled"
  },
  {
    id: "SCHEME-KASP",
    title: "Karunya Arogya Suraksha Padhathi (KASP)",
    titleMalayalam: "കാരുണ്യ ആരോഗ്യ സുരക്ഷാ പദ്ധതി",
    department: "Health & Family Welfare Dept., Kerala",
    badge: "Secondary & Tertiary Care",
    healthCover: "Up to ₹5,00,000 / Family",
    accidentalCover: "Surgical & Hospitalization Support",
    eligibility: "Migrant families under Kerala Arogya Suraksha register",
    howToApply: "Apply with Ration / Aadhaar card at Taluk Hospital Kiosk",
    helpline: "1056 (DISHA)",
    color: "from-amber-600 to-amber-900",
    status: "Eligible (Requires Aadhaar Link)"
  },
  {
    id: "SCHEME-ESHRAM",
    title: "e-Shram National Database for Unorganised Workers",
    titleMalayalam: "ഇ-ശ്രം ദേശീയ രജിസ്ട്രേഷൻ",
    department: "Ministry of Labour & Employment x Kerala Labour",
    badge: "Central + State Linked",
    healthCover: "Accidental Insurance ₹2 Lakh (PMSBY)",
    accidentalCover: "National Portability across all States",
    eligibility: "All unorganised and construction workers",
    howToApply: "Instant digital integration in ShramikCare",
    helpline: "14434",
    color: "from-indigo-700 to-slate-900",
    status: "Linked with UAN"
  },
  {
    id: "SCHEME-KWWF",
    title: "Kerala Migrant Workers Welfare Scheme (KWWF)",
    titleMalayalam: "കേരള അന്തർസംസ്ഥാന തൊഴിലാളി ക്ഷേമനിധി",
    department: "Kerala Building & Other Construction Workers Board",
    badge: "Disability, Education & Maternity Aid",
    healthCover: "Medical Allowance & Annual Health Checkups",
    accidentalCover: "Maternity Aid ₹15,000 • Education Grants",
    eligibility: "Workers contributing ₹50/year to welfare board",
    howToApply: "Via Camp Registration Desk",
    helpline: "0471-2462211",
    color: "from-emerald-700 to-teal-950",
    status: "Available at Camp"
  }
];

export const MOCK_METRICS = {
  registeredWorkers: 35240,
  registeredGrowth: "↗ 12% This Month",
  activeHealthCamps: 48,
  highRiskZones: "⚠ 3 High-Risk Zones",
  awazClaimsSettled: "₹1.42 Cr",
  awazSettlementRate: "✓ 100% Cashless",
  activeDoctors: 124,
  abhaPassportsGenerated: 34105,
  teleTriageConsultations: 8940
};

export const KERALA_DISTRICTS = [
  "Ernakulam",
  "Thiruvananthapuram",
  "Kozhikode",
  "Kannur",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kollam",
  "Alappuzha",
  "Kottayam",
  "Pathanamthitta",
  "Idukki",
  "Wayanad",
  "Kasaragod"
];

export const ORIGIN_STATES = [
  "Bihar",
  "West Bengal",
  "Uttar Pradesh",
  "Odisha",
  "Assam",
  "Jharkhand",
  "Rajasthan",
  "Tamil Nadu",
  "Chhattisgarh",
  "Madhya Pradesh",
  "Other"
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const COMMON_ALLERGIES = [
  "Penicillin / Amoxicillin",
  "Sulfa Antibiotics",
  "NSAIDs (Aspirin / Ibuprofen)",
  "Severe Dust & Silica",
  "Latex",
  "No Known Drug Allergies (NKDA)"
];

export const COMMON_CONDITIONS = [
  "Type 2 Diabetes",
  "Hypertension (High BP)",
  "Asthma / Occupational Bronchitis",
  "Past History of Tuberculosis (TB)",
  "Skin Dermatitis / Eczema",
  "None / Healthy Baseline"
];

export const ACTIVE_CAMPS_LIST = [
  {
    id: "CAMP-PBV-01",
    name: "Perumbavoor Plywood Corridor Mega Camp",
    district: "Ernakulam",
    time: "Today, 05:30 PM - 09:30 PM",
    venue: "Bhai Camp Ground, Kandanthara",
    doctorInCharge: "Dr. P.K. Thomas",
    expectedTurnout: 350,
    services: ["Screening", "Blood Sugar", "ABHA Generation", "AWAZ Seeding"],
    riskStatus: "High Risk (Dust & Silica Exposure)"
  },
  {
    id: "CAMP-KL-02",
    name: "Kaloor Metro Workers Health Outpost",
    district: "Ernakulam",
    time: "Today, 07:00 PM - 10:30 PM",
    venue: "Kaloor Stadium Transit Yard",
    doctorInCharge: "Dr. Ananya Menon",
    expectedTurnout: 220,
    services: ["Tetanus Booster", "General Triage", "Multilingual Tele-Consult"],
    riskStatus: "Normal"
  },
  {
    id: "CAMP-ALV-03",
    name: "Aluva Industrial Workers Medical Camp",
    district: "Ernakulam",
    time: "Tomorrow, 09:00 AM - 01:00 PM",
    venue: "Aluva Market Community Hall",
    doctorInCharge: "Dr. K. S. Nambiar",
    expectedTurnout: 400,
    services: ["Chest X-Ray Mobile Van", "ECG", "Vitals Baseline"],
    riskStatus: "Moderate"
  }
];
