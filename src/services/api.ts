import { Item, Claim, CampusStation, SystemStats, MatchCandidate } from '../types';

export const api = {
  async getItems(filters: {
    type?: string;
    category?: string;
    building?: string;
    status?: string;
    q?: string;
    sort?: string;
  } = {}): Promise<{ success: boolean; count: number; items: Item[] }> {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.building && filters.building !== 'all') params.append('building', filters.building);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.q) params.append('q', filters.q);
    if (filters.sort) params.append('sort', filters.sort);

    const res = await fetch(`/api/items?${params.toString()}`);
    return res.json();
  },

  async getItemById(id: string): Promise<{ success: boolean; item: Item; matches: MatchCandidate[] }> {
    const res = await fetch(`/api/items/${id}`);
    return res.json();
  },

  async createItem(itemData: Partial<Item>): Promise<{ success: boolean; item: Item; matches: MatchCandidate[] }> {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return res.json();
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<{ success: boolean; item: Item }> {
    const res = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteItem(id: string): Promise<{ success: boolean; item: Item }> {
    const res = await fetch(`/api/items/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getMatches(): Promise<{ success: boolean; count: number; matches: MatchCandidate[] }> {
    const res = await fetch('/api/matches');
    return res.json();
  },

  async getStations(): Promise<{ success: boolean; stations: CampusStation[] }> {
    const res = await fetch('/api/stations');
    return res.json();
  },

  async getClaims(query: { itemId?: string; claimantEmail?: string; status?: string } = {}): Promise<{ success: boolean; count: number; claims: Claim[] }> {
    const params = new URLSearchParams();
    if (query.itemId) params.append('itemId', query.itemId);
    if (query.claimantEmail) params.append('claimantEmail', query.claimantEmail);
    if (query.status && query.status !== 'all') params.append('status', query.status);

    const res = await fetch(`/api/claims?${params.toString()}`);
    return res.json();
  },

  async createClaim(claimData: {
    itemId: string;
    claimantName: string;
    claimantEmail: string;
    claimantStudentId: string;
    claimantPhone: string;
    verificationAnswer: string;
    additionalProof?: string;
  }): Promise<{ success: boolean; claim: Claim; message: string }> {
    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData)
    });
    return res.json();
  },

  async reviewClaim(claimId: string, decision: {
    status: 'approved' | 'rejected';
    reviewedBy: string;
    rejectionReason?: string;
  }): Promise<{ success: boolean; claim: Claim; item?: Item }> {
    const res = await fetch(`/api/claims/${claimId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decision)
    });
    return res.json();
  },

  async getStats(): Promise<{ success: boolean; stats: SystemStats }> {
    const res = await fetch('/api/stats');
    return res.json();
  },

  async getAiMatchReasoning(lostItemId: string, foundItemId: string): Promise<{
    success: boolean;
    confidenceScore: number;
    aiAssessment: string;
    factors: string[];
  }> {
    const res = await fetch('/api/ai/match-reasoning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lostItemId, foundItemId })
    });
    return res.json();
  }
};
