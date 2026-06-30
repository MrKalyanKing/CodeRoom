import { useState, useEffect } from 'react';
import LandingPage from './feature/LandingPage/LandingPage';
import EditorRoom from './feature/Editor/component/EditorRoom';
import HistoryPage from './feature/History/HistoryPage';

const SESSION_KEY = 'coderoom_session';
const SESSION_EXPIRY_KEY = 'coderoom_session_expiry';
const SESSION_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

function getInitialSession() {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (sessionStr && expiryStr) {
    const expiry = parseInt(expiryStr, 10);
    if (Date.now() < expiry) {
      try {
        return JSON.parse(sessionStr);
      } catch (e) {
        return null;
      }
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
    }
  }
  return null;
}

function App() {
  const [sessionState, setSessionState] = useState(getInitialSession);
  const [currentView, setCurrentView] = useState('landing');

  const setSession = (newSession) => {
    setSessionState(newSession);
    if (newSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      localStorage.setItem(SESSION_EXPIRY_KEY, (Date.now() + SESSION_TIMEOUT_MS).toString());
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
    }
  };

  useEffect(() => {
    if (!sessionState) return;
    const updateExpiry = () => {
      localStorage.setItem(SESSION_EXPIRY_KEY, (Date.now() + SESSION_TIMEOUT_MS).toString());
    };
    updateExpiry();
    const interval = setInterval(updateExpiry, 60000); // refresh expiry every minute while tab is open
    return () => clearInterval(interval);
  }, [sessionState]);

  if (currentView === 'history') {
    return <HistoryPage onBack={() => setCurrentView('landing')} />;
  }

  if (sessionState) {
    return <EditorRoom session={sessionState} onLeave={() => setSession(null)} onViewHistory={() => setCurrentView('history')} />;
  }

  return <LandingPage 
    onEnterRoom={(roomData) => setSession(roomData)} 
    onViewHistory={() => setCurrentView('history')} 
  />;
}

export default App;
