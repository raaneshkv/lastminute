import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Mail, Sparkles, BookOpen, Heart, DollarSign, AlertCircle, Zap, Check, Clock, Mic, MicOff, Trash2 } from 'lucide-react';
import type { ExtractedTask } from '../App';

interface RescueConsoleProps {
  tasks: ExtractedTask[] | null;
  setTasks: (tasks: ExtractedTask[] | null) => void;
  selectedTask: ExtractedTask | null;
  setSelectedTask: (task: ExtractedTask | null) => void;
  inputText: string;
  setInputText: (text: string | ((prev: string) => string)) => void;
}

const priorityTag: Record<ExtractedTask['priority'], string> = {
  Emergency: 'tag-urgent',
  Critical: 'tag-high',
  Important: 'tag-normal',
  Normal: 'tag-low',
  Optional: 'tag-low',
};

const categoryIcons = {
  Finance: DollarSign,
  Academic: BookOpen,
  Health: Heart,
  General: AlertCircle,
};

// ─── Dynamic Task Parsing Logic ───
export function parseRawTasks(text: string): ExtractedTask[] {
  if (!text || !text.trim()) return [];

  const taskList: ExtractedTask[] = [];
  const lowerWhole = text.toLowerCase();

  // Global Deadline/Priority Detection
  let globalPriority: ExtractedTask['priority'] = 'Normal';
  let globalDeadline = 'Today, Flexible';
  if (lowerWhole.includes('tomorrow morning')) {
    globalPriority = 'Critical';
    globalDeadline = 'Tomorrow, 9:00 AM';
  } else if (lowerWhole.includes('tomorrow')) {
    globalPriority = 'Important';
    globalDeadline = 'Tomorrow, End of Day';
  } else if (lowerWhole.includes('tonight')) {
    globalPriority = 'Emergency';
    globalDeadline = 'Tonight, 11:59 PM';
  }

  // 1. Specific Academic Hardcoded Scenarios (From previous task requirements)
  let handledFluidMech = false;
  if (lowerWhole.includes('write the observation') || lowerWhole.includes('write observation')) {
    const subtasks = [];
    if (lowerWhole.includes('aim')) subtasks.push('Aim');
    if (lowerWhole.includes('materials required')) subtasks.push('Materials required');
    if (lowerWhole.includes('formula')) subtasks.push('Formula');
    if (lowerWhole.includes('table')) subtasks.push('Table');
    taskList.push({
      title: 'Complete Fluid Mechanics observation notebook',
      duration: '60–90 mins', category: 'Academic', priority: globalPriority, deadline: globalDeadline, subtasks,
      urgency: 'Requires high focus', consequence: 'Automatic grade deduction and incomplete standing.', recommendation: 'Gather reference materials first. Complete calculations before writing theory.'
    });
    handledFluidMech = true;
  }
  if (lowerWhole.includes('take printout') && (lowerWhole.includes('first three experiments') || lowerWhole.includes('fluid mechanics'))) {
    taskList.push({ title: 'Take printout of first three Fluid Mechanics experiments', duration: '15–30 mins', category: 'Academic', priority: globalPriority, deadline: globalDeadline, urgency: 'Low effort, quick win', consequence: 'Missing lab manual for the session.', recommendation: 'Ensure printer has ink and paper before starting.' });
    handledFluidMech = true;
  }
  if (lowerWhole.includes('stick file') || lowerWhole.includes('arrange file')) {
    taskList.push({ title: 'Arrange Fluid Mechanics printouts in stick file', duration: '5–15 mins', category: 'Academic', priority: globalPriority, deadline: globalDeadline, urgency: 'Admin task', consequence: 'Disorganized submission.', recommendation: 'Do this immediately after taking printouts.' });
    handledFluidMech = true;
  }
  let handledThermo = false;
  if (lowerWhole.includes('thermodynamics') && lowerWhole.includes('printout')) {
    taskList.push({ title: 'Take printout of Thermodynamics Work/Heat Energy problems from LMS', duration: '15–30 mins', category: 'Academic', priority: globalPriority, deadline: globalDeadline, urgency: 'Quick win', consequence: 'Unprepared for thermodynamics class.', recommendation: 'Download all files locally before printing to save time.' });
    handledThermo = true;
  }
  let handledMfg = false;
  if (lowerWhole.includes('study manufacturing') || lowerWhole.includes('manufacturing processes')) {
    taskList.push({ title: 'Study Manufacturing Processes topics', duration: '30–60 mins', category: 'Academic', priority: globalPriority, deadline: globalDeadline, subtasks: ['Testing methods of moulding sand', 'AFS grain fineness number & formula'], urgency: 'Medium focus', consequence: 'Incomplete knowledge for upcoming tests.', recommendation: 'Use active recall and write down the formula multiple times.' });
    handledMfg = true;
  }

  // 2. General Parsing Logic (For any other unstructured input)
  const statements = text.split(/[.,;]|\band\b|\balso\b|\bthen\b/i);
  
  statements.forEach((statement) => {
    let s = statement.trim();
    if (!s) return;
    
    // Ignore context/constraints and conversational fillers
    if (/^(i have only|make a plan|make a realistic plan|so make a realistic|i have \d+ hours)/i.test(s)) return;
    
    // Skip if this statement looks like it was already handled by the specific rules
    const sLower = s.toLowerCase();
    if (handledFluidMech && (sLower.includes('observation') || sLower.includes('fluid mechanics') || sLower.includes('printout') || sLower.includes('stick file') || sLower.includes('aim') || sLower.includes('formula') || sLower.includes('table') || sLower.includes('experiments') || sLower.includes('materials required'))) return;
    if (handledThermo && sLower.includes('thermodynamics')) return;
    if (handledMfg && (sLower.includes('manufacturing') || sLower.includes('afs grain') || sLower.includes('moulding sand'))) return;

    // Clean conversational prefixes
    s = s.replace(/^(tomorrow|today|tonight|yesterday)\b/i, '');
    s = s.replace(/^(i have a|i should|i need to|i also need to|i have to|to complete|submit my|finish the|update my|complete my|conduct my|collect my|prepare for|review my|study for my|plan for a|i have)\b/i, '');
    s = s.trim();

    if (s.length < 3) return; // Ignore very short/empty fragments

    // Category and Duration mapping
    let category: ExtractedTask['category'] = 'General';
    let duration = '30 mins';

    if (/(study|test|assignment|homework|quiz|exam|record|lab)/i.test(sLower)) {
      category = 'Academic';
      duration = '60 mins';
    } else if (/(clinic|doctor|health|gym|workout|appointment)/i.test(sLower)) {
      category = 'Health';
      duration = '45 mins';
    } else if (/(trip|flight|hotel|vacation)/i.test(sLower)) {
      category = 'General';
      duration = '1 hour';
    } else if (/(bill|pay|finance|money|fee|invoice)/i.test(sLower)) {
      category = 'Finance';
      duration = '15 mins';
    }

    const cleanTitle = s.charAt(0).toUpperCase() + s.slice(1);

    taskList.push({
      title: cleanTitle,
      duration,
      category,
      priority: globalPriority,
      deadline: globalDeadline,
      urgency: 'General priority task',
      consequence: 'Could cause delays in personal schedule if left unaddressed.',
      recommendation: 'Allocate a focused block of time to address this task.'
    });
  });

  return taskList;
}

export default function RescueConsole({
  tasks,
  setTasks,
  selectedTask,
  setSelectedTask,
  inputText,
  setInputText,
}: RescueConsoleProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [showEmailDraft, setShowEmailDraft] = useState(false);
  const [emailText, setEmailText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  // ─── Voice Transcript Normalization ───
  const normalizeVoiceTranscript = (text: string): string => {
    // Map spoken number words to digits
    const wordToNum: Record<string, string> = {
      zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
      six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
      eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15',
      sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20',
      thirty: '30', forty: '40', fifty: '50',
    };

    let result = text;

    // Replace compound spoken times like "eight thirty" → "8:30"
    result = result.replace(
      /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(ten|fifteen|twenty|thirty|forty|forty five|fifty)\b/gi,
      (_, hour, mins) => {
        const h = wordToNum[hour.toLowerCase()] || hour;
        let m = wordToNum[mins.toLowerCase()] || mins;
        if (mins.toLowerCase() === 'forty five') m = '45';
        return `${h}:${m}`;
      }
    );

    // Replace standalone number words → digits (e.g. "ten AM" → "10 AM")
    result = result.replace(
      /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty)\b/gi,
      (match) => wordToNum[match.toLowerCase()] || match
    );

    // Normalize "a.m." / "p.m." / "a m" / "p m" variants to "AM" / "PM"
    result = result.replace(/\b([aApP])\.?\s*[mM]\.?\b/g, (_, letter) => `${letter.toUpperCase()}M`);

    // Replace " and " between task-like phrases with ", " for parser separation
    result = result.replace(/\s+and\s+/gi, ', ');

    // Clean up multiple spaces
    result = result.replace(/\s{2,}/g, ' ').trim();

    return result;
  };

  // ─── Voice Input Logic ───
  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      transcript = normalizeVoiceTranscript(transcript.trim());
      if (transcript) {
        setInputText((prev: string) => {
          if (prev.trim().length === 0) return transcript;
          // Append with comma so the parser treats it as a separate task
          return prev.trimEnd().replace(/,?\s*$/, '') + ', ' + transcript;
        });
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
    setIsListening(true);
  }, [isListening, setInputText]);

  const handleClearInput = () => {
    setInputText('');
    setTasks(null);
    setSelectedTask(null);
  };

  const templates = [
    {
      label: 'Exam Cram',
      text: 'Physics quiz tomorrow morning, calculus homework due at 10 AM, email professor for project clarification.',
    },
    {
      label: 'Freelance Rush',
      text: 'Send client invoice by 3 PM, fix homepage layout bugs before midnight, push git changes.',
    },
    {
      label: 'General Day',
      text: 'Electricity bill due tonight, cancel gym subscription, call landlord about broken tap.',
    },
  ];

  const handleRescue = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      const parsed = parseRawTasks(inputText);
      setTasks(parsed);
      if (parsed.length > 0) {
        setSelectedTask(parsed[0]);
      } else {
        setSelectedTask(null);
      }
    }, 1200);
  };

  const generateEmailDraft = (taskTitle: string) => {
    const drafts: Record<string, string> = {
      'Manufacturing lab record': `Subject: Extension request — Lab Record\n\nDear Professor,\n\nI am writing to respectfully request a brief extension on tomorrow's manufacturing lab record submission. Due to overlapping timelines, I require a few extra hours to submit work that meets course standards.\n\nCould I submit my report by tomorrow afternoon?\n\nWarm regards,\n[Your Name]`,
      'Mechanics quiz preparation': `Subject: Study resource confirmation\n\nDear Professor,\n\nI am reviewing core mechanics topics for tomorrow's quiz. Could you clarify if structural vector calculations are included in this syllabus?\n\nThank you,\n[Your Name]`,
      'LastMinute AI frontend bug fixes': `Subject: Production deployment update\n\nHi team,\n\nI am compiling the final fixes for the left-clinging dashboard layout. Code is undergoing verification and will deploy before midnight.\n\nRegards,\n[Your Name]`,
    };
    setEmailText(drafts[taskTitle] || `Draft message ready for task: "${taskTitle}"\n\nHello Support,\n\nI am writing regarding my task to "${taskTitle}". Please update my status accordingly.\n\nSincerely,\n[Your Name]`);
    setShowEmailDraft(true);
    setCopied(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

      {/* Hero Section */}
      <header style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <p className="eyebrow" style={{ marginBottom: '12px' }}>Smart Planner</p>
        <h1 className="display-lg">Untangle your schedule.</h1>
        <p className="lead" style={{ marginTop: '16px', fontSize: '17px', lineHeight: '1.7' }}>
          Dump your raw thoughts, tasks, and deadlines. The AI organizer parses everything into an actionable priorities plan.
        </p>
      </header>

      {/* Two-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '32px',
          alignItems: 'stretch',
        }}
        className="lg:!grid-cols-[38%_1fr]"
      >

        {/* Left Column - Raw Task Dump */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="label">Raw Task Dump</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#8892a8' }}>{inputText.length} chars</span>
                {/* Voice Button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                  style={{
                    width: 34, height: 34,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: isListening ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(148, 163, 184, 0.16)',
                    background: isListening ? 'rgba(244, 63, 94, 0.12)' : 'rgba(148, 163, 184, 0.06)',
                    color: isListening ? '#f43f5e' : '#8892a8',
                    transition: 'all 0.2s',
                    animation: isListening ? 'pulse-mic 1.5s ease-in-out infinite' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isListening) {
                      e.currentTarget.style.color = '#22d3ee';
                      e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isListening) {
                      e.currentTarget.style.color = '#8892a8';
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.16)';
                    }
                  }}
                >
                  {isListening ? <MicOff style={{ width: 16, height: 16 }} /> : <Mic style={{ width: 16, height: 16 }} />}
                </button>
                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handleClearInput}
                  title="Clear raw text dump"
                  disabled={inputText.length === 0}
                  style={{
                    width: 34, height: 34,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputText.length === 0 ? 'not-allowed' : 'pointer',
                    border: '1px solid rgba(148, 163, 184, 0.16)',
                    background: 'rgba(148, 163, 184, 0.06)',
                    color: inputText.length === 0 ? '#2a2e3a' : '#8892a8',
                    transition: 'all 0.2s',
                    opacity: inputText.length === 0 ? 0.4 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (inputText.length > 0) {
                      e.currentTarget.style.color = '#f43f5e';
                      e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (inputText.length > 0) {
                      e.currentTarget.style.color = '#8892a8';
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.16)';
                    }
                  }}
                >
                  <Trash2 style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {templates.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => setInputText(tpl.text)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: '1px solid rgba(148, 163, 184, 0.14)',
                    background: 'rgba(16, 18, 35, 0.5)',
                    color: '#8892a8',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#22d3ee';
                    e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8892a8';
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.14)';
                  }}
                >
                  {tpl.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="textarea-field"
              style={{ flex: 1, minHeight: '200px', fontSize: '15px' }}
              placeholder="Type in everything you need to get done..."
            />
          </div>

          {/* Stress Meter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8892a8' }}>
              <span>Stress level</span>
              <span style={{
                fontWeight: 600,
                color: inputText.length > 100 ? '#f43f5e' : inputText.length > 40 ? '#fbbf24' : '#22d3ee',
              }}>
                {inputText.length === 0 ? 'Calm' : inputText.length > 100 ? 'High' : inputText.length > 40 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <div className="progress-track">
              <motion.div
                animate={{ width: `${Math.min(100, (inputText.length / 250) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 80 }}
                style={{
                  height: '100%',
                  borderRadius: '3px',
                  background: inputText.length > 100 ? '#f43f5e' : inputText.length > 40 ? '#fbbf24' : '#22d3ee',
                }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleRescue}
            disabled={isExtracting || !inputText.trim()}
            className="btn-primary"
            style={{ width: '100%', padding: '14px 24px', fontSize: '15px', fontWeight: 700, borderRadius: '14px' }}
          >
            {isExtracting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 16, height: 16,
                    border: '2px solid #080a14',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
                Analyzing...
              </span>
            ) : (
              <>
                Build My Plan
                <Sparkles style={{ width: 18, height: 18 }} />
              </>
            )}
          </button>
        </div>

        {/* Right Column - Generated Plan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence mode="wait">
            {!tasks ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel"
                style={{
                  padding: '48px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: '460px',
                  borderStyle: 'dashed',
                }}
              >
                <div
                  style={{
                    width: 48, height: 48,
                    borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Zap style={{ width: 22, height: 22, color: '#22d3ee' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#d8dce8' }}>
                  Your execution plan
                </h3>
                <p style={{ fontSize: '15px', color: '#8892a8', marginTop: '10px', maxWidth: '360px', lineHeight: '1.65' }}>
                  Enter your tasks on the left and click "Build My Plan" to get an organized, prioritized timeline.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label">Generated Plan</span>
                  <span style={{ fontSize: '13px', color: '#22d3ee', fontWeight: 500 }}>
                    {tasks.length} tasks prioritized
                  </span>
                </div>

                {/* Task Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {tasks.map((task) => {
                    const Icon = categoryIcons[task.category] || AlertCircle;
                    const isSelected = selectedTask?.title === task.title;
                    
                    return (
                      <div
                        key={task.title}
                        onMouseEnter={() => setSelectedTask(task)}
                        onMouseLeave={() => setSelectedTask(null)}
                        className="group relative"
                        style={{ perspective: '1000px' }}
                      >
                        <motion.div
                          className={`glass-panel w-full text-left transition-all duration-500 transform-style-3d ${
                            isSelected ? 'scale-[1.02] shadow-[0_20px_40px_rgba(56,189,248,0.15)] border-accent-cyan z-10' : ''
                          }`}
                          style={{
                            padding: '16px 20px',
                            background: isSelected ? 'rgba(12, 14, 28, 0.95)' : undefined,
                            borderColor: isSelected ? 'rgba(34, 211, 238, 0.4)' : undefined,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div
                                style={{
                                  padding: '10px',
                                  borderRadius: '14px',
                                  border: `1px solid ${isSelected ? 'rgba(34, 211, 238, 0.5)' : 'rgba(148, 163, 184, 0.14)'}`,
                                  background: isSelected ? 'rgba(34, 211, 238, 0.1)' : 'rgba(16, 18, 35, 0.5)',
                                  color: isSelected ? '#22d3ee' : '#8892a8',
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                <Icon style={{ width: 16, height: 16 }} />
                              </div>
                              <div>
                                <p style={{ fontSize: '15px', fontWeight: 600, color: isSelected ? '#fff' : '#f0f2f8', transition: 'color 0.3s ease' }}>{task.title}</p>
                                <p style={{ fontSize: '13px', color: '#8892a8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Clock style={{ width: 12, height: 12 }} />
                                  {task.duration} · {task.category}
                                </p>
                              </div>
                            </div>
                            <span className={`tag ${priorityTag[task.priority]}`}>
                              {task.priority}
                            </span>
                          </div>

                          {/* Hover Bento Grid Expansion */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div className="p-5 mt-3 bg-black/20 rounded-2xl border border-line backdrop-blur-sm">
                                  <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-start gap-4">
                                      <div>
                                        <p className="text-[11px] font-bold text-accent-purple uppercase tracking-wider">Deadline</p>
                                        <p className="text-[14px] font-semibold text-ivory mt-1">{task.deadline}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-2 justify-end">
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(`Task: ${task.title}\nDeadline: ${task.deadline}\nDuration: ${task.duration}`);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                          }}
                                          className="btn-ghost !px-3 !py-1.5 !text-[11px]"
                                        >
                                          {copied ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                                          {copied ? 'Copied' : 'Copy'}
                                        </button>
                                        <button
                                          onClick={() => generateEmailDraft(task.title)}
                                          className="btn-primary !px-3 !py-1.5 !text-[11px] !rounded-[10px]"
                                        >
                                          <Mail className="w-3.5 h-3.5" />
                                          Draft Email
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="bg-black/40 border border-line rounded-xl p-4 flex flex-col">
                                        <p className="text-[11px] font-bold text-accent-rose uppercase tracking-wider mb-2">Risk of Failure</p>
                                        <p className="text-[13px] text-accent-rose/90 leading-relaxed break-words">{task.consequence}</p>
                                      </div>
                                      <div className="bg-black/40 border border-line rounded-xl p-4 flex flex-col">
                                        <p className="text-[11px] font-bold text-accent-cyan uppercase tracking-wider mb-2">Recommendation</p>
                                        <p className="text-[13px] text-cream leading-relaxed break-words">{task.recommendation}</p>
                                      </div>
                                    </div>

                                    {task.subtasks && task.subtasks.length > 0 && (
                                      <div className="bg-black/40 border border-line rounded-xl p-4">
                                        <p className="text-[11px] font-bold text-accent-gold uppercase tracking-wider mb-3">Subtasks</p>
                                        <div className="flex flex-wrap gap-2">
                                          {task.subtasks.map((sub, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[12px] text-ivory break-words max-w-full">
                                              {sub}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Email Draft inline */}
                                    <AnimatePresence>
                                      {showEmailDraft && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="mt-2"
                                        >
                                          <div className="bg-black/60 border border-accent-purple/30 rounded-xl p-4 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-purple to-accent-cyan" />
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="text-[12px] font-bold text-accent-purple">Email Draft Generated</span>
                                              <button onClick={() => setShowEmailDraft(false)} className="text-[11px] text-muted hover:text-white">Close</button>
                                            </div>
                                            <pre className="font-mono text-[11px] text-cream whitespace-pre-wrap leading-relaxed">{emailText}</pre>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
