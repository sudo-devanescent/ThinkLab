export interface AdaptationRule {
  id: string;
  dimension: 'coherence' | 'risk' | 'consistency';
  threshold: number;
  operator: 'lt' | 'gt' | 'lte' | 'gte';
  nextDifficulty: 'easy' | 'medium' | 'hard';
}
