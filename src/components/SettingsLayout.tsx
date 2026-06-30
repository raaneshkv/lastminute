import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Monitor, Moon, Sun, Volume2, Eye, Database } from 'lucide-react';

const ACCENT = '#22d3ee';
const PANEL = 'rgba(16, 18, 35, 0.72)';
const BORDER = 'rgba(148, 163, 184, 0.12)';
const MUTED = '#8892a8';

interface SettingItem {
  name: string;
  desc: string;
  key: string;
}

interface Section {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  settings: SettingItem[];
}

export default function SettingsLayout() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    hardware_accel: true,
    haptic: false,
    dark_mode: true,
    reduce_motion: false,
    critical_alerts: true,
    daily_briefing: true,
    deadline_pings: true,
    focus_mode_dnd: false,
    local_only: true,
    telemetry: false,
    crash_reports: true,
    data_export: false,
  });

  const toggle = (key: string) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const sections: Section[] = [
    {
      title: 'Display & Performance',
      icon: Monitor,
      color: '#22d3ee',
      settings: [
        { name: 'Hardware Acceleration', desc: 'Use WebGL for 3D UI matrix rendering', key: 'hardware_accel' },
        { name: 'Dark Mode', desc: 'Use the dark color scheme across all panels', key: 'dark_mode' },
        { name: 'Reduce Motion', desc: 'Minimize animations for accessibility', key: 'reduce_motion' },
        { name: 'Haptic Feedback', desc: 'Trigger vibrations on task completion', key: 'haptic' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: '#fbbf24',
      settings: [
        { name: 'Critical Alerts', desc: 'Bypass focus mode for emergency tasks', key: 'critical_alerts' },
        { name: 'Daily Briefing', desc: 'Receive a morning digest of priorities', key: 'daily_briefing' },
        { name: 'Deadline Pings', desc: 'Get reminded 30 minutes before deadlines', key: 'deadline_pings' },
        { name: 'Focus DND Mode', desc: 'Silence all notifications during Focus HUD sessions', key: 'focus_mode_dnd' },
      ]
    },
    {
      title: 'Data & Privacy',
      icon: Shield,
      color: '#34d399',
      settings: [
        { name: 'Local Only Mode', desc: 'Keep task extraction entirely offline', key: 'local_only' },
        { name: 'Telemetry', desc: 'Send anonymous performance metrics to improve the app', key: 'telemetry' },
        { name: 'Crash Reports', desc: 'Automatically send crash logs for debugging', key: 'crash_reports' },
        { name: 'Auto Data Export', desc: 'Export your tasks weekly to a local JSON file', key: 'data_export' },
      ]
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '860px', margin: '0 auto', paddingBottom: '80px' }}>
      
      {/* Header */}
      <header style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: ACCENT, marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
          System Config
        </p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: '#f0f2f8', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Control Panel
        </h1>
        <p style={{ fontSize: '16px', color: MUTED, marginTop: '14px', lineHeight: 1.6 }}>
          Fine-tune your Smart Workspace environment. All settings are saved locally.
        </p>
      </header>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              style={{
                background: PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: '20px',
                padding: '32px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '18px', borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ width: 36, height: 36, borderRadius: '12px', background: `${section.color}14`, border: `1px solid ${section.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 18, height: 18, color: section.color }} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f0f2f8' }}>{section.title}</h3>
              </div>

              {/* Settings rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {section.settings.map((setting) => {
                  const isOn = prefs[setting.key];
                  return (
                    <div key={setting.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>{setting.name}</p>
                        <p style={{ fontSize: '13px', color: MUTED, marginTop: '3px', lineHeight: 1.5 }}>{setting.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggle(setting.key)}
                        aria-label={`Toggle ${setting.name}`}
                        style={{
                          position: 'relative',
                          width: '48px',
                          height: '26px',
                          borderRadius: '99px',
                          border: 'none',
                          cursor: 'pointer',
                          flexShrink: 0,
                          background: isOn ? section.color : 'rgba(74, 82, 104, 0.4)',
                          transition: 'background 0.25s ease',
                          boxShadow: isOn ? `0 0 12px ${section.color}55` : 'none',
                        }}
                      >
                        <motion.div
                          animate={{ x: isOn ? 22 : 2 }}
                          transition={{ type: 'spring', stiffness: 600, damping: 35 }}
                          style={{
                            position: 'absolute',
                            top: '3px',
                            left: '0px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* About card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{
          background: PANEL,
          border: `1px solid ${BORDER}`,
          borderRadius: '20px',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#f0f2f8' }}>LastMinute AI</p>
          <p style={{ fontSize: '12px', color: MUTED, marginTop: '4px', fontFamily: 'var(--font-mono)' }}>Version 2.0 · Build 2026.06</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ padding: '5px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#34d399' }}>
            ✓ System Calibrated
          </span>
          <span style={{ padding: '5px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
            Local Build
          </span>
        </div>
      </motion.div>
    </div>
  );
}
