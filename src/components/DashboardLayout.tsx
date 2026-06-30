import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutDashboard, Cpu, BarChart3, Crosshair, Menu, X, CalendarDays, Settings } from 'lucide-react';
import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  userEmail: string;
  onLogout: () => void;
}

const tabs: Tab[] = [
  { id: 'console', label: 'Plan Console', icon: LayoutDashboard },
  { id: 'timeline', label: 'Timeline View', icon: CalendarDays },
  { id: 'agents', label: 'AI Subsystems', icon: Cpu },
  { id: 'analytics', label: 'Workload Insights', icon: BarChart3 },
  { id: 'focus', label: 'Focus HUD Room', icon: Crosshair },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
  userEmail,
  onLogout,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-canvas min-h-screen flex flex-col lg:flex-row">
      <div className="app-grain" />

      {/* ─── DESKTOP LEFT SIDEBAR ─── */}
      <aside
        className="hidden lg:flex flex-col justify-between sticky top-0 h-screen w-[280px] shrink-0 border-r border-line"
        style={{
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '32px 24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Logo Section */}
          <a href="#" className="flex items-center gap-3 select-none group" style={{ paddingLeft: '12px' }}>
            <div
              className="group-hover:animate-float"
              style={{
                width: 36, height: 36,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #22d3ee, #38bdf8, #a78bfa)',
                backgroundSize: '200% 200%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#080a14',
                fontWeight: 800,
                fontSize: '18px',
                flexShrink: 0,
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              L
            </div>
            <div>
              <span className="font-sans text-[18px] font-extrabold text-ivory tracking-tight block leading-none">
                LastMinute
              </span>
              <span className="text-[9px] font-bold text-accent-cyan tracking-[0.2em] font-sans uppercase" style={{ marginTop: '4px', display: 'block', opacity: 0.8 }}>
                Smart Workspace
              </span>
            </div>
          </a>

          {/* Navigation Section */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span
              className="label"
              style={{ fontSize: '10px', color: '#4a5268', paddingLeft: '16px', marginBottom: '10px', letterSpacing: '0.1em' }}
            >
              Core Navigation
            </span>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full relative rounded-xl flex items-center cursor-pointer transition-all duration-200"
                  style={{
                    padding: '12px 16px',
                    gap: '14px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isActive ? '#f0f2f8' : '#8892a8',
                    background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.16)' : '1px solid transparent',
                    borderRadius: '12px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#22d3ee';
                      e.currentTarget.style.background = 'rgba(56, 189, 248, 0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#8892a8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute w-[3px] rounded-r-full"
                      style={{
                        left: 0,
                        top: '8px',
                        bottom: '8px',
                        background: 'linear-gradient(180deg, #22d3ee, #38bdf8)',
                      }}
                    />
                  )}
                  <Icon style={{ width: 18, height: 18, color: isActive ? '#22d3ee' : '#4a5268', flexShrink: 0 }} />
                  <span style={{ letterSpacing: '0.01em' }}>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Details & Sign Out */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            className="flex items-center gap-3 rounded-xl text-[13px] font-medium"
            style={{
              background: 'rgba(10, 10, 20, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.10)',
              padding: '12px 16px',
            }}
          >
            <div
              style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 6px rgba(52, 211, 153, 0.5)',
                flexShrink: 0,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span className="text-cream truncate" style={{ fontWeight: 600 }}>{userEmail.split('@')[0]}</span>
              <span style={{ fontSize: '10px', color: '#4a5268', fontFamily: 'var(--font-mono)' }}>Workspace Calibrated</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              color: '#f43f5e',
              boxShadow: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)';
            }}
          >
            <LogOut style={{ width: 14, height: 14 }} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── MOBILE TOP HEADER ─── */}
      <header
        className="flex lg:hidden sticky top-0 z-40 border-b border-line items-center justify-between px-6"
        style={{
          height: '72px',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <a href="#" className="flex items-center gap-2 select-none group">
          <span className="font-sans text-[17px] font-extrabold text-ivory tracking-tight">
            LastMinute
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase"
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)'
            }}
          >
            Smart Workspace
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon rounded-xl"
          >
            {mobileMenuOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed left-0 right-0 z-30 border-b border-line"
            style={{
              top: '72px',
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-semibold text-left transition-all"
                    style={{
                      color: isActive ? '#22d3ee' : '#8892a8',
                      background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                    }}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            <div style={{ height: 1, background: 'rgba(148, 163, 184, 0.1)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#8892a8' }}>{userEmail}</span>
              <button
                onClick={onLogout}
                style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 600, background: 'none', border: 'none' }}
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        <main className="flex-1" style={{ width: '100%', padding: '48px 0 64px' }}>
          <div className="dashboard-container">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-line" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="dashboard-container flex items-center justify-between" style={{ height: '64px' }}>
            <span className="text-[12px] text-muted-faint font-semibold">
              © 2026 LastMinute AI — System Telemetry Calibrated.
            </span>
            <span className="text-[11px] text-muted-faint font-mono">
              v2.0
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
