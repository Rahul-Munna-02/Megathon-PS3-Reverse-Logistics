import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './components/landing/LandingPage';
import { RetailerDashboard } from './components/retailer/RetailerDashboard';
import { DistributorDashboard } from './components/distributor/DistributorDashboard';
import { ManufacturerDashboard } from './components/manufacturer/ManufacturerDashboard';
import { WasteFacilityDashboard } from './components/waste/WasteFacilityDashboard';
import { TrustGateModal } from './components/trustgate/TrustGateModal';
import { BatchPassportModal } from './components/passport/BatchPassportModal';

function MainAppContent() {
  const { role } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

  // Modal states
  const [trustGateOpen, setTrustGateOpen] = useState(false);
  const [trustGateBatch, setTrustGateBatch] = useState('MED-2026-001');

  const [passportOpen, setPassportOpen] = useState(false);
  const [passportBatch, setPassportBatch] = useState('MED-2026-001');

  const handleOpenTrustGate = (batchNumber?: string) => {
    if (batchNumber) setTrustGateBatch(batchNumber);
    setTrustGateOpen(true);
  };

  const handleOpenPassport = (batchNumber: string) => {
    setPassportBatch(batchNumber);
    setPassportOpen(true);
  };

  return (
    <AppShell
      currentView={currentView}
      onNavigate={(v) => setCurrentView(v)}
      onOpenTrustGate={handleOpenTrustGate}
      onOpenPassport={handleOpenPassport}
    >
      {currentView === 'landing' ? (
        <LandingPage
          onExplore={() => setCurrentView('app')}
          onOpenTrustGate={handleOpenTrustGate}
          onOpenPassport={handleOpenPassport}
        />
      ) : (
        <div className="animate-in fade-in duration-300">
          {role === 'RETAILER' && (
            <RetailerDashboard
              onOpenTrustGate={handleOpenTrustGate}
              onOpenPassport={handleOpenPassport}
            />
          )}

          {role === 'DISTRIBUTOR' && (
            <DistributorDashboard onOpenPassport={handleOpenPassport} />
          )}

          {role === 'MANUFACTURER' && (
            <ManufacturerDashboard
              onOpenPassport={handleOpenPassport}
              onOpenTrustGate={handleOpenTrustGate}
            />
          )}

          {role === 'WASTE_FACILITY' && (
            <WasteFacilityDashboard onOpenPassport={handleOpenPassport} />
          )}
        </div>
      )}

      {/* Global Modals */}
      <TrustGateModal
        isOpen={trustGateOpen}
        onClose={() => setTrustGateOpen(false)}
        initialBatchNumber={trustGateBatch}
        onSelectBatchForPassport={handleOpenPassport}
      />

      <BatchPassportModal
        isOpen={passportOpen}
        onClose={() => setPassportOpen(false)}
        batchNumber={passportBatch}
      />
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}