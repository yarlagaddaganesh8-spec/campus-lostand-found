import React, { useState } from 'react';
import { X, BookOpen, Server, Database, Globe, Code2, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';

interface FsdLabGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FsdLabGuideModal: React.FC<FsdLabGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const apiEndpoints = [
    { method: 'GET', path: '/api/items', desc: 'Fetch lost & found items with query params (type, category, building, search)' },
    { method: 'POST', path: '/api/items', desc: 'Create new item record and run cross-matching algorithm against counterpart records' },
    { method: 'GET', path: '/api/items/:id', desc: 'Retrieve single item record and calculate similarity candidates' },
    { method: 'PUT', path: '/api/items/:id', desc: 'Update item status, location, or descriptive attributes' },
    { method: 'DELETE', path: '/api/items/:id', desc: 'Remove or archive an item record from the SQLite database' },
    { method: 'GET', path: '/api/claims', desc: 'List filed ownership claims filtered by email or status' },
    { method: 'POST', path: '/api/claims', desc: 'Submit ownership claim with challenge verification answers' },
    { method: 'PATCH', path: '/api/claims/:id', desc: 'Approve or reject claim; generates secure digital pickup pass code' },
    { method: 'GET', path: '/api/stations', desc: 'Retrieve campus custody stations and physical holding locations' },
    { method: 'GET', path: '/api/stats', desc: 'Compute system aggregate metrics (total items, reunion rate, category breakdown)' },
    { method: 'POST', path: '/api/db/query', desc: 'Run parameterized SQL query for live database demonstration' }
  ];

  const vivaQuestions = [
    {
      q: '1. What architecture does this application follow?',
      a: 'It follows the 3-Tier Full Stack Architecture: Presentation Tier (React SPA with Tailwind CSS), Application / Business Logic Tier (Node.js & Express REST API), and Data Tier (Persistent relational SQLite database with better-sqlite3).'
    },
    {
      q: '2. How does the frontend communicate with the backend in development?',
      a: 'The Express server mounts Vite as middleware in development (`vite.middlewares`). API requests hit `/api/*` Express routes directly, while client-side routes and assets are served by Vite on port 3000.'
    },
    {
      q: '3. How is database integrity maintained in SQLite?',
      a: 'Using primary keys (`id`), foreign key constraints (`REFERENCES items(id) ON DELETE CASCADE`), CHECK constraints (`type IN ("lost", "found")`), and atomic ACID transactions via better-sqlite3 transactions.'
    },
    {
      q: '4. How does the automated matchmaking algorithm work?',
      a: 'The backend engine compares active lost items against found items using a multi-factor scoring function: Category match (+35%), Building proximity (+25%), Date proximity (+10-20%), and Keyword token overlap (+15%). Pairs scoring ≥ 40% are suggested as candidate matches.'
    },
    {
      q: '5. How does anti-fraud claim verification work?',
      a: 'When an item is found, the finder/staff registers an ownership challenge question (e.g., secret sticker, inner initials). The claimant must answer this question and provide proof before a Digital Handover Pass (with barcode code) is issued.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
              FSD
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Full-Stack Development (FSD) Lab Viva & Project Guide
              </h2>
              <div className="text-xs text-neutral-500">
                Project Architecture, REST APIs, Database Schema, and Viva Q&A
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-neutral-700">
          {/* 3-Tier Architecture Diagram */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-800" />
                <span>3-Tier Architecture Overview</span>
              </h3>
              <span className="text-[11px] text-neutral-500 font-mono">React 19 · Node.js 22 · Express · SQLite</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Client Tier (Frontend)</span>
                </div>
                <div className="text-[11px] text-neutral-600 leading-relaxed">
                  React 19 SPA, Tailwind CSS v4, Lucide icons, responsive navigation, live query console.
                </div>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Server Tier (Backend)</span>
                </div>
                <div className="text-[11px] text-neutral-600 leading-relaxed">
                  Express REST API, CORS handling, matchmaking engine, claim verification controller.
                </div>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-amber-700" />
                  <span>3. Data Tier (Database)</span>
                </div>
                <div className="text-[11px] text-neutral-600 leading-relaxed">
                  SQLite (better-sqlite3) relational database with WAL journaling, foreign keys, tables.
                </div>
              </div>
            </div>
          </div>

          {/* Database Relational Tables */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-neutral-700" />
              <span>Relational Database Schema (SQLite)</span>
            </h3>

            <div className="p-3 bg-neutral-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
              <pre className="leading-relaxed">{`-- Core Relational Tables
TABLE items (id PK, type, title, category, campus_building, specific_location, incident_date, status, storage_station_id FK, primary_color, brand, reporter_name, reporter_email, reward_offered);
TABLE claims (id PK, item_id FK, item_title, claimant_name, claimant_email, claimant_student_id, verification_answer, status, pickup_pass_code, pickup_station_name);
TABLE stations (id PK, name, building, room, hours, phone, email, pickup_instructions, custody_count);
TABLE matches (id PK, lost_item_id FK, found_item_id FK, confidence_score, matched_factors, status);`}</pre>
            </div>
          </div>

          {/* RESTful Endpoints Table */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-neutral-700" />
              <span>REST API Specification</span>
            </h3>

            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200 text-[11px]">
                <thead className="bg-neutral-50 text-neutral-600 font-semibold text-left">
                  <tr>
                    <th className="px-3 py-2">Method</th>
                    <th className="px-3 py-2">Endpoint</th>
                    <th className="px-3 py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {apiEndpoints.map((ep, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70 font-mono">
                      <td className="px-3 py-1.5 font-bold text-neutral-900">{ep.method}</td>
                      <td className="px-3 py-1.5 text-blue-700">{ep.path}</td>
                      <td className="px-3 py-1.5 font-sans text-neutral-600">{ep.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Viva Questions and Answers */}
          <div className="space-y-3 pt-2 border-t border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-neutral-700" />
              <span>Lab Viva Questions & Answers</span>
            </h3>

            <div className="space-y-2.5">
              {vivaQuestions.map((vq, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                  <div className="font-bold text-neutral-900">{vq.q}</div>
                  <div className="text-neutral-600 leading-relaxed">{vq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500">
            Full-Stack Project: Ready for lab presentation & evaluation.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
