import { useState } from 'react';
import { useGameStore } from './stores/useGameStore';
import { StartScreen } from './components/StartScreen';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardView } from './components/views/DashboardView';
import { AcademicsView } from './components/views/AcademicsView';
import { CareerView } from './components/views/CareerView';
import { NetworkView } from './components/views/NetworkView';
import { LifestyleView } from './components/views/LifestyleView';
import { MigrationView } from './components/views/MigrationView';
import { EventModal } from './components/common/EventModal';

function App() {
  const {
    phase,
    isGameOver,
    gameOverReason,
    resetGame,
  } = useGameStore();

  const [currentView, setCurrentView] = useState('dashboard');

  if (phase === 'intro') {
    return <StartScreen />;
  }

  if (isGameOver) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="max-w-md text-center space-y-6 p-8">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-4xl font-bold text-red-500">GAME OVER</h1>
          <p className="text-xl text-slate-300">{gameOverReason}</p>
          <div className="pt-8">
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition shadow-lg hover:shadow-red-500/20"
            >
              Try Again (重开)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <EventModal />
      <DashboardLayout currentView={currentView} onChangeView={setCurrentView}>
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'academics' && <AcademicsView />}
        {currentView === 'career' && <CareerView />}
        {currentView === 'network' && <NetworkView />}
        {currentView === 'lifestyle' && <LifestyleView />}
        {currentView === 'migration' && <MigrationView />}
      </DashboardLayout>
    </>
  );
}

export default App;
