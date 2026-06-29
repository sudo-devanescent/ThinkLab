export interface AdaptationRule {
  id: string;
  description: string;
  condition: Record<string, unknown>;
  priority: number;
  nextScenarioTag: string;
  isActive: boolean;
  createdAt: Date;
}
