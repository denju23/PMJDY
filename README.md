# Pradhan Mantri Jan Dhan Yojana (PMJDY) — Interactive PPT, Video & Guidelines Studio

An interactive academic and policy presentation portal for **Pradhan Mantri Jan Dhan Yojana (PMJDY)** (*"Mera Khata, Bhagya Vidhata"*), featuring a **6-chapter animated documentary video studio** with custom microphone voiceover recording & bilingual narration, a **12-slide PowerPoint (PPT) presentation deck** with speaker notes & viva tips, and **official RBI & Ministry of Finance guidelines** with an interactive eligibility calculator.

---

## 🌐 Live Application URLs

- **Shared / Public App URL**: [https://ais-pre-pig4rr52p4gek6jtkveixq-178058624660.asia-southeast1.run.app](https://ais-pre-pig4rr52p4gek6jtkveixq-178058624660.asia-southeast1.run.app)
- **Development App URL**: [https://ais-dev-pig4rr52p4gek6jtkveixq-178058624660.asia-southeast1.run.app](https://ais-dev-pig4rr52p4gek6jtkveixq-178058624660.asia-southeast1.run.app)

---

## ✨ Key Features

1. **Interactive 6-Chapter Documentary Video Studio (`src/components/VideoStudio.tsx`)**:
   - **Animated Motion-Graphics Scenes**: Covers Launch & Guinness World Record (2014), the 6 Strategic Pillars, Zero-Balance BSBD & RuPay/Overdraft entitlements, the JAM Trinity & Direct Benefit Transfer (DBT), 10-Year Impact Statistics (2014–2024+), and Official RBI KYC Procedures.
   - **Custom Voiceover Recording & Upload**: Record your own voice directly via microphone (with a live teleprompter and `100% / 200% / 300%` Web Audio volume booster) or upload `.mp3`, `.wav`, `.m4a`, or `.webm` voice files.
   - **Bilingual AI Voiceover**: Built-in English (`en-IN`) and Hindi (`hi-IN`) voice narration with live synchronized subtitles.
   - **Exportable Video Script & Storyboard**: One-click copy or `.TXT` download of the full 6-chapter script, visual cues, and lower-third titles.

2. **12-Slide PowerPoint (PPT) Presentation Deck (`src/components/PptSlideStudio.tsx`)**:
   - **Complete 12-Slide Deck**: Includes Title & Overview, Pre-2014 Financial Exclusion Context, Launch Chronology, 6 Strategic Pillars, Core Benefits, **PMJDY 1.0 vs. PMJDY 2.0 Comparison Table**, JAM Trinity, 10-Year Statistical Report (`53.13+ Crore` accounts, `₹2.31+ Lakh Crore` deposits, `55.6%` women beneficiaries), Bank Mitra Model, Official KYC Guidelines, Socio-Economic Impact, and Conclusion/References.
   - **Fullscreen Slide Show & Viva Coach**: Navigate using keyboard arrows (`←` / `→`), present in fullscreen mode, and read built-in **Speaker Notes** and **Viva / Examiner Tips**.
   - **Print / Save as PDF & Export**: Print all 12 slides cleanly to PDF or download the complete slide deck notes.

3. **Official RBI & Ministry of Finance Guidelines + Eligibility Simulator (`src/components/GuidelinesAndSimulator.tsx`)**:
   - **Interactive Citizen Eligibility & Entitlement Calculator**: Test applicant age, KYC documentation (*Aadhaar e-KYC*, *Officially Valid Document*, or *Zero-Document "Chhota Khata" / Small Account*), and account tenure to check eligibility for the **₹2,00,000** RuPay Accidental Cover and **₹10,000** Overdraft facility.
   - **10-Year Empirical Data Explorer**: Interactive charts and tables from March 2015 to August 2024+.

---

## 🚀 How to Push This Code to Your Git Branch

Run the following commands in your terminal from the project root directory to initialize Git (if not already initialized) and push the code to your remote repository branch:

### 1. Initialize Git & Stage All Files
```bash
git init
git add .
git commit -m "feat: add PMJDY interactive PPT deck, video voiceover studio, and official guidelines"
```

### 2. Create or Switch to Your Target Branch
```bash
# To push to the 'main' branch:
git branch -M main

# OR to create and switch to a new feature branch (e.g., 'feature/pmjdy-ppt-video'):
git checkout -b feature/pmjdy-ppt-video
```

### 3. Add Your Remote Repository URL & Push
Replace `<YOUR_GITHUB_REPO_URL>` with your GitHub / GitLab / Bitbucket repository URL (for example, `https://github.com/your-username/pmjdy-project.git`):

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>

# If 'origin' already exists, update its URL with:
# git remote set-url origin <YOUR_GITHUB_REPO_URL>

# Push to 'main' branch:
git push -u origin main

# OR if pushing to a custom branch:
# git push -u origin feature/pmjdy-ppt-video
```

---

## 💻 Local Development & Build Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server (Port 3000)
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
