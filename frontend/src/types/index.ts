export interface ThreatActor {
  id: number | string;
  actor_code: string;
  name: string;
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  risk?: string;
  confidence_score: number;
  confidence?: number;
  status: string;
  summary?: string;
  aliases: string[];
}

export interface Entity {
  id: number | string;
  entity_code: string;
  type: string;
  value: string;
  status: 'OBSERVED' | 'CORRELATED' | 'INFERRED' | 'UNVERIFIED';
  confidence: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  status?: string;
  confidence?: number;
  risk?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  confidence: number;
  evidence_id?: string | number;
}

export interface BlockchainAddress {
  address: string;
  currency: string;
  transactionCount: number;
  incoming: number;
  outgoing: number;
  firstSeen: string;
  lastSeen: string;
  risk: number;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  value: number;
  date: string;
}

export interface EvidenceItem {
  id: number | string;
  evidence_code: string;
  type: string;
  source: string;
  timestamp: string;
  hash: string;
  description: string;
  related_entity?: string;
  integrity_status: string;
  confidence: number;
}

export interface TimelineEventItem {
  id: number | string;
  date: string;
  event: string;
  source: string;
  indicator: string;
  confidence: number;
}

export interface AlertItem {
  id: number;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  actor?: string;
  status: 'NEW' | 'REVIEWING' | 'CONFIRMED' | 'DISMISSED';
  description: string;
}

export interface CorrelationResult {
  actor_id: number;
  actor_name: string;
  confidence_score: number;
  confidence_level: string;
  factors: Array<{
    rule: string;
    name: string;
    points: number;
    max_points: number;
    evidence: string;
  }>;
  disclaimer: string;
}
