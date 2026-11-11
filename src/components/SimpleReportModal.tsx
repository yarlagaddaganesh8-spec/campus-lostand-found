import React, { useState } from 'react';
import { X, AlertCircle, Plus, Check, ArrowRight } from 'lucide-react';
import { Item, ItemCategory, CampusStation } from '../types';

interface SimpleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'lost' | 'found';
  onSwitchType: (type: 'lost' | 'found') => void;
  stations: CampusStation[];
  onItemCreated: (item: Item) => void;
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
  'Dining Pavilion'
];

export const SimpleReportModal: React.FC<SimpleReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  onSwitchType,
  stations,
  onItemCreated
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [campusBuilding, setCampusBuilding] = useState('University Library');
  const [specificLocation, setSpecificLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [brand, setBrand] = useState('');
  const [verificationQuestion, setVerificationQuestion] = useState('');
  const [storageStationId, setStorageStationId] = useState(stations[0]?.id || 'st-police');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide an item title.');
      return;
    }
    if (!reporterName.trim() || !reporterEmail.trim()) {
      setError('Please enter your name and university email.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          title: title.trim(),
          category,
          campusBuilding,
          specificLocation: specificLocation.trim(),
          date,
          description: description.trim(),
          primaryColor: primaryColor.trim(),
          brand: brand.trim(),
          verificationQuestion: reportType === 'found' ? verificationQuestion.trim() : undefined,
          storageStationId: reportType === 'found' ? storageStationId : undefined,
          reporterName: reporterName.trim(),
          reporterEmail: reporterEmail.trim(),
          reporterRole: 'student'
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit report');
      }

      onItemCreated(data.item);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error filing report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSpecificLocation('');
    setBrand('');
    setPrimaryColor('');
    setVerificationQuestion('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
              reportType === 'lost' ? 'bg-amber-700' : 'bg-neutral-900'
            }`}>
              {reportType === 'lost' ? <AlertCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {reportType === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
              </h2>
              <div className="text-xs text-neutral-500">
                Logged directly into the campus lost and found database
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

        {/* Type Toggle Switcher */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => onSwitchType('lost')}
              className={`py-1.5 rounded-md transition-all ${
                reportType === 'lost'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Report Lost Item
            </button>
            <button
              type="button"
              onClick={() => onSwitchType('found')}
              className={`py-1.5 rounded-md transition-all ${
                reportType === 'found'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Report Found Item
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[72vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={reportType === 'lost' ? 'e.g. MacBook Pro 14" Space Gray' : 'e.g. Black North Face Backpack'}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-neutral-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Campus Building *
              </label>
              <select
                value={campusBuilding}
                onChange={(e) => setCampusBuilding(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
              >
                {BUILDINGS.map(bldg => (
                  <option key={bldg} value={bldg}>{bldg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Specific Location / Room
              </label>
              <input
                type="text"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="e.g. 2nd floor library study desk"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Date {reportType === 'lost' ? 'Lost' : 'Found'} *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Brand / Make
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Nike, Casio"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Primary Color
              </label>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="e.g. Black, Navy, Silver"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Description & Identifying Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe distinguishing marks, case color, scratches, stickers..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
            />
          </div>

          {reportType === 'found' && (
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Holding Campus Station *
                </label>
                <select
                  value={storageStationId}
                  onChange={(e) => setStorageStationId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
                >
                  {stations.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.building})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Ownership Verification Question (for claimants)
                </label>
                <input
                  type="text"
                  value={verificationQuestion}
                  onChange={(e) => setVerificationQuestion(e.target.value)}
                  placeholder="e.g. What sticker is on the back? / What initials are written inside?"
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Student / Faculty Name"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Campus Email *
              </label>
              <input
                type="email"
                required
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              {isSubmitting ? (
                <span>Submitting to Database...</span>
              ) : (
                <>
                  <span>Save Report</span>
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
