import React from 'react';
import { Plus, Database, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenLabGuide: () => void;
  matchCount: number;
  pendingClaimsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenReportModal,
  onOpenLabGuide,
  matchCount,
  pendingClaimsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onSelectTab('browse')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
                  UF
                </div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 group-hover:text-amber-800 transition-colors whitespace-nowrap">
                  UniFind Campus Portal
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => onSelectTab('browse')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 relative py-1 focus:outline-none ${
                currentTab === 'browse' ? 'text-neutral-950 font-semibold' : ''
              }`}
            >
              Directory
              {currentTab === 'browse' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('matches')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 relative py-1 flex items-center gap-1.5 focus:outline-none ${
                currentTab === 'matches' ? 'text-neutral-950 font-semibold' : ''
              }`}
            >
              <span>Smart Matches</span>
              {matchCount > 0 && (
                <span className="font-mono text-xs text-neutral-700 bg-neutral-100 px-1.5 py-0.2 rounded">
                  {matchCount}
                </span>
              )}
              {currentTab === 'matches' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('stations')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 relative py-1 focus:outline-none ${
                currentTab === 'stations' ? 'text-neutral-950 font-semibold' : ''
              }`}
            >
              Campus Desks
              {currentTab === 'stations' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('activity')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 relative py-1 focus:outline-none ${
                currentTab === 'activity' ? 'text-neutral-950 font-semibold' : ''
              }`}
            >
              My Activity & Pass
              {currentTab === 'activity' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('staff')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 relative py-1 flex items-center gap-1.5 focus:outline-none ${
                currentTab === 'staff' ? 'text-neutral-950 font-semibold' : ''
              }`}
            >
              <span>Security Desk</span>
              {pendingClaimsCount > 0 && (
                <span className="font-mono text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                  {pendingClaimsCount}
                </span>
              )}
              {currentTab === 'staff' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('db')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 relative py-1 flex items-center gap-1.5 focus:outline-none ${
                currentTab === 'db' ? 'text-neutral-950 font-semibold' : ''
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-700" />
              <span>SQLite Studio</span>
              {currentTab === 'db' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action button + Lab guide badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenLabGuide}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">FSD Viva Guide</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Item</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-neutral-100 py-2.5 overflow-x-auto gap-4 text-xs font-medium text-neutral-600">
          <button
            onClick={() => onSelectTab('browse')}
            className={`whitespace-nowrap ${currentTab === 'browse' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Directory
          </button>
          <button
            onClick={() => onSelectTab('matches')}
            className={`whitespace-nowrap flex items-center gap-1 ${currentTab === 'matches' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Matches ({matchCount})
          </button>
          <button
            onClick={() => onSelectTab('stations')}
            className={`whitespace-nowrap ${currentTab === 'stations' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Stations
          </button>
          <button
            onClick={() => onSelectTab('activity')}
            className={`whitespace-nowrap ${currentTab === 'activity' ? 'text-neutral-950 font-bold' : ''}`}
          >
            My Pass
          </button>
          <button
            onClick={() => onSelectTab('staff')}
            className={`whitespace-nowrap ${currentTab === 'staff' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Staff Desk
          </button>
          <button
            onClick={() => onSelectTab('db')}
            className={`whitespace-nowrap flex items-center gap-1 font-semibold ${currentTab === 'db' ? 'text-neutral-950' : 'text-amber-800'}`}
          >
            <Database className="w-3 h-3" />
            SQLite
          </button>
          <button
            onClick={onOpenLabGuide}
            className="whitespace-nowrap text-blue-700 font-bold"
          >
            FSD Guide
          </button>
        </div>
      </div>
    </header>
  );
};
