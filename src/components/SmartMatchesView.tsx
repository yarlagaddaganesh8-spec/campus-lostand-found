import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, MapPin, Calendar, Clock, Brain, Loader2 } from 'lucide-react';
import { MatchCandidate, Item } from '../types';

interface SmartMatchesViewProps {
  matches: MatchCandidate[];
  onOpenClaim: (item: Item) => void;
  onSelectItem: (item: Item) => void;
  onRefreshMatches: () => void;
}

export const SmartMatchesView: React.FC<SmartMatchesViewProps> = ({
  matches,
  onOpenClaim,
  onSelectItem,
  onRefreshMatches
}) => {
  const [analyzingPair, setAnalyzingPair] = useState<string | null>(null);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<Record<string, { assessment: string; score: number }>>({});

  const handleRunAiAnalysis = async (lost: Item, found: Item) => {
    const pairKey = `${lost.id}-${found.id}`;
    try {
      setAnalyzingPair(pairKey);
      const res = await fetch('/api/ai/match-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lostItemId: lost.id,
          foundItemId: found.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysisResults(prev => ({
          ...prev,
          [pairKey]: {
            assessment: data.aiAssessment,
            score: data.confidenceScore
          }
        }));
      }
    } catch (err) {
      console.error('Error running match analysis:', err);
    } finally {
      setAnalyzingPair(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* View Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Automated Full-Stack Match Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
            Cross-Referenced Match Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Our algorithmic engine continuously cross-evaluates active Lost reports against newly logged Found items across all campus buildings, comparing time windows, item taxonomy, geographic transit clusters, and identifying terminology.
          </p>
        </div>
      </div>

      {/* Match List */}
      {matches.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mb-1">No Active Match Candidates</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Currently no open lost reports align with uncollected found items above the 40% confidence threshold.
          </p>
          <button
            onClick={onRefreshMatches}
            className="px-4 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Re-run Comparison Engine
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((m, idx) => {
            const pairKey = `${m.lostItem.id}-${m.foundItem.id}`;
            const aiData = aiAnalysisResults[pairKey];
            const isAnalyzing = analyzingPair === pairKey;

            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all p-5 sm:p-6 shadow-xs space-y-5"
              >
                {/* Confidence Bar & Factors */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-mono text-sm font-bold">
                      {m.confidenceScore}% Similarity Score
                    </div>
                    <div className="text-xs text-neutral-500">
                      Evaluated category, building coordinates, & incident timestamp
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunAiAnalysis(m.lostItem, m.foundItem)}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors disabled:opacity-50 self-start sm:self-auto"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating with AI...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3.5 h-3.5 text-neutral-600" />
                        <span>{aiData ? 'Re-evaluate AI Insight' : 'Run Gemini Semantic Match'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Reasoning Callout if available */}
                {aiData && (
                  <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                      <Brain className="w-3.5 h-3.5 text-amber-800" />
                      <span>Gemini Intelligence Assessment</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">
                      {aiData.assessment}
                    </p>
                  </div>
                )}

                {/* Side by Side Item Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lost Item Column */}
                  <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-amber-900">LOST REPORT ({m.lostItem.id})</span>
                      <span className="font-mono tabular-nums text-neutral-500">{m.lostItem.date}</span>
                    </div>

                    <div>
                      <h4
                        onClick={() => onSelectItem(m.lostItem)}
                        className="text-sm font-bold text-neutral-900 hover:underline cursor-pointer line-clamp-1"
                      >
                        {m.lostItem.title}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                        {m.lostItem.description}
                      </p>
                    </div>

                    <div className="text-xs text-neutral-600 space-y-1 pt-2 border-t border-amber-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{m.lostItem.campusBuilding} ({m.lostItem.specificLocation || 'General area'})</span>
                      </div>
                      <div className="text-neutral-500 text-[11px]">
                        Reporter: {m.lostItem.reporterName} ({m.lostItem.reporterRole})
                      </div>
                    </div>
                  </div>

                  {/* Found Item Column */}
                  <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-900">FOUND IN CUSTODY ({m.foundItem.id})</span>
                      <span className="font-mono tabular-nums text-neutral-500">{m.foundItem.date}</span>
                    </div>

                    <div>
                      <h4
                        onClick={() => onSelectItem(m.foundItem)}
                        className="text-sm font-bold text-neutral-900 hover:underline cursor-pointer line-clamp-1"
                      >
                        {m.foundItem.title}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                        {m.foundItem.description}
                      </p>
                    </div>

                    <div className="text-xs text-neutral-600 space-y-1 pt-2 border-t border-emerald-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{m.foundItem.campusBuilding} ({m.foundItem.specificLocation || 'Turned in'})</span>
                      </div>
                      <div className="text-neutral-500 text-[11px]">
                        Turned in by: {m.foundItem.reporterName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Factors & Action Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-neutral-400 mr-1">Match Signals:</span>
                    {m.matchedFactors.map((factor, fIdx) => (
                      <span key={fIdx} className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px]">
                        {factor}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectItem(m.foundItem)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                    >
                      Inspect Found Record
                    </button>
                    <button
                      onClick={() => onOpenClaim(m.foundItem)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify & Claim Found Item</span>
                    </button>
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
