export type ItemType = 'lost' | 'found';

export type ItemCategory =
  | 'Electronics'
  | 'IDs & Cards'
  | 'Keys & Badges'
  | 'Bags & Backpacks'
  | 'Clothing & Gear'
  | 'Books & Notes'
  | 'Personal Valuables';

export type ItemStatus = 'active' | 'claim_pending' | 'reunited' | 'stored_at_security';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  campusBuilding: string;
  specificLocation: string;
  date: string; // YYYY-MM-DD
  timeOfDay?: string;
  description: string;
  status: ItemStatus;
  storageStationId?: string;
  primaryColor?: string;
  brand?: string;
  secretDetails?: string; // Hidden identifying details (e.g. lock screen, engraving, serial suffix)
  verificationQuestion?: string; // For found items: question the claimant must answer
  reporterName: string;
  reporterEmail: string;
  reporterPhone?: string;
  reporterRole: 'student' | 'faculty' | 'staff' | 'visitor';
  rewardOffered?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchCandidate {
  lostItem: Item;
  foundItem: Item;
  confidenceScore: number; // 0 - 100
  matchedFactors: string[];
  status: 'suggested' | 'dismissed' | 'claim_in_progress' | 'confirmed';
}

export interface Claim {
  id: string;
  itemId: string;
  itemTitle: string;
  claimantName: string;
  claimantEmail: string;
  claimantStudentId: string;
  claimantPhone: string;
  verificationAnswer: string;
  additionalProof: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  pickupPassCode?: string;
  rejectionReason?: string;
  pickupStationName?: string;
}

export interface CampusStation {
  id: string;
  name: string;
  building: string;
  room: string;
  hours: string;
  phone: string;
  email: string;
  custodyItemCount: number;
  pickupInstructions: string;
}

export interface SystemStats {
  totalLostReported: number;
  totalFoundReported: number;
  totalReunited: number;
  reunionRatePercent: number;
  averageDaysToReunite: number;
  topCategories: { category: string; count: number }[];
  topLocations: { building: string; count: number }[];
}
