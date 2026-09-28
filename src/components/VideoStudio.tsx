import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  FileText,
  Download,
  Copy,
  Check,
  Sparkles,
  Film,
  ShieldCheck,
  Landmark,
  CreditCard,
  Smartphone,
  FileCheck2,
  Maximize2,
  Minimize2,
  Mic,
  Square,
  Upload,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Radio
} from 'lucide-react';
import { VIDEO_CHAPTERS, VideoChapter } from '../data/pmjdyData';

interface VideoStudioProps {
  compactHeroMode?: boolean;
  onOpenFullSlideDeck?: () => void;
}

interface CustomVoiceRecording {
  chapterId: number; // 0 = Full Video Global Voiceover, 1..6 = specific chapter
  audioUrl: string;
  blob?: Blob;
  fileName: string;
  durationSec: number;
  mimeType?: string;
}

function getSupportedAudioMimeType(): string {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return '';
  }
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/wav'
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return '';
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  compactHeroMode = false,
  onOpenFullSlideDeck
}) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedInChapter, setElapsedInChapter] = useState(0);
  const [voiceMode, setVoiceMode] = useState<'en' | 'hi' | 'custom'>('en');
  const [isMuted, setIsMuted] = useState(false);
  const [showScriptPanel, setShowScriptPanel] = useState(!compactHeroMode);
  const [showVoiceStudio, setShowVoiceStudio] = useState(true);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Whether user's uploaded voice plays continuously across the entire video or per-chapter
  const [customPlaybackScope, setCustomPlaybackScope] = useState<'full_video' | 'per_chapter'>('full_video');

  // Global/Full-video voice recording (used when user uploads a single voice file for the whole video)
  const [globalVoice, setGlobalVoice] = useState<CustomVoiceRecording | null>(null);

  // Per-chapter voice recordings (if user records/uploads chapter-by-chapter)
  const [customRecordings, setCustomRecordings] = useState<Record<number, CustomVoiceRecording>>({});

  // Editable scripts per chapterId
  const [customScriptsEn, setCustomScriptsEn] = useState<Record<number, string>>({});
  const [customScriptsHi, setCustomScriptsHi] = useState<Record<number, string>>({});
  const [isEditingScript, setIsEditingScript] = useState(false);

  // Microphone Recording State
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [audioPlayStatus, setAudioPlayStatus] = useState<string | null>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  // Persistent DOM <audio> element so browsers never block playback
  const domAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const safeChapterIdx = Math.min(Math.max(0, activeChapterIdx), VIDEO_CHAPTERS.length - 1);
  const currentChapter: VideoChapter = VIDEO_CHAPTERS[safeChapterIdx] || VIDEO_CHAPTERS[0];

  // Resolve the active custom voice for the current chapter (either chapter-specific or global uploaded voice)
  const activeCustomVoice: CustomVoiceRecording | undefined =
    customRecordings[currentChapter.id] || globalVoice || Object.values(customRecordings)[0];

  const hasAnyCustomVoice = Boolean(globalVoice || Object.keys(customRecordings).length > 0);

  const activeNarrationEn = customScriptsEn[currentChapter.id] ?? currentChapter.narrationEn;
  const activeNarrationHi = customScriptsHi[currentChapter.id] ?? currentChapter.narrationHi;

  // Compute effective chapter duration
  const effectiveDurationSec = (() => {
    const chapterRec = customRecordings[currentChapter.id];
    if (customPlaybackScope === 'per_chapter' && chapterRec && chapterRec.durationSec > 2) {
      return Math.ceil(chapterRec.durationSec);
    }
    if (customPlaybackScope === 'full_video' && globalVoice && globalVoice.durationSec > 10) {
      // Distribute full-video voiceover duration evenly across the 6 chapters
      return Math.max(8, Math.ceil(globalVoice.durationSec / VIDEO_CHAPTERS.length));
    }
    return currentChapter.durationSec;
  })();

  // Stop all audio (both DOM <audio> and Web Speech synthesis)
  const stopAllAudioPlayback = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (domAudioRef.current) {
      domAudioRef.current.pause();
    }
  }, []);

  // Directly start playing the DOM <audio> or Web Speech API
  const triggerAudioForChapter = useCallback(
    (
      chapter: VideoChapter,
      mode: 'en' | 'hi' | 'custom',
      muted: boolean,
      isChapterTransition = false
    ) => {
      if (muted) {
        stopAllAudioPlayback();
        return;
      }

      const chapterVoice = customRecordings[chapter.id];
      const fallbackVoice = globalVoice || Object.values(customRecordings)[0];
      const chosenVoice =
        customPlaybackScope === 'per_chapter'
          ? chapterVoice || fallbackVoice
          : fallbackVoice || chapterVoice;

      // If user is in 'custom' mode (or has uploaded/recorded a voice and selected custom mode)
      if (mode === 'custom' && chosenVoice && domAudioRef.current) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }

        const audioEl = domAudioRef.current;

        // If full_video scope and the same global audio is already playing during a chapter transition, let it continue smoothly!
        if (
          isChapterTransition &&
          customPlaybackScope === 'full_video' &&
          !audioEl.paused &&
          audioEl.src === chosenVoice.audioUrl
        ) {
          return;
        }

        if (audioEl.src !== chosenVoice.audioUrl) {
          audioEl.src = chosenVoice.audioUrl;
          audioEl.load();
        } else if (!isChapterTransition) {
          // If starting fresh, rewind if ended
          if (audioEl.ended) {
            audioEl.currentTime = 0;
          }
        }

        audioEl.muted = false;
        audioEl.volume = 1.0;

        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setAudioPlayStatus(`Playing your voice: ${chosenVoice.fileName}`);
            })
            .catch((err) => {
              console.warn('Custom audio playback error:', err);
              setAudioPlayStatus(
                'Could not auto-start audio. Please click the Play button on the audio player below.'
              );
            });
        }
        return;
      }

      // If user is in 'custom' mode, has NO custom voice uploaded yet, fallback to English TTS so it's never silent
      if (domAudioRef.current && !domAudioRef.current.paused) {
        domAudioRef.current.pause();
      }

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      const text =
        mode === 'hi'
          ? customScriptsHi[chapter.id] ?? chapter.narrationHi
          : customScriptsEn[chapter.id] ?? chapter.narrationEn;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = mode === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.98;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find((v) =>
        mode === 'hi'
          ? v.lang.includes('hi')
          : v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    },
    [
      customPlaybackScope,
      customRecordings,
      customScriptsEn,
      customScriptsHi,
      globalVoice,
      stopAllAudioPlayback
    ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudioPlayback();
      if (analyserIntervalRef.current) window.clearInterval(analyserIntervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    };
  }, [stopAllAudioPlayback]);

  // Handle chapter transitions while video is playing
  const prevChapterIdxRef = useRef(activeChapterIdx);
  useEffect(() => {
    if (prevChapterIdxRef.current !== activeChapterIdx) {
      prevChapterIdxRef.current = activeChapterIdx;
      if (isPlaying) {
        triggerAudioForChapter(currentChapter, voiceMode, isMuted, true);
      }
    }
  }, [activeChapterIdx, currentChapter, isMuted, isPlaying, triggerAudioForChapter, voiceMode]);

  // Timer interval for video progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsedInChapter((prev) => prev + 0.25);
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Advance chapter or stop when elapsedInChapter reaches effectiveDurationSec
  useEffect(() => {
    if (!isPlaying) return;
    if (elapsedInChapter >= effectiveDurationSec) {
      if (safeChapterIdx < VIDEO_CHAPTERS.length - 1) {
        setActiveChapterIdx((idx) => Math.min(VIDEO_CHAPTERS.length - 1, idx + 1));
        setElapsedInChapter(0);
      } else {
        setIsPlaying(false);
        stopAllAudioPlayback();
        setElapsedInChapter(effectiveDurationSec);
      }
    }
  }, [elapsedInChapter, effectiveDurationSec, isPlaying, safeChapterIdx, stopAllAudioPlayback]);

  // Timer for active microphone recording
  useEffect(() => {
    if (!isRecordingMic) return;
    const recInterval = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(recInterval);
  }, [isRecordingMic]);

  // Start Microphone Recording
  const handleStartMicRecording = async () => {
    setMicError(null);
    setAudioPlayStatus(null);
    setIsPlaying(false);
    stopAllAudioPlayback();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError(
        'Microphone recording is not supported in this browser. Please use "Upload Voice File" instead.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      recordedChunksRef.current = [];
      setRecordingSeconds(0);

      // Live audio level meter
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        analyserIntervalRef.current = window.setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setMicLevel(Math.min(100, Math.round((avg / 100) * 100)));
        }, 100);
      } catch {
        // Ignore analyser error
      }

      const supportedMime = getSupportedAudioMimeType();
      const recorder = supportedMime
        ? new MediaRecorder(stream, { mimeType: supportedMime })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const startTime = Date.now();

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const durationRecorded = Math.max(3, Math.round((Date.now() - startTime) / 1000));
        const actualMime = recorder.mimeType || supportedMime || 'audio/webm';
        const blob = new Blob(recordedChunksRef.current, { type: actualMime });
        const audioUrl = URL.createObjectURL(blob);
        const ext = actualMime.includes('mp4')
          ? 'm4a'
          : actualMime.includes('ogg')
          ? 'ogg'
          : 'webm';

        const newRec: CustomVoiceRecording = {
          chapterId: currentChapter.id,
          audioUrl,
          blob,
          fileName: `PMJDY_${currentChapter.chapterCode}_MyVoice.${ext}`,
          durationSec: durationRecorded,
          mimeType: actualMime
        };

        setCustomRecordings((prev) => ({
          ...prev,
          [currentChapter.id]: newRec
        }));

        // Also set as global fallback so playing from any chapter works immediately
        setGlobalVoice((prev) => prev ?? newRec);
        setVoiceMode('custom');
        setIsRecordingMic(false);
        setMicLevel(0);
        setAudioPlayStatus(
          `Recorded ${durationRecorded}s voiceover for ${currentChapter.chapterCode}. Click "Play Video (With My Voice)" to listen!`
        );

        // Preload into DOM audio element immediately
        if (domAudioRef.current) {
          domAudioRef.current.src = audioUrl;
          domAudioRef.current.load();
        }

        if (analyserIntervalRef.current) {
          window.clearInterval(analyserIntervalRef.current);
          analyserIntervalRef.current = null;
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250);
      setIsRecordingMic(true);
    } catch {
      setMicError(
        'Microphone access was blocked or unavailable. Please allow microphone permission in your browser, or click "Upload Voice File" to attach an audio recording from your phone/computer.'
      );
    }
  };

  const handleStopMicRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Handle uploading an external audio file (.mp3, .wav, .m4a, .aac, .ogg, .webm, .mp4)
  const handleUploadAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMicError(null);
    setIsPlaying(false);
    stopAllAudioPlayback();

    const audioUrl = URL.createObjectURL(file);

    const initialRec: CustomVoiceRecording = {
      chapterId: currentChapter.id,
      audioUrl,
      blob: file,
      fileName: file.name,
      durationSec: currentChapter.durationSec,
      mimeType: file.type || 'audio/mpeg'
    };

    // Save both to current chapter AND global voice so it NEVER plays blank regardless of which chapter is active!
    setGlobalVoice(initialRec);
    setCustomRecordings((prev) => ({
      ...prev,
      [currentChapter.id]: initialRec
    }));
    setVoiceMode('custom');
    setAudioPlayStatus(`Uploaded "${file.name}". Ready to play!`);

    // Load directly into the persistent DOM <audio> element and read real duration
    if (domAudioRef.current) {
      domAudioRef.current.src = audioUrl;
      domAudioRef.current.load();
    }

    const tempAudio = new Audio();
    tempAudio.preload = 'metadata';
    tempAudio.src = audioUrl;
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && isFinite(tempAudio.duration) && tempAudio.duration > 1) {
        const realDuration = Math.ceil(tempAudio.duration);
        const updatedRec: CustomVoiceRecording = {
          ...initialRec,
          durationSec: realDuration
        };
        setGlobalVoice(updatedRec);
        setCustomRecordings((prev) => ({
          ...prev,
          [currentChapter.id]: updatedRec
        }));
      }
    };

    e.target.value = '';
  };

  const handleDeleteCustomVoice = (chapterId: number) => {
    stopAllAudioPlayback();
    setCustomRecordings((prev) => {
      const next = { ...prev };
      delete next[chapterId];
      return next;
    });
    if (globalVoice?.chapterId === chapterId) {
      setGlobalVoice(null);
    }
    setAudioPlayStatus(null);
  };

  const handleClearAllCustomVoices = () => {
    stopAllAudioPlayback();
    setCustomRecordings({});
    setGlobalVoice(null);
    setVoiceMode('en');
    setAudioPlayStatus(null);
  };

  const handleDownloadCustomVoice = (rec: CustomVoiceRecording) => {
    const a = document.createElement('a');
    a.href = rec.audioUrl;
    a.download = rec.fileName;
    a.click();
  };

  // Synchronous Play/Pause handler (guarantees browser allows audio playback!)
  const handleTogglePlay = () => {
    if (isRecordingMic) {
      handleStopMicRecording();
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      stopAllAudioPlayback();
    } else {
      let nextChapterIdx = activeChapterIdx;
      if (elapsedInChapter >= effectiveDurationSec) {
        nextChapterIdx = 0;
        setActiveChapterIdx(0);
        setElapsedInChapter(0);
        if (domAudioRef.current) {
          domAudioRef.current.currentTime = 0;
        }
      }
      const nextMode = hasAnyCustomVoice ? 'custom' : voiceMode;
      if (hasAnyCustomVoice && voiceMode !== 'custom') {
        setVoiceMode('custom');
      }
      setIsPlaying(true);
      // Call synchronously inside user click event so browser never blocks audio!
      triggerAudioForChapter(VIDEO_CHAPTERS[nextChapterIdx], nextMode, isMuted, false);
    }
  };

  // Explicit "Play My Voice Now" handler
  const handlePlayMyVoiceNow = () => {
    if (!hasAnyCustomVoice) {
      setVoiceMode('custom');
      setShowVoiceStudio(true);
      return;
    }
    setVoiceMode('custom');
    if (elapsedInChapter >= effectiveDurationSec) {
      setActiveChapterIdx(0);
      setElapsedInChapter(0);
    }
    if (domAudioRef.current) {
      domAudioRef.current.currentTime = 0;
    }
    setIsPlaying(true);
    triggerAudioForChapter(currentChapter, 'custom', false, false);
    setIsMuted(false);
  };

  const handleSelectChapter = (idx: number) => {
    if (isRecordingMic) {
      handleStopMicRecording();
    }
    setActiveChapterIdx(idx);
    setElapsedInChapter(0);
    if (isPlaying) {
      triggerAudioForChapter(VIDEO_CHAPTERS[idx], voiceMode, isMuted, true);
    }
  };

  const handleNextChapter = () => {
    if (activeChapterIdx < VIDEO_CHAPTERS.length - 1) {
      const nextIdx = activeChapterIdx + 1;
      setActiveChapterIdx(nextIdx);
      setElapsedInChapter(0);
      if (isPlaying) {
        triggerAudioForChapter(VIDEO_CHAPTERS[nextIdx], voiceMode, isMuted, true);
      }
    }
  };

  const handlePrevChapter = () => {
    const prevIdx = activeChapterIdx > 0 ? activeChapterIdx - 1 : 0;
    setActiveChapterIdx(prevIdx);
    setElapsedInChapter(0);
    if (isPlaying) {
      triggerAudioForChapter(VIDEO_CHAPTERS[prevIdx], voiceMode, isMuted, true);
    }
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const progressPercent = Math.min(100, (elapsedInChapter / effectiveDurationSec) * 100);
  const customRecordedCount = Object.keys(customRecordings).length;

  const generateFullVideoScriptText = () => {
    const lines: string[] = [
      '====================================================================',
      'PRADHAN MANTRI JAN DHAN YOJANA (PMJDY) — PROJECT VIDEO SCRIPT & STORYBOARD',
      'Total Runtime: ~01:54 | Format: 6-Chapter Documentary & Explainer',
      'Official Data Source: Ministry of Finance (DFS) & RBI Guidelines',
      '====================================================================\n'
    ];
    VIDEO_CHAPTERS.forEach((ch) => {
      const enText = customScriptsEn[ch.id] ?? ch.narrationEn;
      const hiText = customScriptsHi[ch.id] ?? ch.narrationHi;
      lines.push(`[${ch.chapterCode}] ${ch.title} (${ch.timestampRange})`);
      lines.push(`Hindi Title: ${ch.hindiTitle}`);
      lines.push(`VISUAL / ANIMATION CUE: ${ch.storyboardCue.visual}`);
      lines.push(`ON-SCREEN LOWER THIRD: ${ch.storyboardCue.lowerThird}`);
      lines.push(`ENGLISH VOICEOVER: "${enText}"`);
      lines.push(`HINDI VOICEOVER: "${hiText}"`);
      lines.push(`B-ROLL TIP: ${ch.storyboardCue.bRollSuggestion}`);
      lines.push('--------------------------------------------------------------------\n');
    });
    return lines.join('\n');
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateFullVideoScriptText());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([generateFullVideoScriptText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PMJDY_Video_Project_Script_and_Storyboard.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render bespoke animated motion-graphics scene for each chapter
  const renderSceneVisual = (chapter: VideoChapter) => {
    switch (chapter.sceneType) {
      case 'genesis':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto my-auto">
            <div className="bg-[#1C2536]/90 border border-[#D95D24]/40 rounded-lg p-4 flex flex-col justify-between">
              <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#D95D24]">
                Step 01 • Announcement
              </span>
              <div className="my-3">
                <div className="text-2xl font-editorial font-bold text-[#FAF7F2]">15 Aug 2014</div>
                <p className="text-xs text-[#FAF7F2]/75 mt-1">
                  Announced from the Red Fort on India’s 68th Independence Day to end financial exclusion.
                </p>
              </div>
              <div className="text-[11px] font-mono-tabular text-[#D95D24] border-t border-white/10 pt-2">
                Red Fort Address • New Delhi
              </div>
            </div>

            <div className="bg-[#1C2536]/90 border border-[#FAF7F2]/20 rounded-lg p-4 flex flex-col justify-between">
              <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#4ADE80]">
                Step 02 • Mission Launch
              </span>
              <div className="my-3">
                <div className="text-2xl font-editorial font-bold text-[#FAF7F2]">28 Aug 2014</div>
                <p className="text-xs text-[#FAF7F2]/75 mt-1">
                  Simultaneous launch across 77,852 camps nationwide; 1.50 Crore accounts opened on Day 1.
                </p>
              </div>
              <div className="text-[11px] font-mono-tabular text-[#4ADE80] border-t border-white/10 pt-2">
                Motto: “Mera Khata, Bhagya Vidhata”
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D95D24]/30 to-[#1C2536] border border-[#D95D24] rounded-lg p-4 flex flex-col justify-between">
              <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#FDE047]">
                Step 03 • World Record
              </span>
              <div className="my-3">
                <div className="text-2xl font-mono-tabular font-bold text-[#FAF7F2]">1,80,96,130</div>
                <p className="text-xs text-[#FAF7F2]/85 mt-1">
                  Guinness World Record for most bank accounts opened in 1 week (23–29 August 2014).
                </p>
              </div>
              <div className="text-[11px] font-mono-tabular text-[#FDE047] border-t border-white/10 pt-2">
                Certified by Guinness World Records
              </div>
            </div>
          </div>
        );

      case 'pillars':
        return (
          <div className="w-full max-w-4xl mx-auto my-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { num: 'Pillar 01', phase: 'Phase I', title: 'Universal Banking Access', desc: '1.59L Sub-Service Areas & Bank Mitras within 5 km' },
                { num: 'Pillar 02', phase: 'Phase I', title: 'BSBD Account + ₹10K OD', desc: 'Zero-balance account with RuPay Card & Overdraft' },
                { num: 'Pillar 03', phase: 'Phase I', title: 'Financial Literacy (FLP)', desc: 'Digital payments, ATM usage & credit discipline' },
                { num: 'Pillar 04', phase: 'Phase II', title: 'Credit Guarantee Fund', desc: 'Institutional cover for Overdraft defaults' },
                { num: 'Pillar 05', phase: 'Phase II', title: 'Micro-Insurance Cover', desc: 'PMJJBY (₹2L Life) & PMSBY (₹2L Accident)' },
                { num: 'Pillar 06', phase: 'Phase II', title: 'Pension Scheme (APY)', desc: 'Unorganized sector pension ₹1K–₹5K/month' }
              ].map((p, i) => (
                <div
                  key={p.num}
                  className={`rounded-lg p-3.5 border transition-all duration-500 ${
                    i < 3
                      ? 'bg-[#1C2536]/90 border-[#D95D24]/50'
                      : 'bg-[#173026]/85 border-[#4ADE80]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-1">
                    <span className={i < 3 ? 'text-[#D95D24]' : 'text-[#4ADE80]'}>{p.num}</span>
                    <span className="text-[#FAF7F2]/60">{p.phase}</span>
                  </div>
                  <div className="font-editorial font-semibold text-sm text-[#FAF7F2]">{p.title}</div>
                  <p className="text-[11px] text-[#FAF7F2]/75 mt-1 leading-snug">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rupay_od':
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full max-w-4xl mx-auto my-auto items-center">
            <div className="md:col-span-6 bg-gradient-to-br from-[#1E3A5F] via-[#14243B] to-[#0F172A] border border-[#FAF7F2]/25 rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#D95D24]">
                    PMJDY • BSBD ACCOUNT
                  </div>
                  <div className="text-sm font-editorial font-bold text-[#FAF7F2]">
                    Pradhan Mantri Jan Dhan Yojana
                  </div>
                </div>
                <CreditCard className="w-6 h-6 text-[#FDE047]" />
              </div>
              <div className="w-10 h-7 rounded bg-gradient-to-tr from-[#D97706] to-[#FDE047] mb-4 opacity-90" />
              <div className="font-mono-tabular text-base tracking-widest text-[#FAF7F2] mb-3">
                6070  ••••  ••••  2014
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#FAF7F2]/80 border-t border-white/10 pt-2.5">
                <span>ZERO MINIMUM BALANCE</span>
                <span className="text-[#4ADE80] font-semibold">RuPay • NPCI</span>
              </div>
            </div>

            <div className="md:col-span-6 space-y-2.5">
              <div className="bg-[#1C2536]/90 border border-white/15 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#FAF7F2]/70">Minimum Balance Requirement</div>
                  <div className="text-sm font-semibold text-[#FAF7F2]">RBI BSBD Zero-Balance Norm</div>
                </div>
                <span className="font-mono-tabular text-lg font-bold text-[#4ADE80]">₹0</span>
              </div>
              <div className="bg-[#1C2536]/90 border border-[#D95D24]/50 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#FAF7F2]/70">Inbuilt Accidental Insurance</div>
                  <div className="text-sm font-semibold text-[#FAF7F2]">On RuPay Card (90-Day Active Rule)</div>
                </div>
                <span className="font-mono-tabular text-lg font-bold text-[#D95D24]">₹2,00,000</span>
              </div>
              <div className="bg-[#1C2536]/90 border border-[#FDE047]/40 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#FAF7F2]/70">Collateral-Free Overdraft Limit</div>
                  <div className="text-sm font-semibold text-[#FAF7F2]">After 6 Months (Age 18–65 Yrs)</div>
                </div>
                <span className="font-mono-tabular text-lg font-bold text-[#FDE047]">₹10,000</span>
              </div>
            </div>
          </div>
        );

      case 'jam_trinity':
        return (
          <div className="w-full max-w-4xl mx-auto my-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="bg-[#1C2536]/95 border border-[#D95D24] rounded-lg p-4 text-center">
                <Landmark className="w-7 h-7 text-[#D95D24] mx-auto mb-2" />
                <div className="font-mono-tabular text-xs text-[#D95D24] uppercase">J • JAN DHAN</div>
                <div className="font-editorial font-bold text-lg text-[#FAF7F2] mt-0.5">53.13 Cr Accounts</div>
                <p className="text-xs text-[#FAF7F2]/70 mt-1">Universal Core Banking endpoint in every household</p>
              </div>
              <div className="bg-[#1C2536]/95 border border-[#4ADE80] rounded-lg p-4 text-center">
                <ShieldCheck className="w-7 h-7 text-[#4ADE80] mx-auto mb-2" />
                <div className="font-mono-tabular text-xs text-[#4ADE80] uppercase">A • AADHAAR</div>
                <div className="font-editorial font-bold text-lg text-[#FAF7F2] mt-0.5">Biometric e-KYC</div>
                <p className="text-xs text-[#FAF7F2]/70 mt-1">De-duplication & thumbprint AePS Micro-ATM withdrawals</p>
              </div>
              <div className="bg-[#1C2536]/95 border border-[#60A5FA] rounded-lg p-4 text-center">
                <Smartphone className="w-7 h-7 text-[#60A5FA] mx-auto mb-2" />
                <div className="font-mono-tabular text-xs text-[#60A5FA] uppercase">M • MOBILE</div>
                <div className="font-editorial font-bold text-lg text-[#FAF7F2] mt-0.5">Instant DBT & UPI</div>
                <p className="text-xs text-[#FAF7F2]/70 mt-1">Real-time SMS alerts & direct welfare credit</p>
              </div>
            </div>
            <div className="mt-3 bg-[#173026]/90 border border-[#4ADE80]/50 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono-tabular text-[#4ADE80] uppercase tracking-wider">
                RESULT: 300+ Direct Benefit Transfer (DBT) Schemes Linked
              </span>
              <span className="font-mono-tabular text-sm font-bold text-[#FAF7F2]">
                ₹3.48 Lakh Crore Saved from Leakages
              </span>
            </div>
          </div>
        );

      case 'decadal_growth':
        return (
          <div className="w-full max-w-4xl mx-auto my-auto space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#1C2536]/90 border border-white/15 rounded-lg p-3">
                <div className="text-[11px] font-mono-tabular text-[#FAF7F2]/60">MAR 2015 → AUG 2024</div>
                <div className="text-xl font-mono-tabular font-bold text-[#D95D24] mt-1">53.13 Cr</div>
                <div className="text-xs text-[#FAF7F2]/85">Total Accounts (3.6x)</div>
              </div>
              <div className="bg-[#1C2536]/90 border border-white/15 rounded-lg p-3">
                <div className="text-[11px] font-mono-tabular text-[#FAF7F2]/60">WOMEN SHARE</div>
                <div className="text-xl font-mono-tabular font-bold text-[#4ADE80] mt-1">55.6%</div>
                <div className="text-xs text-[#FAF7F2]/85">29.56 Cr Women</div>
              </div>
              <div className="bg-[#1C2536]/90 border border-white/15 rounded-lg p-3">
                <div className="text-[11px] font-mono-tabular text-[#FAF7F2]/60">RURAL / SEMI-URBAN</div>
                <div className="text-xl font-mono-tabular font-bold text-[#FDE047] mt-1">66.6%</div>
                <div className="text-xs text-[#FAF7F2]/85">35.38 Cr Rural/Semi</div>
              </div>
              <div className="bg-[#1C2536]/90 border border-white/15 rounded-lg p-3">
                <div className="text-[11px] font-mono-tabular text-[#FAF7F2]/60">TOTAL DEPOSITS</div>
                <div className="text-xl font-mono-tabular font-bold text-[#60A5FA] mt-1">₹2.31L Cr</div>
                <div className="text-xs text-[#FAF7F2]/85">Avg ₹4,352 / Account</div>
              </div>
            </div>
            <div className="bg-[#1C2536]/90 border border-white/10 rounded-lg p-3.5">
              <div className="flex items-center justify-between text-xs font-mono-tabular text-[#FAF7F2]/75 mb-2">
                <span>10-YEAR DEPOSIT GROWTH TRAJECTORY (2015 – 2024)</span>
                <span className="text-[#4ADE80]">14.7x Increase in Aggregate Savings</span>
              </div>
              <div className="grid grid-cols-5 gap-2 items-end h-16 pt-2">
                {[
                  { yr: '2015', val: '₹15,670 Cr', h: 'h-4' },
                  { yr: '2017', val: '₹62,972 Cr', h: 'h-7' },
                  { yr: '2019', val: '₹96,107 Cr', h: 'h-9' },
                  { yr: '2021', val: '₹1,45,551 Cr', h: 'h-12' },
                  { yr: '2024', val: '₹2,31,236 Cr', h: 'h-14' }
                ].map((bar) => (
                  <div key={bar.yr} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono-tabular text-[#FAF7F2]/80 mb-1">{bar.val}</span>
                    <div className={`w-full ${bar.h} bg-gradient-to-t from-[#D95D24] to-[#F59E0B] rounded-t`} />
                    <span className="text-[10px] font-mono-tabular text-[#FAF7F2]/60 mt-1">{bar.yr}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'guidelines_kyc':
        return (
          <div className="w-full max-w-4xl mx-auto my-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#1C2536]/90 border border-[#4ADE80]/50 rounded-lg p-3.5">
                <div className="flex items-center gap-2 text-[#4ADE80] font-mono-tabular text-xs mb-1">
                  <FileCheck2 className="w-4 h-4" /> PATH 1: FULL e-KYC
                </div>
                <div className="font-editorial font-bold text-base text-[#FAF7F2]">Aadhaar Biometric</div>
                <p className="text-xs text-[#FAF7F2]/75 mt-1">
                  Instant paperless account opening at any Bank Branch or Bank Mitra Micro-ATM using thumbprint/OTP.
                </p>
              </div>
              <div className="bg-[#1C2536]/90 border border-[#60A5FA]/50 rounded-lg p-3.5">
                <div className="flex items-center gap-2 text-[#60A5FA] font-mono-tabular text-xs mb-1">
                  <FileCheck2 className="w-4 h-4" /> PATH 2: OVD DOCUMENTS
                </div>
                <div className="font-editorial font-bold text-base text-[#FAF7F2]">Any 1 Official ID</div>
                <p className="text-xs text-[#FAF7F2]/75 mt-1">
                  Voter ID, Driving License, Passport, NREGA Job Card, or National Population Register (NPR) letter.
                </p>
              </div>
              <div className="bg-[#1C2536]/90 border border-[#FDE047]/60 rounded-lg p-3.5">
                <div className="flex items-center gap-2 text-[#FDE047] font-mono-tabular text-xs mb-1">
                  <Sparkles className="w-4 h-4" /> PATH 3: NO DOCUMENTS?
                </div>
                <div className="font-editorial font-bold text-base text-[#FAF7F2]">“Chhota Khata” Option</div>
                <p className="text-xs text-[#FAF7F2]/75 mt-1">
                  Open a Small Account with just 2 self-attested photos & thumbprint (Max ₹50,000 balance, valid 12 mos).
                </p>
              </div>
            </div>
            <div className="mt-3 bg-[#1C2536] border border-white/15 rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono-tabular text-[#FAF7F2]">
              <span>ELIGIBILITY: INDIAN CITIZEN AGED 10+ YEARS</span>
              <span className="text-[#FDE047]">TOLL-FREE HELPLINES: 1800-11-0001 • 1800-180-1111</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Persistent DOM <audio> element for 100% reliable custom voice playback */}
      <audio
        ref={domAudioRef}
        preload="auto"
        playsInline
        onEnded={() => {
          if (customPlaybackScope === 'per_chapter' && safeChapterIdx < VIDEO_CHAPTERS.length - 1) {
            setActiveChapterIdx((i) => Math.min(VIDEO_CHAPTERS.length - 1, i + 1));
            setElapsedInChapter(0);
          }
        }}
        className="hidden"
      />

      {/* Main Video Broadcast Player Container */}
      <div
        ref={playerContainerRef}
        className="bg-[#141A24] text-[#FAF7F2] rounded-xl border border-[#141A24] shadow-xl overflow-hidden flex flex-col"
      >
        {/* Top Broadcast Status Bar */}
        <div className="px-4 py-2.5 bg-[#0D1219] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#D95D24] text-[#FAF7F2] font-mono-tabular text-[11px] font-semibold tracking-wider uppercase">
              <Film className="w-3.5 h-3.5" /> PMJDY DOCUMENTARY PLAYER
            </span>
            <span className="font-mono-tabular text-xs text-[#FAF7F2]/70">
              {currentChapter.chapterCode} OF 06 • {currentChapter.timestampRange}
            </span>
            {activeCustomVoice && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1B6B45] text-[#4ADE80] font-mono-tabular text-[11px] font-semibold">
                <Mic className="w-3 h-3" /> Custom Voice Ready ({activeCustomVoice.durationSec}s)
              </span>
            )}
          </div>

          {/* Language & Custom Voiceover Mode Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-md bg-[#1C2536] p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setVoiceMode('en');
                  if (isPlaying) triggerAudioForChapter(currentChapter, 'en', isMuted, false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  voiceMode === 'en'
                    ? 'bg-[#D95D24] text-white'
                    : 'text-[#FAF7F2]/70 hover:text-white'
                }`}
              >
                English Voice
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoiceMode('hi');
                  if (isPlaying) triggerAudioForChapter(currentChapter, 'hi', isMuted, false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  voiceMode === 'hi'
                    ? 'bg-[#D95D24] text-white'
                    : 'text-[#FAF7F2]/70 hover:text-white'
                }`}
              >
                हिंदी वॉयस
              </button>
              <button
                type="button"
                onClick={handlePlayMyVoiceNow}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  voiceMode === 'custom'
                    ? 'bg-[#1B6B45] text-white'
                    : 'text-[#4ADE80] hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />{' '}
                {hasAnyCustomVoice ? '▶ Play My Voice' : 'My Voice (Add Below)'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (domAudioRef.current) {
                  domAudioRef.current.muted = nextMuted;
                }
                if (nextMuted) {
                  stopAllAudioPlayback();
                } else if (isPlaying) {
                  triggerAudioForChapter(currentChapter, voiceMode, false, false);
                }
              }}
              className="p-1.5 rounded bg-[#1C2536] border border-white/10 text-[#FAF7F2]/80 hover:text-white cursor-pointer"
              title={isMuted ? 'Unmute Voiceover Narration' : 'Mute Voiceover Narration'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-[#F87171]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#4ADE80]" />
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded bg-[#1C2536] border border-white/10 text-[#FAF7F2]/80 hover:text-white cursor-pointer"
              title="Toggle Fullscreen Video"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 16:9 Motion Graphics Stage */}
        <div className="relative min-h-[350px] sm:min-h-[400px] p-5 sm:p-7 flex flex-col justify-between bg-gradient-to-b from-[#141A24] via-[#182232] to-[#0F151E]">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#FAF7F2 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Chapter Header inside Video Frame */}
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#D95D24]">
                {currentChapter.chapterCode} • {currentChapter.storyboardCue.lowerThird}
              </div>
              <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#FAF7F2] mt-0.5">
                {voiceMode === 'hi' ? currentChapter.hindiTitle : currentChapter.title}
              </h3>
            </div>
            <div className="bg-[#1C2536] border border-white/15 rounded-lg px-3 py-1.5 text-right">
              <div className="font-mono-tabular text-sm font-bold text-[#FDE047]">
                {currentChapter.keyFigure.number}
              </div>
              <div className="text-[10px] text-[#FAF7F2]/70">{currentChapter.keyFigure.caption}</div>
            </div>
          </div>

          {/* Dynamic Animated Infographic Scene */}
          <div className="relative z-10 py-4 flex-1 flex items-center">
            {renderSceneVisual(currentChapter)}
          </div>

          {/* Live Subtitles / Teleprompter Bar */}
          <div
            className={`relative z-10 rounded-lg px-4 py-3 mt-2 border transition-all ${
              isRecordingMic
                ? 'bg-[#2A1215]/95 border-[#EF4444] ring-2 ring-[#EF4444]/40'
                : 'bg-[#0A0E14]/90 border-white/15'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-wider mb-1">
              {isRecordingMic ? (
                <span className="text-[#F87171] font-bold flex items-center gap-1.5 animate-pulse">
                  ● RECORDING YOUR VOICE ({recordingSeconds}s) — READ THIS TELEPROMPTER ALOUD NOW:
                </span>
              ) : (
                <span className="text-[#4ADE80]">
                  {isPlaying
                    ? voiceMode === 'custom' && activeCustomVoice
                      ? `● PLAYING YOUR VOICE FILE: "${activeCustomVoice.fileName}"`
                      : '● LIVE VOICEOVER NARRATION & CAPTIONS'
                    : hasAnyCustomVoice
                    ? '⏸ YOUR VOICE IS LOADED — CLICK "PLAY VIDEO (WITH MY VOICE)" BELOW'
                    : '⏸ TELEPROMPTER & SUBTITLES — CLICK PLAY OR UPLOAD/RECORD YOUR VOICE BELOW'}
                </span>
              )}
              <span className="text-[#FAF7F2]/75">
                {voiceMode === 'custom' && activeCustomVoice
                  ? 'YOUR CUSTOM VOICE ACTIVE'
                  : voiceMode === 'hi'
                  ? 'HINDI (हिन्दी)'
                  : 'ENGLISH (INDIA)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#FAF7F2] leading-relaxed font-medium">
              “{voiceMode === 'hi' ? activeNarrationHi : activeNarrationEn}”
            </p>
          </div>
        </div>

        {/* Chapter Progress Bar */}
        <div className="bg-[#0D1219] px-4 pt-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D95D24] transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Video Transport & Chapter Selector Bar */}
        <div className="bg-[#0D1219] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D95D24] hover:bg-[#C04E18] text-white font-semibold text-xs sm:text-sm transition shadow-sm cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Pause Video
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />{' '}
                  {hasAnyCustomVoice ? 'Play Video (With My Voice)' : 'Play Documentary'}
                </>
              )}
            </button>

            {/* Dedicated green button if user uploaded a voice so they can test/play it in 1 click */}
            {hasAnyCustomVoice && !isPlaying && (
              <button
                type="button"
                onClick={handlePlayMyVoiceNow}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1B6B45] hover:bg-[#155738] text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Play My Uploaded Voice Now
              </button>
            )}

            {/* Quick Record My Voice Button */}
            {!isRecordingMic ? (
              <button
                type="button"
                onClick={handleStartMicRecording}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1C2536] hover:bg-[#263248] border border-white/15 text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                <Mic className="w-4 h-4 text-[#4ADE80]" /> Record Mic
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopMicRecording}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs sm:text-sm animate-pulse cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" /> Stop Recording ({recordingSeconds}s)
              </button>
            )}

            <button
              type="button"
              onClick={handlePrevChapter}
              disabled={activeChapterIdx === 0}
              className="p-2 rounded-lg bg-[#1C2536] border border-white/10 text-[#FAF7F2] disabled:opacity-40 hover:bg-[#263248] cursor-pointer"
              title="Previous Chapter"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNextChapter}
              disabled={activeChapterIdx === VIDEO_CHAPTERS.length - 1}
              className="p-2 rounded-lg bg-[#1C2536] border border-white/10 text-[#FAF7F2] disabled:opacity-40 hover:bg-[#263248] cursor-pointer"
              title="Next Chapter"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Chapter Quick Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {VIDEO_CHAPTERS.map((ch, idx) => {
              const hasVoice = Boolean(customRecordings[ch.id] || globalVoice);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChapter(idx)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-tabular transition cursor-pointer flex items-center gap-1 ${
                    idx === activeChapterIdx
                      ? 'bg-[#FAF7F2] text-[#141A24] font-bold'
                      : hasVoice
                      ? 'bg-[#1B6B45]/40 border border-[#4ADE80]/50 text-[#4ADE80]'
                      : 'bg-[#1C2536] text-[#FAF7F2]/70 hover:text-white'
                  }`}
                >
                  <span>{ch.chapterCode}</span>
                  {hasVoice && <Check className="w-3 h-3 text-[#4ADE80]" />}
                </button>
              );
            })}
          </div>

          {/* Script & Voice Studio Toggle Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowVoiceStudio((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2536] border border-[#4ADE80]/40 text-xs font-medium text-[#4ADE80] hover:bg-[#263248] cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5" />
              {showVoiceStudio ? 'Hide Voice Studio' : 'My Voice Studio'}
            </button>

            <button
              type="button"
              onClick={() => setShowScriptPanel((s) => !s)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2536] border border-white/15 text-xs font-medium text-[#FAF7F2] hover:bg-[#263248] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#D95D24]" />
              {showScriptPanel ? 'Hide Script' : 'Storyboard'}
            </button>

            {onOpenFullSlideDeck && (
              <button
                type="button"
                onClick={onOpenFullSlideDeck}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D95D24] hover:bg-[#C04E18] text-xs font-semibold text-white cursor-pointer"
              >
                12-Slide PPT →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MY VOICEOVER RECORDING & AUDIO UPLOAD STUDIO */}
      {showVoiceStudio && (
        <div className="bg-white rounded-xl border-2 border-[#1B6B45]/40 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2DDD2] pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono-tabular uppercase tracking-wider text-[#1B6B45] font-bold">
                <Mic className="w-4 h-4" /> ADD YOUR OWN VOICEOVER TO THIS VIDEO (UPLOAD FILE OR RECORD MIC)
              </span>
              <h3 className="text-xl font-editorial font-bold text-[#141A24] mt-0.5">
                Custom Voiceover Studio & Direct Audio Player
              </h3>
              <p className="text-xs text-[#4A5260] mt-0.5">
                Upload your recorded voice file (<code>.mp3</code>, <code>.wav</code>, <code>.m4a</code>, <code>.aac</code>, <code>.ogg</code>, <code>.mp4</code>) or record live with your microphone.
              </p>
            </div>

            {/* Broad File Input supporting all mobile & desktop voice recording formats */}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/mp4,video/webm,.mp3,.wav,.m4a,.aac,.ogg,.webm,.mp4,.3gp"
              onChange={handleUploadAudioFile}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D95D24] hover:bg-[#C04E18] text-white text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload Voice File (.MP3 / .M4A / .WAV)
              </button>

              {!isRecordingMic ? (
                <button
                  type="button"
                  onClick={handleStartMicRecording}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B6B45] hover:bg-[#145335] text-white text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  <Mic className="w-4 h-4" /> Record via Microphone
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopMicRecording}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs sm:text-sm font-semibold animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" /> Stop Recording ({recordingSeconds}s)
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsEditingScript((e) => !e)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[#E2DDD2] bg-white hover:bg-[#FAF7F2] text-[#141A24] text-xs font-semibold transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1E3A5F]" />
                {isEditingScript ? 'Done Editing Script' : 'Edit Teleprompter Script'}
              </button>
            </div>
          </div>

          {/* DIRECT NATIVE AUDIO PREVIEW BAR WHEN USER UPLOADS OR RECORDS VOICE */}
          {activeCustomVoice && (
            <div className="bg-[#1B6B45]/10 border-2 border-[#1B6B45] rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase font-bold text-[#1B6B45]">
                  <CheckCircle2 className="w-4 h-4" /> YOUR VOICE FILE IS LOADED & ACTIVE: {activeCustomVoice.fileName}
                </div>
                <p className="text-xs text-[#141A24]">
                  {audioPlayStatus ||
                    'Click "Play Video + My Voice Together" on the right, or test your audio file directly using the audio player controls:'}
                </p>
                {/* Playback scope toggle */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#4A5260]">Playback Mode:</span>
                  <button
                    type="button"
                    onClick={() => setCustomPlaybackScope('full_video')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      customPlaybackScope === 'full_video'
                        ? 'bg-[#141A24] text-white'
                        : 'bg-white border border-[#E2DDD2] text-[#4A5260]'
                    }`}
                  >
                    <Radio className="w-3 h-3 inline mr-1" />
                    Play Continuously Across Entire Video (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPlaybackScope('per_chapter')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      customPlaybackScope === 'per_chapter'
                        ? 'bg-[#141A24] text-white'
                        : 'bg-white border border-[#E2DDD2] text-[#4A5260]'
                    }`}
                  >
                    Play Per Individual Chapter
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Visible HTML5 Audio Controls so user can always verify & hear their uploaded file */}
                <audio
                  controls
                  src={activeCustomVoice.audioUrl}
                  className="h-10 max-w-full sm:w-64 rounded-lg"
                />

                <button
                  type="button"
                  onClick={handlePlayMyVoiceNow}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B6B45] hover:bg-[#145335] text-white text-xs sm:text-sm font-bold shadow-sm cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" /> Play Video + My Voice Together
                </button>

                <button
                  type="button"
                  onClick={handleClearAllCustomVoices}
                  className="p-2.5 rounded-lg bg-white border border-[#FECACA] text-[#DC2626] hover:bg-[#FEF2F2] cursor-pointer"
                  title="Remove Uploaded Voice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Live Microphone Level Meter when recording */}
          {isRecordingMic && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#DC2626] animate-ping" />
                <div>
                  <div className="text-xs font-mono-tabular uppercase font-bold text-[#991B1B]">
                    Microphone Live — Recording {currentChapter.chapterCode} ({recordingSeconds}s)
                  </div>
                  <div className="text-xs text-[#7F1D1D]">
                    Read the script below clearly. Click <strong>Stop Recording</strong> when finished.
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-48 bg-white rounded-full h-3 border border-[#FCA5A5] overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#1B6B45] via-[#F59E0B] to-[#DC2626] rounded-full transition-all duration-100"
                  style={{ width: `${Math.max(12, micLevel)}%` }}
                />
              </div>
            </div>
          )}

          {/* Error message if mic permission denied */}
          {micError && (
            <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#92400E]">
              <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <div>{micError}</div>
            </div>
          )}

          {/* Editable Teleprompter Box for Current Chapter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 bg-[#FAF7F2] rounded-xl p-4 border border-[#E2DDD2] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tabular uppercase font-bold text-[#141A24]">
                  Teleprompter Script to Read Aloud ({currentChapter.chapterCode})
                </span>
                <span className="text-[11px] font-mono-tabular text-[#4A5260]">
                  Recommended time: ~{currentChapter.durationSec} seconds
                </span>
              </div>

              {isEditingScript ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono-tabular uppercase text-[#4A5260] mb-1">
                      English Narration Script (Editable):
                    </label>
                    <textarea
                      rows={3}
                      value={activeNarrationEn}
                      onChange={(e) =>
                        setCustomScriptsEn((prev) => ({
                          ...prev,
                          [currentChapter.id]: e.target.value
                        }))
                      }
                      className="w-full rounded-lg border border-[#E2DDD2] bg-white p-2.5 text-xs sm:text-sm text-[#141A24] focus:outline-none focus:border-[#D95D24]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-tabular uppercase text-[#4A5260] mb-1">
                      Hindi Narration Script / हिंदी स्क्रिप्ट (Editable):
                    </label>
                    <textarea
                      rows={3}
                      value={activeNarrationHi}
                      onChange={(e) =>
                        setCustomScriptsHi((prev) => ({
                          ...prev,
                          [currentChapter.id]: e.target.value
                        }))
                      }
                      className="w-full rounded-lg border border-[#E2DDD2] bg-white p-2.5 text-xs sm:text-sm text-[#141A24] focus:outline-none focus:border-[#D95D24]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-white border border-[#E2DDD2]">
                    <div className="text-[10px] font-mono-tabular uppercase text-[#D95D24] font-bold mb-1">
                      English Script:
                    </div>
                    <p className="text-xs sm:text-sm text-[#141A24] leading-relaxed font-medium">
                      “{activeNarrationEn}”
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#E2DDD2]">
                    <div className="text-[10px] font-mono-tabular uppercase text-[#1B6B45] font-bold mb-1">
                      Hindi Script (हिंदी वॉयसओवर):
                    </div>
                    <p className="text-xs sm:text-sm text-[#141A24] leading-relaxed font-medium">
                      “{activeNarrationHi}”
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Recorded Voiceover Status across all 6 Chapters */}
            <div className="lg:col-span-5 bg-[#FAF7F2] rounded-xl p-4 border border-[#E2DDD2] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-2">
                <span className="text-xs font-mono-tabular uppercase font-bold text-[#141A24]">
                  Chapter Voiceover List ({customRecordedCount} / 6)
                </span>
                <span className="text-[11px] text-[#1B6B45] font-semibold">
                  {globalVoice ? 'Full-Video Voice Active' : 'Select Chapter to Record'}
                </span>
              </div>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {VIDEO_CHAPTERS.map((ch, idx) => {
                  const rec = customRecordings[ch.id] || (customPlaybackScope === 'full_video' ? globalVoice : undefined);
                  const isSelected = idx === activeChapterIdx;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => handleSelectChapter(idx)}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                        isSelected
                          ? 'bg-white border-[#D95D24] shadow-2xs'
                          : 'bg-white/70 border-[#E2DDD2] hover:bg-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-mono-tabular font-bold text-[#141A24] flex items-center gap-1.5">
                          <span>{ch.chapterCode}</span>
                          {rec ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[#1B6B45]/15 text-[#1B6B45]">
                              <CheckCircle2 className="w-3 h-3" /> {rec.durationSec}s Voice Ready
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#7A8291] font-normal">
                              Default AI Voice
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#4A5260] truncate">{ch.title}</div>
                      </div>

                      {customRecordings[ch.id] && (
                        <div
                          className="flex items-center gap-1 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleDownloadCustomVoice(customRecordings[ch.id])}
                            className="p-1.5 rounded bg-[#F3EFE6] hover:bg-[#E2DDD2] text-[#141A24]"
                            title="Download Your Voice Recording"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomVoice(ch.id)}
                            className="p-1.5 rounded bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626]"
                            title="Remove Recording"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Synchronized Video Script, Teleprompter & Storyboard Production Sheet */}
      {showScriptPanel && (
        <div className="bg-white rounded-xl border border-[#E2DDD2] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DDD2] pb-4 mb-5">
            <div>
              <span className="text-xs font-mono-tabular uppercase tracking-wider text-[#D95D24] font-semibold">
                VIDEO PRODUCTION KIT • SCRIPT, TELEPROMPTER & STORYBOARD
              </span>
              <h3 className="text-xl font-editorial font-bold text-[#141A24] mt-0.5">
                Complete 6-Chapter Documentary Script (English & Hindi)
              </h3>
              <p className="text-xs text-[#4A5260] mt-0.5">
                Use this ready-to-record script, timestamped visual cues, and lower-third titles for your school/college or institutional PMJDY video project.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-xs font-semibold text-[#141A24] transition cursor-pointer"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-4 h-4 text-[#1B6B45]" /> Script Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#4A5260]" /> Copy Full Video Script
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadScript}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#141A24] hover:bg-[#263042] text-xs font-semibold text-white transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Script (.TXT)
              </button>
            </div>
          </div>

          {/* 6 Chapter Storyboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VIDEO_CHAPTERS.map((ch, idx) => {
              const isCurrent = idx === activeChapterIdx;
              const hasCustomVoice = Boolean(customRecordings[ch.id] || globalVoice);
              return (
                <div
                  key={ch.id}
                  onClick={() => handleSelectChapter(idx)}
                  className={`rounded-lg border p-4 transition cursor-pointer ${
                    isCurrent
                      ? 'border-[#D95D24] bg-[#FAF7F2] ring-1 ring-[#D95D24]/30'
                      : 'border-[#E2DDD2] bg-white hover:bg-[#FAF7F2]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono-tabular text-xs font-bold text-[#D95D24]">
                      {ch.chapterCode} • {ch.timestampRange}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {hasCustomVoice && (
                        <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-[#1B6B45]/15 text-[#1B6B45] font-bold">
                          ✓ Custom Voice Ready
                        </span>
                      )}
                      <span className="text-[11px] font-mono-tabular px-2 py-0.5 rounded bg-[#F3EFE6] text-[#4A5260]">
                        Click to Select
                      </span>
                    </div>
                  </div>
                  <h4 className="font-editorial font-bold text-base text-[#141A24]">{ch.title}</h4>
                  <div className="text-xs font-medium text-[#1B6B45] mb-2">{ch.hindiTitle}</div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded bg-[#F3EFE6]/70 border border-[#E2DDD2]">
                      <div className="font-mono-tabular text-[10px] uppercase text-[#4A5260] mb-0.5">
                        English Voiceover Narration:
                      </div>
                      <p className="text-[#141A24] leading-relaxed">
                        “{customScriptsEn[ch.id] ?? ch.narrationEn}”
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#F3EFE6]/40 border border-[#E2DDD2]">
                      <div className="font-mono-tabular text-[10px] uppercase text-[#4A5260] mb-0.5">
                        Hindi Voiceover (हिंदी स्क्रिप्ट):
                      </div>
                      <p className="text-[#141A24] leading-relaxed">
                        “{customScriptsHi[ch.id] ?? ch.narrationHi}”
                      </p>
                    </div>

                    <div className="text-[11px] text-[#4A5260] pt-1 flex flex-col gap-0.5">
                      <span>
                        <strong className="text-[#141A24]">Visual / B-Roll Cue:</strong>{' '}
                        {ch.storyboardCue.bRollSuggestion}
                      </span>
                      <span>
                        <strong className="text-[#141A24]">On-Screen Text:</strong>{' '}
                        {ch.onScreenText.join(' | ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
