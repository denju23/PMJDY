import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  Check,
  Printer,
  Presentation,
  Mic,
  HelpCircle,
  BookOpen,
  Layers,
  CheckCircle2,
  Award
} from 'lucide-react';
import { PPT_SLIDES, SlideData } from '../data/pmjdyData';

export const PptSlideStudio: React.FC = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAllSlidesGrid, setShowAllSlidesGrid] = useState(false);
  const [copiedSlideText, setCopiedSlideText] = useState(false);

  const slideDeckRef = useRef<HTMLDivElement>(null);
  const safeSlideIdx = Math.min(Math.max(0, currentSlideIdx), PPT_SLIDES.length - 1);
  const slide: SlideData = PPT_SLIDES[safeSlideIdx] || PPT_SLIDES[0];

  // Keyboard navigation for left/right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlideIdx((prev) => Math.min(PPT_SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIdx((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFullscreen = () => {
    if (!slideDeckRef.current) return;
    if (!document.fullscreenElement) {
      slideDeckRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatDeckForExport = () => {
    const out: string[] = [
      '=========================================================================',
      'PRADHAN MANTRI JAN DHAN YOJANA (PMJDY) — COMPLETE 12-SLIDE PPT DECK',
      'Includes: Slide Titles, Key Bullet Points, Comparison Tables, Speaker Notes & Viva Tips',
      '=========================================================================\n'
    ];
    PPT_SLIDES.forEach((s) => {
      out.push(`--- SLIDE ${String(s.id).padStart(2, '0')}: ${s.title} ---`);
      out.push(`Hindi Subtitle: ${s.hindiTitle}`);
      out.push(`Theme: ${s.subtitle}\n`);
      out.push('KEY SLIDE BULLETS:');
      s.keyPoints.forEach((kp, i) => {
        out.push(`  ${i + 1}. ${kp.heading} [${kp.metric || ''}]: ${kp.detail}`);
      });
      if (s.comparisonTable) {
        out.push('\nCOMPARISON TABLE (PMJDY 1.0 vs PMJDY 2.0):');
        s.comparisonTable.forEach((row) => {
          out.push(`  • ${row.dimension}: (${row.phase1}) ---> (${row.phase2})`);
        });
      }
      out.push(`\nSPEAKER NOTES (FOR PRESENTATION): "${s.speakerNotes}"`);
      out.push(`VIVA / EXAMINER TIP: ${s.vivaTip}`);
      out.push(`SOURCE: ${s.sourceRef}`);
      out.push('=========================================================================\n');
    });
    return out.join('\n');
  };

  const handleCopyDeck = () => {
    navigator.clipboard.writeText(formatDeckForExport());
    setCopiedSlideText(true);
    setTimeout(() => setCopiedSlideText(false), 2500);
  };

  const handleDownloadDeck = () => {
    const blob = new Blob([formatDeckForExport()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PMJDY_12_Slide_PPT_Presentation_and_Notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintSlides = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top PPT Action Toolbar */}
      <div className="bg-white rounded-xl border border-[#E2DDD2] p-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D95D24]/10 border border-[#D95D24]/30 flex items-center justify-center text-[#D95D24]">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[#D95D24] font-semibold">
              READY-TO-PRESENT ACADEMIC & POLICY SLIDE DECK
            </div>
            <h2 className="text-lg font-editorial font-bold text-[#141A24]">
              12-Slide PMJDY PowerPoint (PPT) Deck + Viva Speaker Notes
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAllSlidesGrid((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-xs font-semibold text-[#141A24] cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#D95D24]" />
            {showAllSlidesGrid ? 'Single Slide View' : 'View All 12 Slides'}
          </button>

          <button
            type="button"
            onClick={handleCopyDeck}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-xs font-semibold text-[#141A24] cursor-pointer"
          >
            {copiedSlideText ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1B6B45]" /> Copied All 12 Slides!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#4A5260]" /> Copy PPT Content
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadDeck}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1B6B45] hover:bg-[#145335] text-xs font-semibold text-white cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download PPT Notes (.TXT)
          </button>

          <button
            type="button"
            onClick={handlePrintSlides}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141A24] hover:bg-[#253042] text-xs font-semibold text-white cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Interactive Single-Slide Stage */}
      {!showAllSlidesGrid ? (
        <div
          ref={slideDeckRef}
          className={`bg-white rounded-xl border border-[#E2DDD2] shadow-lg overflow-hidden flex flex-col justify-between ${
            isFullscreen ? 'p-8 bg-[#FAF7F2] h-screen overflow-y-auto' : ''
          }`}
        >
          {/* Slide Top Ribbon */}
          <div className="bg-[#141A24] text-[#FAF7F2] px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b-4 border-[#D95D24]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded bg-[#D95D24] text-white font-mono-tabular text-xs font-bold">
                SLIDE {String(slide.id).padStart(2, '0')} / {PPT_SLIDES.length}
              </span>
              <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#FAF7F2]/80">
                {slide.category}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-tabular text-[#FAF7F2]/70 hidden sm:inline">
                Pradhan Mantri Jan Dhan Yojana (PMJDY) • Project Presentation
              </span>
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer no-print"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" /> Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" /> Present Fullscreen
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Slide Body (16:9 Presentation Canvas) */}
          <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#FFFFFF] via-[#FAF7F2] to-[#F3EFE6] min-h-[430px] flex flex-col justify-between">
            {/* Slide Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#E2DDD2] pb-5">
              <div className="max-w-3xl">
                <div className="text-xs sm:text-sm font-semibold text-[#1B6B45] mb-1">
                  {slide.hindiTitle}
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold text-[#141A24] leading-tight">
                  {slide.title}
                </h3>
                <p className="text-sm text-[#4A5260] mt-2">{slide.subtitle}</p>
              </div>

              {slide.highlightStat && (
                <div className="bg-[#141A24] text-[#FAF7F2] rounded-xl p-4 min-w-[220px] border-l-4 border-[#D95D24] shrink-0">
                  <div className="text-2xl sm:text-3xl font-mono-tabular font-bold text-[#FDE047]">
                    {slide.highlightStat.value}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white mt-1">
                    {slide.highlightStat.label}
                  </div>
                  <div className="text-[11px] text-[#FAF7F2]/70 mt-0.5">
                    {slide.highlightStat.subtext}
                  </div>
                </div>
              )}
            </div>

            {/* Key Bullet Cards Grid */}
            <div
              className={`grid gap-4 my-6 ${
                slide.keyPoints.length === 6
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : slide.keyPoints.length === 4
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-3'
              }`}
            >
              {slide.keyPoints.map((pt, index) => (
                <div
                  key={pt.heading}
                  className="bg-white rounded-xl p-4 border border-[#E2DDD2] shadow-xs flex flex-col justify-between hover:border-[#D95D24]/60 transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F3EFE6] text-[#141A24] font-mono-tabular text-xs font-bold">
                        0{index + 1}
                      </span>
                      {pt.metric && (
                        <span className="px-2 py-0.5 rounded bg-[#D95D24]/10 text-[#D95D24] font-mono-tabular text-xs font-bold">
                          {pt.metric}
                        </span>
                      )}
                    </div>
                    <h4 className="font-editorial font-bold text-base text-[#141A24] mb-1.5">
                      {pt.heading}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A5260] leading-relaxed">{pt.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Comparison Table (if slide includes Phase 1 vs Phase 2 table) */}
            {slide.comparisonTable && (
              <div className="mb-6 overflow-x-auto rounded-xl border border-[#E2DDD2] bg-white">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#F3EFE6] text-[#141A24] border-b border-[#E2DDD2]">
                      <th className="py-2.5 px-4 font-mono-tabular uppercase text-xs">Policy Dimension</th>
                      <th className="py-2.5 px-4 font-mono-tabular uppercase text-xs text-[#4A5260]">
                        Previous / Phase I (2014–2018)
                      </th>
                      <th className="py-2.5 px-4 font-mono-tabular uppercase text-xs text-[#1B6B45]">
                        Upgraded / Phase II (Post-2018)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD2]">
                    {slide.comparisonTable.map((row) => (
                      <tr key={row.dimension} className="hover:bg-[#FAF7F2]">
                        <td className="py-2.5 px-4 font-semibold text-[#141A24]">{row.dimension}</td>
                        <td className="py-2.5 px-4 text-[#4A5260]">{row.phase1}</td>
                        <td className="py-2.5 px-4 font-medium text-[#1B6B45]">{row.phase2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Slide Footer Citation Bar */}
            <div className="pt-3 border-t border-[#E2DDD2] flex flex-wrap items-center justify-between gap-2 text-xs text-[#7A8291] font-mono-tabular">
              <span>SOURCE: {slide.sourceRef}</span>
              <span>NATIONAL MISSION FOR FINANCIAL INCLUSION (PMJDY)</span>
            </div>
          </div>

          {/* Slide Navigation Controls Bar */}
          <div className="bg-[#F3EFE6] px-6 py-3.5 border-t border-[#E2DDD2] flex flex-wrap items-center justify-between gap-4 no-print">
            <button
              type="button"
              onClick={() => setCurrentSlideIdx((i) => Math.max(0, i - 1))}
              disabled={currentSlideIdx === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#E2DDD2] text-xs sm:text-sm font-semibold text-[#141A24] disabled:opacity-40 hover:bg-[#FAF7F2] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Slide
            </button>

            {/* Numbered Slide Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {PPT_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlideIdx(idx)}
                  className={`w-8 h-8 rounded-lg font-mono-tabular text-xs font-bold transition cursor-pointer ${
                    idx === currentSlideIdx
                      ? 'bg-[#D95D24] text-white shadow-xs'
                      : 'bg-white border border-[#E2DDD2] text-[#4A5260] hover:text-[#141A24]'
                  }`}
                  title={s.title}
                >
                  {s.id}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentSlideIdx((i) => Math.min(PPT_SLIDES.length - 1, i + 1))}
              disabled={currentSlideIdx === PPT_SLIDES.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D95D24] hover:bg-[#C04E18] text-xs sm:text-sm font-semibold text-white disabled:opacity-40 cursor-pointer"
            >
              Next Slide <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speaker Notes & Viva Prep Coach Drawer */}
          <div className="bg-white p-5 sm:p-6 border-t border-[#E2DDD2] grid grid-cols-1 lg:grid-cols-12 gap-4 no-print">
            <div className="lg:col-span-7 bg-[#FAF7F2] rounded-xl p-4 border border-[#E2DDD2]">
              <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[#D95D24] font-bold mb-1.5">
                <Mic className="w-4 h-4" /> Presenter Speaker Notes (What to say in class / presentation)
              </div>
              <p className="text-xs sm:text-sm text-[#141A24] leading-relaxed">
                “{slide.speakerNotes}”
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#1B6B45]/5 rounded-xl p-4 border border-[#1B6B45]/25">
              <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[#1B6B45] font-bold mb-1.5">
                <HelpCircle className="w-4 h-4" /> Viva / Q&A Examiner Tip
              </div>
              <p className="text-xs sm:text-sm text-[#141A24] leading-relaxed">
                {slide.vivaTip}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* All 12 Slides Overview Grid (Also great for Print / Review) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PPT_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setCurrentSlideIdx(idx);
                setShowAllSlidesGrid(false);
              }}
              className="bg-white rounded-xl border border-[#E2DDD2] p-5 shadow-xs hover:border-[#D95D24] transition cursor-pointer flex flex-col justify-between print-page-break"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-[#E2DDD2] pb-2.5 mb-3">
                  <span className="px-2 py-0.5 rounded bg-[#141A24] text-white font-mono-tabular text-xs font-bold">
                    SLIDE {String(s.id).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono-tabular text-[#D95D24] font-semibold">
                    Click to Present Full Slide →
                  </span>
                </div>
                <div className="text-xs font-medium text-[#1B6B45]">{s.hindiTitle}</div>
                <h3 className="text-xl font-editorial font-bold text-[#141A24] mt-0.5">{s.title}</h3>
                <p className="text-xs text-[#4A5260] mt-1 mb-3">{s.subtitle}</p>

                <ul className="space-y-2 text-xs text-[#141A24]">
                  {s.keyPoints.map((kp) => (
                    <li key={kp.heading} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D95D24] shrink-0 mt-0.5" />
                      <span>
                        <strong>{kp.heading}:</strong> {kp.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2DDD2] bg-[#FAF7F2] -mx-5 -mb-5 p-4 rounded-b-xl">
                <div className="text-[11px] font-mono-tabular uppercase text-[#D95D24] font-bold">
                  Speaker Note Summary:
                </div>
                <p className="text-xs text-[#4A5260] mt-0.5 line-clamp-2">“{s.speakerNotes}”</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
