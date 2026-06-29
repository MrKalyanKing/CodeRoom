import { useState } from 'react';
import LandingPage from './feature/LandingPage/LandingPage';
import EditorRoom from './feature/Editor/component/EditorRoom';

function App() {
  const [session, setSession] = useState(null);

  if (session) {
    return <EditorRoom session={session} onLeave={() => setSession(null)} />;
  }

  return <LandingPage onEnterRoom={(roomData) => setSession(roomData)} />;
}

export default App;
