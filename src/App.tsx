import { useState, useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import { useLegacyStore } from './stores/useLegacyStore';
import { SoundManager } from './utils/SoundManager';
import { StartScreen } from './components/StartScreen';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardView } from './components/views/DashboardView';
import { AcademicsView } from './components/views/AcademicsView';
import { CareerView } from './components/views/CareerView';
import { NetworkView } from './components/views/NetworkView';
import { LifestyleView } from './components/views/LifestyleView';
import { MigrationView } from './components/views/MigrationView';
import { ResumeView } from './components/views/ResumeView';
import { EventModal } from './components/common/EventModal';
import { GameClock } from './components/common/GameClock';
import { EndingScreen } from './components/EndingScreen';

function App() {
  const {
    phase,
    isGameOver,
    gameOverReason,
    resetGame,
  } = useGameStore();

  // Debug
  useEffect(() => {
    (window as any).gameStore = useGameStore;
    (window as any).legacyStore = useLegacyStore;
  }, []);

  const [currentView, setCurrentView] = useState('dashboard');

  // Global click sound listener
  useEffect(() => {
    const handleClick = () => {
      SoundManager.playClick();
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  if (phase === 'intro') {
    return <StartScreen />;
  }

  if (isGameOver) {
    return <EndingScreen />;
  }

  return (
    <>
      <EventModal />
      <DashboardLayout currentView={currentView} onChangeView={setCurrentView}>
        <GameClock />
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'academics' && <AcademicsView />}
        {currentView === 'career' && <CareerView />}
        {currentView === 'network' && <NetworkView />}
        {currentView === 'lifestyle' && <LifestyleView />}
        {currentView === 'migration' && <MigrationView />}
        {currentView === 'resume' && <ResumeView />}
      </DashboardLayout>
    </>
  );
}

export default App;
