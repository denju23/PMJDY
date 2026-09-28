import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calculator,
  PhoneCall,
  Landmark,
  BarChart3,
  BookOpen,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { OFFICIAL_GUIDELINES, DECADAL_GROWTH_DATA } from '../data/pmjdyData';

export const GuidelinesAndSimulator: React.FC = () => {
  // Simulator State
  const [ageGroup, setAgeGroup] = useState<'under10' | '10to17' | '18to65' | 'above65'>('18to65');
  const [kycStatus, setKycStatus] = useState<'aadhaar' | 'ovd' | 'none'>('aadhaar');
  const [accountTenure, setAccountTenure] = useState<'new' | '6months'>('6months');

  // Guidelines Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Chart Metric Selector
  const [chartMetric, setChartMetric] = useState<'accountsCr' | 'depositsCr' | 'avgDepositRs'>('accountsCr');

  // Compute Eligibility & Entitlements based on RBI & DFS rules
  const computeEligibility = () => {
    if (ageGroup === 'under10') {
      return {
        eligible: false,
        accountCategory: 'Not Eligible for Independent PMJDY Account (Minimum Age: 10 Years)',
        kycPath: 'Requires attaining age 10 years under RBI BSBD Minor Account norms.',
        rupayCover: '₹0',
        overdraftLimit: '₹0 (Requires Age 18–65)',
        balanceCap: 'N/A',
        notes: [
          'Under PMJDY & RBI guidelines, a minor must be at least 10 years old to open and operate a PMJDY BSBD account.',
          'Parents/guardians may open a standard minor savings account at a bank branch.'
        ]
      };
    }

    const isChhotaKhata = kycStatus === 'none';
    const isMinor = ageGroup === '10to17';
    const isOdAgeEligible = ageGroup === '18to65';
    const qualifiesForOd = isOdAgeEligible && accountTenure === '6months' && kycStatus === 'aadhaar';

    return {
      eligible: true,
      accountCategory: isChhotaKhata
        ? 'PMJDY "Chhota Khata" (RBI Small Account — Zero Document Relaxation)'
        : isMinor
        ? 'PMJDY Minor BSBD Account (Age 10–17 Years)'
        : 'Full-KYC PMJDY Basic Savings Bank Deposit (BSBD) Account',
      kycPath:
        kycStatus === 'aadhaar'
          ? 'Instant Biometric / OTP e-KYC via Aadhaar at any Bank Branch or Bank Mitra'
          : kycStatus === 'ovd'
          ? 'Standard KYC using Voter ID / Driving License / NREGA Job Card / Passport'
          : '2 Self-Attested Photographs + Signature/Thumbprint before Bank Officer (Valid 12 Months)',
      rupayCover: '₹2,00,000 (Subject to 1 RuPay transaction within 90 days prior to accident)',
      overdraftLimit: qualifiesForOd
        ? 'Up to ₹10,000 (₹2,000 unconditional)'
        : !isOdAgeEligible
        ? '₹0 (Overdraft strictly for Age 18–65 Years)'
        : kycStatus !== 'aadhaar'
        ? '₹0 (Requires Aadhaar seeding to prevent duplicate OD)'
        : 'Unlocks up to ₹10,000 after 6 months of satisfactory operation',
      balanceCap: isChhotaKhata
        ? 'Max Balance ₹50,000 | Max Monthly Withdrawal ₹10,000 | Max Annual Credit ₹1,00,000'
        : 'No Upper Limit on Deposits (Full KYC BSBD Account)',
      notes: [
        'Zero minimum balance required; 4 free withdrawals per month via ATM/Micro-ATM/Branch.',
        isChhotaKhata
          ? 'Small Account remains operational for 12 months; extendable by 12 more months upon showing proof of applying for an Officially Valid Document (OVD).'
          : 'Eligible for Direct Benefit Transfer (DBT) across 300+ Central and State welfare schemes.',
        ageGroup === '18to65'
          ? 'Eligible to link PMSBY (₹20/yr Accident Insurance) and PMJJBY (₹436/yr Life Insurance up to age 50).'
          : 'Eligible for free RuPay ATM-cum-Debit Card.'
      ]
    };
  };

  const simResult = computeEligibility();

  const categories = [
    'ALL',
    'Account Opening & KYC',
    'Overdraft (OD) Rules',
    'RuPay Insurance',
    'Bank Mitra & Last Mile'
  ];

  const filteredGuidelines =
    selectedCategory === 'ALL'
      ? OFFICIAL_GUIDELINES
      : OFFICIAL_GUIDELINES.filter((g) => g.category === selectedCategory);

  return (
    <div className="space-y-10">
      {/* SECTION 1: Interactive Eligibility & Entitlement Simulator */}
      <div className="bg-white rounded-xl border border-[#E2DDD2] shadow-xs overflow-hidden">
        <div className="bg-[#141A24] text-[#FAF7F2] px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#1B6B45]">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#4ADE80]" />
            <div>
              <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#4ADE80] block">
                INTERACTIVE POLICY RULE ENGINE
              </span>
              <h3 className="text-lg sm:text-xl font-editorial font-bold">
                PMJDY Citizen Eligibility, KYC & Benefit Calculator
              </h3>
            </div>
          </div>
          <span className="font-mono-tabular text-xs bg-white/10 px-3 py-1 rounded text-[#FAF7F2]/90">
            Based on RBI BSBD & DFS Post-2018 Master Norms
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 3 Interactive Controls */}
          <div className="lg:col-span-5 space-y-5 bg-[#FAF7F2] p-5 rounded-xl border border-[#E2DDD2]">
            {/* 1. Age Bracket */}
            <div>
              <label className="block text-xs font-mono-tabular uppercase tracking-wider text-[#141A24] font-bold mb-2">
                1. Select Applicant Age Group
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'under10', label: 'Under 10 Yrs', sub: 'Child' },
                  { id: '10to17', label: '10 – 17 Yrs', sub: 'Minor Eligible' },
                  { id: '18to65', label: '18 – 65 Yrs', sub: 'Full Adult + OD' },
                  { id: 'above65', label: 'Above 65 Yrs', sub: 'Senior Citizen' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAgeGroup(opt.id as typeof ageGroup)}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      ageGroup === opt.id
                        ? 'bg-[#141A24] text-white border-[#141A24]'
                        : 'bg-white text-[#141A24] border-[#E2DDD2] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <div className="font-mono-tabular text-xs font-bold">{opt.label}</div>
                    <div
                      className={`text-[11px] ${
                        ageGroup === opt.id ? 'text-[#FAF7F2]/75' : 'text-[#4A5260]'
                      }`}
                    >
                      {opt.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. KYC Document Status */}
            <div>
              <label className="block text-xs font-mono-tabular uppercase tracking-wider text-[#141A24] font-bold mb-2">
                2. Available KYC Documentation
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'aadhaar',
                    title: 'Aadhaar Card (Biometric / OTP e-KYC)',
                    desc: 'Enables instant account opening, DBT & ₹10,000 Overdraft'
                  },
                  {
                    id: 'ovd',
                    title: 'Other Officially Valid Document (OVD)',
                    desc: 'Voter ID, Driving License, NREGA Job Card, Passport, or NPR Letter'
                  },
                  {
                    id: 'none',
                    title: 'No Official ID Documents Available',
                    desc: 'Activates RBI "Chhota Khata" (Small Account) with 2 photos'
                  }
                ].map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setKycStatus(doc.id as typeof kycStatus)}
                    className={`w-full p-3 rounded-lg border text-left transition cursor-pointer ${
                      kycStatus === doc.id
                        ? 'bg-[#D95D24]/10 border-[#D95D24] text-[#141A24]'
                        : 'bg-white border-[#E2DDD2] text-[#141A24] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{doc.title}</span>
                      {kycStatus === doc.id && (
                        <span className="text-[10px] font-mono-tabular uppercase px-1.5 py-0.5 rounded bg-[#D95D24] text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#4A5260] mt-0.5">{doc.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Account Tenure */}
            <div>
              <label className="block text-xs font-mono-tabular uppercase tracking-wider text-[#141A24] font-bold mb-2">
                3. Account Operation Tenure (For Overdraft Check)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountTenure('new')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    accountTenure === 'new'
                      ? 'bg-[#141A24] text-white border-[#141A24]'
                      : 'bg-white text-[#141A24] border-[#E2DDD2]'
                  }`}
                >
                  New Account (Day 1)
                </button>
                <button
                  type="button"
                  onClick={() => setAccountTenure('6months')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    accountTenure === '6months'
                      ? 'bg-[#141A24] text-white border-[#141A24]'
                      : 'bg-white text-[#141A24] border-[#E2DDD2]'
                  }`}
                >
                  6+ Months Active Usage
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Computed Official Entitlements Output */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className={`p-5 rounded-xl border ${
                simResult.eligible
                  ? 'bg-[#1B6B45]/5 border-[#1B6B45]/30'
                  : 'bg-[#B45309]/10 border-[#B45309]/40'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase font-bold mb-1">
                {simResult.eligible ? (
                  <span className="text-[#1B6B45] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> ELIGIBLE UNDER PMJDY GUIDELINES
                  </span>
                ) : (
                  <span className="text-[#B45309] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> AGE REQUIREMENT NOT MET (MIN 10 YEARS)
                  </span>
                )}
              </div>
              <h4 className="text-xl font-editorial font-bold text-[#141A24]">
                {simResult.accountCategory}
              </h4>
              <p className="text-xs text-[#4A5260] mt-1">
                <strong>Verification Protocol:</strong> {simResult.kycPath}
              </p>
            </div>

            {/* 3 Computed Entitlement Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E2DDD2]">
                <div className="text-[11px] font-mono-tabular uppercase text-[#4A5260]">
                  Minimum Balance
                </div>
                <div className="text-2xl font-mono-tabular font-bold text-[#1B6B45] mt-1">₹0</div>
                <div className="text-[11px] text-[#4A5260] mt-1">
                  Zero penalty under RBI BSBD guidelines
                </div>
              </div>

              <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E2DDD2]">
                <div className="text-[11px] font-mono-tabular uppercase text-[#4A5260]">
                  RuPay Accident Cover
                </div>
                <div className="text-xl font-mono-tabular font-bold text-[#D95D24] mt-1">
                  {simResult.eligible ? '₹2,00,000' : '₹0'}
                </div>
                <div className="text-[11px] text-[#4A5260] mt-1">
                  Requires 1 swipe in 90 days prior to accident
                </div>
              </div>

              <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E2DDD2]">
                <div className="text-[11px] font-mono-tabular uppercase text-[#4A5260]">
                  Overdraft (OD) Limit
                </div>
                <div className="text-base font-mono-tabular font-bold text-[#1E3A5F] mt-1">
                  {simResult.overdraftLimit.startsWith('Up to') ? '₹10,000' : 'Conditional'}
                </div>
                <div className="text-[11px] text-[#4A5260] mt-1">{simResult.overdraftLimit}</div>
              </div>
            </div>

            {/* Account Limits & Regulatory Notes */}
            <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E2DDD2] space-y-2">
              <div className="text-xs font-mono-tabular uppercase text-[#141A24] font-bold">
                Applicable RBI & DFS Operational Conditions:
              </div>
              <div className="text-xs text-[#D95D24] font-mono-tabular font-semibold">
                Account Cap: {simResult.balanceCap}
              </div>
              <ul className="space-y-1.5 text-xs text-[#4A5260]">
                {simResult.notes.map((n) => (
                  <li key={n} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B6B45] shrink-0 mt-0.5" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 10-Year Empirical Data Explorer (Chart + Table for PPT/Report) */}
      <div className="bg-white rounded-xl border border-[#E2DDD2] p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DDD2] pb-4 mb-6">
          <div>
            <span className="text-xs font-mono-tabular uppercase tracking-wider text-[#D95D24] font-semibold">
              OFFICIAL MINISTRY OF FINANCE STATISTICAL ARCHIVE (2015 – 2024+)
            </span>
            <h3 className="text-2xl font-editorial font-bold text-[#141A24] mt-0.5">
              Decadal Growth of PMJDY Accounts, Deposits & RuPay Cards
            </h3>
          </div>

          <div className="inline-flex rounded-lg bg-[#F3EFE6] p-1 border border-[#E2DDD2]">
            {[
              { key: 'accountsCr', label: 'Total Accounts (Cr)' },
              { key: 'depositsCr', label: 'Total Deposits (₹ Cr)' },
              { key: 'avgDepositRs', label: 'Avg Deposit / Account (₹)' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setChartMetric(tab.key as typeof chartMetric)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  chartMetric === tab.key
                    ? 'bg-[#141A24] text-white shadow-xs'
                    : 'text-[#4A5260] hover:text-[#141A24]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Bar Chart */}
        <div className="bg-[#FAF7F2] rounded-xl p-5 border border-[#E2DDD2] mb-6">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 items-end h-52 pt-6">
            {DECADAL_GROWTH_DATA.map((row) => {
              const maxVal =
                chartMetric === 'accountsCr'
                  ? 55
                  : chartMetric === 'depositsCr'
                  ? 240000
                  : 4500;
              const val = row[chartMetric];
              const heightPct = Math.max(12, Math.round((val / maxVal) * 100));
              const formattedVal =
                chartMetric === 'accountsCr'
                  ? `${row.accountsCr}Cr`
                  : chartMetric === 'depositsCr'
                  ? `₹${(row.depositsCr / 1000).toFixed(0)}k Cr`
                  : `₹${row.avgDepositRs}`;

              return (
                <div key={row.year} className="flex flex-col items-center h-full justify-end group">
                  <span className="font-mono-tabular text-[10px] font-bold text-[#141A24] mb-1.5">
                    {formattedVal}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[#141A24] via-[#D95D24] to-[#F59E0B] transition-all duration-300 group-hover:opacity-90"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="font-mono-tabular text-[10px] text-[#4A5260] mt-2 text-center">
                    {row.year.replace('Mar ', '’').replace('Aug ', '’')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complete Project Reference Data Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E2DDD2]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F3EFE6] text-[#141A24] border-b border-[#E2DDD2] font-mono-tabular text-xs uppercase">
                <th className="py-3 px-4">Timeline (As of)</th>
                <th className="py-3 px-4">Total PMJDY Accounts</th>
                <th className="py-3 px-4">Aggregate Deposits (₹ Cr)</th>
                <th className="py-3 px-4">Avg Balance / Account</th>
                <th className="py-3 px-4">RuPay Debit Cards Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DDD2] font-mono-tabular">
              {DECADAL_GROWTH_DATA.map((r) => (
                <tr key={r.year} className="hover:bg-[#FAF7F2]">
                  <td className="py-2.5 px-4 font-bold text-[#141A24]">{r.year}</td>
                  <td className="py-2.5 px-4 text-[#D95D24] font-semibold">{r.accountsCr} Crore</td>
                  <td className="py-2.5 px-4 text-[#1B6B45] font-semibold">
                    ₹{r.depositsCr.toLocaleString('en-IN')} Cr
                  </td>
                  <td className="py-2.5 px-4 text-[#1E3A5F]">₹{r.avgDepositRs.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-4 text-[#4A5260]">{r.rupayCr} Crore</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Official RBI & Ministry of Finance Guidelines Compendium */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono-tabular uppercase tracking-wider text-[#D95D24] font-semibold">
              REGULATORY HANDBOOK & CITIZEN CHARTER
            </span>
            <h3 className="text-2xl font-editorial font-bold text-[#141A24]">
              Official PMJDY Guidelines, KYC Rules & Claim Procedures
            </h3>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D95D24] text-white'
                    : 'bg-white border border-[#E2DDD2] text-[#4A5260] hover:text-[#141A24]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGuidelines.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E2DDD2] p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#F3EFE6] text-[#141A24] font-mono-tabular text-xs font-bold">
                    {item.code}
                  </span>
                  <span className="text-xs font-mono-tabular text-[#D95D24] font-semibold">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-lg font-editorial font-bold text-[#141A24]">{item.title}</h4>
                <div className="text-xs text-[#1B6B45] font-medium mt-0.5 mb-2.5">
                  Issuing Authority: {item.authority}
                </div>
                <p className="text-xs sm:text-sm text-[#4A5260] leading-relaxed mb-3">
                  {item.summary}
                </p>

                <div className="bg-[#FAF7F2] rounded-lg p-3.5 border border-[#E2DDD2] mb-3">
                  <div className="text-[11px] font-mono-tabular uppercase text-[#141A24] font-bold mb-1.5">
                    Mandatory Regulatory Requirements:
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#141A24]">
                    {item.mandatoryRequirements.map((req) => (
                      <li key={req} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D95D24] shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2DDD2] text-xs space-y-1">
                <div className="text-[#1B6B45]">
                  <strong>Special Relaxation:</strong> {item.exceptionsOrRelaxations}
                </div>
                <div className="font-mono-tabular text-[11px] text-[#7A8291]">
                  Reference: {item.officialReference}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Helpline & National Portal Banner */}
      <div className="bg-[#141A24] text-[#FAF7F2] rounded-xl p-6 border-l-4 border-[#D95D24] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#FDE047]">
            OFFICIAL GOVERNMENT OF INDIA HELPLINE & RESOURCES
          </div>
          <h4 className="text-xl font-editorial font-bold">
            National Toll-Free Jan Dhan Helplines & Citizen Grievance Redressal
          </h4>
          <p className="text-xs text-[#FAF7F2]/80">
            For account opening assistance, Bank Mitra complaints, Overdraft queries, or RuPay insurance claims.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono-tabular">
          <div className="bg-[#1C2536] border border-white/15 rounded-lg px-4 py-2.5">
            <div className="text-[10px] text-[#FAF7F2]/60 uppercase">Primary Toll-Free</div>
            <div className="text-base font-bold text-[#4ADE80] flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> 1800-11-0001
            </div>
          </div>
          <div className="bg-[#1C2536] border border-white/15 rounded-lg px-4 py-2.5">
            <div className="text-[10px] text-[#FAF7F2]/60 uppercase">Secondary Toll-Free</div>
            <div className="text-base font-bold text-[#FDE047] flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> 1800-180-1111
            </div>
          </div>
          <div className="bg-[#1C2536] border border-white/15 rounded-lg px-4 py-2.5">
            <div className="text-[10px] text-[#FAF7F2]/60 uppercase">Official Portal</div>
            <div className="text-base font-bold text-white">pmjdy.gov.in</div>
          </div>
        </div>
      </div>
    </div>
  );
};
