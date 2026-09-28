export interface SlideData {
  id: number;
  category: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  layoutType: 'title' | 'split-comparison' | 'six-pillars' | 'benefits-grid' | 'jam-trinity' | 'data-milestone' | 'guidelines-flow' | 'summary';
  keyPoints: {
    heading: string;
    detail: string;
    metric?: string;
  }[];
  highlightStat?: {
    value: string;
    label: string;
    subtext: string;
  };
  comparisonTable?: {
    dimension: string;
    phase1: string;
    phase2: string;
  }[];
  speakerNotes: string;
  vivaTip: string;
  sourceRef: string;
}

export interface VideoChapter {
  id: number;
  chapterCode: string;
  title: string;
  hindiTitle: string;
  durationSec: number;
  timestampRange: string;
  sceneType: 'genesis' | 'pillars' | 'rupay_od' | 'jam_trinity' | 'decadal_growth' | 'guidelines_kyc';
  narrationEn: string;
  narrationHi: string;
  onScreenText: string[];
  keyFigure: {
    number: string;
    caption: string;
  };
  storyboardCue: {
    visual: string;
    lowerThird: string;
    bRollSuggestion: string;
  };
}

export interface GuidelineItem {
  id: string;
  code: string;
  category: 'Account Opening & KYC' | 'Overdraft (OD) Rules' | 'RuPay Insurance' | 'Bank Mitra & Last Mile';
  title: string;
  authority: string;
  summary: string;
  mandatoryRequirements: string[];
  exceptionsOrRelaxations: string;
  officialReference: string;
}

export const KEY_NATIONAL_STATS = [
  {
    id: 'total-accounts',
    metric: '53.13 Cr+',
    rawValue: 53.13,
    label: 'Total PMJDY Accounts',
    sublabel: 'Opened across Rural & Urban India (2014–2024+)',
    accent: 'terracotta'
  },
  {
    id: 'women-accounts',
    metric: '29.56 Cr',
    rawValue: 55.6,
    label: '55.6% Women Beneficiaries',
    sublabel: 'Empowering Nari Shakti via Direct Benefit Transfers',
    accent: 'emerald'
  },
  {
    id: 'total-deposits',
    metric: '₹2,31,236 Cr',
    rawValue: 231236,
    label: 'Aggregate Deposit Balance',
    sublabel: '66.6% accounts anchored in Rural & Semi-Urban centres',
    accent: 'navy'
  },
  {
    id: 'rupay-cards',
    metric: '36.14 Cr+',
    rawValue: 36.14,
    label: 'RuPay Debit Cards Issued',
    sublabel: 'Includes ₹2 Lakh free Accidental Insurance cover',
    accent: 'terracotta'
  }
];

export const DECADAL_GROWTH_DATA = [
  { year: 'Mar 2015', accountsCr: 14.72, depositsCr: 15670, rupayCr: 13.14, avgDepositRs: 1065 },
  { year: 'Mar 2016', accountsCr: 21.43, depositsCr: 35672, rupayCr: 17.75, avgDepositRs: 1665 },
  { year: 'Mar 2017', accountsCr: 28.17, depositsCr: 62972, rupayCr: 21.99, avgDepositRs: 2235 },
  { year: 'Mar 2018', accountsCr: 31.44, depositsCr: 78494, rupayCr: 23.65, avgDepositRs: 2497 },
  { year: 'Mar 2019', accountsCr: 35.27, depositsCr: 96107, rupayCr: 27.91, avgDepositRs: 2725 },
  { year: 'Mar 2020', accountsCr: 38.33, depositsCr: 118434, rupayCr: 29.30, avgDepositRs: 3090 },
  { year: 'Mar 2021', accountsCr: 42.20, depositsCr: 145551, rupayCr: 30.90, avgDepositRs: 3449 },
  { year: 'Mar 2022', accountsCr: 45.06, depositsCr: 166459, rupayCr: 31.62, avgDepositRs: 3694 },
  { year: 'Mar 2023', accountsCr: 48.65, depositsCr: 198844, rupayCr: 32.94, avgDepositRs: 4087 },
  { year: 'Aug 2024', accountsCr: 53.13, depositsCr: 231236, rupayCr: 36.14, avgDepositRs: 4352 }
];

export const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 1,
    chapterCode: 'CH-01',
    title: 'The Genesis & National Mission (2014)',
    hindiTitle: 'अध्याय १: जन धन योजना का शुभारंभ और संकल्प',
    durationSec: 18,
    timestampRange: '00:00 – 00:18',
    sceneType: 'genesis',
    narrationEn:
      'Announced from the ramparts of the Red Fort on August 15, 2014, and formally launched on August 28, 2014, Pradhan Mantri Jan Dhan Yojana became the world’s largest financial inclusion initiative. Guided by the motto "Mera Khata, Bhagya Vidhata", it set a Guinness World Record by opening 1.8 Crore bank accounts in its very first week.',
    narrationHi:
      '१५ अगस्त २०१४ को लाल किले की प्राचीर से घोषित और २८ अगस्त २०१४ को प्रारंभ की गई प्रधानमंत्री जन धन योजना विश्व की सबसे बड़ी वित्तीय समावेशन पहल है। "मेरा खाता, भाग्य विधाता" के आदर्श वाक्य के साथ, इसने पहले ही सप्ताह में १.८ करोड़ बैंक खाते खोलकर गिनीज वर्ल्ड रिकॉर्ड बनाया।',
    onScreenText: [
      'ANNOUNCED: 15 AUGUST 2014 | LAUNCHED: 28 AUGUST 2014',
      'NATIONAL MOTTO: "MERA KHATA — BHAGYA VIDHATA"',
      'GUINNESS WORLD RECORD: 1,80,96,130 ACCOUNTS IN WEEK 1'
    ],
    keyFigure: {
      number: '28 Aug 2014',
      caption: 'Historic Launch Day across 77,852 camps nationwide'
    },
    storyboardCue: {
      visual: 'Archival timeline transition from unbanked rural households to formal banking counters with national emblem motif.',
      lowerThird: 'PMJDY: National Mission for Financial Inclusion (Ministry of Finance)',
      bRollSuggestion: 'Show launch ceremony visuals, rural Bank Mitra camp, and Guinness World Record certificate callout.'
    }
  },
  {
    id: 2,
    chapterCode: 'CH-02',
    title: 'The 6 Strategic Pillars of PMJDY',
    hindiTitle: 'अध्याय २: वित्तीय समावेशन के ६ मुख्य स्तंभ',
    durationSec: 20,
    timestampRange: '00:18 – 00:38',
    sceneType: 'pillars',
    narrationEn:
      'PMJDY rests on six architectural pillars across two phases. Phase One ensured universal access to banking through Sub-Service Areas and Bank Mitras, Basic Savings Bank Deposit accounts with overdraft, and Financial Literacy programs. Phase Two expanded into Credit Guarantee Funds, Micro-Insurance under PMJJBY and PMSBY, and unorganized sector pension schemes like Atal Pension Yojana.',
    narrationHi:
      'यह योजना छह मुख्य स्तंभों पर आधारित है। पहले चरण में बैंकिंग सुविधाओं तक सार्वभौमिक पहुंच, ओवरड्राफ्ट के साथ बेसिक बचत खाता, और वित्तीय साक्षरता शामिल थी। दूसरे चरण में क्रेडिट गारंटी फंड, सूक्ष्म बीमा और अटल पेंशन योजना जैसी सामाजिक सुरक्षा योजनाओं को जोड़ा गया।',
    onScreenText: [
      'PILLAR 1–3: UNIVERSAL ACCESS • ZERO-BALANCE BSBD + OD • FINANCIAL LITERACY',
      'PILLAR 4–6: CREDIT GUARANTEE • MICRO-INSURANCE (PMJJBY/PMSBY) • PENSION (APY)',
      'SHIFT IN 2018: FROM "EVERY HOUSEHOLD" TO "EVERY UNBANKED ADULT"'
    ],
    keyFigure: {
      number: '6 Pillars',
      caption: 'Integrated Banking + Credit + Insurance + Pension Architecture'
    },
    storyboardCue: {
      visual: 'Architectural 6-column blueprint illuminating Phase I (2014–2018) and Phase II (Post-2018) pillars sequentially.',
      lowerThird: 'Six Pillars of Universal Financial Inclusion',
      bRollSuggestion: 'Animate 6 pillars rising on screen with icons for Banking, Overdraft, Literacy, Guarantee, Insurance, and Pension.'
    }
  },
  {
    id: 3,
    chapterCode: 'CH-03',
    title: 'Zero-Balance BSBD Account, RuPay & ₹10,000 Overdraft',
    hindiTitle: 'अध्याय ३: शून्य बैलेंस खाता, रूपे कार्ड और ₹१०,००० ओवरड्राफ्ट',
    durationSec: 20,
    timestampRange: '00:38 – 00:58',
    sceneType: 'rupay_od',
    narrationEn:
      'Every PMJDY account is a Basic Savings Bank Deposit account requiring zero minimum balance. Account holders receive a free indigenous RuPay Debit Card carrying accidental insurance cover of up to 2 Lakh rupees for accounts opened after August 28, 2018. After six months of satisfactory operation, eligible adult beneficiaries can avail an Overdraft credit facility of up to 10,000 rupees.',
    narrationHi:
      'प्रत्येक जन धन खाता शून्य न्यूनतम बैलेंस वाला बेसिक सेविंग्स बैंक डिपॉजिट खाता है। खाताधारकों को निःशुल्क स्वदेशी रूपे डेबिट कार्ड मिलता है जिसमें २ लाख रुपये तक का दुर्घटना बीमा कवर शामिल है। ६ महीने के संतोषजनक संचालन के बाद ₹१०,००० तक की ओवरड्राफ्ट सुविधा भी मिलती है।',
    onScreenText: [
      '₹0 MINIMUM BALANCE REQUIREMENT (BSBD NORMS)',
      '₹2,00,000 ACCIDENTAL INSURANCE COVER ON RUPAY CARD',
      '₹10,000 OVERDRAFT FACILITY (₹2,000 WITHOUT CONDITIONS)'
    ],
    keyFigure: {
      number: '₹2,00,000',
      caption: 'Free RuPay Accidental Insurance Cover (Doubled from ₹1L in 2018)'
    },
    storyboardCue: {
      visual: 'Interactive anatomy of a PMJDY Passbook and RuPay Debit Card highlighting zero-balance, insurance shield, and ₹10,000 credit lifeline.',
      lowerThird: 'Core Entitlements: Savings, Credit & Social Security',
      bRollSuggestion: 'Close-up graphic of RuPay card swipe at Micro-ATM and passbook update.'
    }
  },
  {
    id: 4,
    chapterCode: 'CH-04',
    title: 'The JAM Trinity & Direct Benefit Transfer (DBT)',
    hindiTitle: 'अध्याय ४: जैम ट्रिनिटी (जन धन - आधार - मोबाइल) और डीबीटी क्रांति',
    durationSec: 18,
    timestampRange: '00:58 – 01:16',
    sceneType: 'jam_trinity',
    narrationEn:
      'By linking Jan Dhan bank accounts with Aadhaar biometric identity and Mobile connectivity—known globally as the JAM Trinity—India eliminated middlemen from welfare delivery. Over 300 central and state schemes, from PM-KISAN to LPG PAHAL and MGNREGA wages, transfer funds directly into citizen accounts with zero leakage.',
    narrationHi:
      'जन धन खातों को आधार और मोबाइल से जोड़कर भारत ने "जैम ट्रिनिटी" का निर्माण किया। इससे बिचौलियों की भूमिका समाप्त हो गई और पीएम-किसान, मनरेगा तथा एलपीजी सब्सिडी जैसी ३०० से अधिक योजनाओं का पैसा सीधे लाभार्थियों के बैंक खाते में पहुँचता है।',
    onScreenText: [
      'J = JAN DHAN ACCOUNT • A = AADHAAR IDENTITY • M = MOBILE ACCESS',
      '100% DIRECT BENEFIT TRANSFER (DBT) WITH ZERO LEAKAGE',
      'BACKBONE OF DIGITAL PUBLIC INFRASTRUCTURE & UPI ADOPTION'
    ],
    keyFigure: {
      number: 'JAM Trinity',
      caption: 'World-renowned Digital Public Infrastructure for direct welfare delivery'
    },
    storyboardCue: {
      visual: 'Three interlocking nodes (Jan Dhan + Aadhaar + Mobile) converging into an instant Direct Benefit Transfer pipeline.',
      lowerThird: 'The JAM Trinity: Plugging Welfare Leakages',
      bRollSuggestion: 'Flowchart animation showing Treasury -> NPCI Aadhaar Payment Bridge -> Beneficiary PMJDY Account.'
    }
  },
  {
    id: 5,
    chapterCode: 'CH-05',
    title: '10 Years of Impact: 53+ Crore Accounts & Nari Shakti',
    hindiTitle: 'अध्याय ५: १० वर्षों की ऐतिहासिक उपलब्धि और नारी सशक्तिकरण',
    durationSec: 20,
    timestampRange: '01:16 – 01:36',
    sceneType: 'decadal_growth',
    narrationEn:
      'In one decade, PMJDY grew 3.6 times from 14.72 Crore accounts in 2015 to over 53.13 Crore accounts by 2024. Remarkably, 55.6 percent—nearly 30 Crore account holders—are women, and 66.6 percent reside in rural and semi-urban India. Aggregate deposits have crossed 2.31 Lakh Crore rupees, proving that poor households actively save and participate in formal finance.',
    narrationHi:
      'दस वर्षों में जन धन खातों की संख्या २०१५ के १४.७२ करोड़ से बढ़कर ५३.१३ करोड़ से अधिक हो गई है। इनमें ५५.६ प्रतिशत (लगभग ३० करोड़) महिला खाताधारक हैं और ६६.६ प्रतिशत खाते ग्रामीण व अर्ध-शहरी क्षेत्रों में हैं। कुल जमा राशि ₹२.३१ लाख करोड़ को पार कर चुकी है।',
    onScreenText: [
      '53.13 CRORE+ TOTAL ACCOUNTS (3.6x GROWTH IN 10 YEARS)',
      '55.6% WOMEN BENEFICIARIES (29.56 CRORE NARI SHAKTI ACCOUNTS)',
      '₹2,31,236 CRORE TOTAL DEPOSITS (AVG ₹4,352 PER ACCOUNT)'
    ],
    keyFigure: {
      number: '55.6% Women',
      caption: '29.56 Crore women brought into formal financial decision-making'
    },
    storyboardCue: {
      visual: 'Animated bar and area chart tracing 2015 to 2024 growth in accounts and deposits alongside Rural/Urban and Gender breakdown.',
      lowerThird: 'Decadal Impact Report (2014–2024+)',
      bRollSuggestion: 'Highlight the jump in average deposit per account from ₹1,065 (2015) to ₹4,352 (2024).'
    }
  },
  {
    id: 6,
    chapterCode: 'CH-06',
    title: 'Official Guidelines, Eligibility & KYC Procedure',
    hindiTitle: 'अध्याय ६: आधिकारिक दिशानिर्देश, पात्रता और खाता खोलने की प्रक्रिया',
    durationSec: 18,
    timestampRange: '01:36 – 01:54',
    sceneType: 'guidelines_kyc',
    narrationEn:
      'Under Reserve Bank of India and Ministry of Finance guidelines, any Indian citizen aged 10 years or above without an existing bank account can open a PMJDY account at any bank branch or Bank Mitra outlet. Even citizens without official KYC documents can open a "Chhota Khata" or Small Account by submitting a self-attested photograph and signature or thumbprint before a bank official.',
    narrationHi:
      'भारतीय रिजर्व बैंक और वित्त मंत्रालय के दिशानिर्देशों के अनुसार, १० वर्ष या उससे अधिक आयु का कोई भी भारतीय नागरिक किसी भी बैंक शाखा या बैंक मित्र केंद्र पर खाता खोल सकता है। यदि किसी के पास कोई आधिकारिक दस्तावेज नहीं है, तो भी वह स्व-सत्यापित फोटो देकर "छोटा खाता" खुलवा सकता है।',
    onScreenText: [
      'ELIGIBILITY: ANY INDIAN CITIZEN AGED 10+ YEARS',
      'DOCUMENTATION: AADHAAR e-KYC OR OFFICIALLY VALID DOCUMENT (OVD)',
      'NO DOCUMENTS? OPEN A "CHHOTA KHATA" (SMALL ACCOUNT FOR 12 MONTHS)'
    ],
    keyFigure: {
      number: '10+ Years',
      caption: 'Minimum eligible age; zero-document Small Account option available'
    },
    storyboardCue: {
      visual: 'Step-by-step KYC decision tree: Aadhaar Biometric e-KYC -> OVD Verification -> Chhota Khata relaxation.',
      lowerThird: 'RBI & DFS Official Account Opening Guidelines',
      bRollSuggestion: 'Conclude with National Toll-Free Helpline numbers (1800-11-0001 / 1800-180-1111) and official website pmjdy.gov.in.'
    }
  }
];

export const PPT_SLIDES: SlideData[] = [
  {
    id: 1,
    category: 'SLIDE 01 • TITLE & OVERVIEW',
    title: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    hindiTitle: 'प्रधानमंत्री जन धन योजना — "मेरा खाता, भाग्य विधाता"',
    subtitle: 'National Mission for Financial Inclusion: Architecture, Decadal Impact (2014–2024+), and Official RBI/DFS Guidelines',
    layoutType: 'title',
    keyPoints: [
      {
        heading: 'Core Objective',
        detail: 'Ensure universal access to formal banking, basic savings & deposit accounts, remittance, credit, insurance, and pension in an affordable manner.',
        metric: '100% Inclusion'
      },
      {
        heading: 'Administrative Ministry',
        detail: 'Department of Financial Services (DFS), Ministry of Finance, Government of India, in coordination with Reserve Bank of India (RBI) & NPCI.',
        metric: 'MoF / DFS'
      },
      {
        heading: 'National Motto',
        detail: '“Mera Khata, Bhagya Vidhata” (My Account, Maker of Destiny) — transforming unbanked citizens into active stakeholders in the formal economy.',
        metric: '28 Aug 2014'
      }
    ],
    highlightStat: {
      value: '53.13 Cr+',
      label: 'Beneficiaries Banked',
      subtext: 'World’s Largest Financial Inclusion Mission'
    },
    speakerNotes:
      'Good morning/afternoon everyone. Today’s presentation examines Pradhan Mantri Jan Dhan Yojana (PMJDY), India’s flagship National Mission for Financial Inclusion launched on 28 August 2014. We will cover its 6-pillar policy design, the transition from PMJDY 1.0 to 2.0, decadal impact data crossing 53.13 Crore accounts, and official RBI/Ministry of Finance operational guidelines.',
    vivaTip:
      'If asked who administers PMJDY: Answer "Department of Financial Services (DFS), Ministry of Finance, Government of India" with regulatory norms under RBI’s Basic Savings Bank Deposit (BSBD) guidelines.',
    sourceRef: 'Department of Financial Services (DFS), Ministry of Finance — pmjdy.gov.in'
  },
  {
    id: 2,
    category: 'SLIDE 02 • PROBLEM STATEMENT & CONTEXT',
    title: 'Why India Needed PMJDY: Pre-2014 Financial Exclusion',
    hindiTitle: 'पृष्ठभूमि: २०१४ से पूर्व वित्तीय बहिष्करण की चुनौतियाँ',
    subtitle: 'Addressing the structural barriers that kept over 40% of Indian households outside the formal banking system',
    layoutType: 'split-comparison',
    keyPoints: [
      {
        heading: 'High Informal Debt Trap',
        detail: 'According to Census 2011, only 58.7% of Indian households had access to banking services, forcing rural families to rely on informal moneylenders charging 36%–120% annual interest.',
        metric: '41.3% Unbanked'
      },
      {
        heading: 'Minimum Balance & KYC Barriers',
        detail: 'Traditional bank accounts demanded ₹500–₹2,000 minimum balance and complex address/identity proofs that migrant workers and rural women lacked.',
        metric: 'KYC Hurdle'
      },
      {
        heading: 'Welfare Subsidy Leakages',
        detail: 'Without direct bank accounts for the poor, government welfare payments passed through multi-layered intermediaries, causing severe delays and fiscal leakage.',
        metric: 'DBT Gap'
      }
    ],
    comparisonTable: [
      {
        dimension: 'Target Unit',
        phase1: 'Pre-2014: Fragmented village-level campaigns (Swabhimaan covered only villages >2,000 pop.)',
        phase2: 'PMJDY (2014+): Universal Sub-Service Area (SSA) covering every 1,000–1,500 households nationwide'
      },
      {
        dimension: 'Account Type',
        phase1: 'Frill-free offline accounts often frozen or restricted to branch visits',
        phase2: 'Core Banking Solution (CBS) online accounts with interoperable RuPay card & Micro-ATM access'
      },
      {
        dimension: 'Social Security Link',
        phase1: 'Purely savings-focused with no built-in accident insurance or overdraft lifeline',
        phase2: 'Bundled ₹2 Lakh Accident Cover, ₹10,000 Overdraft, and PMJJBY/PMSBY/APY integration'
      }
    ],
    speakerNotes:
      'On Slide 2, we analyze why previous financial inclusion drives like the 2011 Swabhimaan campaign had limited reach. Swabhimaan focused only on villages with populations above 2,000 and lacked interoperability. PMJDY shifted the paradigm to universal coverage across both rural and urban India with full Core Banking interoperability.',
    vivaTip:
      'Contrast Swabhimaan (2011) vs PMJDY (2014): Swabhimaan targeted villages >2000 population without RuPay/OD; PMJDY targeted every household (and later every adult) across both rural and urban India.',
    sourceRef: 'Census of India 2011 Banking Data & RBI Committee on Comprehensive Financial Services'
  },
  {
    id: 3,
    category: 'SLIDE 03 • HISTORIC LAUNCH & TIMELINE',
    title: 'Launch Chronology & Guinness World Record',
    hindiTitle: 'ऐतिहासिक शुभारंभ और गिनीज वर्ल्ड रिकॉर्ड',
    subtitle: 'From Independence Day announcement to global recognition as the fastest banking drive in human history',
    layoutType: 'data-milestone',
    keyPoints: [
      {
        heading: '15 August 2014 — Independence Day Announcement',
        detail: 'Announced during the Prime Minister’s address from the Red Fort to end "financial untouchability" within a time-bound national mission.',
        metric: '15 Aug 2014'
      },
      {
        heading: '28 August 2014 — Nationwide Simultaneous Launch',
        detail: '77,852 account-opening camps organized simultaneously across all districts; 1.5 Crore accounts opened on Day 1 alone.',
        metric: '1.5 Cr Day 1'
      },
      {
        heading: 'Guinness World Record Certification',
        detail: 'Recognized for "Most bank accounts opened in one week as part of a financial inclusion campaign": 1,80,96,130 accounts between Aug 23–29, 2014.',
        metric: '1.81 Cr Week 1'
      },
      {
        heading: '14 August 2018 — Extension to PMJDY 2.0',
        detail: 'Extended beyond 2018 as an open-ended mission shifting focus from "Every Household" to "Every Unbanked Adult" with doubled insurance & overdraft.',
        metric: 'PMJDY 2.0'
      }
    ],
    highlightStat: {
      value: '1,80,96,130',
      label: 'Guinness World Record',
      subtext: 'Accounts opened in a single week (23–29 August 2014)'
    },
    speakerNotes:
      'Slide 3 highlights the sheer speed of execution. Announced on August 15, 2014, and launched 13 days later on August 28, banks organized 77,852 camps nationwide. Guinness World Records certified PMJDY for opening 18.09 million accounts in a single week.',
    vivaTip:
      'Remember both dates: Announced on 15 August 2014; Launched on 28 August 2014.',
    sourceRef: 'Guinness World Records Certificate (2014) & PIB Archival Release'
  },
  {
    id: 4,
    category: 'SLIDE 04 • POLICY ARCHITECTURE',
    title: 'The Six Strategic Pillars of PMJDY',
    hindiTitle: 'पीएमजेडीवाई के ६ रणनीतिक स्तंभ',
    subtitle: 'A two-phase institutional blueprint combining banking infrastructure, credit access, and social security',
    layoutType: 'six-pillars',
    keyPoints: [
      {
        heading: 'Pillar 1: Universal Access to Banking Facilities',
        detail: 'Mapping 6 Lakh+ villages into 1.59 Lakh Sub-Service Areas (SSAs), serving every 1,000–1,500 households via brick-and-mortar branches or Bank Mitras within 5 km.',
        metric: 'Phase I'
      },
      {
        heading: 'Pillar 2: Basic Banking Accounts with Overdraft',
        detail: 'Zero-balance BSBD account with RuPay Debit Card and an Overdraft (OD) credit facility up to ₹10,000 (initially ₹5,000) for emergency liquidity.',
        metric: 'Phase I'
      },
      {
        heading: 'Pillar 3: Financial Literacy Programme (FLP)',
        detail: 'Educating beneficiaries on ATM usage, PIN security, RuPay card swipe benefits, digital payments, and disciplined debt repayment.',
        metric: 'Phase I'
      },
      {
        heading: 'Pillar 4: Creation of Credit Guarantee Fund',
        detail: 'Institutional backstop to cover possible defaults in Overdraft accounts so commercial banks lend confidently to low-income households.',
        metric: 'Phase II'
      },
      {
        heading: 'Pillar 5: Micro-Insurance Integration',
        detail: 'Seamless auto-debit access to PM Jeevan Jyoti Bima Yojana (₹2L life cover at ₹436/yr) and PM Suraksha Bima Yojana (₹2L accident cover at ₹20/yr).',
        metric: 'Phase II'
      },
      {
        heading: 'Pillar 6: Unorganized Sector Pension Schemes',
        detail: 'Linking informal workers to Atal Pension Yojana (APY) for guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60.',
        metric: 'Phase II'
      }
    ],
    speakerNotes:
      'Slide 4 is the core policy framework of our presentation. Notice that PMJDY was never meant to be just an account-opening drive. Pillars 1 to 3 build the banking rails and literacy, while Pillars 4 to 6 layer credit guarantee, micro-insurance, and old-age pension on top of that account.',
    vivaTip:
      'Examiners often ask to name all 6 pillars: 1. Universal Access, 2. Basic Account + OD, 3. Financial Literacy, 4. Credit Guarantee Fund, 5. Micro-Insurance, 6. Pension (Swavalamban/APY).',
    sourceRef: 'PMJDY Mission Document, Ministry of Finance (Phase I & Phase II)'
  },
  {
    id: 5,
    category: 'SLIDE 05 • CORE ENTITLEMENTS',
    title: '6 Major Benefits Available to Every Account Holder',
    hindiTitle: 'जन धन खाताधारकों को मिलने वाले ६ प्रमुख लाभ',
    subtitle: 'Financial dignity without hidden fees, minimum balance penalties, or collateral hurdles',
    layoutType: 'benefits-grid',
    keyPoints: [
      {
        heading: 'Zero Minimum Balance Requirement',
        detail: 'Categorized as a Basic Savings Bank Deposit (BSBD) account under RBI guidelines; zero penalty for maintaining nil balance.',
        metric: '₹0 Min Balance'
      },
      {
        heading: 'Interest Earned on Savings Deposit',
        detail: 'Earns standard savings bank interest rate (typically 2.70%–4.00% p.a. depending on bank) paid quarterly on daily balances.',
        metric: 'Savings Interest'
      },
      {
        heading: 'Free Indigenous RuPay Debit Card',
        detail: 'No annual maintenance charge; interoperable across all ATMs, PoS terminals, Micro-ATMs, and UPI (via RuPay/Aadhaar OTP).',
        metric: 'Free RuPay Card'
      },
      {
        heading: '₹2 Lakh Accidental Insurance Cover',
        detail: 'Built-in accidental death & permanent disability insurance cover of ₹2,00,000 (₹1,00,000 for accounts opened prior to 28 Aug 2018).',
        metric: '₹2,00,000 Cover'
      },
      {
        heading: '₹10,000 Overdraft (OD) Lifeline',
        detail: 'Available to one account per household (preferably the woman of the house) after 6 months of satisfactory account operation; ₹2,000 without conditions.',
        metric: '₹10,000 OD'
      },
      {
        heading: 'Direct Benefit Transfer (DBT) Eligibility',
        detail: 'Instant eligibility to receive government subsidies, scholarships, PM-KISAN installments, LPG PAHAL, and MGNREGA wages.',
        metric: '300+ Schemes'
      }
    ],
    speakerNotes:
      'Slide 5 details the six direct benefits to a citizen. Emphasize two upgrades made in August 2018: First, accidental insurance on RuPay cards was doubled from ₹1 Lakh to ₹2 Lakh. Second, the Overdraft limit was doubled from ₹5,000 to ₹10,000, with the upper age limit raised from 60 to 65 years.',
    vivaTip:
      'Note the 90-day rule for RuPay Accidental Insurance: The cardholder must have performed at least one successful financial or non-financial transaction within 90 days prior to the date of accident.',
    sourceRef: 'NPCI RuPay Insurance Program & RBI BSBD Master Direction'
  },
  {
    id: 6,
    category: 'SLIDE 06 • POLICY EVOLUTION',
    title: 'PMJDY 1.0 (2014–18) vs. PMJDY 2.0 (Post-2018)',
    hindiTitle: 'नीतिगत विकास: चरण १ बनाम चरण २ (२०१८ के बाद के बदलाव)',
    subtitle: 'How the government upgraded the scheme after achieving initial household-level saturation',
    layoutType: 'split-comparison',
    keyPoints: [
      {
        heading: 'Shift from Household to Individual Adult',
        detail: 'Phase 1 aimed for at least 1 bank account per household. After 2018, the target expanded to "Every Unbanked Adult" so multiple adults in a family have independent accounts.',
        metric: 'Every Adult'
      },
      {
        heading: 'Doubling of Financial Safety Nets',
        detail: 'Both the RuPay Accidental Insurance Cover (₹1L → ₹2L) and Overdraft Facility (₹5,000 → ₹10,000) were doubled to match inflation and household credit needs.',
        metric: '2x Benefits'
      },
      {
        heading: 'Expanded Age Limit for Overdraft',
        detail: 'Eligible age bracket for availing the ₹10,000 Overdraft was relaxed from 18–60 years to 18–65 years.',
        metric: '18–65 Years'
      }
    ],
    comparisonTable: [
      {
        dimension: 'Primary Target',
        phase1: 'Every Unbanked Household (2014–2018)',
        phase2: 'Every Unbanked Adult (Post-August 2018)'
      },
      {
        dimension: 'RuPay Accident Insurance',
        phase1: '₹1,00,000 cover per eligible RuPay card',
        phase2: '₹2,00,000 cover (for accounts opened after 28.08.2018)'
      },
      {
        dimension: 'Overdraft (OD) Limit',
        phase1: 'Up to ₹5,000 per household',
        phase2: 'Up to ₹10,000 (₹2,000 without conditions)'
      },
      {
        dimension: 'Overdraft Age Limit',
        phase1: '18 to 60 Years',
        phase2: '18 to 65 Years'
      }
    ],
    speakerNotes:
      'Slide 6 is a favorite comparison table for project evaluations. When the first 4-year cycle ended in August 2018, the Union Cabinet approved the continuation of PMJDY with four major upgrades: shifting target to every adult, doubling RuPay accident cover to ₹2 Lakh, doubling Overdraft to ₹10,000, and raising the OD age limit to 65 years.',
    vivaTip:
      'Memorize this table—it directly answers "What changed in PMJDY after 2018?"',
    sourceRef: 'Union Cabinet Decision on Continuation of PMJDY (August 2018)'
  },
  {
    id: 7,
    category: 'SLIDE 07 • DIGITAL PUBLIC INFRASTRUCTURE',
    title: 'The JAM Trinity: Jan Dhan + Aadhaar + Mobile',
    hindiTitle: 'जैम ट्रिनिटी (JAM): डिजिटल इंडिया की आधारशिला',
    subtitle: 'How PMJDY serves as the foundational financial layer of India’s Digital Public Infrastructure (DPI)',
    layoutType: 'jam-trinity',
    keyPoints: [
      {
        heading: 'J — Jan Dhan (Universal Bank Account Layer)',
        detail: '53.13+ Crore interoperable bank accounts act as the digital vault and endpoint for every citizen across rural and urban India.',
        metric: '53.13 Cr Accounts'
      },
      {
        heading: 'A — Aadhaar (Biometric Identity & Authentication)',
        detail: '138+ Crore Aadhaar numbers enable instant e-KYC account opening and Aadhaar Enabled Payment System (AePS) thumbprint withdrawals.',
        metric: 'AePS & e-KYC'
      },
      {
        heading: 'M — Mobile (Last-Mile Connectivity & UPI)',
        detail: 'Real-time SMS alerts, missed-call balance inquiry, and UPI linkage allow instant peer-to-merchant digital transactions.',
        metric: 'Real-Time Access'
      },
      {
        heading: 'Fiscal Savings Through DBT',
        detail: 'By eliminating duplicate and ghost beneficiaries across LPG, PDS rations, and fertilizer schemes, DBT saved the exchequer over ₹3.48 Lakh Crore.',
        metric: '₹3.48L Cr Saved'
      }
    ],
    highlightStat: {
      value: '₹3.48L Cr',
      label: 'Cumulative DBT Savings',
      subtext: 'Saved by eliminating ghost beneficiaries & leakages (DBT Bharat)'
    },
    speakerNotes:
      'Slide 7 connects PMJDY to the broader macroeconomic story of the JAM Trinity—coined in the Economic Survey 2014-15. Without Jan Dhan accounts as the base layer, neither Direct Benefit Transfer (DBT) nor the rural expansion of UPI and Aadhaar Enabled Payment System (AePS) would have been possible.',
    vivaTip:
      'Explain AePS (Aadhaar Enabled Payment System): Even if a villager does not have a smartphone or forgets their PIN, they can withdraw cash at a Bank Mitra Micro-ATM using just their Aadhaar number and fingerprint.',
    sourceRef: 'Economic Survey of India & DBT Bharat Portal (dbtbharat.gov.in)'
  },
  {
    id: 8,
    category: 'SLIDE 08 • DECADAL STATISTICAL REPORT',
    title: '10 Years of PMJDY in Numbers (2014 – 2024+)',
    hindiTitle: '१० वर्षों की सांख्यिकीय प्रगति रिपोर्ट (२०१४ – २०२४+)',
    subtitle: 'Empirical evidence of sustained account growth, rising average balances, and active usage',
    layoutType: 'data-milestone',
    keyPoints: [
      {
        heading: '3.6x Growth in Total Accounts',
        detail: 'Expanded from 14.72 Crore accounts in March 2015 to 53.13 Crore+ accounts by August 2024.',
        metric: '14.7Cr → 53.1Cr'
      },
      {
        heading: '14.7x Surge in Total Deposits',
        detail: 'Aggregate deposits rose from ₹15,670 Crore (Mar 2015) to ₹2,31,236 Crore (Aug 2024), debunking the myth that accounts would remain empty.',
        metric: '₹2.31 Lakh Cr'
      },
      {
        heading: '4.1x Increase in Average Balance per Account',
        detail: 'Average deposit per PMJDY account climbed steadily from ₹1,065 in March 2015 to ₹4,352 in August 2024.',
        metric: '₹4,352 / Account'
      },
      {
        heading: 'Dramatic Decline in Zero-Balance Accounts',
        detail: 'Zero-balance accounts fell from 58% in March 2015 to just ~8.4% in 2024, confirming high active usage by beneficiaries.',
        metric: '91.6% Funded'
      }
    ],
    highlightStat: {
      value: '₹4,352',
      label: 'Avg Deposit Per Account',
      subtext: 'Up 4.1x from ₹1,065 in March 2015'
    },
    speakerNotes:
      'Slide 8 presents hard empirical statistics from the Ministry of Finance. Critics initially worried that zero-balance accounts would stay dormant and empty. However, data proves the opposite: total deposits surged nearly 15-fold to ₹2.31 Lakh Crore, and average balance per account rose fourfold from ₹1,065 to ₹4,352.',
    vivaTip:
      'Cite the drop in zero-balance accounts (from >58% in 2015 down to ~8.4% today) as proof of genuine financial engagement rather than mere token account opening.',
    sourceRef: 'PIB & Ministry of Finance 10th Anniversary Statistical Release (Aug 2024)'
  },
  {
    id: 9,
    category: 'SLIDE 09 • LAST-MILE DELIVERY MODEL',
    title: 'Bank Mitras & Sub-Service Area (SSA) Architecture',
    hindiTitle: 'बैंक मित्र और अंतिम छोर तक बैंकिंग सेवा वितरण',
    subtitle: 'How India brought doorstep banking to remote habitations without requiring expensive brick-and-mortar branches',
    layoutType: 'benefits-grid',
    keyPoints: [
      {
        heading: 'Sub-Service Area (SSA) Mapping',
        detail: 'Over 6 Lakh villages were mapped into 1.59 Lakh SSAs (1,000–1,500 households each) to guarantee banking access within a 5 km radius.',
        metric: '1.59 Lakh SSAs'
      },
      {
        heading: '13.5+ Lakh Bank Mitras (Business Correspondents)',
        detail: 'Local agents—including Self-Help Group women ("Bank Sakhis"), CSC operators, and postmen—equipped with handheld Micro-ATMs.',
        metric: '13.5L+ Agents'
      },
      {
        heading: 'Interoperable Micro-ATM & AePS',
        detail: 'Biometric thumbprint authentication allows cash deposit, withdrawal, fund transfer, and balance inquiry across any bank.',
        metric: 'Biometric Banking'
      },
      {
        heading: 'Jan Dhan Darshak GIS Mobile App',
        detail: 'Citizen-facing geographic information system (GIS) app mapping 13.5+ Lakh banking touchpoints so any village without 5 km access is identified.',
        metric: '99.95% Villages'
      }
    ],
    speakerNotes:
      'Slide 9 explains the operational secret behind PMJDY’s rural reach: the Bank Mitra (Business Correspondent) model. Instead of building costly brick-and-mortar branches in every small village, banks deployed local agents and SHG "Bank Sakhis" carrying biometric Micro-ATMs.',
    vivaTip:
      'Mention the "Jan Dhan Darshak App"—a GIS tool launched by the government to locate the nearest Bank Branch, ATM, Post Office, or Bank Mitra within 5 km of any village.',
    sourceRef: 'National Mission for Financial Inclusion GIS Report & RBI BC Guidelines'
  },
  {
    id: 10,
    category: 'SLIDE 10 • OFFICIAL GUIDELINES & KYC',
    title: 'Official Guidelines, Eligibility & "Chhota Khata" Rules',
    hindiTitle: 'आधिकारिक दिशानिर्देश, पात्रता और "छोटा खाता" नियम',
    subtitle: 'Regulatory instructions issued by the Reserve Bank of India (RBI) and Department of Financial Services',
    layoutType: 'guidelines-flow',
    keyPoints: [
      {
        heading: 'Age & Citizenship Eligibility',
        detail: 'Any Indian citizen aged 10 years or above who does not already hold a bank account. Minors (10–18 yrs) can open accounts managed with guardian support and receive a RuPay card.',
        metric: 'Age 10+ Years'
      },
      {
        heading: 'Path A: Aadhaar e-KYC / Officially Valid Documents (OVD)',
        detail: 'Instant paperless account opening via Aadhaar biometric authentication, or using Voter ID, Driving License, Passport, NREGA Job Card, or NPR letter.',
        metric: 'Full KYC'
      },
      {
        heading: 'Path B: "Chhota Khata" (Small Account) for Zero Documents',
        detail: 'If a citizen has NO official ID, banks MUST still open a Small Account using a self-attested photograph and signature/thumbprint in the presence of a bank official.',
        metric: 'Zero-Doc Option'
      },
      {
        heading: 'Small Account Limits & 12-Month Conversion Rule',
        detail: 'Chhota Khata allows max balance of ₹50,000, max annual credits of ₹1,00,000, and max monthly withdrawals of ₹10,000. Valid for 12 months (extendable by 12 more months if user applies for OVD).',
        metric: '₹50K Max Balance'
      }
    ],
    speakerNotes:
      'Slide 10 is essential for the "Guidelines" portion of our project. Under RBI Master Directions on KYC, no poor citizen can be turned away for lacking documents. Through the "Chhota Khata" (Small Account) provision, a person only needs two photographs and a thumbprint/signature before the branch officer.',
    vivaTip:
      'Know the exact numerical caps of a Chhota Khata (Small Account): Balance cannot exceed ₹50,000 at any point; total credits in a financial year cannot exceed ₹1,00,000; monthly withdrawals/transfers cannot exceed ₹10,000.',
    sourceRef: 'RBI Master Direction — Know Your Customer (KYC) Direction & BSBD Guidelines'
  },
  {
    id: 11,
    category: 'SLIDE 11 • SOCIO-ECONOMIC IMPACT',
    title: 'Women Empowerment, COVID-19 Relief & Economic Formalization',
    hindiTitle: 'सामाजिक-आर्थिक प्रभाव: नारी सशक्तिकरण और संकटकालीन सुरक्षा',
    subtitle: 'How universal banking transformed gender equity, crisis resilience, and rural credit access',
    layoutType: 'benefits-grid',
    keyPoints: [
      {
        heading: 'Nari Shakti Financial Autonomy (55.6% Women)',
        detail: 'With 29.56 Crore women holding personal PMJDY accounts, wages, maternity benefits, and state cash transfers go directly into women’s hands, increasing household nutrition and education spending.',
        metric: '29.56 Cr Women'
      },
      {
        heading: 'COVID-19 PM Garib Kalyan Yojana Lifeline (2020)',
        detail: 'During the 2020 lockdown, the government transferred ₹500/month for 3 months (₹1,500 total) into 20.64 Crore women PMJDY accounts within days—totaling ₹30,945 Crore.',
        metric: '20.64 Cr Assisted'
      },
      {
        heading: 'Gateway to PM SVANidhi & MUDRA Loans',
        detail: 'Transaction history in PMJDY accounts enables street vendors and micro-entrepreneurs to build formal credit scores and access collateral-free MUDRA & SVANidhi loans.',
        metric: 'Formal Credit'
      },
      {
        heading: 'Reduction in Rural Crime & Alcohol Leakage',
        detail: 'Academic studies show direct digital transfers to female-held PMJDY accounts curbed cash skimming and increased women’s bargaining power within households.',
        metric: 'Social Equity'
      }
    ],
    speakerNotes:
      'Slide 11 demonstrates real-world socio-economic impact. The biggest test of PMJDY came during the COVID-19 pandemic in April–June 2020: within 10 days of announcing the lockdown, India transferred ₹30,945 Crore directly into 20.64 Crore women’s Jan Dhan accounts without people needing to queue at government offices.',
    vivaTip:
      'Use the COVID-19 PM Garib Kalyan Package (20.64 Crore women receiving ₹500/month for 3 months) as the best real-world case study of PMJDY in action.',
    sourceRef: 'SBI Ecowrap Research Study & Ministry of Finance PMGKY Report'
  },
  {
    id: 12,
    category: 'SLIDE 12 • CONCLUSION & FUTURE ROADMAP',
    title: 'Challenges Ahead, PMJDY 3.0 Vision & References',
    hindiTitle: 'निष्कर्ष, चुनौतियाँ और भविष्य की राह',
    subtitle: 'Transitioning from account saturation to active digital credit, cyber safety, and wealth creation',
    layoutType: 'summary',
    keyPoints: [
      {
        heading: 'Challenge 1: Inoperative / Dormant Accounts (~18–20%)',
        detail: 'Accounts with no customer-induced transactions for over 24 months become inoperative under RBI norms; requires periodic re-KYC camps at Gram Panchayat level.',
        metric: 'Re-KYC Drive'
      },
      {
        heading: 'Challenge 2: Digital Fraud & Cyber Literacy',
        detail: 'First-time digital users are vulnerable to phishing and OTP scams; expansion of RBI’s Centres for Financial Literacy (CFL) across every block is critical.',
        metric: 'Cyber Safety'
      },
      {
        heading: 'Future Vision: Jan Dhan to Jan Suraksha & Micro-Credit',
        detail: 'Achieving 100% saturation of PMJJBY, PMSBY, and APY among existing PMJDY holders, alongside AI-driven cash-flow lending for rural micro-enterprises.',
        metric: 'Next Decade'
      }
    ],
    highlightStat: {
      value: '1800-11-0001',
      label: 'National Toll-Free Helpline',
      subtext: 'Official Portal: pmjdy.gov.in | Secondary Helpline: 1800-180-1111'
    },
    speakerNotes:
      'To conclude on Slide 12: PMJDY compressed nearly five decades of financial inclusion progress into less than ten years, as recognized by the World Bank and BIS. Moving forward, the policy priority shifts from opening accounts to keeping them active via Gram Panchayat re-KYC drives, expanding cybersecurity awareness, and deepening micro-insurance coverage. Thank you! I am happy to take questions.',
    vivaTip:
      'When asked "When does a PMJDY account become inoperative/dormant?", answer: "Under RBI guidelines, if there are no customer-induced debit or credit transactions for over 24 consecutive months (2 years)." Note that bank interest or government DBT credits alone do not count as customer-induced debit transactions unless withdrawn/used.',
    sourceRef: 'Official References: pmjdy.gov.in | rbi.org.in | dbtbharat.gov.in'
  }
];

export const OFFICIAL_GUIDELINES: GuidelineItem[] = [
  {
    id: 'g-bsbd',
    code: 'RBI/DBR/BSBD-01',
    category: 'Account Opening & KYC',
    title: 'Basic Savings Bank Deposit (BSBD) Account Norms',
    authority: 'Reserve Bank of India (RBI) & DFS',
    summary:
      'All accounts opened under PMJDY are treated as BSBD accounts. Banks are strictly prohibited from requiring any minimum balance or levying charges for non-maintenance of balance.',
    mandatoryRequirements: [
      'Eligible for any Indian citizen aged 10 years and above.',
      'Free deposit of cash at bank branch as well as ATMs/CDMs (no limit on number or value of deposits).',
      'Minimum 4 free withdrawals per month, including ATM/Micro-ATM withdrawals and RTGS/NEFT/UPI/Branch withdrawals.',
      'Customer cannot hold another normal Savings Bank account in the same bank (if they do, it must be closed within 30 days of opening BSBD).'
    ],
    exceptionsOrRelaxations:
      'Minors above 10 years of age can open and operate PMJDY accounts independently up to bank-specified limits and be issued a RuPay ATM-cum-Debit card.',
    officialReference: 'RBI Master Circular DBR.No.Leg.BC.96 / BSBD Guidelines'
  },
  {
    id: 'g-small-account',
    code: 'RBI/KYC/CHHOTA-02',
    category: 'Account Opening & KYC',
    title: '"Chhota Khata" (Small Account) for Citizens Without KYC Documents',
    authority: 'Prevention of Money-Laundering Rules & RBI KYC Master Direction',
    summary:
      'Individuals who do not possess Aadhaar or any of the 6 Officially Valid Documents (OVDs) can still open a PMJDY "Small Account" by submitting two self-attested photographs and signing/affixing thumb impression before a designated bank officer.',
    mandatoryRequirements: [
      'Aggregate of all credits in a financial year shall not exceed ₹1,00,000 (One Lakh Rupees).',
      'Aggregate of all withdrawals and transfers in a month shall not exceed ₹10,000 (Ten Thousand Rupees).',
      'Balance at any point of time shall not exceed ₹50,000 (Fifty Thousand Rupees).',
      'Foreign remittances are not permitted to be credited into a Small Account without full KYC.'
    ],
    exceptionsOrRelaxations:
      'Initially valid for 12 months. Extended for another 12 months if the holder provides proof of having applied for an Officially Valid Document within the first 12 months.',
    officialReference: 'RBI Master Direction on Know Your Customer (KYC), Section on Small Accounts'
  },
  {
    id: 'g-overdraft',
    code: 'DFS/PMJDY/OD-03',
    category: 'Overdraft (OD) Rules',
    title: '₹10,000 Overdraft (OD) Facility Eligibility & Sanction Rules',
    authority: 'Department of Financial Services (DFS), Ministry of Finance',
    summary:
      'Provides hassle-free emergency credit up to ₹10,000 to low-income households without collateral, acting as a micro-credit alternative to informal moneylenders.',
    mandatoryRequirements: [
      'Satisfactory operation of the PMJDY account (regular credits/DBT/transactions) for at least 6 months.',
      'Account must be seeded with Aadhaar to prevent duplicate overdraft claims across banks.',
      'Applicant age must be between 18 years and 65 years (upgraded from 60 years in Aug 2018).',
      'Granted to only ONE account per household, preferably the lady of the household.'
    ],
    exceptionsOrRelaxations:
      'Overdraft up to ₹2,000 is accorded "without conditions" to eligible active PMJDY account holders. Loan period extends up to 36 months or renewal on annual review.',
    officialReference: 'DFS Mission Continuation Guidelines (Post-14.08.2018)'
  },
  {
    id: 'g-rupay-insurance',
    code: 'NPCI/RUPAY/INS-04',
    category: 'RuPay Insurance',
    title: '₹2,00,000 RuPay Accidental Death & Permanent Disability Insurance',
    authority: 'National Payments Corporation of India (NPCI) & New India Assurance',
    summary:
      'Inbuilt accidental insurance cover provided free of cost to PMJDY RuPay Debit Card holders in case of accidental death or Permanent Total Disability.',
    mandatoryRequirements: [
      '₹1,00,000 cover for PMJDY accounts opened between 28.08.2014 and 28.08.2018.',
      '₹2,00,000 cover for PMJDY RuPay cards issued for accounts opened after 28.08.2018.',
      'MANDATORY 90-DAY ACTIVITY RULE: The RuPay cardholder must have carried out at least one successful financial or non-financial transaction (at ATM, Micro-ATM, PoS, or e-Commerce) within 90 days prior to the date of accident.',
      'Claim intimation must be submitted to the bank branch within 90 days of the accident along with FIR, Post-Mortem Report, and Death Certificate.'
    ],
    exceptionsOrRelaxations:
      'Both intra-bank (on-us) and inter-bank (off-us) RuPay card transactions qualify for the 90-day active usage criteria.',
    officialReference: 'NPCI RuPay Insurance Program Guidelines (FY 2024–25)'
  },
  {
    id: 'g-bank-mitra',
    code: 'DFS/BC/SSA-05',
    category: 'Bank Mitra & Last Mile',
    title: 'Bank Mitra (Business Correspondent) & Micro-ATM Standards',
    authority: 'IBA / DFS / RBI Financial Inclusion Division',
    summary:
      'Establishes doorstep banking in rural Sub-Service Areas (SSAs) where opening a full brick-and-mortar branch is not viable.',
    mandatoryRequirements: [
      'Every SSA (1,000–1,500 households) must be served by either a bank branch or a fixed-point Bank Mitra.',
      'Bank Mitra devices must support interoperable Aadhaar Enabled Payment System (AePS) and RuPay EMV Chip + PIN transactions.',
      'Zero service charge to the PMJDY customer for cash deposits, withdrawals, or balance inquiries at the Bank Mitra point.',
      'Mandatory display of Bank Name, BC Agent ID, Helpline Number, and Do’s & Don’ts charter in local language.'
    ],
    exceptionsOrRelaxations:
      'Women Self-Help Group (SHG) members trained under NRLM are prioritized for appointment as "Bank Sakhis".',
    officialReference: 'DFS Operational Guidelines for Bank Mitras & SSAs'
  }
];
