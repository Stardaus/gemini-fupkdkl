import { useState, useMemo, useEffect } from 'react';
import {
  Pill,
  ShieldAlert,
  Search,
  XCircle,
  ExternalLink,
  Smartphone,
  Download,
  ShieldCheck,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  ChevronRight,
  Apple,
  MoreVertical,
  QrCode,
  AlertTriangle,
  Filter,
  Lock,
  X,
  FileText,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { Medication, FilterCategory } from '../types/formulary';
import { FormularyQueryEngine } from '../services/formularyQueryEngine';
import { Quest3Link } from './Quest3Link';
import { Theme } from '../hooks/useTheme';

export interface IntroPageProps {
  theme: Theme;
  onToggleTheme: () => void;
  onLaunchApp: () => void;
  medications: Medication[];
}

export function IntroPage({
  theme,
  onToggleTheme,
  onLaunchApp,
  medications,
}: IntroPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queryEngine = useMemo(
    () => new FormularyQueryEngine(medications),
    [medications]
  );

  const { displayed: displayedMedications, quotaCount } = useMemo(
    () => queryEngine.query(searchQuery, activeFilter),
    [queryEngine, searchQuery, activeFilter]
  );

  const appBaseUrl = typeof window !== 'undefined' ? window.location.origin + import.meta.env.BASE_URL : '';

  const screenshots = [
    {
      id: 'dark-mode',
      title: 'Dark Mode Dashboard',
      description: 'High-contrast dark mode surface designed for nocturnal clinical shifts.',
      src: `${import.meta.env.BASE_URL}intro-assets/main-screen-dark-mode.png`,
    },
    {
      id: 'light-mode',
      title: 'Light Mode Dashboard',
      description: 'Clean, accessible light theme with brand teal accents for daylight consultation.',
      src: `${import.meta.env.BASE_URL}intro-assets/main-screen-light-mode.png`,
    },
    {
      id: 'quick-search',
      title: 'Multi-Field Instant Search',
      description: 'Fuzzy search by brand name, generic name, MDC code, or clinical indication.',
      src: `${import.meta.env.BASE_URL}intro-assets/quick-search-on-medication.png`,
    },
    {
      id: 'recent-searches',
      title: 'Recent Lookup History',
      description: 'Quick-access ribbon storing recent formulation lookups for single-tap replay.',
      src: `${import.meta.env.BASE_URL}intro-assets/recent-searches-ribbon.png`,
    },
    {
      id: 'quota-filter',
      title: 'Quota Control Filter',
      description: 'One-tap toggle isolating the 16 high-risk quota-controlled formulations.',
      src: `${import.meta.env.BASE_URL}intro-assets/List-quota-drugs-button.png`,
    },
    {
      id: 'neon-quota-alert',
      title: 'Neon Quota Visual Alerts',
      description: 'High-visibility neon amber glowing borders and warning badges for quota items.',
      src: `${import.meta.env.BASE_URL}intro-assets/neon-yellow-alert-on-quota-drugs.png`,
    },
    {
      id: 'med-detail',
      title: 'Clinical Guideline Card',
      description: 'Full prescribing restrictions, MAL registration links, dosage, and adverse reactions.',
      src: `${import.meta.env.BASE_URL}intro-assets/medication-detail-card.png`,
    },
    {
      id: 'settings',
      title: 'App Configuration & Sync',
      description: 'Check Google Sheets dataset updates, toggle orientation lock, and replay interactive tour.',
      src: `${import.meta.env.BASE_URL}intro-assets/setting-page.png`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* OFFLINE INTERNET REQUIREMENT BANNER */}
      {!isOnline && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-700 dark:text-amber-300 px-4 py-2.5 text-center text-xs font-semibold flex items-center justify-center gap-2">
          <WifiOff className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Active Internet Connection Required — High-resolution showcase assets and live presentation updates on /intro require network connectivity.</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 overflow-hidden">
          {/* Brand Logo & Title */}
          <button
            type="button"
            onClick={onLaunchApp}
            className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer min-w-0 flex-1"
          >
            <div className="p-1 bg-brand-500/10 dark:bg-brand-500/15 rounded-xl sm:rounded-2xl border border-brand-500/25 shadow-sm shrink-0 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={`${import.meta.env.BASE_URL}icon-192.png`}
                alt="PKDKL Formulary Logo"
                className="size-8 sm:size-10 object-contain rounded-lg sm:rounded-xl"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-extrabold text-xs sm:text-base leading-tight text-slate-900 dark:text-white tracking-tight truncate">
                District Drug Formulary <span className="text-brand-600 dark:text-brand-400">PKD Kuala Langat</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                Pejabat Kesihatan Daerah Kuala Langat
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 shrink-0">
            <a href="#overview" className="hover:text-brand-500 transition-colors">
              Overview
            </a>
            <a href="#interactive-demo" className="hover:text-brand-500 transition-colors">
              Live Search Demo
            </a>
            <a href="#quota-system" className="hover:text-brand-500 transition-colors">
              Quota Control
            </a>
            <a href="#screenshots" className="hover:text-brand-500 transition-colors">
              App Showcase
            </a>
            <a href="#install-guide" className="hover:text-brand-500 transition-colors">
              Install Guide
            </a>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-brand-500 transition-all cursor-pointer min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="size-4 sm:size-5 text-amber-500" />
              ) : (
                <Moon className="size-4 sm:size-5 text-indigo-500" />
              )}
            </button>

            {/* Launch App Button */}
            <button
              type="button"
              onClick={onLaunchApp}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span>Launch App</span>
              <ExternalLink className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="overview" className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                <ShieldCheck className="size-4" />
                <span>Official Point-of-Care Clinical Reference</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                District Drug Formulary <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-teal-400 to-cyan-400">
                  PKD Kuala Langat
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                A modern, offline-ready Progressive Web App (PWA) engineered for instant clinical medication lookups, MDC code cross-referencing, and real-time quota-controlled drug tracking across Klinik Kesihatan Kuala Langat.
              </p>

              {/* Feature Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center shadow-sm">
                  <p className="text-2xl font-bold text-brand-500">{medications.length || 291}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Total Meds</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-amber-500/40 text-center shadow-sm">
                  <p className="text-2xl font-bold text-amber-500">{quotaCount || 16}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Quota Restricted</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center shadow-sm">
                  <p className="text-2xl font-bold text-brand-500">100%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Offline Sync</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center shadow-sm">
                  <p className="text-2xl font-bold text-cyan-400">&lt; 1s</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Fast Search</p>
                </div>
              </div>

              {/* CTA Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onLaunchApp}
                  className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Smartphone className="size-5" />
                  <span>Open Web Application</span>
                </button>
                <a
                  href="#install-guide"
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-base hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all flex items-center gap-2"
                >
                  <Download className="size-5 text-brand-500" />
                  <span>Install on Phone</span>
                </a>
              </div>
            </div>

            {/* Right Simulated Mobile Phone Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] rounded-[42px] p-3 bg-slate-950 border-4 border-slate-800 shadow-2xl shadow-brand-500/10">
                {/* Phone Speaker Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
                </div>

                {/* Simulated Screen Content */}
                <div className="relative bg-slate-900 rounded-[30px] overflow-hidden pt-8 pb-4 px-3 border border-slate-800 min-h-[580px] flex flex-col justify-between text-white text-xs">
                  <div>
                    {/* Header in Phone */}
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-0.5 bg-brand-500/10 rounded-lg border border-brand-500/25 shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={`${import.meta.env.BASE_URL}icon-192.png`}
                            alt="PKDKL Formulary Logo"
                            className="size-7 object-contain rounded-md"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs leading-none">District Drug Formulary</p>
                          <p className="text-[10px] text-brand-400 font-semibold">PKD Kuala Langat</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <span className="p-1 rounded bg-slate-800 text-brand-400">
                          <Wifi className="size-3.5" />
                        </span>
                        <span className="p-1 rounded bg-slate-800 text-amber-400">
                          <Moon className="size-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Search Input Frame */}
                    <div className="relative my-2">
                      <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        readOnly
                        value="Search medication name, MAL nu..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-[11px] text-slate-400 pointer-events-none"
                      />
                    </div>

                    {/* Filter Buttons */}
                    <div className="grid grid-cols-2 gap-2 my-2">
                      <div className="bg-brand-600 text-white rounded-lg p-1.5 flex items-center justify-between font-medium text-[11px]">
                        <span className="flex items-center gap-1">
                          <Pill className="size-3" /> All Meds
                        </span>
                        <span className="bg-brand-900/60 px-1.5 py-0.5 rounded text-[10px]">{medications.length || 291}</span>
                      </div>
                      <div className="bg-amber-600/20 border border-amber-500/40 text-amber-400 rounded-lg p-1.5 flex items-center justify-between font-medium text-[11px]">
                        <span className="flex items-center gap-1">
                          <ShieldAlert className="size-3" /> Quota
                        </span>
                        <span className="bg-amber-500/30 px-1.5 py-0.5 rounded text-[10px]">{quotaCount || 16}</span>
                      </div>
                    </div>

                    {/* Mini Drug Items Mockup */}
                    <div className="space-y-2 mt-3">
                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="font-semibold text-slate-100 text-[11px]">Acetylsalicylic Acid 100 mg & Glyc...</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[9px] font-semibold">Cat B</span>
                          <span className="text-[9px] text-slate-400 font-mono">MDC: B01AC06-259</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800 border-2 border-amber-500 shadow-md">
                        <p className="font-semibold text-slate-100 text-[11px]">Etonogestrel 68mg Implant</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center gap-1">
                            <ShieldAlert className="size-2.5" /> Quota Control
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[9px] font-semibold">Cat A/KK</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="font-semibold text-slate-100 text-[11px]">Allopurinol 100 mg Tablet</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[9px] font-semibold">Cat A/KK</span>
                          <span className="text-[9px] text-slate-400 font-mono">MDC: M04AA01-000</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footnote in Phone */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3 text-brand-400" /> Official PKD
                    </span>
                    <span className="font-mono">v2.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SEARCH PLAYGROUND / LIVE DEMO */}
      <section id="interactive-demo" className="py-16 bg-white dark:bg-slate-800/40 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-brand-600 dark:text-brand-400 font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 mb-2">
              <Sparkles className="size-4" />
              <span>Interactive Clinical Playground</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Try the Live Formulary Search
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base">
              Test real-time searching across generic names, MAL registration numbers, MDC codes, and Quota badges connected directly to the live dataset.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-500/20">
              <ShieldCheck className="size-3.5" />
              <span>Preview Mode — Full terms & disclaimer agreement required upon launching app</span>
            </div>
          </div>

          {/* Interactive Search Box Container */}
          <div className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xl space-y-4">
            <div className="relative">
              <Search className="size-5 absolute left-4 top-3.5 text-slate-400" />
              <input
                id="demoSearchInput"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type drug name (e.g. Amlodipine, Insulin, Etonogestrel, MAL number)..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-11 pr-10 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <XCircle className="size-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Pill className="size-4" />
                <span>All Meds ({medications.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('QUOTA_ONLY')}
                className={`py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeFilter === 'QUOTA_ONLY'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-500'
                }`}
              >
                <ShieldAlert className="size-4 text-amber-500" />
                <span>Quota Control ({quotaCount})</span>
              </button>
            </div>

            {/* Live Demo Results List */}
            <div className="space-y-3 mt-4 max-h-[360px] overflow-y-auto pr-1">
              {displayedMedications.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <Pill className="size-8 mx-auto opacity-50" />
                  <p className="text-sm font-medium">No matching formulations found in formulary registry.</p>
                </div>
              ) : (
                displayedMedications.slice(0, 6).map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => setSelectedMedication(med)}
                    className={`w-full text-left p-4 rounded-xl transition-all shadow-xs cursor-pointer ${
                      med.isQuota
                        ? 'border-2 border-amber-500 bg-white dark:bg-slate-800 hover:border-amber-400'
                        : 'border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-brand-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-bold text-sm sm:text-base ${
                          med.isQuota ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {med.name}
                      </h3>
                      <ChevronRight className="size-4 text-slate-400 shrink-0 mt-1" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      {med.isQuota && (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1">
                          <ShieldAlert className="size-3" /> Quota Control
                        </span>
                      )}
                      {med.prescriberCategory && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                          Category {med.prescriberCategory}
                        </span>
                      )}
                      {med.mdc && (
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                          MDC: {med.mdc}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QUOTA CONTROL FEATURE SHOWCASE */}
      <section id="quota-system" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
                <ShieldAlert className="size-4" />
                <span>High-Risk & Allocation Management</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Neon-Yellow Quota Alert System
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                To prevent over-prescribing and ensure fair distribution across Kuala Langat health clinics, 16 critical formulations are tagged under strict <strong>Quota Control</strong>.
              </p>

              <ul className="space-y-3.5 mt-6 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Visual Highlighting:</strong> Quota items are styled with neon-yellow glowing borders for instant clinical visual recognition.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Filter className="size-5 text-brand-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>One-Tap Filter:</strong> Switch seamlessly between the complete medication registry and the 16 quota-controlled list.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="size-5 text-brand-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Category Rules:</strong> Clear prescribing authority tags (e.g., Cat A*, Cat A/KK) directly displayed on the card header.
                  </span>
                </li>
              </ul>
            </div>

            {/* Quota Visual Card Examples */}
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-500 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Etonogestrel 68mg Implant</h3>
                  <ChevronRight className="size-5 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1">
                    <ShieldAlert className="size-3.5" /> Quota Control
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-300 font-semibold text-xs">
                    Cat A/KK
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">MDC: G03AC08-000-P10-01-XXX</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-500 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Insulin Aspart 100 IU/ml Injection</h3>
                  <ChevronRight className="size-5 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1">
                    <ShieldAlert className="size-3.5" /> Quota Control
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-300 font-semibold text-xs">
                    Cat A/KK
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">MDC: A10AB05000P3001XX</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCREENSHOT FEATURE GALLERY SHOWCASE */}
      <section id="screenshots" className="py-16 bg-white dark:bg-slate-800/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-brand-600 dark:text-brand-400 font-bold text-xs sm:text-sm tracking-wider uppercase">Visual Walkthrough</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Application Feature Showcase</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Explore high-resolution previews of the PWA user interface across dark mode, search filters, and settings.
            </p>
          </div>

          {/* MOBILE HORIZONTAL PILL SELECTOR (Mobile Viewports < 1024px) */}
          <div className="flex lg:hidden overflow-x-auto pb-2 gap-2 scrollbar-none mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {screenshots.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveScreenshotIndex(index)}
                className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeScreenshotIndex === index
                    ? 'bg-brand-600 text-white shadow-sm border border-brand-500/40'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Screenshot Thumbnail List (Desktop Viewports >= 1024px) */}
            <div className="hidden lg:block lg:col-span-5 space-y-2.5">
              {screenshots.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveScreenshotIndex(index)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeScreenshotIndex === index
                      ? 'bg-brand-500/10 border-brand-500 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                  <ChevronRight className={`size-4 shrink-0 transition-transform ${activeScreenshotIndex === index ? 'text-brand-500 translate-x-1' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>

            {/* Active Screenshot Display Card */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl w-full">
                <img
                  src={screenshots[activeScreenshotIndex].src}
                  alt={screenshots[activeScreenshotIndex].title}
                  className="w-full h-auto max-h-[540px] object-contain rounded-xl border border-slate-800"
                />
                <div className="mt-3 px-2 text-center">
                  <h3 className="font-bold text-white text-base">{screenshots[activeScreenshotIndex].title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{screenshots[activeScreenshotIndex].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP-BY-STEP PWA INSTALLATION GUIDE */}
      <section id="install-guide" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-brand-600 dark:text-brand-400 font-bold text-xs sm:text-sm tracking-wider uppercase">Installation Tutorial</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">How to Install as a PWA App</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Add the District Drug Formulary directly to your smartphone home screen for offline access without app store downloads.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* iOS Safari Step */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 relative shadow-sm">
              <div className="size-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold mb-4">
                <Apple className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">iPhone / iPad (Safari)</h3>
              <ol className="space-y-3 mt-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-brand-500">1.</span>
                  <span>Open URL in <strong>Safari Browser</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-brand-500">2.</span>
                  <span>Tap the <strong>Share Button</strong> bottom bar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-brand-500">3.</span>
                  <span>Scroll down and select <strong>"Add to Home Screen"</strong>.</span>
                </li>
              </ol>
            </div>

            {/* Android Chrome Step */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 relative shadow-sm">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold mb-4">
                <Smartphone className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Android (Google Chrome)</h3>
              <ol className="space-y-3 mt-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-brand-500">1.</span>
                  <span>Open URL in <strong>Chrome Browser</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-brand-500">2.</span>
                  <span>Tap the <strong>Three Dots Menu</strong> (<MoreVertical className="size-3.5 inline" />) top right.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-brand-500">3.</span>
                  <span>Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</span>
                </li>
              </ol>
            </div>

            {/* Desktop & QR Transfer Step */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between shadow-sm">
              <div>
                <div className="size-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold mb-4">
                  <QrCode className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scan to Mobile Device</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Scan with your smartphone camera to immediately open the formulary app.
                </p>
              </div>
              <div className="flex justify-center my-4 bg-white p-3 rounded-xl w-fit mx-auto shadow-md border border-slate-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(appBaseUrl || 'https://stardaus.github.io/gemini-fupkdkl/')}`}
                  alt="PKD Kuala Langat Formulary PWA QR Code"
                  className="size-32 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY LEGEND & PRESCRIBING RESTRICTIONS */}
      <section id="categories" className="py-16 bg-white dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-brand-600 dark:text-brand-400 font-bold text-xs sm:text-sm tracking-wider uppercase">Clinical Standards</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Medication Categories Legend</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Understanding category badges and prescribing authorizations across Ministry of Health (MOH) facilities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-md bg-brand-500/20 text-brand-600 dark:text-brand-300 font-bold text-xs inline-block mb-3">Cat A/KK</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Specialist / KK Medical Officer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Restricted to Specialists or Medical Officers stationed at Health Clinics (Klinik Kesihatan).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold text-xs inline-block mb-3">Cat A*</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Specialist Consultant Only</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Strictly restricted to Consultant Specialists or registered clinical discipline heads.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold text-xs inline-block mb-3">Cat B</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Medical Officers & Dentists</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Prescribable by all registered Medical Officers and Dental Officers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold text-xs inline-block mb-3">Cat C</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Paramedical Staff (AMO/Nurse)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Authorized for Assistant Medical Officers and trained Staff Nurses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MEDICATION DETAIL PREVIEW MODAL */}
      {selectedMedication && (
        <div
          role="dialog"
          aria-labelledby="preview-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 text-slate-900 dark:text-slate-100 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedMedication(null)}
              aria-label="Close preview modal"
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 pr-8">
                <h3
                  id="preview-modal-title"
                  className={`text-lg font-bold ${
                    selectedMedication.isQuota ? 'text-amber-600 dark:text-amber-400' : 'text-brand-600 dark:text-brand-400'
                  }`}
                >
                  {selectedMedication.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  {selectedMedication.isQuota && (
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1">
                      <ShieldAlert className="size-3" /> Quota Control
                    </span>
                  )}
                  {selectedMedication.prescriberCategory && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                      <Bookmark className="size-3 mr-1 text-brand-500 inline" />
                      Category {selectedMedication.prescriberCategory}
                    </span>
                  )}
                </div>
              </div>

              {selectedMedication.malBrands && (
                <div className="text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <FileText className="size-3.5 text-brand-500" /> MAL Brands:
                  </span>
                  <Quest3Link malString={selectedMedication.malBrands} />
                </div>
              )}

              {selectedMedication.indications && (
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Indications</h4>
                  <p className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/40">
                    {selectedMedication.indications}
                  </p>
                </div>
              )}

              {selectedMedication.dosage && (
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dosage</h4>
                  <p className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/40">
                    {selectedMedication.dosage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-brand-500/10 dark:bg-brand-500/15 rounded-xl border border-brand-500/25 shadow-sm shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}icon-192.png`}
                alt="PKDKL Formulary Logo"
                className="size-8 object-contain rounded-lg"
              />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">District Drug Formulary PKD Kuala Langat</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pejabat Kesihatan Daerah Kuala Langat</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={onLaunchApp}
              className="text-brand-600 dark:text-brand-400 hover:underline font-bold cursor-pointer flex items-center gap-1"
            >
              <span>Launch Main App</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
