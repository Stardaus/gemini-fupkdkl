import { useState, useMemo, useCallback } from 'react';
import { useFormularyData } from './hooks/useFormularyData';
import { useTheme } from './hooks/useTheme';
import { useRecentMeds } from './hooks/useRecentMeds';
import { useDisclaimer } from './hooks/useDisclaimer';
import { usePWAInstall } from './hooks/usePWAInstall';
import { FormularyQueryEngine } from './services/formularyQueryEngine';
import { Medication, FilterCategory } from './types/formulary';

import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { QuickFilters } from './components/QuickFilters';
import { VirtualMedList } from './components/VirtualMedList';
import { MedicationDetailDialog } from './components/MedicationDetailDialog';
import { DisclaimerDialog } from './components/DisclaimerDialog';
import { RecentMedications } from './components/RecentMedications';
import { UpdateToast } from './components/UpdateToast';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { DataUpdatePrompt } from './components/DataUpdatePrompt';
import { InstallBanner } from './components/InstallBanner';
import { IOSInstallDialog } from './components/IOSInstallDialog';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { hasAccepted, acceptDisclaimer } = useDisclaimer();
  const { recentMeds, addRecentMed, clearRecentMeds } = useRecentMeds();
  const {
    isInstallable,
    isBannerVisible,
    isIOSModalOpen,
    promptInstall,
    dismissBanner,
    closeIOSModal,
  } = usePWAInstall();

  const {
    medications,
    versionInfo,
    isLoading,
    isDataUpdateAvailable,
    pendingVersion,
    isSuccessToastVisible,
    applyDataUpdate,
    dismissDataUpdatePrompt,
    dismissSuccessToast,
    refreshData,
  } = useFormularyData();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);

  // Pure domain query engine memoized against medications array
  const queryEngine = useMemo(
    () => new FormularyQueryEngine(medications),
    [medications]
  );

  // Query engine results (filtered items + category counts)
  const { displayed: displayedMedications, quotaCount } = useMemo(
    () => queryEngine.query(searchQuery, activeFilter),
    [queryEngine, searchQuery, activeFilter]
  );

  const handleSelectMedication = useCallback(
    (med: Medication) => {
      setSelectedMedication(med);
      addRecentMed(med);
    },
    [addRecentMed]
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedMedication(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* PWA App Shell Code Update Banner */}
      <PWAUpdatePrompt />

      {/* Google Sheets Data Update Banner */}
      <DataUpdatePrompt
        isVisible={isDataUpdateAvailable}
        version={pendingVersion}
        onUpdate={applyDataUpdate}
        onDismiss={dismissDataUpdatePrompt}
      />

      {/* PWA Install Banner */}
      <InstallBanner
        isVisible={isBannerVisible}
        onInstall={promptInstall}
        onDismiss={dismissBanner}
      />

      {/* iOS Safari Install Guide Dialog */}
      <IOSInstallDialog
        isOpen={isIOSModalOpen}
        onClose={closeIOSModal}
      />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 pb-8 sm:pb-6 space-y-5">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onCheckUpdate={refreshData}
          isInstallable={isInstallable}
          onInstallApp={promptInstall}
        />

        {/* Disclaimer Dialog for first-time launch */}
        <DisclaimerDialog
          isOpen={!hasAccepted}
          onAccept={acceptDisclaimer}
        />

        {/* Hero Section: Recent Lookups */}
        <RecentMedications
          recentMeds={recentMeds}
          onSelectMedication={handleSelectMedication}
          onClearRecent={clearRecentMeds}
        />

        {/* Search Controls */}
        <div className="space-y-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
          <QuickFilters
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            totalCount={medications.length}
            quotaCount={quotaCount}
          />
        </div>

        {/* Medication List or Loading Indicator */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            <p className="text-sm font-medium">Loading formulary data...</p>
          </div>
        ) : (
          <VirtualMedList
            medications={displayedMedications}
            onSelectMedication={handleSelectMedication}
          />
        )}

        {/* Medication Detail Dialog */}
        <MedicationDetailDialog
          medication={selectedMedication}
          isOpen={!!selectedMedication}
          onClose={handleCloseDialog}
        />

        {/* Data Update Completion Toast */}
        <UpdateToast
          isVisible={isSuccessToastVisible}
          version={pendingVersion}
          onDismiss={dismissSuccessToast}
        />

        {/* Footnote displaying App Build version & Data Version */}
        <Footer versionInfo={versionInfo} onCheckUpdate={refreshData} />
      </main>
    </div>
  );
}
