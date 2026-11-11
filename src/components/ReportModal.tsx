import React, { useState } from 'react';
import { X, Check, AlertCircle, Sparkles, MapPin, Calendar, HelpCircle, Shield, ArrowRight } from 'lucide-react';
import { Item, ItemCategory, CampusStation, MatchCandidate } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'lost' | 'found';
  stations: CampusStation[];
  onItemCreated: (item: Item, matches: MatchCandidate[]) => void;
  onViewMatches: (matches: MatchCandidate[], createdItem: Item) => void;
}

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'IDs & Cards',
  'Keys & Badges',
  'Bags & Backpacks',
  'Clothing & Gear',
  'Books & Notes',
  'Personal Valuables'
];

const BUILDINGS = [
  'University Library',
  'Student Union & Commons',
  'Science & Engineering Hall',
  'Campus Recreation Center',
  'East Parking Pavilion',
  'Fine Arts Complex',
  'Health & Wellness Center',
  'Dining Pavilion'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'lost',
  stations,
  onItemCreated,
  onViewMatches
}) => {
  const [reportType, setReportType] = useState<'lost' | 'found'>(defaultType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [campusBuilding, setCampusBuilding] = useState('University Library');
  const [specificLocation, setSpecificLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeOfDay, setTimeOfDay] = useState('Morning (08:00 - 12:00)');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [secretDetails, setSecretDetails] = useState('');
  const [verificationQuestion, setVerificationQuestion] = useState('');
  const [storageStationId, setStorageStationId] = useState(stations[0]?.id || 'st-police');
  const [rewardOffered, setRewardOffered] = useState('');

  // Reporter Fields
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterRole, setReporterRole] = useState<'student' | 'faculty' | 'staff' | 'visitor'>('student');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide an item title.');
      return;
    }
    if (!reporterName.trim() || !reporterEmail.trim()) {
      setError('Please provide your name and university email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: Partial<Item> = {
        type: reportType,
        title: title.trim(),
        category,
        campusBuilding,
        specificLocation: specificLocation.trim(),
        date,
        timeOfDay,
        description: description.trim(),
        brand: brand.trim(),
        primaryColor: primaryColor.trim(),
        secretDetails: secretDetails.trim(),
        verificationQuestion: reportType === 'found' ? verificationQuestion.trim() : undefined,
        storageStationId: reportType === 'found' ? storageStationId : undefined,
        rewardOffered: rewardOffered ? Number(rewardOffered) : undefined,
        reporterName: reporterName.trim(),
        reporterEmail: reporterEmail.trim(),
        reporterPhone: reporterPhone.trim(),
        reporterRole
      };

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to file report');
      }

      onItemCreated(data.item, data.matches || []);

      if (data.matches && data.matches.length > 0) {
        onViewMatches(data.matches, data.item);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-neutral-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {reportType === 'lost' ? 'Report a Lost Belonging' : 'Log a Found Campus Item'}
            </h2>
            <div className="text-xs text-neutral-500">
              Information is broadcast to university security and intake desks
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="px-6 pt-5 pb-2">
          <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setReportType('lost')}
              className={`py-2 rounded-md transition-all ${
                reportType === 'lost'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              I Lost An Item
            </button>
            <button
              type="button"
              onClick={() => setReportType('found')}
              className={`py-2 rounded-md transition-all ${
                reportType === 'found'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              I Found An Item
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Item Core Details */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              1. Item Identification
            </label>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Item Title / Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={reportType === 'lost' ? 'e.g. MacBook Pro 14" Space Gray' : 'e.g. Apple Laptop in Black Sleeve'}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Brand / Make
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Hydro Flask, Nike"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Primary Color
                </label>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="e.g. Space Gray, Navy, Black"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Description & Distinguishing Features
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include general details such as wear, stickers, case style, or what compartment it was in..."
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Section 2: Campus Location & Timing */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              2. Campus Location & Date
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Campus Facility / Building *
                </label>
                <select
                  value={campusBuilding}
                  onChange={(e) => setCampusBuilding(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  {BUILDINGS.map(bldg => (
                    <option key={bldg} value={bldg}>{bldg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Specific Room / Spot
                </label>
                <input
                  type="text"
                  value={specificLocation}
                  onChange={(e) => setSpecificLocation(e.target.value)}
                  placeholder="e.g. 3rd Floor quiet study pod #12"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Date {reportType === 'lost' ? 'Lost' : 'Found'} *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Time of Day
                </label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
                  <option value="Afternoon (12:00 - 17:00)">Afternoon (12:00 - 17:00)</option>
                  <option value="Evening (17:00 - 21:00)">Evening (17:00 - 21:00)</option>
                  <option value="Late Night (21:00+)">Late Night (21:00+)</option>
                  <option value="Unknown">Approximate / Unknown</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Verification & Security Controls */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              3. Security & Anti-Fraud Verification
            </label>

            {reportType === 'lost' ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>Confidential Identifiable Detail (Private to Verification Staff)</span>
                </div>
                <input
                  type="text"
                  value={secretDetails}
                  onChange={(e) => setSecretDetails(e.target.value)}
                  placeholder="e.g. Specific lock screen wallpaper, engraving initials, partial serial number"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <p className="text-[11px] text-neutral-500">
                  This stays private and is only used to verify your ownership when matching found items.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Where is this item currently held? *
                  </label>
                  <select
                    value={storageStationId}
                    onChange={(e) => setStorageStationId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    {stations.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.building})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Ownership Verification Question (Required for claimants)
                  </label>
                  <input
                    type="text"
                    value={verificationQuestion}
                    onChange={(e) => setVerificationQuestion(e.target.value)}
                    placeholder="e.g. What sticker is on the back? / What initials are inside?"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Anyone attempting to claim this item must answer this question correctly before receiving a handover pass.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Contact & Reward */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              4. Reporter Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Campus Email *
                </label>
                <input
                  type="email"
                  required
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {reportType === 'lost' ? (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Optional Reward Offer ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={rewardOffered}
                    onChange={(e) => setRewardOffered(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Your Affiliation
                  </label>
                  <select
                    value={reporterRole}
                    onChange={(e) => setReporterRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Campus Custodial / Staff</option>
                    <option value="visitor">Campus Visitor</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
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
                <span>Registering & Cross-checking...</span>
              ) : (
                <>
                  <span>Submit & Scan Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
