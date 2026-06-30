import { motion } from 'framer-motion';
import { useState } from 'react';
import { Play, Cpu, Activity, Zap, Brain, Target, Shield, AlertTriangle, Eye, ChevronDown } from 'lucide-react';
import type { ExtractedTask } from '../App';

interface AgentsSectionProps {
  tasks: ExtractedTask[] | null;
}

interface Agent {
  id: string;
  name: string;
  displayName: string;
  role: string;
  icon: React.ComponentType<any>;
  status: 'Active' | 'Standby' | 'Learning';
}

const agents: Agent[] = [
  {
    id: 'planner',
    name: 'Chronos',
    displayName: 'Planner',
    role: 'Organizes tasks into energy-based time blocks',
    icon: Target,
    status: 'Active',
  },
  {
    id: 'risk',
    name: 'Aegis',
    displayName: 'Risk Analyzer',
    role: 'Evaluates deadline risks and consequence paths',
    icon: Shield,
    status: 'Active',
  },
  {
    id: 'coach',
    name: 'Pulse',
    displayName: 'Focus Coach',
    role: 'Monitors cognitive load and sends adaptive nudges',
    icon: Brain,
    status: 'Standby',
  },
  {
    id: 'execution',
    name: 'Nexus',
    displayName: 'Executor',
    role: 'Creates step-by-step checklists and starter drafts',
    icon: Zap,
    status: 'Active',
  },
  {
    id: 'reflection',
    name: 'Sybil',
    displayName: 'Learner',
    role: 'Analyzes historical trends to improve future plans',
    icon: Activity,
    status: 'Learning',
  },
];

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  Active: { bg: 'rgba(52, 211, 153, 0.08)', border: 'rgba(52, 211, 153, 0.25)', text: '#34d399' },
  Standby: { bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.25)', text: '#fbbf24' },
  Learning: { bg: 'rgba(167, 139, 250, 0.08)', border: 'rgba(167, 139, 250, 0.25)', text: '#a78bfa' },
};

export default function AgentsSection({ tasks }: AgentsSectionProps) {
  const [activeAgent, setActiveAgent] = useState('planner');
  const [isRunning, setIsRunning] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [runCompletedFor, setRunCompletedFor] = useState<string | null>(null);
  const [expandedTemplates, setExpandedTemplates] = useState<Record<string, boolean>>({});

  const currentAgent = agents.find((a) => a.id === activeAgent)!;

  // Generate dynamic logs based on active tasks
  const getDynamicActions = (agentId: string): string[] => {
    if (!tasks || tasks.length === 0) return ['No active tasks. System in idle monitoring mode.'];

    switch (agentId) {
      case 'planner':
        return [
          'Initializing Chronos Planner core...',
          `Scanning local planner tasks: ${tasks.length} active items mapped.`,
          ...tasks.slice(0, 3).map(t => `Chronos: Allocating Pomodoro energy blocks for "${t.title}" (Estimated: ${t.duration}).`),
          `Chronos: Deadline schedule constructed. Target density optimized.`,
        ];
      case 'risk':
        return [
          'Initializing Aegis Risk Evaluation matrix...',
          `Evaluating calendar exposure for ${tasks.length} priorities.`,
          ...tasks.slice(0, 3).map(t => `Aegis Warning: Task "${t.title}" carries high risk. Consequence: ${t.consequence}`),
          'Aegis: Threat paths analyzed. Critical exceptions flagged to UI.',
        ];
      case 'coach':
        return [
          'Engaging Pulse Focus Coach telemetry...',
          `Current workspace load: ${tasks.length} tasks scheduled.`,
          ...tasks.slice(0, 3).map(t => `Pulse Nudge: For "${t.title}" -> ${t.recommendation}`),
          'Pulse: Cognitive recommendations compiled for active HUD.',
        ];
      case 'execution':
        return [
          'Activating Nexus Checklist compilation...',
          ...tasks.slice(0, 3).map(t => `Nexus: Generated checklist starter checkpoint for "${t.title}".`),
          'Nexus: starter_package_compiled.zip created in scratch folder.',
        ];
      case 'reflection':
      default:
        return [
          'Connecting to Sybil historic model weights database...',
          `Aggregating delay statistics across ${tasks.length} user activities.`,
          ...tasks.slice(0, 3).map(t => `Sybil: Recalculating duration coefficient for task type "${t.category}".`),
          'Sybil: Machine learning model weights adjusted (delta: -0.02).',
        ];
    }
  };

  const runAgent = () => {
    console.log("Starting agent core:", activeAgent);
    setIsRunning(true);
    setLogLines([]);
    setRunCompletedFor(null);
    const actions = getDynamicActions(activeAgent);
    console.log("Actions list:", actions);
    actions.forEach((action, i) => {
      setTimeout(() => {
        console.log(`Log [${i + 1}]:`, action);
        setLogLines((prev) => {
          const next = prev ? [...prev, action] : [action];
          return next;
        });
        if (i === actions.length - 1) {
          setIsRunning(false);
          setRunCompletedFor(activeAgent);
        }
      }, (i + 1) * 350);
    });
  };

  const renderVisualOutput = () => {
    if (!tasks || tasks.length === 0) return null;

    switch (activeAgent) {
      case 'planner':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f0f2f8' }}>Pomodoro Sprint Allocation Timeline</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((task, idx) => {
                const startHour = 19;
                const startMins = idx * 45;
                const h1 = startHour + Math.floor(startMins / 60);
                const m1 = (startMins % 60).toString().padStart(2, '0');
                const endMins = (idx + 1) * 45;
                const h2 = startHour + Math.floor(endMins / 60);
                const m2 = (endMins % 60).toString().padStart(2, '0');
                
                return (
                  <div
                    key={task.title}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderRadius: '14px',
                      background: 'rgba(8, 10, 20, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.10)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#22d3ee', fontWeight: 700 }}>
                        {h1}:{m1} – {h2}:{m2}
                      </span>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2f8' }}>{task.title}</p>
                        <p style={{ fontSize: '12px', color: '#8892a8', marginTop: '2px' }}>Duration: {task.duration} · Category: {task.category}</p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        color: '#38bdf8',
                      }}
                    >
                      Focus Sprint
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'risk':
        // Calculate dynamic threat index
        let totalRisk = 0;
        tasks.forEach(t => {
          let r = 40;
          if (t.priority === 'Emergency') r = 95;
          else if (t.priority === 'Critical') r = 82;
          else if (t.priority === 'Important') r = 65;
          if (t.duration.includes('60') || t.duration.includes('90')) r += 5;
          totalRisk += Math.min(r, 100);
        });
        const avgRisk = tasks.length > 0 ? Math.round(totalRisk / tasks.length) : 0;
        const safetyMargin = avgRisk > 80 ? '-15 mins' : avgRisk > 60 ? '+10 mins' : '+45 mins';
        const exposure = avgRisk > 80 ? 'Severe' : avgRisk > 60 ? 'Moderate' : 'Low';
        const avgColor = avgRisk > 80 ? '#f43f5e' : avgRisk > 60 ? '#fbbf24' : '#34d399';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f0f2f8' }}>Aegis Threat Model & Exposure Breakdown</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(8, 10, 20, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <span style={{ fontSize: '11px', color: '#8892a8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Threat Index</span>
                <p style={{ fontSize: '24px', fontWeight: 800, color: avgColor, marginTop: '4px' }}>{avgRisk}/100</p>
                <p style={{ fontSize: '11px', color: '#8892a8', marginTop: '4px' }}>Calculated from priorities</p>
              </div>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(8, 10, 20, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <span style={{ fontSize: '11px', color: '#8892a8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Safety Margin</span>
                <p style={{ fontSize: '24px', fontWeight: 800, color: avgRisk > 80 ? '#fbbf24' : '#22d3ee', marginTop: '4px' }}>{safetyMargin}</p>
                <p style={{ fontSize: '11px', color: '#8892a8', marginTop: '4px' }}>{avgRisk > 80 ? 'Sufficient buffers missing' : 'Buffer available'}</p>
              </div>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(8, 10, 20, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <span style={{ fontSize: '11px', color: '#8892a8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Exposure Risk</span>
                <p style={{ fontSize: '24px', fontWeight: 800, color: '#a78bfa', marginTop: '4px' }}>{exposure}</p>
                <p style={{ fontSize: '11px', color: '#8892a8', marginTop: '4px' }}>Task overlap analysis</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="label" style={{ fontSize: '10px' }}>Task Slippage Exposure</span>
              {tasks.map((task) => {
                let riskVal = 40;
                if (task.priority === 'Emergency') riskVal = 95;
                else if (task.priority === 'Critical') riskVal = 82;
                else if (task.priority === 'Important') riskVal = 65;
                if (task.duration.includes('60') || task.duration.includes('90')) riskVal += 5;
                riskVal = Math.min(riskVal, 100);

                const riskColor = riskVal > 80 ? '#f43f5e' : riskVal > 60 ? '#fbbf24' : '#22d3ee';
                
                return (
                  <div key={task.title} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(8, 10, 20, 0.4)', border: '1px solid rgba(148, 163, 184, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f8' }}>{task.title}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: riskColor }}>{riskVal}% Risk</span>
                    </div>
                    <div className="progress-track" style={{ height: '5px' }}>
                      <div className="progress-fill" style={{ width: `${riskVal}%`, background: riskColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'coach':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f0f2f8' }}>Pulse Momentum Analysis & Cognitive Nudges</h4>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(8, 10, 20, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(56, 189, 248, 0.08)', border: '2px solid #22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#22d3ee' }}>64%</span>
                </div>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#f0f2f8' }}>Cognitive Momentum Index</h5>
                  <p style={{ fontSize: '12px', color: '#8892a8', marginTop: '2px' }}>Balanced. Energy blocks pre-allocated.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="label" style={{ fontSize: '10px' }}>Actionable Focus Nudges</span>
              {tasks.map((task) => (
                <div
                  key={task.title}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(8, 10, 20, 0.4)',
                    border: '1px solid rgba(167, 139, 250, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#d8dce8',
                  }}
                >
                  <Brain style={{ width: 16, height: 16, color: '#a78bfa', flexShrink: 0 }} />
                  <p>
                    For <strong style={{ color: '#f0f2f8' }}>{task.title}</strong>: {task.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'execution':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f0f2f8' }}>Nexus Checklist Artifacts & Templates</h4>
            <p style={{ fontSize: '13px', color: '#8892a8', lineHeight: '1.5' }}>
              We have generated startup assets, checklists, and templates to eliminate momentum blocks for your active schedule. Click below to view drafts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((task) => {
                const fileName = `${task.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_starter_notes.md`;
                
                const subtasksList = task.subtasks && task.subtasks.length > 0 
                  ? task.subtasks.map(s => `- [ ] ${s}`).join('\n')
                  : `- [ ] Clear workspace and remove distractions\n- [ ] Break down "${task.title}" into 15-minute chunks\n- [ ] Execute focused work session\n- [ ] Review and finalize output`;
                  
                const templateText = `# Execution Checklist: ${task.title}\n\n## Goal / Urgency\n${task.urgency}\n\n## Action Plan\n${subtasksList}\n\n## Impact of Delay\n${task.consequence}`;
                
                const isExpanded = expandedTemplates[task.title];

                return (
                  <div
                    key={task.title}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: 'rgba(8, 10, 20, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                          <Zap style={{ width: 16, height: 16 }} />
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#a78bfa' }}>{fileName}</p>
                          <p style={{ fontSize: '12px', color: '#8892a8', marginTop: '2px' }}>Action template compiled for: {task.title}</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedTemplates(prev => ({ ...prev, [task.title]: !prev[task.title] }));
                          }}
                          className="btn-ghost"
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Eye style={{ width: 14, height: 14 }} />
                          {isExpanded ? 'Hide' : 'View'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(templateText);
                            alert(`Copied template for "${task.title}" to clipboard!`);
                          }}
                          className="btn-ghost"
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '10px' }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Expandable Preview */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                          overflow: 'hidden',
                          background: 'rgba(16, 18, 35, 0.8)',
                          borderRadius: '10px',
                          border: '1px solid rgba(148, 163, 184, 0.1)',
                          padding: '16px',
                          marginTop: '8px',
                        }}
                      >
                        <pre style={{ fontSize: '12px', color: '#d8dce8', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                          {templateText}
                        </pre>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'reflection':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f0f2f8' }}>Sybil Cognitive Adjustment Telemetry</h4>
            
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(8, 10, 20, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#a78bfa' }}>Prediction Calibration Matrix</span>
                <span style={{ fontSize: '11px', color: '#8892a8', fontFamily: 'var(--font-mono)' }}>CALIBRATION ACCURACY: 74%</span>
              </div>
              <p style={{ fontSize: '13px', color: '#d8dce8', lineHeight: '1.5' }}>
                Sybil maps delay frequencies against historical estimates to forecast user slippage.
              </p>
              
              <div style={{ height: 1, background: 'rgba(148, 163, 184, 0.1)' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#8892a8' }}>Estimated Academic Bias</span>
                  <span style={{ color: '#f43f5e', fontWeight: 700 }}>+45 mins delay correlation</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#8892a8' }}>Estimated Finance Bias</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>0 mins delay correlation</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#8892a8' }}>Adjusted time buffer allocated</span>
                  <span style={{ color: '#22d3ee', fontWeight: 700 }}>+30 mins automatically added</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

      {/* Hero */}
      <header style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
        <p className="eyebrow" style={{ marginBottom: '10px' }}>AI Agents</p>
        <h1 className="display-lg">Your productivity crew.</h1>
        <p className="lead" style={{ marginTop: '14px', fontSize: '17px' }}>
          Five specialized AI modules work together to plan, analyze, and optimize your workflow.
        </p>
      </header>

      {/* If No Tasks Exist */}
      {!tasks || tasks.length === 0 ? (
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
              background: 'rgba(251, 191, 36, 0.08)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
            }}
          >
            <AlertTriangle style={{ width: 20, height: 20 }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#d8dce8' }}>Subsystems Standby</h3>
          <p style={{ fontSize: '14px', color: '#8892a8', lineHeight: '1.6', maxWidth: '380px' }}>
            AI cores require task parameters. Go to the **Plan Console** and build a timeline plan to activate agents.
          </p>
        </div>
      ) : (
        <>
          {/* Agent Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isSelected = activeAgent === agent.id;
              const statusStyle = statusColors[agent.status];
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => {
                    setActiveAgent(agent.id);
                    setLogLines([]);
                    setIsRunning(false);
                    setRunCompletedFor(null);
                  }}
                  className="glass-panel"
                  style={{
                    textAlign: 'left',
                    padding: '24px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    borderColor: isSelected ? '#38bdf8' : undefined,
                    background: isSelected ? 'rgba(56, 189, 248, 0.04)' : undefined,
                  }}
                >
                  {/* Icon + Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: 40, height: 40,
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected ? 'rgba(34, 211, 238, 0.1)' : 'rgba(148, 163, 184, 0.06)',
                        border: `1px solid ${isSelected ? 'rgba(34, 211, 238, 0.25)' : 'rgba(148, 163, 184, 0.14)'}`,
                      }}
                    >
                      <Icon style={{ width: 18, height: 18, color: isSelected ? '#22d3ee' : '#4a5268' }} />
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: statusStyle.bg,
                        border: `1px solid ${statusStyle.border}`,
                        color: statusStyle.text,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f8' }}>{agent.displayName}</h3>
                  <p style={{ fontSize: '13px', color: '#8892a8', marginTop: '8px', lineHeight: '1.55', minHeight: '40px' }}>
                    {agent.role}
                  </p>

                  {/* Active indicator bar */}
                  {isSelected && (
                    <motion.div
                      layoutId="agentActiveBorder"
                      style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: 3,
                        background: 'linear-gradient(90deg, #22d3ee, #38bdf8)',
                        borderRadius: '0 0 22px 22px',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Agent Log Panel */}
          <div className="glass-panel" style={{ padding: '28px 32px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

            {/* Panel Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: 42, height: 42,
                    borderRadius: '14px',
                    background: 'rgba(167, 139, 250, 0.1)',
                    border: '1px solid rgba(167, 139, 250, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Cpu style={{ width: 20, height: 20, color: '#a78bfa' }} />
                </div>
                <div>
                  <span className="label" style={{ fontSize: '11px' }}>Active Module</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f0f2f8', marginTop: '2px' }}>
                    {currentAgent.name} — {currentAgent.displayName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={runAgent}
                disabled={isRunning}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px' }}
              >
                {isRunning ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: 14, height: 14,
                        border: '2px solid #080a14',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                    Running...
                  </span>
                ) : (
                  <>
                    Run Agent
                    <Play style={{ width: 14, height: 14, fill: '#080a14' }} />
                  </>
                )}
              </button>
            </div>

            {/* Log Output */}
            <div
              style={{
                background: 'rgba(8, 10, 20, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                minHeight: '140px',
              }}
            >
              {logLines.length === 0 ? (
                <div style={{ color: '#4a5268', fontStyle: 'italic' }}>
                  Ready. Click "Run Agent" to see processing logs.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {logLines.map((line, i) => {
                    const isLast = i === getDynamicActions(activeAgent).length - 1;
                    return (
                      <div
                        key={`${line}-${i}`}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                      >
                        <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0 }}>[{i + 1}]</span>
                        <span style={{ color: isLast ? '#34d399' : '#d8dce8', fontWeight: isLast ? 600 : 400 }}>
                          {line}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Visual Output Preview Card */}
          {runCompletedFor === activeAgent && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{
                padding: '28px 32px',
                maxWidth: '900px',
                margin: '24px auto 0 auto',
                width: '100%',
                borderColor: 'rgba(56, 189, 248, 0.25)',
                background: 'rgba(16, 18, 35, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 10, height: 10,
                      borderRadius: '50%',
                      background: '#22d3ee',
                      boxShadow: '0 0 8px #22d3ee',
                    }}
                  />
                  <span className="label" style={{ fontSize: '11px', color: '#22d3ee' }}>Agent Core Deliverable Output</span>
                </div>
                <span style={{ fontSize: '11px', color: '#8892a8', fontFamily: 'var(--font-mono)' }}>STATUS: CALIBRATED</span>
              </div>

              <div style={{ height: 1, background: 'rgba(148, 163, 184, 0.1)' }} />

              {renderVisualOutput()}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
