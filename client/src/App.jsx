import { useState, useEffect } from 'react';
import LandingPage from './feature/LandingPage/LandingPage';
import EditorRoom from './feature/Editor/component/EditorRoom';
import HistoryPage from './feature/History/HistoryPage';

function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('coderoom_session');
    const expiry = localStorage.getItem('coderoom_session_expiry');
    if (saved && expiry && Date.now() < parseInt(expiry, 10)) {
      return JSON.parse(saved);
    }
    return null;
  });

  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => {
    if (session) {
      localStorage.setItem('coderoom_session', JSON.stringify(session));
      localStorage.setItem('coderoom_session_expiry', (Date.now() + 3 * 60 * 1000).toString());
      
      const interval = setInterval(() => {
        localStorage.setItem('coderoom_session_expiry', (Date.now() + 3 * 60 * 1000).toString());
      }, 60000);
      return () => clearInterval(interval);
    } else {
      localStorage.removeItem('coderoom_session');
      localStorage.removeItem('coderoom_session_expiry');
    }
  }, [session]);

  if (viewHistory) {
    return <HistoryPage onBack={() => setViewHistory(false)} />;
  }

  if (session) {
    return (
      <EditorRoom 
        session={session} 
        onLeave={() => setSession(null)} 
        onViewHistory={() => setViewHistory(true)}
      />
    );
  }

  return (
    <LandingPage 
      onEnterRoom={(roomData) => setSession(roomData)} 
      onViewHistory={() => setViewHistory(true)}
    />
  );
}

export default App;
