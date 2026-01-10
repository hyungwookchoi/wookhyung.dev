import type { FlowStep } from '../types';

export const FLOW_STEPS: FlowStep[] = [
  {
    id: 'ssr',
    title: {
      ko: '1. 서버 렌더링 (SSR)',
      en: '1. Server Rendering (SSR)',
    },
    description: {
      ko: [
        '서버에서 HTML 생성',
        '<script src="..."> 태그가 HTML에 포함',
        '→ 브라우저로 HTML 전송',
      ],
      en: [
        'Server generates HTML',
        '<script src="..."> tag included in HTML',
        '→ HTML sent to browser',
      ],
    },
    scriptStatus: ['not-exist'],
  },
  {
    id: 'hydration',
    title: {
      ko: '2. 브라우저 파싱 & 실행',
      en: '2. Browser Parsing & Execution',
    },
    description: {
      ko: [
        '브라우저가 HTML 파싱',
        '<script> 태그 발견 및 로드',
        '→ 스크립트 실행 (첫 번째 실행)',
      ],
      en: [
        'Browser parses HTML',
        '<script> tag found and loaded',
        '→ Script executed (1st execution)',
      ],
    },
    scriptStatus: ['executable'],
  },
  {
    id: 'dynamic',
    title: {
      ko: '3. 하이드레이션 & 동적 주입',
      en: '3. Hydration & Dynamic Injection',
    },
    description: {
      ko: [
        'React 하이드레이션 완료',
        "useEffect 실행 → document.createElement('script')",
        '→ 동일한 스크립트 재실행 (두 번째 실행)',
      ],
      en: [
        'React hydration complete',
        "useEffect runs → document.createElement('script')",
        '→ Same script re-executed (2nd execution)',
      ],
    },
    scriptStatus: ['executable', 'executable'],
    highlight: true,
  },
];

const TRANSLATIONS = {
  ko: {
    header: {
      badge: '인터랙티브 시스템 다이어그램',
    },
    title: 'SSR 환경에서의 스크립트 중복 실행 문제',
    subtitle: '각 단계를 클릭하여 중복 실행이 발생하는 과정을 확인하세요',
    result: '결과: 중복 실행!',
    resultDescription:
      '동일한 스크립트가 2번 실행되어 Analytics 중복 집계, 위젯 중복 렌더링 등의 문제 발생',
    scriptStates: {
      'not-exist': '존재하지 않음',
      'parser-inserted': '실행 불가',
      executable: '실행됨',
      duplicate: '중복',
    },
    playButton: '재생',
    pauseButton: '일시정지',
    resetButton: '초기화',
    footer: '이 문제는 PR #5095에서 중복 방지 로직으로 해결되었습니다',
    stepStatus: {
      complete: '완료',
      active: '진행중',
      pending: '대기',
    },
    sectionHeaders: {
      processDescription: '프로세스 설명',
      scriptStatus: '스크립트 상태',
    },
    scriptDetails: {
      notYetInDOM: 'DOM에 아직 없음',
      cannotExecute: '실행 불가',
      executedSuccessfully: '성공적으로 실행됨',
      duplicateDetected: '중복 감지됨',
    },
    progress: '진행률',
  },
  en: {
    header: {
      badge: 'Interactive System Diagram',
    },
    title: 'Script Duplication Issue in SSR Environment',
    subtitle: 'Click each step to see how duplication occurs',
    result: 'Result: Duplicate Execution!',
    resultDescription:
      'Same script executed twice, causing duplicate Analytics tracking and widget rendering',
    scriptStates: {
      'not-exist': 'Not Exist',
      'parser-inserted': 'Not Executable',
      executable: 'Executed',
      duplicate: 'Duplicate',
    },
    playButton: 'Play',
    pauseButton: 'Pause',
    resetButton: 'Reset',
    footer: 'This issue was resolved in PR #5095 with deduplication logic',
    stepStatus: {
      complete: 'Complete',
      active: 'Active',
      pending: 'Pending',
    },
    sectionHeaders: {
      processDescription: 'Process Description',
      scriptStatus: 'Script Status',
    },
    scriptDetails: {
      notYetInDOM: 'Not yet in DOM',
      cannotExecute: 'Cannot execute',
      executedSuccessfully: 'Executed successfully',
      duplicateDetected: 'Duplicate detected',
    },
    progress: 'Progress',
  },
} as const;

export type Locale = 'ko' | 'en';

export function getTranslations(locale: Locale) {
  return TRANSLATIONS[locale];
}
