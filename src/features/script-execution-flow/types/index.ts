export type FlowStepType = 'ssr' | 'hydration' | 'dynamic';

export type ScriptStatus =
  | 'not-exist'
  | 'parser-inserted'
  | 'executable'
  | 'duplicate';

export interface FlowStep {
  id: FlowStepType;
  title: string;
  description: string[];
  scriptStatus: ScriptStatus[];
  highlight?: boolean;
}
