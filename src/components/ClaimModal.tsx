import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Item, Claim } from '../types';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onClaimSubmitted: (claim: Claim) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  item,
  onClaimSubmitted
}) => {
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [claimantStudentId, setClaimantStudentId] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [additionalProof, setAdditionalProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedClaim, setSubmittedClaim] = useState<Claim | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!verificationAnswer.trim()) {
      setError('Please answer the security verification question.');
      return;
    }
    if (!claimantName.trim() || !claimantEmail.trim()) {
      setError('Please provide your name and contact email.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          claimantName: claimantName.trim(),
          claimantEmail: claimantEmail.trim(),
          claimantStudentId: claimantStudentId.trim(),
          claimantPhone: claimantPhone.trim(),
          verificationAnswer: verificationAnswer.trim(),
          additionalProof: additionalProof.trim()
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit claim');
      }

      setSubmittedClaim(data.claim);
      onClaimSubmitted(data.claim);
    } catch (err: any) {
      setError(err.message || 'Error submitting claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedClaim(null);
    setVerificationAnswer('');
    setAdditionalProof('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                File Ownership Claim
              </h2>
              <div className="text-xs text-neutral-500 font-mono">
                Item ID: {item.id}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedClaim ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Claim Registered
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
              Your claim for <span className="font-semibold">{item.title}</span> has been logged under record <span className="font-mono font-semibold">{submittedClaim.id}</span>. Campus security and custodial attendants will review your answers against custody records.
            </p>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700 text-left space-y-1">
              <div><span className="text-neutral-400">Intake Desk:</span> <span className="font-medium">{submittedClaim.pickupStationName}</span></div>
              <div><span className="text-neutral-400">Status:</span> <span className="text-amber-700 font-semibold">Under Staff Review</span></div>
              <div><span className="text-neutral-400">Contact:</span> <span className="font-mono">{submittedClaim.claimantEmail}</span></div>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Done & Return to Directory
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Item Summary */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1 text-xs">
              <div className="font-bold text-neutral-900">{item.title}</div>
              <div className="flex items-center gap-2 text-neutral-500">
                <span>{item.category}</span>
                <span aria-hidden="true">·</span>
                <span>{item.campusBuilding}</span>
                <span aria-hidden="true">·</span>
                <span>Found on {item.date}</span>
              </div>
            </div>

            {/* Security Question Challenge */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>Ownership Security Challenge</span>
              </div>
              <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                {item.verificationQuestion || 'Describe any distinctive marks, stickers, engravings, or wallpaper details not visible in public listing:'}
              </p>
              <textarea
                required
                rows={3}
                value={verificationAnswer}
                onChange={(e) => setVerificationAnswer(e.target.value)}
                placeholder="Provide specific, non-public details that prove this belongs to you..."
                className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 placeholder:text-neutral-400"
              />
            </div>

            {/* Additional Proof */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Additional Proof (Optional)
              </label>
              <input
                type="text"
                value={additionalProof}
                onChange={(e) => setAdditionalProof(e.target.value)}
                placeholder="e.g. Serial number snippet, purchase invoice number, student photo with item"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Claimant Contact Details */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  University Email *
                </label>
                <input
                  type="email"
                  required
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  placeholder="user@university.edu"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Student / Staff ID Number
                </label>
                <input
                  type="text"
                  value={claimantStudentId}
                  onChange={(e) => setClaimantStudentId(e.target.value)}
                  placeholder="e.g. U994821"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={claimantPhone}
                  onChange={(e) => setClaimantPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Submit Claim for Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
