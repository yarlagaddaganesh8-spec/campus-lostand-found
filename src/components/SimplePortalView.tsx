import React, { useState } from 'react';
import { Search, Plus, AlertCircle, CheckCircle2, MapPin, Calendar, Clock, ChevronRight, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import { Item, ItemCategory, SystemStats } from '../types';

interface SimplePortalViewProps {
  items: Item[];
  stats: SystemStats | null;
  onOpenReportLost: () => void;
  onOpenReportFound: () => void;
  onSelectItem: (item: Item) => void;
  onOpenClaim: (item: Item) => void;
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
  'All Campus Buildings',
  'University Library',
  'Student Union & Commons',
  'Science & Engineering Hall',
  'Campus Recreation Center',
  'East Parking Pavilion'
];

export const SimplePortalView: React.FC<SimplePortalViewProps> = ({
  items,
  stats,
  onOpenReportLost,
  onOpenReportFound,
  onSelectItem,
  onOpenClaim
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found' | 'reunited'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('All Campus Buildings');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Count metrics
  const totalCount = items.length;
  const lostCount = items.filter(i => i.type === 'lost' && i.status !== 'reunited').length;
  const foundCount = items.filter(i => i.type === 'found' && i.status !== 'reunited').length;
  const reunitedCount = items.filter(i => i.status === 'reunited').length;

  // Filter items
  const filteredItems = items.filter(item => {
    if (selectedType === 'lost' && (item.type !== 'lost' || item.status === 'reunited')) return false;
    if (selectedType === 'found' && (item.type !== 'found' || item.status === 'reunited')) return false;
    if (selectedType === 'reunited' && item.status !== 'reunited') return false;

    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedBuilding !== 'All Campus Buildings' && item.campusBuilding !== selectedBuilding) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchBuilding = item.campusBuilding.toLowerCase().includes(q);
      const matchLoc = item.specificLocation.toLowerCase().includes(q);
      const matchBrand = item.brand?.toLowerCase().includes(q);
      const matchColor = item.primaryColor?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchBuilding && !matchLoc && !matchBrand && !matchColor) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header with Two Primary Buttons */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-3 mb-8">
          <div className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
            University Student Services
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            Campus Lost and Found Portal
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Quickly report lost items or register belongings you found on campus. Records are stored in the central database to match owners with their items.
          </p>
        </div>

        {/* The Two Primary Action Cards / Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onOpenReportLost}
            className="group text-left p-5 sm:p-6 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all flex flex-col justify-between shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-1">
                <AlertCircle className="w-5 h-5 text-amber-700" />
                <span>Report Lost Item</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Misplaced your student ID, laptop, earphones, keys, or bag? File a quick report with identifying details so finders can match it.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-900 group-hover:translate-x-0.5 transition-transform">
              <span>File Lost Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={onOpenReportFound}
            className="group text-left p-5 sm:p-6 rounded-xl border border-neutral-300 bg-neutral-900 text-white hover:bg-neutral-800 transition-all flex flex-col justify-between shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-base text-white mb-1">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Report Found Item</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Found an unattended belonging in a lecture hall, library, or quad? Register it here to notify the owner or log campus desk custody.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-300 group-hover:translate-x-0.5 transition-transform">
              <span>Log Found Item</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Related Data: Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Total Cataloged Items</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {totalCount}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Lost Items (Searching)</div>
          <div className="text-2xl font-bold font-mono text-amber-800 tabular-nums">
            {lostCount}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Found Items (In Custody)</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {foundCount}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Reunited Belongings</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {reunitedCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Related Data */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search related items (e.g. MacBook, AirPods, Keys, Calculator, Library)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-neutral-900 placeholder:text-neutral-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Segmented Filter: All / Lost / Found / Reunited */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg shrink-0 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Items ({totalCount})
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedType === 'lost'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Lost ({lostCount})
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedType === 'found'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Found ({foundCount})
            </button>
            <button
              onClick={() => setSelectedType('reunited')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedType === 'reunited'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Reunited ({reunitedCount})
            </button>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-neutral-500">Facility:</span>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              {BUILDINGS.map(bldg => (
                <option key={bldg} value={bldg}>{bldg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Related Data Records Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
          <div>
            Showing <span className="font-mono font-bold text-neutral-900">{filteredItems.length}</span> related items
            {selectedCategory !== 'all' && <span> in {selectedCategory}</span>}
          </div>
          <div className="text-neutral-400">
            Click any item card to view full custody details or claim
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">No matching items found</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              No items match your active search and filter criteria. You can register this item now using the buttons above.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedBuilding('All Campus Buildings');
                  setSelectedType('all');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => {
              const isFound = item.type === 'found';
              const isReunited = item.status === 'reunited';
              const isPending = item.status === 'claim_pending';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="group bg-white rounded-xl border border-neutral-200 hover:border-neutral-400 transition-all duration-150 p-5 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-sm"
                >
                  <div className="space-y-2.5">
                    {/* Unboxed Metadata Header */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isFound ? 'text-emerald-700' : 'text-amber-800'}`}>
                          {isFound ? 'FOUND ITEM' : 'LOST ITEM'}
                        </span>
                        <span aria-hidden="true" className="text-neutral-300">·</span>
                        <span className="text-neutral-400">{item.id}</span>
                      </div>

                      <div>
                        {isReunited ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Reunited
                          </span>
                        ) : isPending ? (
                          <span className="text-amber-700 font-medium">Claim Pending</span>
                        ) : (
                          <span className="text-neutral-500">
                            {isFound ? 'In Custody' : 'Open Search'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-neutral-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Unboxed Category / Brand / Color details */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{item.category}</span>
                      {item.brand && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.brand}</span>
                        </>
                      )}
                      {item.primaryColor && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.primaryColor}</span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer: Location and Action */}
                  <div className="pt-3 border-t border-neutral-100 mt-3 space-y-2 text-xs">
                    <div className="flex items-start gap-1.5 text-neutral-600">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium text-neutral-700">
                        {item.campusBuilding}
                        {item.specificLocation ? ` (${item.specificLocation})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-500 pt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-mono tabular-nums">{item.date}</span>
                      </div>

                      {isFound && !isReunited ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenClaim(item);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                        >
                          Claim Item
                        </button>
                      ) : (
                        <span className="text-neutral-400 group-hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors">
                          Details <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
