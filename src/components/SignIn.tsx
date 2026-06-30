import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Shield, Activity, Lock, Mail, Terminal, Zap, Layers } from 'lucide-react';

interface SignInProps {
  onSignIn: (email: string) => void;
}

const features = [
  {
    icon: Terminal,
    title: 'Smart Task Decoupler',
    desc: 'Input raw notes, paragraphs, or lists. Our dynamic parsing engine immediately maps priorities, categories, and deadlines.',
  },
  {
    icon: Layers,
    title: 'Core Subsystem Orchestration',
    desc: 'Simulate chronological study planning, risk estimation, checklists, and ML adjustments across five dedicated AI cores.',
  },
  {
    icon: Activity,
    title: 'Workload Rhythm Analytics',
    desc: 'Visualize workload intensity and calendar density heatmap, generated dynamically from your active planner load.',
  },
  {
    icon: Zap,
    title: 'High-Focus HUD Timer',
    desc: 'Activate Pomodoro cycles, distraction shielding, and absolute emergency bypass directives mapped to your core objectives.',
  },
];

export default function SignIn({ onSignIn }: SignInProps) {
  const [mode, setMode] = useState<'intro' | 'signin' | 'register'>('intro');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');



  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-sans text-ivory">
      {/* ─── 3D Live Video Background ─── */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Ambient Dark Overlay to match design system and ensure readability */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: mode === 'intro'
              ? 'radial-gradient(circle at center, rgba(8, 10, 20, 0.45) 0%, rgba(8, 10, 20, 0.8) 100%)'
              : 'radial-gradient(circle at center, rgba(8, 10, 20, 0.6) 0%, rgba(8, 10, 20, 0.9) 100%)',
            backdropFilter: mode === 'intro' ? 'blur(6px)' : 'blur(16px)',
            WebkitBackdropFilter: mode === 'intro' ? 'blur(6px)' : 'blur(16px)',
          }}
        />
      </div>

      <div className="app-grain" />

      {/* ─── Immersive Contents ─── */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          {mode === 'intro' ? (
            /* ─── INTRO LANDING PAGE ─── */
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '40px',
                width: '100%',
              }}
            >
              {/* Logo & Headline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.16)',
                  }}
                >
                  <Cpu style={{ width: 14, height: 14, color: '#22d3ee' }} />
                  <span className="label" style={{ fontSize: '11px', color: '#38bdf8' }}>LASTMINUTE AI v2.0</span>
                </div>
                <h1 className="display-xl" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
                  Decouple your schedule. <br />
                  <span className="text-gradient-cyan-blue">Master the pressure.</span>
                </h1>
                <p className="lead" style={{ maxWidth: '640px', marginTop: '8px' }}>
                  An intelligent, centered AI productivity assistant built for students. Turn messy deadlines, assignments, and tasks into calm, structured plans.
                </p>
              </div>

              {/* Grid of Key Features */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  width: '100%',
                  maxWidth: '1120px',
                }}
              >
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className="glass-panel"
                      style={{
                        padding: '24px',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        background: 'rgba(16, 18, 35, 0.55)',
                      }}
                    >
                      <div
                        style={{
                          width: 38, height: 38,
                          borderRadius: '12px',
                          background: 'rgba(56, 189, 248, 0.08)',
                          border: '1px solid rgba(56, 189, 248, 0.16)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        <Icon style={{ width: 18, height: 18 }} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f8' }}>{f.title}</h3>
                      <p style={{ fontSize: '13px', color: '#8892a8', lineHeight: '1.55' }}>{f.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Call to Action */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    onClick={() => setMode('signin')}
                    className="btn-primary"
                    style={{
                      padding: '16px 36px',
                      fontSize: '16px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontWeight: 700,
                    }}
                  >
                    Sign In
                    <ArrowRight style={{ width: 18, height: 18 }} />
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className="btn-ghost"
                    style={{
                      padding: '16px 36px',
                      fontSize: '16px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontWeight: 700,
                    }}
                  >
                    Register Free
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8892a8' }}>
                  <Shield style={{ width: 14, height: 14, color: '#34d399' }} />
                  <span>AES-256 local verification</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─── EMAIL & PASSWORD SIGN IN / REGISTER ─── */
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[440px]"
            >
              <div className="glass-panel" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* Heading */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f2f8' }}>
                      {mode === 'signin' ? 'Identify Core' : 'Register Core'}
                    </h2>
                    <button
                      onClick={() => setMode('intro')}
                      style={{
                        fontSize: '12px',
                        color: '#38bdf8',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      ← Back
                    </button>
                  </div>
                  <p style={{ fontSize: '13px', color: '#8892a8' }}>
                    {mode === 'signin' 
                      ? 'Enter your email and workspace security key.'
                      : 'Create a new secure workspace access key.'}
                  </p>
                </div>

                {/* Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setError('');
                    
                    if (!email) { setError('Please enter your email'); return; }
                    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address'); return; }
                    if (!password) { setError('Please enter your password'); return; }
                    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
                    
                    if (mode === 'signin') {
                      // Demo Validation for existing accounts
                      if (password !== 'demo123') {
                        setError('Incorrect password. (Hint: use demo123 for existing accounts, or register a new one)');
                        return;
                      }
                    }

                    setIsSubmitting(true);
                    setTimeout(() => {
                      setIsSubmitting(false);
                      onSignIn(email);
                    }, 1200);
                  }} 
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  
                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="email" className="label" style={{ fontSize: '11px' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="student@example.edu"
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                      />
                      <Mail style={{ width: 16, height: 16, color: '#4a5268', position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  {/* Password */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="password" className="label" style={{ fontSize: '11px' }}>Security Key (Password)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="••••••••"
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                      />
                      <Lock style={{ width: 16, height: 16, color: '#4a5268', position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  {/* Error display */}
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: '12px', color: '#f43f5e', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>*</span> {error}
                    </motion.p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px 24px', fontSize: '15px', fontWeight: 700, borderRadius: '14px' }}
                  >
                    {isSubmitting ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: 14, height: 14,
                            border: '2px solid #080a14',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.7s linear infinite',
                          }}
                        />
                        {mode === 'signin' ? 'Authenticating...' : 'Registering...'}
                      </span>
                    ) : (
                      <>
                        {mode === 'signin' ? 'Access Workspace' : 'Create Workspace'}
                        <ArrowRight style={{ width: 16, height: 16 }} />
                      </>
                    )}
                  </button>
                  
                  {/* Toggle Register/Login */}
                  <div style={{ textAlign: 'center', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setMode(mode === 'signin' ? 'register' : 'signin');
                        setError('');
                      }}
                      style={{
                        background: 'none', border: 'none',
                        color: '#8892a8', fontSize: '13px', cursor: 'pointer',
                        textDecoration: 'underline', textUnderlineOffset: '4px'
                      }}
                    >
                      {mode === 'signin' ? "Don't have an account? Register" : "Already have an account? Sign In"}
                    </button>
                  </div>
                </form>

                {/* Footer notes */}
                <div style={{ height: 1, background: 'rgba(148, 163, 184, 0.1)' }} />
                <p style={{ fontSize: '11px', color: '#4a5268', fontFamily: 'var(--font-mono)', lineHeight: '1.4' }}>
                  SESSION PREFERENCES AND CONFIGURATIONS ARE PERSISTED SECURELY IN YOUR WEB BROWSER STORAGE.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
