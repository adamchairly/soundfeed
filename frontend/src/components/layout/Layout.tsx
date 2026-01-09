import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RecoveryModal } from '@/components/header/RecoveryModal';
import { UserModal } from '@/components/header/UserModal';
import { useUser } from '@/contexts/UserContext';

export const Layout = () => {
  const { userCode, email, emailNotifications, recoverIdentity, refreshUser } = useUser();
  const [showRecovery, setShowRecovery] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const handleRecover = async (code: string) => {
    const success = await recoverIdentity(code);
    if (success) window.location.reload();
  };

  const handleUserUpdate = async () => {
    await refreshUser();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-display">
      <Header 
        recoveryCode={userCode} 
        onCodeClick={() => setShowRecovery(true)}
        onEmailClick={() => setShowUser(true)}
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

      {showUser && (
        <UserModal
          email={email}
          emailNotifications={emailNotifications}
          onClose={() => setShowUser(false)}
          onUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
};