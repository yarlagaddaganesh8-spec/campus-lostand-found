import React, { useState, useEffect } from 'react';
import { Database, Play, RotateCcw, Table, Terminal, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

interface TableInfo {
  table: string;
  rowCount: number;
  columns: { cid: number; name: string; type: string; notnull: number; dflt_value: any; pk: number }[];
  sample: any[];
}

interface DatabaseExplorerViewProps {
  onRefreshParent: () => void;
}

export const DatabaseExplorerView: React.FC<DatabaseExplorerViewProps> = ({ onRefreshParent }) => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('items');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT id, title, type, category, status, incident_date FROM items LIMIT 10;');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'schema'>('console');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const sampleQueries = [
    {
      title: 'Active Lost vs Found Items',
      sql: 'SELECT type, COUNT(*) as total_items FROM items GROUP BY type;'
    },
    {
      title: 'Top Categories by Volume',
      sql: 'SELECT category, COUNT(*) as item_count FROM items GROUP BY category ORDER BY item_count DESC;'
    },
    {
      title: 'Approved Claims & Handover Pass Codes',
      sql: 'SELECT id, item_title, claimant_name, pickup_pass_code, status FROM claims WHERE status = "approved";'
    },
    {
      title: 'Campus Holding Desks & Custody Inventory',
      sql: 'SELECT name, building, custody_count FROM stations ORDER BY custody_count DESC;'
    },
    {
      title: 'All Active Items in Library',
      sql: 'SELECT id, title, type, specific_location FROM items WHERE campus_building = "University Library";'
    }
  ];

  const fetchDbOverview = async () => {
    try {
      const res = await fetch('/api/db/overview');
      const data = await res.json();
      if (data.success && data.tables) {
        setTables(data.tables);
      }
    } catch (err) {
      console.error('Failed to fetch DB overview:', err);
    }
  };

  useEffect(() => {
    fetchDbOverview();
  }, []);

  const handleExecuteQuery = async (customSql?: string) => {
    const toRun = customSql || sqlQuery;
    setIsExecuting(true);
    setQueryError(null);
    setQueryResults(null);

    try {
      const res = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: toRun })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Query failed');
      }
      setQueryResults(data.results);
    } catch (err: any) {
      setQueryError(err.message || 'Execution error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Reset database to original campus demonstration seed data?')) return;
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage('Database reset successfully.');
        setTimeout(() => setStatusMessage(null), 3000);
        fetchDbOverview();
        onRefreshParent();
      }
    } catch (err) {
      console.error('Error resetting database:', err);
    }
  };

  const copySql = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const currentTableData = tables.find(t => t.table === selectedTable);

  return (
    <div className="space-y-8 pb-16">
      {/* View Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
            <Database className="w-4 h-4" />
            <span>Embedded Relational SQLite Database (better-sqlite3)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Database Engine & Live SQL Query Studio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Data is stored in persistent relational SQLite tables (<code className="font-mono text-neutral-800 bg-neutral-100 px-1 py-0.5 rounded text-xs">/data/campus_lost_found.db</code>) with foreign keys, WAL journaling, and parameterized CRUD transactions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetDb}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Relational Tables KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tables.map(t => (
          <div
            key={t.table}
            onClick={() => {
              setSelectedTable(t.table);
              setSqlQuery(`SELECT * FROM ${t.table} LIMIT 10;`);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedTable === t.table
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className={`text-[11px] font-mono uppercase mb-1 ${
              selectedTable === t.table ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              TABLE
            </div>
            <div className="text-base font-bold font-mono truncate">{t.table}</div>
            <div className={`text-xs mt-2 flex items-center justify-between ${
              selectedTable === t.table ? 'text-neutral-300' : 'text-neutral-500'
            }`}>
              <span className="font-mono tabular-nums">{t.rowCount} records</span>
              <span>{t.columns.length} cols</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mode Sub-nav: Query Console vs Schema Inspector */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab('console')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'console'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive SQL Terminal</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'schema'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Schema & Foreign Keys ({selectedTable})</span>
        </button>
      </div>

      {activeTab === 'console' ? (
        <div className="space-y-6">
          {/* Query Editor Box */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-neutral-300 text-xs border-b border-neutral-800">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-amber-400 font-bold">SQL /</span>
                <span>campus_lost_found.db</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => copySql(sqlQuery)}
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuery ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-neutral-950">
              <textarea
                rows={3}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter SQL query (SELECT, EXPLAIN, PRAGMA)..."
                className="w-full bg-transparent text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-neutral-50 border-t border-neutral-200 text-xs">
              <div className="text-neutral-500">
                Supports standard ANSI SQL syntax (<code className="font-mono">JOIN</code>, <code className="font-mono">WHERE</code>, <code className="font-mono">GROUP BY</code>, <code className="font-mono">ORDER BY</code>)
              </div>
              <button
                onClick={() => handleExecuteQuery()}
                disabled={isExecuting}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
              </button>
            </div>
          </div>

          {/* Preset Student Queries */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Sample FSD Queries
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSqlQuery(sample.sql);
                    handleExecuteQuery(sample.sql);
                  }}
                  className="px-3 py-1.5 text-xs bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-lg text-neutral-800 transition-colors text-left"
                >
                  <span className="font-medium">{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {queryError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">SQL Execution Error:</div>
                <div className="font-mono mt-1">{queryError}</div>
              </div>
            </div>
          )}

          {/* Results Table */}
          {queryResults && (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs space-y-2">
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <div>
                  Query executed: <span className="font-mono font-bold text-neutral-900">{queryResults.length}</span> rows returned
                </div>
                <div className="font-mono text-[11px] text-neutral-400">
                  SQLite Statement: OK
                </div>
              </div>

              {queryResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  Query returned 0 matching records.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200 text-xs font-mono">
                    <thead className="bg-neutral-50 text-neutral-600 font-semibold text-left">
                      <tr>
                        {Object.keys(queryResults[0]).map((colKey) => (
                          <th key={colKey} className="px-4 py-2.5 whitespace-nowrap">
                            {colKey}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-800">
                      {queryResults.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-neutral-50/80">
                          {Object.values(row).map((val: any, cIdx) => (
                            <td key={cIdx} className="px-4 py-2 whitespace-nowrap text-neutral-700 tabular-nums">
                              {val === null ? (
                                <span className="text-neutral-400 italic">NULL</span>
                              ) : typeof val === 'object' ? (
                                JSON.stringify(val)
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Schema & Columns Tab */
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 font-mono">
              Table Schema: {selectedTable}
            </h3>
            <span className="text-xs text-neutral-500 font-mono">
              Total rows: {currentTableData?.rowCount || 0}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold text-left">
                <tr>
                  <th className="px-4 py-2.5">Column ID</th>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Data Type</th>
                  <th className="px-4 py-2.5">Primary Key</th>
                  <th className="px-4 py-2.5">Nullable</th>
                  <th className="px-4 py-2.5">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-neutral-700">
                {currentTableData?.columns.map(col => (
                  <tr key={col.cid} className="hover:bg-neutral-50">
                    <td className="px-4 py-2 text-neutral-400">{col.cid}</td>
                    <td className="px-4 py-2 font-bold text-neutral-900">{col.name}</td>
                    <td className="px-4 py-2 text-amber-800 font-semibold">{col.type}</td>
                    <td className="px-4 py-2">{col.pk ? 'YES (PK)' : 'No'}</td>
                    <td className="px-4 py-2">{col.notnull ? 'NOT NULL' : 'YES'}</td>
                    <td className="px-4 py-2 text-neutral-400">{col.dflt_value || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
