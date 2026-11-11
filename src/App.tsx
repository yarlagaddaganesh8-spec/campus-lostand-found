import React, { useState, useEffect } from 'react';
import { SimpleNavbar } from './components/SimpleNavbar';
import { SimplePortalView } from './components/SimplePortalView';
import { SimpleReportModal } from './components/SimpleReportModal';
import { ClaimModal } from './components/ClaimModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { Item, Claim, CampusStation, SystemStats, MatchCandidate } from './types';
import { api } from './services/api';
import { CheckCircle, X } from 'lucide-react';

export default function App() {
  // Core Data
  const [items, setItems] = useState<Item[]>([]);
  const [stations, setStations] = useState<CampusStation[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<'lost' | 'found'>('lost');

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimTargetItem, setClaimTargetItem] = useState<Item | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [detailMatches, setDetailMatches] = useState<MatchCandidate[]>([]);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, stationsRes, claimsRes, statsRes] = await Promise.all([
        api.getItems(),
        api.getStations(),
        api.getClaims(),
        api.getStats()
      ]);

      if (itemsRes.success) setItems(itemsRes.items);
      if (stationsRes.success) setStations(stationsRes.stations);
      if (claimsRes.success) setClaims(claimsRes.claims);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error('Error fetching data from SQLite database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReportLost = () => {
    setReportModalType('lost');
    setIsReportModalOpen(true);
  };

  const handleOpenReportFound = () => {
    setReportModalType('found');
    setIsReportModalOpen(true);
  };

  const handleItemCreated = (newItem: Item) => {
    setItems(prev => [newItem, ...prev]);
    showToast(
      newItem.type === 'lost'
        ? `Lost item report registered (${newItem.id}). Saved to database.`
        : `Found item logged (${newItem.id}). Placed in custody registry.`,
      'success'
    );
    api.getStats().then(s => { if (s.success) setStats(s.stats); });
  };

  const handleSelectItem = async (item: Item) => {
    setDetailItem(item);
    setIsDetailModalOpen(true);

    try {
      const res = await api.getItemById(item.id);
      if (res.success && res.matches) {
        setDetailMatches(res.matches);
      }
    } catch (err) {
      console.error('Error fetching item details:', err);
    }
  };

  const handleOpenClaim = (item: Item) => {
    setClaimTargetItem(item);
    setIsClaimModalOpen(true);
  };

  const handleClaimSubmitted = (claim: Claim) => {
    setClaims(prev => [claim, ...prev]);
    setItems(prev => prev.map(i => i.id === claim.itemId ? { ...i, status: 'claim_pending' } : i));
    showToast(`Claim filed under ID ${claim.id}. Awaiting staff verification.`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl border border-neutral-800 flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Simplified Clean Navbar with Title and Two Action Buttons */}
      <SimpleNavbar
        onOpenReportLost={handleOpenReportLost}
        onOpenReportFound={handleOpenReportFound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {isLoading ? (
          <div className="p-16 text-center text-xs text-neutral-500 space-y-2">
            <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>Loading campus lost and found records...</div>
          </div>
        ) : (
          <SimplePortalView
            items={items}
            stats={stats}
            onOpenReportLost={handleOpenReportLost}
            onOpenReportFound={handleOpenReportFound}
            onSelectItem={handleSelectItem}
            onOpenClaim={handleOpenClaim}
          />
        )}
      </main>

      {/* Simple Report Modal (for both Lost & Found) */}
      <SimpleReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportType={reportModalType}
        onSwitchType={setReportModalType}
        stations={stations}
        onItemCreated={handleItemCreated}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={detailItem}
        stations={stations}
        matches={detailMatches}
        onOpenClaim={handleOpenClaim}
        onSelectMatchItem={(counterpart) => {
          handleSelectItem(counterpart);
        }}
      />

      {/* Claim Modal */}
      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        item={claimTargetItem}
        onClaimSubmitted={handleClaimSubmitted}
      />

      {/* Clean University Footer */}
      <footer className="border-t border-neutral-200 bg-white mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">Campus Lost and Found Portal</span>
            <span aria-hidden="true">·</span>
            <span>University Student Affairs & Public Safety</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Security Dispatch: <span className="font-mono text-neutral-800 font-medium">(555) 019-2200</span></span>
            <span>Intake Desks: <span className="font-mono text-neutral-800 font-medium">5 Stations Active</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
