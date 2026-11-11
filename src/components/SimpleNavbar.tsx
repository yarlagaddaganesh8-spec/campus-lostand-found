import React from 'react';
import { Search, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SimpleNavbarProps {
  onOpenReportLost: () => void;
  onOpenReportFound: () => void;
}

export const SimpleNavbar: React.FC<SimpleNavbarProps> = ({
  onOpenReportLost,
  onOpenReportFound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Wordmark Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              LF
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
              Campus Lost and Found Portal
            </h1>
          </div>

          {/* Prominent Action Buttons: Report Lost Item & Report Found Item */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenReportLost}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-800" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={onOpenReportFound}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Found Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
