import { motion } from 'framer-motion';
import { Award, Zap, TrendingDown, Sparkles, Calendar, Activity, ChevronRight, AlertTriangle } from 'lucide-react';
import type { ExtractedTask } from '../App';

interface AnalyticsDashboardProps {
  tasks: ExtractedTask[] | null;
}

const getHeatColor = (load: number) => {
  if (load >= 0.9) return 'rgba(244, 63, 94, 0.8)';
  if (load >= 0.7) return 'rgba(251, 191, 36, 0.75)';
  if (load >= 0.5) return 'rgba(167, 139, 250, 0.7)';
  if (load >= 0.3) return 'rgba(56, 189, 248, 0.6)';
  return 'rgba(148, 163, 184, 0.12)';
};

export default function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // 1. Dynamic Stats Calculation
  const activeCount = tasks ? tasks.length : 0;
  const emergencyCount = tasks ? tasks.filter(t => t.priority === 'Emergency').length : 0;
  
  // Calculate total focus hours based on durations
  const calculateFocusHours = (): string => {
    if (!tasks || tasks.length === 0) return '0h';
    let hours = 0;
    tasks.forEach(t => {
      if (t.duration.includes('mins')) {
        const mins = parseInt(t.duration) || 15;
        hours += mins / 60;
      } else {
        const hrs = parseFloat(t.duration) || 2;
        hours += hrs;
      }
    });
    return `${hours.toFixed(1)}h`;
  };

  const focusHours = calculateFocusHours();

  // 2. Workload Matrix calculations based on active tasks
  const getDynamicHeatmap = () => {
    // Default matrix
    const baseMatrix = [
      { week: 1, load: [0.3, 0.5, 0.8, 0.4, 0.6, 0.2, 0.1] },
      { week: 2, load: [0.6, 0.8, 0.7, 0.85, 0.9, 0.4, 0.2] },
      { week: 3, load: [0.5, 0.3, 0.65, 0.45, 0.75, 0.15, 0.25] },
      { week: 4, load: [0.2, 0.1, 0.2, 0.3, 0.2, 0.1, 0.05] }, // W4 represents active week
    ];

    if (!tasks || tasks.length === 0) return baseMatrix;

    // Distribute active tasks into week 4
    // E.g. emergency tasks increase current day (today is Wed = index 2) load to 1.0
    // Academic tasks increase Thursday/Friday load
    const activeWeekLoad = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
    tasks.forEach((t, i) => {
      const idx = (i + 2) % 7; // spread index
      let weight = 0.3;
      if (t.priority === 'Emergency') weight = 0.95;
      else if (t.priority === 'Critical') weight = 0.8;
      else if (t.priority === 'Important') weight = 0.6;
      activeWeekLoad[idx] = Math.min(1.0, activeWeekLoad[idx] + weight);
    });

    baseMatrix[3].load = activeWeekLoad;
    return baseMatrix;
  };

  const heatmapData = getDynamicHeatmap();

  // 3. Dynamic Observations Formulation
  const getObservations = () => {
    const list: Array<{ text: string; tone: 'calm' | 'warn'; icon: any }> = [
      { text: 'Your most productive focus window is 7 PM – 10 PM.', tone: 'calm' as const, icon: Zap },
      { text: 'Active streak standing: 12 days without a deadline slip.', tone: 'calm' as const, icon: Award },
    ];

    if (!tasks || tasks.length === 0) {
      list.unshift({
        text: 'Workload rhythm is stable. Complete tasks to update prediction index.',
        tone: 'calm' as const,
        icon: Sparkles
      });
      return list;
    }

    if (emergencyCount > 0) {
      list.unshift({
        text: `Critical Alert: You have ${emergencyCount} Emergency task(s) scheduled. FocusHUD bypass recommended immediately.`,
        tone: 'warn' as const,
        icon: TrendingDown
      });
    }

    const academicTasks = tasks.filter(t => t.category === 'Academic');
    if (academicTasks.length > 0) {
      list.push({
        text: `${academicTasks.length} academic task(s) mapped. Chronos recommends splitting "${academicTasks[0].title}" into energy blocks.`,
        tone: 'calm' as const,
        icon: Sparkles
      });
    }

    const financeTasks = tasks.filter(t => t.category === 'Finance');
    if (financeTasks.length > 0) {
      list.push({
        text: `Finance transaction due: Pay "${financeTasks[0].title}" to prevent late penalty fees.`,
        tone: 'warn' as const,
        icon: TrendingDown
      });
    }

    return list;
  };

  const activeInsights = getObservations();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px', paddingBottom: '40px' }}>

      {/* Hero */}
      <header style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <p className="eyebrow" style={{ marginBottom: '12px' }}>Insights</p>
        <h1 className="display-lg">Workload patterns.</h1>
        <p className="lead" style={{ marginTop: '16px', fontSize: '17px' }}>
          Analyze your scheduling patterns over time. The planner uses this data to adjust buffers and match your actual pace.
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
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee',
            }}
          >
            <AlertTriangle style={{ width: 20, height: 20 }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#d8dce8' }}>Telemetry Offline</h3>
          <p style={{ fontSize: '14px', color: '#8892a8', lineHeight: '1.6', maxWidth: '380px' }}>
            Workload Insights are generated from your tasks. Go to the **Plan Console** and build a plan to view rhythm telemetry.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Cards - 4 columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              { label: 'Active tasks', value: `${activeCount}`, note: 'In execution loop', icon: Sparkles, color: '#22d3ee' },
              { label: 'Emergency Items', value: `${emergencyCount}`, note: 'Due before tomorrow', icon: TrendingDown, color: '#f43f5e' },
              { label: 'Focus hours', value: focusHours, note: 'Estimated sprint time', icon: Zap, color: '#a78bfa' },
              { label: 'Streak record', value: '12d', note: 'Days without miss', icon: Award, color: '#fbbf24' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="glass-panel"
                  style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      width: 32, height: 32,
                      borderRadius: '10px',
                      background: 'rgba(148, 163, 184, 0.06)',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon style={{ width: 16, height: 16, color: stat.color }} />
                  </div>
                  <p style={{ fontSize: '32px', fontWeight: 800, color: '#f0f2f8', letterSpacing: '-0.02em' }}>{stat.value}</p>
                  <p style={{ fontSize: '14px', color: '#d8dce8', marginTop: '10px', fontWeight: 600 }}>{stat.label}</p>
                  <p style={{ fontSize: '12px', color: '#8892a8', marginTop: '4px' }}>{stat.note}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Heatmap & Insights - 60/40 Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '24px',
            }}
            className="lg:!grid-cols-[3fr_2fr]"
          >
            {/* Heatmap */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar style={{ width: 20, height: 20, color: '#22d3ee' }} />
                <div>
                  <span className="label" style={{ fontSize: '11px' }}>Workload Heatmap</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f0f2f8', marginTop: '2px' }}>Four-week rhythm</h3>
                </div>
              </div>

              {/* Bar Chart */}
              <div style={{ padding: '20px 0 10px 0', height: '220px', display: 'flex', alignItems: 'flex-end', gap: '16px', position: 'relative' }}>
                {/* Y-Axis lines */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0, opacity: 0.1, pointerEvents: 'none' }}>
                  <div style={{ borderTop: '1px dashed #fff', width: '100%' }} />
                  <div style={{ borderTop: '1px dashed #fff', width: '100%' }} />
                  <div style={{ borderTop: '1px dashed #fff', width: '100%' }} />
                  <div style={{ borderTop: '1px dashed #fff', width: '100%' }} />
                </div>
                
                {/* Bars */}
                {heatmapData[3].load.map((load, di) => {
                  const heightPercentage = Math.max(10, load * 100);
                  const color = getHeatColor(load);
                  return (
                    <div key={di} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                      <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: `${heightPercentage}%`, opacity: 1 }}
                          transition={{ type: 'spring', bounce: 0.4, delay: di * 0.1 }}
                          whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
                          style={{
                            width: '32px',
                            background: `linear-gradient(180deg, ${color} 0%, rgba(16,18,35,0) 100%)`,
                            borderTop: `2px solid ${color}`,
                            borderTopLeftRadius: '6px',
                            borderTopRightRadius: '6px',
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                          title={`${Math.round(load * 100)}% load capacity`}
                        >
                          <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: 700, color: '#f0f2f8', opacity: 0.8 }}>
                            {Math.round(load * 100)}%
                          </div>
                        </motion.div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#8892a8', fontWeight: 600 }}>{days[di]}</span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: '#8892a8', paddingTop: '16px', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <span style={{ fontWeight: 600 }}>Intensity Level:</span>
                {[
                  { c: 'rgba(56,189,248,0.6)', l: 'Optimal' },
                  { c: 'rgba(167,139,250,0.7)', l: 'Elevated' },
                  { c: 'rgba(251,191,36,0.75)', l: 'Heavy' },
                  { c: 'rgba(244,63,94,0.8)', l: 'Critical' },
                ].map(({ c, l }) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '8px', background: 'rgba(16, 18, 35, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '3px', background: c, display: 'inline-block' }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Observations */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity style={{ width: 20, height: 20, color: '#a78bfa' }} />
                <div>
                  <span className="label" style={{ fontSize: '11px' }}>Core Findings</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f0f2f8', marginTop: '2px' }}>AI observations</h3>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {activeInsights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: `1px solid ${item.tone === 'warn' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(34, 211, 238, 0.2)'}`,
                        background: item.tone === 'warn' ? 'rgba(244, 63, 94, 0.03)' : 'rgba(34, 211, 238, 0.03)',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        fontSize: '14px',
                        lineHeight: '1.55',
                        color: '#d8dce8',
                      }}
                    >
                      <Icon style={{ width: 16, height: 16, flexShrink: 0, marginTop: '2px', color: item.tone === 'warn' ? '#f43f5e' : '#22d3ee' }} />
                      <p>{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Achievement Section */}
          <div className="glass-panel" style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ maxWidth: '420px' }}>
                  <span className="label" style={{ fontSize: '11px' }}>Achievement Rank</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f8', marginTop: '6px' }}>
                    Level: <span className="text-gradient-cyan-blue" style={{ fontWeight: 800 }}>Deadline Defender</span>
                  </h3>
                  <p style={{ fontSize: '13px', color: '#8892a8', marginTop: '6px' }}>
                    Earn 5 more focus blocks to reach Warrior rank
                  </p>
                </div>

                {/* Rank Timeline */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {['Chaos', 'Rebuilding', 'Defender', 'Warrior', 'Master'].map((rank, i) => {
                    const isActive = i === 2;
                    const isPast = i < 2;
                    return (
                      <span
                        key={rank}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: isActive ? 700 : 500,
                          border: `1px solid ${isActive ? 'rgba(34, 211, 238, 0.35)' : 'rgba(148, 163, 184, 0.14)'}`,
                          color: isActive ? '#22d3ee' : isPast ? '#4a5268' : 'rgba(74, 82, 104, 0.5)',
                          background: isActive ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
                          textDecoration: isPast ? 'line-through' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isPast && <span>✓</span>}
                        {rank}
                        {i < 4 && <ChevronRight style={{ width: 12, height: 12, color: 'rgba(74, 82, 104, 0.3)' }} />}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8892a8', marginBottom: '8px' }}>
                  <span>Experience</span>
                  <span style={{ color: '#22d3ee', fontWeight: 600 }}>1,240 / 2,000</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '62%' }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
