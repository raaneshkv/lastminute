import { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import DashboardLayout from './components/DashboardLayout';
import RescueConsole from './components/RescueConsole';
import AgentsSection from './components/AgentsSection';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FocusRoom from './components/FocusRoom';
import TimelineView from './components/TimelineView';
import SettingsLayout from './components/SettingsLayout';

export interface ExtractedTask {
  title: string;
  deadline: string;
  duration: string;
  priority: 'Emergency' | 'Critical' | 'Important' | 'Normal' | 'Optional';
  urgency: string;
  category: 'Finance' | 'Academic' | 'Health' | 'General';
  consequence: string;
  recommendation: string;
  subtasks?: string[];
}

function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('console');
  const [isLoading, setIsLoading] = useState(true);

  const defaultInput = '';

  // Lifted state for tasks and parsing
  const [inputText, setInputText] = useState(defaultInput);
  const [tasks, setTasks] = useState<ExtractedTask[] | null>(null);
  const [selectedTask, setSelectedTask] = useState<ExtractedTask | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) setUserEmail(savedEmail);
    setIsLoading(false);
  }, []);

  const handleSignIn = (email: string) => {
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    setInputText('');
    setTasks(null);
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <div className="app-canvas min-h-screen flex items-center justify-center">
        <div className="app-grain" />
        <p className="eyebrow animate-pulse">Loading</p>
      </div>
    );
  }

  if (!userEmail) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userEmail={userEmail}
      onLogout={handleLogout}
    >
      {activeTab === 'console' && (
        <RescueConsole
          tasks={tasks}
          setTasks={setTasks}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          inputText={inputText}
          setInputText={setInputText}
        />
      )}
      {activeTab === 'agents' && (
        <AgentsSection
          tasks={tasks}
        />
      )}
      {activeTab === 'analytics' && (
        <AnalyticsDashboard
          tasks={tasks}
        />
      )}
      {activeTab === 'focus' && (
        <FocusRoom
          tasks={tasks}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
      )}
      {activeTab === 'timeline' && (
        <TimelineView tasks={tasks} />
      )}
      {activeTab === 'settings' && (
        <SettingsLayout />
      )}
    </DashboardLayout>
  );
}

export default App;
