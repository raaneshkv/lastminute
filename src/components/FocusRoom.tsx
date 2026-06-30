import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, RotateCcw, SkipForward, ShieldAlert, AlertTriangle, Lightbulb, AlertCircle, CheckCircle, Headphones, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ExtractedTask } from '../App';

interface FocusRoomProps {
  tasks: ExtractedTask[] | null;
  selectedTask: ExtractedTask | null;
  setSelectedTask: (task: ExtractedTask | null) => void;
}

export default function FocusRoom({ tasks, selectedTask, setSelectedTask }: FocusRoomProps) {
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25 mins Pomodoro
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(1);
  const [panicActive, setPanicActive] = useState(false);
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lofiPlaying, setLofiPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = [
    { title: 'Lofi Study Beats', author: 'Chillhop', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' },
    { title: 'Deep Focus Flow', author: 'Ambient', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8175567.mp3?filename=empty-mind-118973.mp3' },
    { title: 'Late Night Coding', author: 'ChillStep', url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_5500e57dfc.mp3?filename=good-night-109430.mp3' },
  ];

  const quotes = [
    "The secret of getting ahead is getting started. — Mark Twain",
    "Focus is the art of knowing what to ignore. — James Clear",
    "Do the hard thing now so the future you smiles. — Unknown",
    "One task. Full attention. That's the formula. — Deep Work",
    "You don't rise to your goals, you fall to your systems. — Atomic Habits",
  ];
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(q => (q + 1) % quotes.length), 15000);
    return () => clearInterval(t);
  }, []);

  const toggleLofi = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(tracks[trackIdx].url);
      audioRef.current.loop = true;
    }
    if (lofiPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = tracks[trackIdx].url;
      audioRef.current.play().catch(() => {});
    }
    setLofiPlaying(!lofiPlaying);
  };

  const changeTrack = (dir: 1 | -1) => {
    const newIdx = (trackIdx + dir + tracks.length) % tracks.length;
    setTrackIdx(newIdx);
    if (lofiPlaying && audioRef.current) {
      audioRef.current.src = tracks[newIdx].url;
      audioRef.current.play().catch(() => {});
    }
  };

  // If tasks exist but no selectedTask, default to first task
  const activeTask = selectedTask || (tasks && tasks.length > 0 ? tasks[0] : null);

  // Circular progress math
  const totalSeconds = 1500;
  const progressRatio = secondsLeft / totalSeconds;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  // Reset step index if task changes
  useEffect(() => {
    setStepIndex(1);
    setSecondsLeft(1500);
    setIsActive(false);
  }, [activeTask?.title]);

  const formatTime = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      setIsCompleted(false);
      // Logic to actually remove task from list would go here in full app
      setSelectedTask(null);
    }, 4000);
  };

  if (isCompleted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '24px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }} style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)', border: '2px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle style={{ width: 56, height: 56, color: '#34d399' }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="display-lg" style={{ color: '#34d399' }}>Task Destroyed!</h2>
          <p className="lead mt-3">Incredible focus. The HUD is resetting for your next target.</p>
        </motion.div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0 || !activeTask) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <header style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>Focus HUD</p>
          <h1 className="display-lg">One task at a time.</h1>
        </header>

        <div
          className="glass-panel"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            borderStyle: 'dashed',
          }}
        >
          <div
            style={{
              width: 44, height: 44,
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee',
            }}
          >
            <AlertCircle style={{ width: 20, height: 20 }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#d8dce8' }}>Focus HUD Standby</h3>
          <p style={{ fontSize: '14px', color: '#8892a8', lineHeight: '1.6', maxWidth: '380px' }}>
            No active tasks found in the planner workspace. Go to the **Plan Console** to parse task data first.
          </p>
        </div>
      </div>
    );
  }

  // Generate 4 dynamic checklist steps based on active task title
  const steps = [
    `Analyze objectives & gather materials for "${activeTask.title}"`,
    `Execute initial block setup and draft core structure`,
    `Conduct detailed development and resolve technical dependencies`,
    `Review checklist, verify specifications, and submit task`,
  ];

  const suggestions = [
    `Focus exclusively on: "${activeTask.title}". Remove secondary tabs.`,
    `Chronos nudge: Budget a short rest block after completing this.`,
    `Aegis recommendation: "${activeTask.recommendation}"`,
  ];

  const accentColor = panicActive ? '#f43f5e' : '#22d3ee';
  const accentBg = panicActive ? 'rgba(244, 63, 94, 0.08)' : 'rgba(34, 211, 238, 0.08)';
  const accentBorder = panicActive ? 'rgba(244, 63, 94, 0.25)' : 'rgba(34, 211, 238, 0.25)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Hero */}
      <header style={{ textAlign: 'center' }}>
        <p className="eyebrow" style={{ marginBottom: '10px' }}>Focus HUD</p>
        <h1
          className="display-lg"
          style={{ color: panicActive ? '#f43f5e' : '#f0f2f8', transition: 'color 0.4s' }}
        >
          {panicActive ? 'Emergency Focus Mode' : 'One task at a time.'}
        </h1>
        <p style={{ fontSize: '15px', color: '#8892a8', marginTop: '8px' }}>
          Step {stepIndex} of {steps.length} · {steps[stepIndex - 1]}
        </p>
      </header>

      {/* Task Selector Dropdown (if multiple tasks exist) */}
      {tasks.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#8892a8', fontWeight: 500 }}>Active Task:</span>
          <select
            value={activeTask.title}
            onChange={(e) => {
              const matched = tasks.find(t => t.title === e.target.value);
              if (matched) setSelectedTask(matched);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'rgba(16, 18, 35, 0.72)',
              border: '1px solid rgba(148, 163, 184, 0.14)',
              color: '#f0f2f8',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {tasks.map((t) => (
              <option key={t.title} value={t.title}>{t.title} ({t.priority})</option>
            ))}
          </select>
        </div>
      )}

      {/* Timer + Controls */}
      <div className="glass-panel" style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
        {/* Circular Timer */}
        <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              inset: 16,
              borderRadius: '50%',
              filter: 'blur(25px)',
              opacity: 0.08,
              background: accentColor,
              transition: 'all 0.5s',
            }}
          />
          <svg width="240" height="240" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="120" cy="120" r={radius}
              fill="none"
              stroke={panicActive ? 'rgba(244,63,94,0.1)' : 'rgba(167,139,250,0.1)'}
              strokeWidth="5"
            />
            <motion.circle
              cx="120" cy="120" r={radius}
              fill="none"
              stroke={accentColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ ease: 'linear', duration: 0.5 }}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '48px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: panicActive ? '#f43f5e' : '#f0f2f8',
                transition: 'color 0.4s',
              }}
            >
              {formatTime(secondsLeft)}
            </p>
            <p style={{ fontSize: '11px', color: '#4a5268', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Remaining</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8892a8' }}>
            <span>Progress</span>
            <span style={{ color: accentColor, fontWeight: 600 }}>
              {Math.round(((stepIndex) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${((stepIndex) / steps.length) * 100}%`,
                background: panicActive
                  ? 'linear-gradient(90deg, #f43f5e 0%, #fbbf24 100%)'
                  : 'linear-gradient(90deg, #22d3ee 0%, #a78bfa 100%)',
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsActive(!isActive)}
            style={{
              width: 56, height: 56,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${accentBorder}`,
              background: accentBg,
              color: accentColor,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isActive ? (
              <Pause style={{ width: 20, height: 20 }} strokeWidth={2} />
            ) : (
              <Play style={{ width: 20, height: 20, marginLeft: 2 }} fill="currentColor" strokeWidth={2} />
            )}
          </button>

          <button
            onClick={() => {
              setSecondsLeft(1500);
              setIsActive(false);
            }}
            className="btn-icon"
            style={{ width: 48, height: 48, borderRadius: '14px' }}
            title="Reset Timer"
          >
            <RotateCcw style={{ width: 16, height: 16 }} strokeWidth={2} />
          </button>

          <button
            onClick={() => stepIndex < steps.length ? (setStepIndex((s) => s + 1), setSecondsLeft(1500)) : handleComplete()}
            className={stepIndex === steps.length ? "btn-primary" : "btn-ghost"}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '14px', padding: '10px 16px' }}
          >
            {stepIndex === steps.length ? (
              <>Mark Completed <Check style={{ width: 16, height: 16 }} /></>
            ) : (
              <>Skip Step <SkipForward style={{ width: 14, height: 14 }} /></>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Suggested Next Action */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lightbulb style={{ width: 18, height: 18, color: '#fbbf24' }} />
            <span className="label" style={{ fontSize: '12px' }}>Suggested Action</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={suggestionIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{ fontSize: '15px', color: '#d8dce8', lineHeight: '1.6', fontStyle: 'italic', minHeight: '48px' }}
            >
              "{suggestions[suggestionIdx]}"
            </motion.p>
          </AnimatePresence>
          <button
            onClick={() => setSuggestionIdx((p) => (p + 1) % suggestions.length)}
            className="btn-ghost"
            style={{ alignSelf: 'flex-start', fontSize: '12px', borderRadius: '10px' }}
          >
            Next Suggestion
          </button>
        </div>

        {/* Lo-Fi Focus Player — real audio */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(167, 139, 250, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Headphones style={{ width: 18, height: 18, color: '#a78bfa' }} />
            <span className="label" style={{ fontSize: '12px' }}>Lo-Fi Focus Radio</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Prev */}
            <button onClick={() => changeTrack(-1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', cursor: 'pointer', flexShrink: 0 }}>
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            {/* Play/Pause */}
            <button
              onClick={toggleLofi}
              style={{ width: 48, height: 48, borderRadius: '50%', background: lofiPlaying ? 'rgba(167,139,250,0.2)' : 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', cursor: 'pointer', flexShrink: 0, boxShadow: lofiPlaying ? '0 0 16px rgba(167,139,250,0.4)' : 'none', transition: 'all 0.2s' }}
            >
              {lofiPlaying ? <Pause fill="currentColor" style={{ width: 18, height: 18 }} /> : <Play fill="currentColor" style={{ width: 18, height: 18, marginLeft: 2 }} />}
            </button>
            {/* Next */}
            <button onClick={() => changeTrack(1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', cursor: 'pointer', flexShrink: 0 }}>
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tracks[trackIdx].title}</p>
              <p style={{ fontSize: '12px', color: '#8892a8', marginTop: '2px' }}>{lofiPlaying ? '▶ Playing...' : `Track ${trackIdx + 1} / ${tracks.length}`}</p>
              {/* Animated visualizer */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '14px', marginTop: '8px' }}>
                {[0.4, 0.8, 0.6, 1, 0.5, 0.9, 0.3].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={lofiPlaying ? { height: [`${h * 30}%`, '100%', `${h * 50}%`, '60%', `${h * 40}%`] } : { height: '15%' }}
                    transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: 'easeInOut', delay: i * 0.08 }}
                    style={{ flex: 1, background: '#a78bfa', borderRadius: '2px', opacity: lofiPlaying ? 0.85 : 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(34,211,238,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="label" style={{ fontSize: '12px' }}>Daily Spark</span>
            <button onClick={() => setQuoteIdx(q => (q + 1) % quotes.length)} className="btn-ghost" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px' }}>Next →</button>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{ fontSize: '14px', color: '#d8dce8', lineHeight: '1.7', fontStyle: 'italic' }}
            >
              "{quotes[quoteIdx]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Distraction Shield / Emergency Panel */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          borderColor: panicActive ? 'rgba(244, 63, 94, 0.35)' : undefined,
          background: panicActive ? 'rgba(244, 63, 94, 0.03)' : undefined,
          transition: 'all 0.3s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div
              style={{
                padding: '12px',
                borderRadius: '16px',
                border: `1px solid ${panicActive ? 'rgba(244, 63, 94, 0.3)' : 'rgba(148, 163, 184, 0.14)'}`,
                background: panicActive ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 18, 35, 0.5)',
                color: panicActive ? '#f43f5e' : '#8892a8',
              }}
            >
              <ShieldAlert style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <span
                className="label"
                style={{
                  fontSize: '11px',
                  color: panicActive ? '#f43f5e' : undefined,
                }}
              >
                {panicActive ? 'Emergency Active' : 'Distraction Shield'}
              </span>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f0f2f8', marginTop: '4px' }}>
                Strip to absolute essentials
              </h3>
              <p style={{ fontSize: '13px', color: '#8892a8', marginTop: '4px', maxWidth: '340px', lineHeight: '1.5' }}>
                Pause non-critical tasks to focus entirely on critical deadlines.
              </p>
            </div>
          </div>

          <button
            onClick={() => setPanicActive(!panicActive)}
            className="btn-ghost"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '12px',
              borderColor: panicActive ? 'rgba(244, 63, 94, 0.35)' : undefined,
              color: panicActive ? '#f43f5e' : undefined,
              flexShrink: 0,
            }}
          >
            {panicActive ? 'Stand Down' : 'Activate'}
          </button>
        </div>

        <AnimatePresence>
          {panicActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ height: 1, background: 'rgba(244, 63, 94, 0.15)', margin: '20px 0' }} />
              <div
                style={{
                  background: 'rgba(8, 10, 20, 0.8)',
                  border: '1px solid rgba(244, 63, 94, 0.15)',
                  padding: '20px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#d8dce8',
                  lineHeight: '1.5',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
                  <AlertTriangle style={{ width: 14, height: 14 }} />
                  <span>Emergency Directives</span>
                </div>
                <p>• Focusing exclusively on: "{activeTask.title}"</p>
                <p>• Risk exposure: {activeTask.consequence}</p>
                {tasks.filter(t => t.priority === 'Optional').length > 0 && (
                  <p>• Pausing secondary tasks: {tasks.filter(t => t.priority === 'Optional').map(t => `"${t.title}"`).join(', ')}</p>
                )}
                <p>• Sprints re-allocated to Pomodoro high-focus segments.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
