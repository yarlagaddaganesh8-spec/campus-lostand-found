import React, { useState } from 'react';
import { Claim, Item } from '../types';
import { CheckCircle2, Clock, AlertCircle, QrCode, FileText, ArrowRight, ShieldCheck, Printer } from 'lucide-react';

interface MyActivityViewProps {
  claims: Claim[];
  items: Item[];
  onOpenReport: () => void;
  onSelectItem: (item: Item) => void;
}

export const MyActivityView: React.FC<MyActivityViewProps> = ({
  claims,
  items,
  onOpenReport,
  onSelectItem
}) => {
  const [filterEmail, setFilterEmail] = useState('');
  const [activePass, setActivePass] = useState<Claim | null>(null);

  // Quick preset emails for demonstration
  const sampleEmails = [
    { label: 'Jordan Reed (Water bottle claim)', email: 'jreed@university.edu' },
    { label: 'Nathaniel Cole (Approved car keys pass)', email: 'ncole@university.edu' },
    { label: 'Marcus Vance (MacBook lost report)', email: 'm.vance@university.edu' }
  ];

  const displayedClaims = filterEmail.trim()
    ? claims.filter(c => c.claimantEmail.toLowerCase().includes(filterEmail.toLowerCase().trim()))
    : claims;

  const displayedReports = filterEmail.trim()
    ? items.filter(i => i.reporterEmail.toLowerCase().includes(filterEmail.toLowerCase().trim()))
    : items.slice(0, 5);

  return (
    <div className="space-y-8 pb-16">
      {/* View Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            My Claims & Active Digital Passes
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track ownership claims, verification status, and present your authorized Pickup Pass code at campus holding stations.
          </p>
        </div>

        {/* Email Quick Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            placeholder="Filter by university email..."
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 w-full sm:w-64"
          />
          {filterEmail && (
            <button
              onClick={() => setFilterEmail('')}
              className="text-xs text-neutral-500 hover:text-neutral-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Preset Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
        <span className="text-neutral-400">Quick student profile demos:</span>
        {sampleEmails.map((sample, sIdx) => (
          <button
            key={sIdx}
            onClick={() => setFilterEmail(sample.email)}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              filterEmail === sample.email
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Digital Claim Pass Modal/Drawer if selected */}
      {activePass && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full border border-neutral-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-neutral-900">Official Campus Handover Pass</span>
              </div>
              <button
                onClick={() => setActivePass(null)}
                className="text-xs text-neutral-400 hover:text-neutral-700"
              >
                Close
              </button>
            </div>

            {/* Pass Graphic */}
            <div className="bg-neutral-950 text-white p-5 rounded-xl border border-neutral-800 text-center space-y-4">
              <div className="text-[10px] tracking-widest uppercase text-amber-400 font-semibold">
                University Campus Security · Authorization Verified
              </div>

              <div>
                <div className="text-xs text-neutral-400 mb-1">Item Title</div>
                <div className="text-sm font-bold text-white line-clamp-1">{activePass.itemTitle}</div>
              </div>

              {/* Barcode representation */}
              <div className="bg-white p-4 rounded-lg inline-block text-neutral-900">
                <div className="font-mono text-sm sm:text-base font-extrabold tracking-widest text-neutral-900 mb-2">
                  {activePass.pickupPassCode}
                </div>
                {/* Simulated high-contrast SVG barcode bars */}
                <div className="flex items-center justify-center gap-1 h-12 w-48 mx-auto overflow-hidden">
                  {[4, 2, 6, 1, 3, 5, 2, 7, 3, 2, 5, 4, 1, 6, 3, 2, 4, 1, 3, 6, 2, 5, 2].map((w, i) => (
                    <div
                      key={i}
                      className="bg-neutral-950 h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 text-left gap-2 pt-2 border-t border-neutral-800 text-xs">
                <div>
                  <div className="text-neutral-400 text-[10px]">Claimant</div>
                  <div className="font-semibold">{activePass.claimantName}</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[10px]">Student / Staff ID</div>
                  <div className="font-mono">{activePass.claimantStudentId}</div>
                </div>
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1.5 text-neutral-700">
              <div className="font-semibold text-neutral-900">Designated Station:</div>
              <div>{activePass.pickupStationName}</div>
              <p className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
                Please present your university photo ID card along with this pass code to the intake attendant at the desk.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 py-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass Receipt</span>
              </button>
              <button
                onClick={() => setActivePass(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claims List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            Recorded Item Claims ({displayedClaims.length})
          </h3>
          <span className="text-xs text-neutral-500">
            Ownership submissions awaiting or granted pickup
          </span>
        </div>

        {displayedClaims.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-xs text-neutral-500">
            No claims found matching this email. Browse found items to file an ownership claim.
          </div>
        ) : (
          <div className="space-y-3">
            {displayedClaims.map(claim => {
              const isApproved = claim.status === 'approved';
              const isRejected = claim.status === 'rejected';

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-1">
                        <span>CLAIM {claim.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>TARGET ITEM: {claim.itemId}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{new Date(claim.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-900">
                        {claim.itemTitle}
                      </h4>
                    </div>

                    <div>
                      {isApproved ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Pickup
                          </span>
                          <button
                            onClick={() => setActivePass(claim)}
                            className="px-3 py-1 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded shadow-xs flex items-center gap-1"
                          >
                            <QrCode className="w-3.5 h-3.5" /> View Pass
                          </button>
                        </div>
                      ) : isRejected ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-red-50 text-red-800 border border-red-200 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Verification Not Matched
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Under Staff Review
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-neutral-100">
                    <div>
                      <div className="text-neutral-400 mb-0.5">Your Verification Answer:</div>
                      <div className="text-neutral-800 bg-neutral-50 p-2 rounded border border-neutral-100">
                        "{claim.verificationAnswer}"
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-400 mb-0.5">Holding Station / Pickup Location:</div>
                      <div className="text-neutral-800 bg-neutral-50 p-2 rounded border border-neutral-100 font-medium">
                        {claim.pickupStationName || 'Campus Public Safety Intake Desk'}
                      </div>
                    </div>
                  </div>

                  {isApproved && claim.pickupPassCode && (
                    <div className="p-3 bg-neutral-900 text-white rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-neutral-400">PICKUP CODE:</span>
                        <span className="font-bold tracking-wider text-amber-400">{claim.pickupPassCode}</span>
                      </div>
                      <button
                        onClick={() => setActivePass(claim)}
                        className="underline hover:text-amber-300 text-xs font-medium"
                      >
                        Show Full Barcode Pass
                      </button>
                    </div>
                  )}

                  {isRejected && claim.rejectionReason && (
                    <div className="p-2.5 bg-red-50/70 border border-red-200 text-red-700 text-xs rounded-lg">
                      <span className="font-semibold">Reviewer feedback: </span>
                      {claim.rejectionReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reports filed by this user */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            Registered Lost & Found Reports ({displayedReports.length})
          </h3>
          <button
            onClick={onOpenReport}
            className="text-xs font-semibold text-neutral-900 hover:underline"
          >
            File New Report +
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedReports.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs hover:border-neutral-300 transition-colors cursor-pointer space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-neutral-500 font-mono">
                <span className={item.type === 'found' ? 'text-emerald-700 font-bold' : 'text-amber-800 font-bold'}>
                  {item.type.toUpperCase()}
                </span>
                <span>{item.date}</span>
              </div>
              <div className="font-bold text-sm text-neutral-900 line-clamp-1">{item.title}</div>
              <div className="text-neutral-500 line-clamp-1">
                {item.campusBuilding} {item.specificLocation ? `· ${item.specificLocation}` : ''}
              </div>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-neutral-500">
                <span>Reporter: {item.reporterName}</span>
                <span className="text-neutral-900 font-medium">Click to inspect</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
