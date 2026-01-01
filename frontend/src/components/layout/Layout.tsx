import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { RecoveryModal } from '../RecoveryModal';
import { useUser } from '../../contexts/UserContext';

export const Layout = () => {
  const { userCode, recoverIdentity } = useUser();
  const [showRecovery, setShowRecovery] = useState(false);

  const handleRecover = async (code: string) => {
    const success = await recoverIdentity(code);
    if (success) window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-display">
      <Header 
        recoveryCode={userCode} 
        onCodeClick={() => setShowRecovery(true)} 
      />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {showRecovery && (
        <RecoveryModal 
          currentCode={userCode} 
          onClose={() => setShowRecovery(false)} 
          onRecover={handleRecover}
        />
      )}
    </div>
  );
};