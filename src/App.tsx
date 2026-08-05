import { useState, useMemo, useCallback, useEffect } from 'react';
import { useFormularyData } from './hooks/useFormularyData';
import { useTheme } from './hooks/useTheme';
import { useRecentMeds } from './hooks/useRecentMeds';
import { useDisclaimer } from './hooks/useDisclaimer';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOrientationLock } from './hooks/useOrientationLock';
import { useTour } from './hooks/useTour';
import { FormularyQueryEngine } from './services/formularyQueryEngine';
import { Medication, FilterCategory } from './types/formulary';

import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { QuickFilters } from './components/QuickFilters';
import { VirtualMedList } from './components/VirtualMedList';
import { InitialLoadScreen } from './components/InitialLoadScreen';
import { MedicationDetailDialog } from './components/MedicationDetailDialog';
import { DisclaimerDialog } from './components/DisclaimerDialog';
import { UpdateToast } from './components/UpdateToast';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { DataUpdatePrompt } from './components/DataUpdatePrompt';
import { InstallBanner } from './components/InstallBanner';
import { IOSInstallDialog } from './components/IOSInstallDialog';
import { Footer } from './components/Footer';
import { SettingsDialog } from './components/SettingsDialog';
import { TourGuide } from './components/TourGuide';
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
  const { isPortraitLocked, togglePortraitLock } = useOrientationLock();

  const {
    isActive: isTourActive,
    currentStep: tourStep,
    currentStepIndex: tourStepIndex,
    totalSteps: tourTotalSteps,
    shouldAutoStart: shouldTourAutoStart,
    start: startTour,
    next: nextTourStep,
    back: backTourStep,
    skip: skipTour,
    complete: completeTour,
  } = useTour();

  const {
    medications,
    versionInfo,
    isLoading,
    isInitialLoadRequired,
    isDataUpdateAvailable,
    pendingVersion,
    isSuccessToastVisible,
    applyDataUpdate,
    retryInitialLoad,
    dismissDataUpdatePrompt,
    dismissSuccessToast,
    refreshData,
  } = useFormularyData();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

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

  // Trigger tour automatically after disclaimer acceptance if not completed
  useEffect(() => {
    if (hasAccepted && shouldTourAutoStart && !isTourActive && !isLoading && !isInitialLoadRequired) {
      startTour();
    }
  }, [hasAccepted, shouldTourAutoStart, isTourActive, isLoading, isInitialLoadRequired, startTour]);

  // Action-gated step: advance when medication detail dialog opens
  useEffect(() => {
    if (isTourActive && tourStep?.id === 'medication-list' && selectedMedication) {
      nextTourStep();
    }
  }, [isTourActive, tourStep, selectedMedication, nextTourStep]);

  // Action-gated step: advance when settings dialog opens
  useEffect(() => {
    if (isTourActive && tourStep?.id === 'footer-settings' && isSettingsOpen) {
      nextTourStep();
    }
  }, [isTourActive, tourStep, isSettingsOpen, nextTourStep]);

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

  const handleTourNext = useCallback(() => {
    // If moving away from medication detail step, close the detail dialog
    if (tourStep?.id === 'medication-detail') {
      setSelectedMedication(null);
    }
    nextTourStep();
  }, [tourStep, nextTourStep]);

  return (
    <div className="h-dvh max-h-dvh overflow-hidden flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
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

      {/* Interactive Spotlight Tour Overlay */}
      <TourGuide
        isActive={isTourActive}
        currentStep={tourStep}
        currentStepIndex={tourStepIndex}
        totalSteps={tourTotalSteps}
        onNext={handleTourNext}
        onBack={backTourStep}
        onSkip={skipTour}
        onComplete={completeTour}
      />

      <main className="flex-1 flex flex-col min-h-0 max-w-4xl w-full mx-auto pt-3.5 px-3.5 pb-0 sm:pt-6 sm:px-6 sm:pb-0 space-y-3 sm:space-y-5">
        {/* Top Controls Container */}
        <div className="shrink-0 space-y-2.5 sm:space-y-3">
          <Header
            theme={theme}
            onToggleTheme={toggleTheme}
            isInstallable={isInstallable}
            onInstallApp={promptInstall}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Disclaimer Dialog for first-time launch */}
          <DisclaimerDialog
            isOpen={!hasAccepted}
            onAccept={acceptDisclaimer}
          />

          {/* Hero Search Controls */}
          <div className="space-y-2.5 sm:space-y-3 pt-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              recentMeds={recentMeds}
              onSelectRecentMed={handleSelectMedication}
              onClearRecentMeds={clearRecentMeds}
            />
            <QuickFilters
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              totalCount={medications.length}
              quotaCount={quotaCount}
            />
          </div>
        </div>

        {/* Medication List, Loading Indicator, or Initial Load Screen */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4 text-center">
            <div className="relative">
              <img
                src={`${import.meta.env.BASE_URL}splash-screen.png`}
                alt="FUPKDKL Digital Formulary Splash Screen"
                className="w-44 sm:w-52 h-auto object-contain rounded-2xl shadow-xl border border-brand-500/20 dark:border-brand-500/30"
              />
            </div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-sm">
              <Loader2 className="size-4 animate-spin" />
              <span>Loading clinical formulary database...</span>
            </div>
          </div>
        ) : isInitialLoadRequired ? (
          <InitialLoadScreen onRetry={retryInitialLoad} />
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

        {/* System & Settings Dialog */}
        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          versionInfo={versionInfo}
          onCheckUpdate={refreshData}
          theme={theme}
          onToggleTheme={toggleTheme}
          orientationLock={{
            isLocked: isPortraitLocked,
            onToggle: togglePortraitLock,
          }}
          onReplayTour={startTour}
        />

        {/* Data Update Completion Toast */}
        <UpdateToast
          isVisible={isSuccessToastVisible}
          version={pendingVersion}
          onDismiss={dismissSuccessToast}
        />

      </main>

      {/* Minimal Footnote */}
      <Footer onOpenSettings={() => setIsSettingsOpen(true)} />
    </div>
  );
}
