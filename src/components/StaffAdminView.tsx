import React, { useState } from 'react';
import { Claim, Item, CampusStation, SystemStats } from '../types';
import { Shield, Check, X, Clock, AlertCircle, FileCheck, CheckCircle2, User, Building, QrCode } from 'lucide-react';

interface StaffAdminViewProps {
  claims: Claim[];
  items: Item[];
  stations: CampusStation[];
  stats: SystemStats | null;
  onReviewClaim: (claimId: string, decision: { status: 'approved' | 'rejected'; reviewedBy: string; rejectionReason?: string }) => void;
  onOpenReport: () => void;
  onSelectItem: (item: Item) => void;
}

export const StaffAdminView: React.FC<StaffAdminViewProps> = ({
  claims,
  items,
  stations,
  stats,
  onReviewClaim,
  onOpenReport,
  onSelectItem
}) => {
  const [rejectingClaimId, setRejectingClaimId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewerName, setReviewerName] = useState('Officer Miller (Public Safety)');
  const [verifyingPassCode, setVerifyingPassCode] = useState('');
  const [passVerificationResult, setPassVerificationResult] = useState<Claim | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const pendingClaims = claims.filter(c => c.status === 'pending');
  const resolvedClaims = claims.filter(c => c.status !== 'pending');

  const handleApprove = (claim: Claim) => {
    onReviewClaim(claim.id, {
      status: 'approved',
      reviewedBy: reviewerName
    });
  };

  const handleRejectSubmit = (claimId: string) => {
    if (!rejectionReason.trim()) return;
    onReviewClaim(claimId, {
      status: 'rejected',
      reviewedBy: reviewerName,
      rejectionReason: rejectionReason.trim()
    });
    setRejectingClaimId(null);
    setRejectionReason('');
  };

  const handleVerifyPass = () => {
    setPassError(null);
    setPassVerificationResult(null);

    const code = verifyingPassCode.trim().toUpperCase();
    if (!code) {
      setPassError('Please enter a Pass Code.');
      return;
    }

    const matched = claims.find(c => c.pickupPassCode?.toUpperCase() === code);
    if (!matched) {
      setPassError('No approved pickup authorization found for this code.');
      return;
    }

    setPassVerificationResult(matched);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Header */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
            <Shield className="w-4 h-4" />
            <span>Authorized Campus Custody Portal</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Security Desk & Custodial Intake Console
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
            Manage custody records, evaluate student ownership verification answers against intake logs, and validate physical collection passes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReport}
            className="px-4 py-2.5 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            + Intake New Found Item
          </button>
        </div>
      </div>

      {/* Quick Pass Validator Console */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
          <QrCode className="w-4 h-4 text-amber-800" />
          <span>Physical Handover Code Verification</span>
        </div>
        <p className="text-xs text-neutral-500 mb-4">
          When a student arrives at the desk to collect an item, enter their digital pass code (e.g. PASS-8104-POLICE):
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <input
            type="text"
            value={verifyingPassCode}
            onChange={(e) => setVerifyingPassCode(e.target.value)}
            placeholder="Enter or scan Pass Code (e.g. PASS-8104-POLICE)"
            className="px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono flex-1 uppercase"
          />
          <button
            onClick={handleVerifyPass}
            className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Verify Pass
          </button>
        </div>

        {passError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        {passVerificationResult && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>PASS VERIFIED: Authorized for Handover</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-neutral-700 pt-1 border-t border-emerald-200">
              <div><span className="text-neutral-500">Student:</span> <span className="font-semibold">{passVerificationResult.claimantName}</span></div>
              <div><span className="text-neutral-500">Student ID:</span> <span className="font-mono font-semibold">{passVerificationResult.claimantStudentId}</span></div>
              <div><span className="text-neutral-500">Item:</span> <span className="font-semibold">{passVerificationResult.itemTitle}</span></div>
            </div>
            <p className="text-[11px] text-emerald-800 pt-1">
              Confirmed match against physical inventory. Release item upon viewing student photo ID.
            </p>
          </div>
        )}
      </div>

      {/* Pending Claims Review Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-neutral-900">
              Pending Claims Review Queue
            </h3>
            <span className="font-mono text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
              {pendingClaims.length} Pending
            </span>
          </div>
          <div className="text-xs text-neutral-500">
            Review claimant responses against confidential item notes
          </div>
        </div>

        {pendingClaims.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-xs text-neutral-500">
            No pending claims in review. All filed claims are processed.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingClaims.map(claim => {
              const targetItem = items.find(i => i.id === claim.itemId);
              const isRejecting = rejectingClaimId === claim.id;

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
                        <span className="font-bold text-neutral-900">CLAIM ID: {claim.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>Item: {claim.itemId}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{new Date(claim.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-900">
                        {claim.itemTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(claim)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Issue Pass</span>
                      </button>
                      <button
                        onClick={() => setRejectingClaimId(isRejecting ? null : claim.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Claimant verification comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                      <div className="font-semibold text-neutral-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Claimant Response</span>
                      </div>
                      <div>
                        <div className="text-neutral-500 text-[11px]">Name & Contact:</div>
                        <div className="font-medium">{claim.claimantName} ({claim.claimantStudentId})</div>
                        <div className="font-mono text-neutral-600">{claim.claimantEmail} · {claim.claimantPhone}</div>
                      </div>
                      <div>
                        <div className="text-neutral-500 text-[11px]">Answer to Verification Question:</div>
                        <div className="p-2 bg-white rounded border border-neutral-200 font-medium text-neutral-900">
                          "{claim.verificationAnswer}"
                        </div>
                      </div>
                      {claim.additionalProof && (
                        <div>
                          <div className="text-neutral-500 text-[11px]">Additional Evidence:</div>
                          <div className="text-neutral-700">{claim.additionalProof}</div>
                        </div>
                      )}
                    </div>

                    {/* Official Custody Record */}
                    <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-200 space-y-2">
                      <div className="font-semibold text-amber-900 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-amber-700" />
                        <span>Intake Custody Details</span>
                      </div>
                      {targetItem ? (
                        <>
                          <div>
                            <div className="text-neutral-500 text-[11px]">Location Logged:</div>
                            <div className="font-medium text-neutral-900">
                              {targetItem.campusBuilding} ({targetItem.specificLocation})
                            </div>
                          </div>
                          <div>
                            <div className="text-neutral-500 text-[11px]">Challenge Question Set on File:</div>
                            <div className="font-medium text-neutral-800">
                              "{targetItem.verificationQuestion || 'No question specified'}"
                            </div>
                          </div>
                          <div>
                            <div className="text-neutral-500 text-[11px]">Holding Station:</div>
                            <div className="font-medium text-neutral-800">{claim.pickupStationName}</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-neutral-500">Target item details not available</div>
                      )}
                    </div>
                  </div>

                  {/* Rejection input box if open */}
                  {isRejecting && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2 text-xs">
                      <label className="font-semibold text-red-900 block">
                        Reason for rejection (sent to claimant):
                      </label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g. Details provided do not match the item serial number or physical markings."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setRejectingClaimId(null)}
                          className="px-3 py-1 text-xs text-neutral-600 hover:text-neutral-900"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRejectSubmit(claim.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-md"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved Claims Audit Log */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <h3 className="text-base font-bold text-neutral-900">
          Processed Claims Log ({resolvedClaims.length})
        </h3>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <table className="min-w-full divide-y divide-neutral-200 text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold text-left">
              <tr>
                <th className="px-4 py-3">Claim ID</th>
                <th className="px-4 py-3">Item Title</th>
                <th className="px-4 py-3">Claimant</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Pass Code</th>
                <th className="px-4 py-3">Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {resolvedClaims.map(c => (
                <tr key={c.id} className="hover:bg-neutral-50/60">
                  <td className="px-4 py-3 font-mono text-neutral-900 font-medium">{c.id}</td>
                  <td className="px-4 py-3 font-medium text-neutral-900">{c.itemTitle}</td>
                  <td className="px-4 py-3">{c.claimantName} ({c.claimantStudentId})</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      c.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-red-50 text-red-800'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-neutral-900">
                    {c.pickupPassCode || '—'}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{c.reviewedBy || 'Staff'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
