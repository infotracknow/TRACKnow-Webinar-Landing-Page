import { useState } from 'react';
import LandingPage from './components/LandingPage';
import WebinarRoom from './components/WebinarRoom';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);

  const handleRegister = (formData) => {
    setUser(formData);
    setCurrentPage('webinar-room');
  };

  return (
    <>
      {currentPage === 'landing' && <LandingPage onRegister={handleRegister} />}
      {currentPage === 'webinar-room' && <WebinarRoom user={user} />}
    </>
  );
}

export default App;
