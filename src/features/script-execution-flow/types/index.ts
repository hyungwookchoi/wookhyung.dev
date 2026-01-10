export type FlowStepType = 'ssr' | 'hydration' | 'dynamic';

export type ScriptStatus =
  | 'not-exist'
  | 'parser-inserted'
  | 'executable'
  | 'duplicate';

export interface FlowStep {
  id: FlowStepType;
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string[];
    en: string[];
  };
  scriptStatus: ScriptStatus[];
  highlight?: boolean;
}
