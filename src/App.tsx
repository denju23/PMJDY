import React, { useState } from 'react';
import {
  Landmark,
  Film,
  Presentation,
  BookOpen,
  Download,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { KEY_NATIONAL_STATS, PPT_SLIDES, VIDEO_CHAPTERS, OFFICIAL_GUIDELINES } from './data/pmjdyData';
import { VideoStudio } from './components/VideoStudio';
import { PptSlideStudio } from './components/PptSlideStudio';
import { GuidelinesAndSimulator } from './components/GuidelinesAndSimulator';

type ActiveSection = 'all' | 'video' | 'ppt' | 'guidelines';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveSection>('all');

  // Download Complete Combined Project Kit (PPT + Video Script + Guidelines)
  const handleDownloadFullProjectKit = () => {
    const lines: string[] = [
      '=========================================================================',
      'PRADHAN MANTRI JAN DHAN YOJANA (PMJDY) — COMPLETE PROJECT KIT',
      'Includes: 12-Slide PPT Deck + 6-Chapter Video Script + Official Guidelines',
      'National Motto: "Mera Khata, Bhagya Vidhata" | Launched: 28 August 2014',
      '=========================================================================\n',
      'PART 1: KEY NATIONAL STATISTICS (2014 – 2024+)',
      '• Total PMJDY Accounts: 53.13 Crore+',
      '• Women Beneficiaries: 29.56 Crore (55.6%)',
      '• Rural & Semi-Urban Accounts: 35.38 Crore (66.6%)',
      '• Aggregate Deposit Balance: ₹2,31,236 Crore (Avg ₹4,352 per account)',
      '• RuPay Debit Cards Issued: 36.14 Crore+',
      '• Guinness World Record: 1,80,96,130 accounts opened in Week 1 (23–29 Aug 2014)\n',
      '=========================================================================',
      'PART 2: 12-SLIDE POWERPOINT (PPT) PRESENTATION & SPEAKER NOTES',
      '=========================================================================\n'
    ];

    PPT_SLIDES.forEach((s) => {
      lines.push(`[SLIDE ${String(s.id).padStart(2, '0')}] ${s.title}`);
      lines.push(`Hindi Title: ${s.hindiTitle}`);
      lines.push(`Subtitle: ${s.subtitle}`);
      s.keyPoints.forEach((kp, idx) => {
        lines.push(`  ${idx + 1}. ${kp.heading} (${kp.metric || ''}): ${kp.detail}`);
      });
      lines.push(`Speaker Notes: "${s.speakerNotes}"`);
      lines.push(`Viva Tip: ${s.vivaTip}\n`);
    });

    lines.push('=========================================================================');
    lines.push('PART 3: 6-CHAPTER VIDEO DOCUMENTARY SCRIPT & STORYBOARD (EN + HI)');
    lines.push('=========================================================================\n');

    VIDEO_CHAPTERS.forEach((ch) => {
      lines.push(`[${ch.chapterCode}] ${ch.title} (${ch.timestampRange})`);
      lines.push(`Visual Cue: ${ch.storyboardCue.visual}`);
      lines.push(`English Narration: "${ch.narrationEn}"`);
      lines.push(`Hindi Narration: "${ch.narrationHi}"\n`);
    });

    lines.push('=========================================================================');
    lines.push('PART 4: OFFICIAL RBI & MINISTRY OF FINANCE GUIDELINES');
    lines.push('=========================================================================\n');

    OFFICIAL_GUIDELINES.forEach((g) => {
      lines.push(`[${g.code}] ${g.title} (${g.authority})`);
      lines.push(`Summary: ${g.summary}`);
      g.mandatoryRequirements.forEach((r) => lines.push(`  - ${r}`));
      lines.push(`Relaxation: ${g.exceptionsOrRelaxations}\n`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PMJDY_Complete_PPT_Video_and_Guidelines_Project_Kit.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#141A24]">
      {/* Sticky Top Institutional Header */}
      <header className="sticky top-0 z-40 h-16 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E2DDD2] px-4 sm:px-8 flex items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#141A24] text-[#FAF7F2] flex items-center justify-center border-b-2 border-[#D95D24] shrink-0">
            <Landmark className="w-5 h-5 text-[#FDE047]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial font-bold text-base sm:text-lg tracking-tight text-[#141A24]">
                PMJDY Project Studio
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider bg-[#D95D24]/15 text-[#D95D24] font-bold rounded">
                PPT + Video + Guidelines
              </span>
            </div>
            <p className="text-[11px] text-[#4A5260] hidden sm:block">
              Pradhan Mantri Jan Dhan Yojana • National Mission for Financial Inclusion
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
          {[
            { id: 'all', label: 'Complete Studio', icon: Sparkles },
            { id: 'video', label: 'Video & Script', icon: Film },
            { id: 'ppt', label: '12-Slide PPT', icon: Presentation },
            { id: 'guidelines', label: 'Guidelines & Eligibility', icon: BookOpen }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as ActiveSection)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#141A24] text-[#FAF7F2] shadow-xs'
                    : 'text-[#4A5260] hover:text-[#141A24] hover:bg-[#F3EFE6]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#D95D24]" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Download Full Kit CTA */}
        <button
          type="button"
          onClick={handleDownloadFullProjectKit}
          className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D95D24] hover:bg-[#C04E18] text-white text-xs font-semibold transition shadow-xs cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" /> Download Project Kit
        </button>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-8 py-8 space-y-12">
        {/* Editorial Hero Header & National Impact Ledger */}
        <section className="space-y-6 no-print">
          <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs relative overflow-hidden">
            {/* Subtle top tricolor-inspired editorial accent rule */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D95D24] via-[#FAF7F2] to-[#1B6B45]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex flex-wrap items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[#D95D24] font-bold">
                  <span>MINISTRY OF FINANCE (DFS) ARCHIVE</span>
                  <span>•</span>
                  <span className="text-[#1B6B45]">“मेरा खाता, भाग्य विधाता” (MERA KHATA, BHAGYA VIDHATA)</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#141A24] tracking-tight leading-[1.1]">
                  Pradhan Mantri Jan Dhan Yojana: Interactive Video, PPT & Policy Guidelines
                </h1>

                <p className="text-sm sm:text-base text-[#4A5260] max-w-3xl leading-relaxed">
                  A complete multimedia project & policy reference suite covering India’s historic National Mission for Financial Inclusion (launched <strong>28 August 2014</strong>)—featuring an animated <strong>6-chapter voiceover documentary</strong>, a ready-to-present <strong>12-slide PowerPoint deck with viva notes</strong>, and official <strong>RBI & DFS master guidelines</strong>.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D95D24] hover:bg-[#C04E18] text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
                  >
                    <Film className="w-4 h-4" /> Watch Explainer Video & Script
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('ppt')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#141A24] hover:bg-[#253042] text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    <Presentation className="w-4 h-4 text-[#FDE047]" /> Present 12-Slide PPT Deck
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('guidelines')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2DDD2] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#141A24] text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#1B6B45]" /> Check Eligibility & Guidelines
                  </button>
                </div>
              </div>

              {/* Quick Project Fact Sheet Card */}
              <div className="lg:col-span-4 bg-[#FAF7F2] rounded-xl p-5 border border-[#E2DDD2] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-2.5">
                  <span className="font-mono-tabular text-xs font-bold uppercase text-[#141A24]">
                    AT A GLANCE • PROJECT FACT SHEET
                  </span>
                  <Award className="w-4 h-4 text-[#D95D24]" />
                </div>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#4A5260]">Announced / Launched:</dt>
                    <dd className="font-mono-tabular font-bold text-[#141A24]">15 Aug / 28 Aug 2014</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#4A5260]">Nodal Ministry:</dt>
                    <dd className="font-semibold text-[#141A24]">Ministry of Finance (DFS)</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#4A5260]">Account Classification:</dt>
                    <dd className="font-mono-tabular font-semibold text-[#1B6B45]">Zero-Balance BSBD</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#4A5260]">RuPay Accident Cover:</dt>
                    <dd className="font-mono-tabular font-bold text-[#D95D24]">₹2,00,000 (Post-2018)</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#4A5260]">Overdraft (OD) Limit:</dt>
                    <dd className="font-mono-tabular font-bold text-[#1E3A5F]">Up to ₹10,000</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#4A5260]">Guinness World Record:</dt>
                    <dd className="font-mono-tabular font-semibold text-[#141A24]">1.80 Cr Accounts (Week 1)</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* 4 Key National Statistics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E2DDD2]">
              {KEY_NATIONAL_STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E2DDD2] flex flex-col justify-between"
                >
                  <div className="text-2xl sm:text-3xl font-mono-tabular font-bold text-[#141A24]">
                    {stat.metric}
                  </div>
                  <div className="mt-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#D95D24]">
                      {stat.label}
                    </div>
                    <div className="text-xs text-[#4A5260] mt-0.5">{stat.sublabel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 1: VIDEO DOCUMENTARY STUDIO */}
        {(activeTab === 'all' || activeTab === 'video') && (
          <section className="space-y-4 no-print" id="video-studio">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-xs font-mono-tabular uppercase tracking-widest text-[#D95D24] font-bold">
                  MODULE 01 • INTERACTIVE VIDEO EXPLAINER & STORYBOARD
                </span>
                <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#141A24]">
                  PMJDY Documentary Video Player (with English & Hindi Voiceover)
                </h2>
              </div>
              <p className="text-xs text-[#4A5260]">
                Click <strong>Play Documentary</strong> to hear synchronized audio narration and view animated scenes.
              </p>
            </div>

            <VideoStudio
              onOpenFullSlideDeck={() => {
                setActiveTab('ppt');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </section>
        )}

        {/* SECTION 2: 12-SLIDE PPT PRESENTATION DECK */}
        {(activeTab === 'all' || activeTab === 'ppt') && (
          <section className="space-y-4" id="ppt-studio">
            <div className="flex flex-wrap items-end justify-between gap-2 no-print">
              <div>
                <span className="text-xs font-mono-tabular uppercase tracking-widest text-[#1B6B45] font-bold">
                  MODULE 02 • POWERPOINT (PPT) SLIDE DECK & VIVA NOTES
                </span>
                <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#141A24]">
                  12-Slide Project Presentation Deck
                </h2>
              </div>
              <p className="text-xs text-[#4A5260]">
                Use keyboard arrows (← / →) to navigate slides or click <strong>Present Fullscreen</strong>.
              </p>
            </div>

            <PptSlideStudio />
          </section>
        )}

        {/* SECTION 3: OFFICIAL GUIDELINES, ELIGIBILITY SIMULATOR & DATA CHARTS */}
        {(activeTab === 'all' || activeTab === 'guidelines') && (
          <section className="space-y-4 no-print" id="guidelines-studio">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-xs font-mono-tabular uppercase tracking-widest text-[#1E3A5F] font-bold">
                  MODULE 03 • OFFICIAL GUIDELINES, ELIGIBILITY & DECADAL DATA
                </span>
                <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#141A24]">
                  RBI & Ministry of Finance Guidelines + Benefit Calculator
                </h2>
              </div>
              <p className="text-xs text-[#4A5260]">
                Verify eligibility, "Chhota Khata" zero-document rules, Overdraft conditions, and 10-year data.
              </p>
            </div>

            <GuidelinesAndSimulator />
          </section>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#F3EFE6] border-t border-[#E2DDD2] py-8 px-4 sm:px-8 mt-12 no-print">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#4A5260]">
          <div className="space-y-1">
            <div className="font-editorial font-bold text-sm text-[#141A24]">
              Pradhan Mantri Jan Dhan Yojana (PMJDY) — PPT, Video & Policy Guidelines Portal
            </div>
            <p>
              Compiled from official public records of the Department of Financial Services (DFS), Ministry of Finance, Reserve Bank of India (RBI), and NPCI.
            </p>
          </div>
          <div className="font-mono-tabular text-right space-y-1">
            <div className="text-[#141A24] font-semibold">
              National Toll-Free Helplines: 1800-11-0001 | 1800-180-1111
            </div>
            <div>Official Web Reference: pmjdy.gov.in • rbi.org.in</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
