import { motion } from 'framer-motion';
import { Clock, Calendar, CheckCircle2, CircleDashed, Zap, Target, AlertTriangle } from 'lucide-react';
import type { ExtractedTask } from '../App';

const categoryColors: Record<string, { color: string; glow: string; bg: string }> = {
  Academic: { color: '#22d3ee', glow: 'rgba(34, 211, 238, 0.3)', bg: 'rgba(34, 211, 238, 0.08)' },
  Finance: { color: '#34d399', glow: 'rgba(52, 211, 153, 0.3)', bg: 'rgba(52, 211, 153, 0.08)' },
  Health: { color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.3)', bg: 'rgba(167, 139, 250, 0.08)' },
  General: { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)', bg: 'rgba(251, 191, 36, 0.08)' },
};

const priorityIcon = (priority: string) => {
  if (priority === 'Emergency') return <AlertTriangle style={{ width: 14, height: 14, color: '#f43f5e' }} />;
  if (priority === 'Critical') return <Zap style={{ width: 14, height: 14, color: '#fbbf24' }} />;
  return <Target style={{ width: 14, height: 14, color: '#22d3ee' }} />;
};

export default function TimelineView({ tasks }: { tasks: ExtractedTask[] | null }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: '20px' }}>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <Calendar style={{ width: 56, height: 56, color: '#4a5268' }} />
        </motion.div>
        <h3 className="display-md" style={{ color: '#8892a8' }}>No tasks found</h3>
        <p className="lead" style={{ marginTop: '8px' }}>Head back to the Plan Console to generate your execution timeline.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', position: 'relative' }}>

      {/* Floating Background Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {[
          { x: '15%', y: '20%', size: 300, color: 'rgba(34,211,238,0.04)', delay: 0 },
          { x: '80%', y: '60%', size: 250, color: 'rgba(167,139,250,0.05)', delay: 2 },
          { x: '50%', y: '85%', size: 200, color: 'rgba(251,191,36,0.03)', delay: 4 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -30, 0], scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 8 + i * 2, ease: 'easeInOut', delay: orb.delay }}
            style={{
              position: 'absolute',
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: orb.color,
              filter: 'blur(60px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="eyebrow" style={{ marginBottom: '12px' }}>Timeline Matrix</p>
          <h1 className="display-lg">Chronological Execution</h1>
          <p className="lead" style={{ marginTop: '16px' }}>
            Your tasks visualized in a spatial timeline. Click a card to dive into details.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}
        >
          {[
            { label: 'Tasks Queued', value: `${tasks.length}`, color: '#22d3ee' },
            { label: 'Emergency', value: `${tasks.filter(t => t.priority === 'Emergency').length}`, color: '#f43f5e' },
            { label: 'Academic', value: `${tasks.filter(t => t.category === 'Academic').length}`, color: '#a78bfa' },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                padding: '10px 20px',
                background: 'rgba(16, 18, 35, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 800, color: stat.color }}>{stat.value}</span>
              <span style={{ fontSize: '12px', color: '#8892a8' }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </header>

      {/* Timeline */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 16px' }}>
        
        {/* Central Spine Line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #22d3ee 0%, #a78bfa 50%, rgba(167,139,250,0) 100%)',
            opacity: 0.35,
            borderRadius: '2px',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {tasks.map((task, idx) => {
            const isLeft = idx % 2 === 0;
            const cat = categoryColors[task.category] || categoryColors.General;
            const startHour = 19 + Math.floor(idx * 1.25);
            const startMin = ((idx * 30) % 60).toString().padStart(2, '0');
            const timeLabel = `${startHour}:${startMin}`;

            return (
              <div
                key={task.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 48px 1fr',
                  alignItems: 'center',
                  gap: '0',
                  minHeight: '0',
                }}
              >
                {/* Left side content */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '32px' }}>
                  {isLeft ? (
                    <motion.div
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.55, delay: idx * 0.08, type: 'spring', bounce: 0.35 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="glass-panel"
                      style={{
                        padding: '24px',
                        maxWidth: '420px',
                        width: '100%',
                        borderColor: `rgba(${cat.color.replace('#', '').match(/../g)?.map(x => parseInt(x, 16)).join(',')}, 0.25)`,
                        boxShadow: `0 8px 32px ${cat.glow}`,
                        cursor: 'default',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Glow accent */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }} />

                      {/* Time + Category tag */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: cat.color, fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}>
                          <Clock style={{ width: 14, height: 14 }} />
                          {timeLabel}
                        </div>
                        <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: cat.bg, color: cat.color }}>
                          {task.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f8', marginBottom: '10px', lineHeight: '1.4' }}>
                        {task.title}
                      </h4>

                      {/* Subtasks if any */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {task.subtasks.map(s => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8892a8' }}>
                              <CheckCircle2 style={{ width: 12, height: 12, color: cat.color, flexShrink: 0 }} />
                              {s}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#8892a8' }}>
                          <CircleDashed style={{ width: 12, height: 12 }} />
                          {task.duration}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: task.priority === 'Emergency' ? '#f43f5e' : '#8892a8' }}>
                          {priorityIcon(task.priority)}
                          {task.priority}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Time label on right for right-side cards */
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#4a5268', fontWeight: 600 }}
                      >
                        {task.deadline}
                      </motion.span>
                    </div>
                  )}
                </div>

                {/* Node */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', bounce: 0.6, delay: idx * 0.08 + 0.2 }}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#080a14',
                      border: `3px solid ${cat.color}`,
                      boxShadow: `0 0 12px ${cat.glow}, 0 0 24px ${cat.glow}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color }} />
                  </motion.div>
                </div>

                {/* Right side content */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '32px' }}>
                  {!isLeft ? (
                    <motion.div
                      initial={{ opacity: 0, x: 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.55, delay: idx * 0.08, type: 'spring', bounce: 0.35 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="glass-panel"
                      style={{
                        padding: '24px',
                        maxWidth: '420px',
                        width: '100%',
                        borderColor: `rgba(${cat.color.replace('#', '').match(/../g)?.map(x => parseInt(x, 16)).join(',')}, 0.25)`,
                        boxShadow: `0 8px 32px ${cat.glow}`,
                        cursor: 'default',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }} />
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: cat.color, fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}>
                          <Clock style={{ width: 14, height: 14 }} />
                          {timeLabel}
                        </div>
                        <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: cat.bg, color: cat.color }}>
                          {task.category}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f8', marginBottom: '10px', lineHeight: '1.4' }}>
                        {task.title}
                      </h4>

                      {task.subtasks && task.subtasks.length > 0 && (
                        <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {task.subtasks.map(s => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8892a8' }}>
                              <CheckCircle2 style={{ width: 12, height: 12, color: cat.color, flexShrink: 0 }} />
                              {s}
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#8892a8' }}>
                          <CircleDashed style={{ width: 12, height: 12 }} />
                          {task.duration}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: task.priority === 'Emergency' ? '#f43f5e' : '#8892a8' }}>
                          {priorityIcon(task.priority)}
                          {task.priority}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#4a5268', fontWeight: 600 }}
                      >
                        {task.deadline}
                      </motion.span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={{ textAlign: 'center', padding: '32px 0', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '16px', background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
          <CheckCircle2 style={{ width: 18, height: 18, color: '#34d399' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#34d399' }}>
            {tasks.length} tasks queued for execution
          </span>
        </div>
      </motion.div>
    </div>
  );
}
