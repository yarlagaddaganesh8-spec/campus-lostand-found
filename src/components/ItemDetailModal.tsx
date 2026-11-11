import React from 'react';
import { X, MapPin, Calendar, Clock, Building, ShieldCheck, Sparkles, CheckCircle2, User, Phone, Mail, Award, ArrowRight } from 'lucide-react';
import { Item, CampusStation, MatchCandidate } from '../types';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  stations: CampusStation[];
  matches?: MatchCandidate[];
  onOpenClaim: (item: Item) => void;
  onSelectMatchItem?: (matchedItem: Item) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  stations,
  matches = [],
  onOpenClaim,
  onSelectMatchItem
}) => {
  if (!isOpen || !item) return null;

  const isFound = item.type === 'found';
  const isReunited = item.status === 'reunited';
  const isPending = item.status === 'claim_pending';
  const station = stations.find(s => s.id === item.storageStationId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-neutral-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-0.5">
              <span className={isFound ? 'text-emerald-700 font-bold' : 'text-amber-800 font-bold'}>
                {isFound ? 'FOUND RECORD' : 'LOST REPORT'}
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-500">{item.id}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-500">{item.category}</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 leading-snug">
              {item.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status banner */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-medium">Lifecycle Status:</span>
              <span className={`font-semibold ${
                isReunited
                  ? 'text-emerald-700 flex items-center gap-1'
                  : isPending
                  ? 'text-amber-700'
                  : 'text-neutral-900'
              }`}>
                {isReunited && <CheckCircle2 className="w-3.5 h-3.5" />}
                {isReunited
                  ? 'Reunited with Owner'
                  : isPending
                  ? 'Claim Verification in Progress'
                  : isFound
                  ? 'In Safe Campus Custody'
                  : 'Active Open Search'}
              </span>
            </div>

            {item.rewardOffered && item.rewardOffered > 0 && (
              <div className="flex items-center gap-1 font-mono text-emerald-800 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>${item.rewardOffered} Reward Offered</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Description & Recorded Details
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50/50 p-3.5 rounded-lg border border-neutral-100">
              {item.description || 'No additional narrative description provided.'}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="text-neutral-400 mb-1">Brand</div>
              <div className="font-semibold text-neutral-900">{item.brand || 'Unspecified'}</div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="text-neutral-400 mb-1">Color</div>
              <div className="font-semibold text-neutral-900">{item.primaryColor || 'Unspecified'}</div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="text-neutral-400 mb-1">Date Logged</div>
              <div className="font-mono font-semibold text-neutral-900 tabular-nums">{item.date}</div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="text-neutral-400 mb-1">Time of Day</div>
              <div className="font-semibold text-neutral-900">{item.timeOfDay || 'Approximate'}</div>
            </div>
          </div>

          {/* Location & Custody Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Campus Location & Custody
            </h4>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2.5">
              <div className="flex items-start gap-2 text-neutral-800">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">{item.campusBuilding}</span>
                  {item.specificLocation && (
                    <div className="text-neutral-500 mt-0.5">{item.specificLocation}</div>
                  )}
                </div>
              </div>

              {station && isFound && (
                <div className="pt-2.5 border-t border-neutral-200/80 space-y-1.5 text-neutral-600">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <Building className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Held at: {station.name}</span>
                  </div>
                  <div><span className="text-neutral-400">Desk Room:</span> {station.room}</div>
                  <div><span className="text-neutral-400">Hours:</span> {station.hours}</div>
                  <div><span className="text-neutral-400">Phone:</span> <span className="font-mono">{station.phone}</span></div>
                  <p className="text-[11px] text-neutral-500 italic mt-1">
                    {station.pickupInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Challenge Preview (If Found) */}
          {isFound && item.verificationQuestion && !isReunited && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>Security Claim Requirement</span>
              </div>
              <p className="text-neutral-700">
                To prevent false claims, prospective owners must answer: <span className="font-semibold text-neutral-900">"{item.verificationQuestion}"</span>
              </p>
            </div>
          )}

          {/* Algorithmic Candidate Matches */}
          {matches.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Algorithmic Matches Found ({matches.length})</span>
                </h4>
                <span className="text-[11px] text-neutral-400">Cross-referenced against campus logs</span>
              </div>

              <div className="space-y-2.5">
                {matches.map((m, idx) => {
                  const counterpart = isFound ? m.lostItem : m.foundItem;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900">{counterpart.title}</span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                            {m.confidenceScore}% Match
                          </span>
                        </div>
                        <div className="text-neutral-500">
                          {counterpart.campusBuilding} · Logged {counterpart.date}
                        </div>
                        <div className="text-[11px] text-neutral-500 flex flex-wrap gap-1 mt-1">
                          {m.matchedFactors.map((factor, fIdx) => (
                            <span key={fIdx} className="bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>

                      {onSelectMatchItem && (
                        <button
                          onClick={() => onSelectMatchItem(counterpart)}
                          className="px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md shrink-0 whitespace-nowrap self-start sm:self-auto"
                        >
                          Compare Item
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reporter Contact Info */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-xs text-neutral-600 space-y-1">
            <div className="font-medium text-neutral-900">Reporter Information</div>
            <div>{item.reporterName} ({item.reporterRole})</div>
            <div className="font-mono">{item.reporterEmail} {item.reporterPhone ? `· ${item.reporterPhone}` : ''}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            Close
          </button>

          {isFound && !isReunited && (
            <button
              onClick={() => {
                onClose();
                onOpenClaim(item);
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>This Is Mine – File Claim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
