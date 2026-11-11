import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, ShieldCheck, ArrowRight, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Item, ItemCategory, SystemStats } from '../types';

interface BrowseViewProps {
  items: Item[];
  stats: SystemStats | null;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedBuilding: string;
  onSelectBuilding: (bldg: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectItem: (item: Item) => void;
  onOpenReport: (type?: 'lost' | 'found') => void;
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
  'All Locations',
  'University Library',
  'Student Union & Commons',
  'Science & Engineering Hall',
  'Campus Recreation Center',
  'East Parking Pavilion'
];

export const BrowseView: React.FC<BrowseViewProps> = ({
  items,
  stats,
  selectedCategory,
  onSelectCategory,
  selectedBuilding,
  onSelectBuilding,
  selectedType,
  onSelectType,
  searchQuery,
  onSearchChange,
  onSelectItem,
  onOpenReport,
  onOpenClaim
}) => {
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

  const filteredItems = items
    .filter(item => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedBuilding !== 'All Locations' && selectedBuilding !== 'all' && item.campusBuilding !== selectedBuilding) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.campusBuilding.toLowerCase().includes(q) || item.specificLocation.toLowerCase().includes(q);
        const matchBrand = item.brand?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchBrand) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const bannerImgPath = "/src/assets/images/campus_quad_banner_1794391609621.jpg";

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200/80 bg-neutral-900 text-white shadow-sm">
        <div className="absolute inset-0 z-0">
          <img
            src={bannerImgPath}
            alt="University campus plaza and library"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-900/60" />
        </div>

        <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16 max-w-3xl">
          <div className="text-xs font-semibold tracking-wider uppercase text-amber-300 mb-3">
            Centralized Campus Recovery Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 text-balance">
            Lost something on campus? We help reunite items with their owners.
          </h1>
          <p className="text-base text-neutral-300 mb-8 leading-relaxed">
            Report lost possessions or securely log found belongings. Our algorithmic matching engine cross-references reports across all campus libraries, student facilities, and security desks in real time.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenReport('lost')}
              className="px-5 py-2.5 text-sm font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              Report Lost Belonging
            </button>
            <button
              onClick={() => onOpenReport('found')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-neutral-800/90 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              I Found an Item
            </button>
          </div>
        </div>

        {/* Hero KPI metrics strip */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-t border-neutral-800 bg-neutral-950/70 backdrop-blur-sm divide-x divide-neutral-800/80">
          <div className="p-4 sm:p-5">
            <div className="text-xs text-neutral-400 mb-1">Active Catalog Items</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {items.length}
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-xs text-neutral-400 mb-1">Reunited Belongings</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-400">
              {stats?.totalReunited || 18}
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-xs text-neutral-400 mb-1">Campus Intake Stations</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              5 Stations
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-xs text-neutral-400 mb-1">Avg. Return Window</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400">
              2.4 Days
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter Toolbar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by keywords, model, serial hint, or color (e.g. MacBook, AirPods, Hydro Flask, Keys)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-neutral-900 placeholder:text-neutral-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Segmented Type Controller */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg shrink-0">
            <button
              onClick={() => onSelectType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => onSelectType('lost')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedType === 'lost'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Lost (Looking for Item)
            </button>
            <button
              onClick={() => onSelectType('found')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedType === 'found'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Found (In Custody)
            </button>
          </div>
        </div>

        {/* Secondary Filters: Category & Campus Location */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onSelectCategory('all')}
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
                onClick={() => onSelectCategory(cat)}
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

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">Building:</span>
              <select
                value={selectedBuilding}
                onChange={(e) => onSelectBuilding(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                {BUILDINGS.map(bldg => (
                  <option key={bldg} value={bldg}>{bldg}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">Order:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="newest">Recent First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Item List Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <div>
          Showing <span className="font-mono font-semibold text-neutral-900">{filteredItems.length}</span> recorded items
          {selectedCategory !== 'all' && <span> in {selectedCategory}</span>}
          {selectedBuilding !== 'All Locations' && <span> at {selectedBuilding}</span>}
        </div>
        <div className="text-neutral-400">
          Click any card to inspect match suggestions & ownership verification
        </div>
      </div>

      {/* Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mb-2">No matching records found</h3>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            We couldn't find any items matching your active search criteria. If you recently lost or found this belonging, please file a report so our system can monitor incoming logs.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('all');
                onSelectBuilding('All Locations');
                onSelectType('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => onOpenReport('lost')}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Report Lost Item
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => {
            const isFound = item.type === 'found';
            const isReunited = item.status === 'reunited';
            const isClaimPending = item.status === 'claim_pending';

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-white rounded-xl border border-neutral-200 hover:border-neutral-400 transition-all duration-150 p-5 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  {/* Clean unboxed metadata header */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className={isFound ? 'text-emerald-700 font-semibold' : 'text-amber-800 font-semibold'}>
                        {isFound ? 'FOUND REPORT' : 'LOST REPORT'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-400">{item.id}</span>
                    </div>

                    <div className="text-xs">
                      {isReunited ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reunited
                        </span>
                      ) : isClaimPending ? (
                        <span className="text-amber-700 font-medium">Claim in Review</span>
                      ) : (
                        <span className="text-neutral-500">
                          {isFound ? 'Awaiting Owner' : 'Open Search'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-amber-900 transition-colors mb-2 line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Clean unboxed item attributes: Category / Date */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
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

                  {/* Description snippet */}
                  <p className="text-xs text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Card Footer: Location & Action */}
                <div className="pt-3 border-t border-neutral-100 mt-2 space-y-2">
                  <div className="flex items-start gap-1.5 text-xs text-neutral-600">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1 font-medium text-neutral-700">
                      {item.campusBuilding}
                      {item.specificLocation ? ` (${item.specificLocation})` : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
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
                    ) : item.rewardOffered && item.rewardOffered > 0 ? (
                      <span className="font-mono text-emerald-700 font-semibold">
                        ${item.rewardOffered} Reward
                      </span>
                    ) : (
                      <span className="text-neutral-400 group-hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors">
                        Inspect <ChevronRight className="w-3 h-3" />
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
  );
};
