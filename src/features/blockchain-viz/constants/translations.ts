export const translations = {
  ko: {
    title: '블록체인 이해하기',
    subtitle: '4단계 체험 학습',

    navigation: {
      previous: '이전',
      next: '다음',
      start: '시작하기',
      restart: '처음부터',
      stepOf: '단계',
    },

    lesson1: {
      title: '디지털 장부',
      question: '블록체인이란 무엇일까요?',
      explanation:
        '블록체인은 기본적으로 **데이터를 기록하는 장부**입니다.\n엑셀이나 공책과 비슷하죠. 누가, 언제, 무엇을 했는지 기록합니다.',
      mission: '아래에 첫 번째 기록을 남겨보세요',
      placeholder: '예: 철수가 영희에게 10,000원을 보냈다',
      addRecord: '기록 추가',
      success: '훌륭해요! 첫 번째 기록이 저장되었습니다.',
      hint: '이것이 바로 "블록"입니다 — 데이터를 담는 상자예요.',
      blockLabel: '기록 #',
    },

    lesson2: {
      title: '체인으로 연결',
      question: '왜 "체인"이라고 부를까요?',
      explanation:
        '낱장 종이는 순서가 섞이거나 잃어버릴 수 있습니다.\n그래서 각 기록마다 **고유한 지문(해시)**을 만들고,\n다음 기록에 앞 기록의 지문을 포함시킵니다.',
      mission: '두 번째 기록을 추가해서 체인을 만들어보세요',
      hashExplanation: '해시 = 데이터의 고유한 지문',
      prevHashExplanation: '이전 해시 = 앞 블록과의 연결고리',
      connectionLabel: '연결됨!',
      success: '체인이 만들어졌습니다!',
      hint: '두 번째 블록의 "이전 해시"가 첫 번째 블록의 "해시"와 같은지 확인해보세요.',
    },

    lesson3: {
      title: '위변조 불가능',
      question: '과거 기록을 몰래 바꾸면 어떻게 될까요?',
      explanation:
        '체인의 마법은 여기서 발휘됩니다.\n과거의 내용을 고치면, 그 블록의 지문(해시)이 바뀌고,\n뒤따르는 모든 연결이 끊어집니다.',
      mission: '블록 #1의 내용을 수정해보세요',
      editButton: '수정',
      saveButton: '저장',
      cancelButton: '취소',
      warningTitle: '⚠️ 체인이 끊어졌습니다!',
      warningText:
        '데이터가 변경되자 해시가 바뀌었고,\n연결이 끊어졌습니다. 이것이 블록체인의 불변성입니다.',
      success: '이제 왜 블록체인이 안전한지 이해하셨죠?',
      hint: '빨간색으로 변한 연결선을 확인하세요.',
      tampered: '변조됨',
      original: '원본',
    },

    lesson4: {
      title: '분산과 합의',
      question: '혼자만 장부를 갖고 있으면 안 될까요?',
      explanation:
        '혼자만 장부를 갖고 있으면 몰래 조작할 수 있겠죠?\n그래서 전 세계 수많은 컴퓨터가 **똑같은 장부**를 나눠 갖습니다.\n이것을 "분산 원장"이라고 합니다.',
      mission: '당신의 체인이 네트워크에 복제되는 것을 확인하세요',
      nodeLabel: '노드',
      yourNode: '당신의 노드',
      networkNodes: '네트워크 노드들',
      synced: '동기화됨',
      consensus: '합의 완료',
      rejected: '거부됨',
      explanation2:
        '만약 한 노드의 데이터가 변조되면,\n다른 정상 노드들이 이를 감지하고 거부합니다.\n다수의 합의가 진실이 됩니다.',
      tryTamper: '노드 A의 데이터를 변조해보세요',
      success: '축하합니다! 블록체인의 핵심을 이해하셨습니다!',
    },

    completion: {
      title: '🎉 학습 완료!',
      summary: '블록체인의 핵심 개념',
      point1: '블록은 데이터를 담는 상자입니다',
      point2: '해시로 블록들이 체인처럼 연결됩니다',
      point3: '한 블록을 수정하면 뒤의 모든 연결이 끊어집니다',
      point4: '분산 저장으로 위변조를 방지합니다',
      restartButton: '다시 학습하기',
      nextSteps: '더 알아보기',
      advancedMode: '고급 시뮬레이터로 이동',
    },

    block: {
      genesis: '제네시스',
      block: '블록',
      hash: '해시',
      prevHash: '이전 해시',
      data: '데이터',
      timestamp: '시간',
    },
  },

  en: {
    title: 'Understanding Blockchain',
    subtitle: '4-Step Hands-on Tutorial',

    navigation: {
      previous: 'Previous',
      next: 'Next',
      start: 'Start',
      restart: 'Start Over',
      stepOf: 'Step',
    },

    lesson1: {
      title: 'The Digital Ledger',
      question: 'What is a blockchain?',
      explanation:
        'A blockchain is basically **a ledger that records data**.\nLike a spreadsheet or notebook. It records who, when, and what happened.',
      mission: 'Add your first record below',
      placeholder: 'e.g., Alice sent Bob $100',
      addRecord: 'Add Record',
      success: 'Great! Your first record has been saved.',
      hint: 'This is a "block" — a box that holds data.',
      blockLabel: 'Record #',
    },

    lesson2: {
      title: 'Linked by Chain',
      question: 'Why is it called a "chain"?',
      explanation:
        'Loose papers can get mixed up or lost.\nSo each record gets a **unique fingerprint (hash)**,\nand the next record includes the previous fingerprint.',
      mission: 'Add a second record to create a chain',
      hashExplanation: 'Hash = unique fingerprint of data',
      prevHashExplanation: 'Prev Hash = link to the previous block',
      connectionLabel: 'Connected!',
      success: 'Chain created!',
      hint: 'Check if Block #2\'s "Prev Hash" matches Block #1\'s "Hash".',
    },

    lesson3: {
      title: 'Tamper-Proof',
      question: 'What if someone secretly changes old records?',
      explanation:
        "This is where the chain's magic kicks in.\nIf you change past data, that block's fingerprint (hash) changes,\nand all following links break.",
      mission: "Try editing Block #1's content",
      editButton: 'Edit',
      saveButton: 'Save',
      cancelButton: 'Cancel',
      warningTitle: '⚠️ Chain Broken!',
      warningText:
        'The data changed, so the hash changed,\nbreaking the chain. This is blockchain immutability.',
      success: 'Now you understand why blockchain is secure!',
      hint: 'Notice the red broken links.',
      tampered: 'Tampered',
      original: 'Original',
    },

    lesson4: {
      title: 'Distribution & Consensus',
      question: 'What if only one person keeps the ledger?',
      explanation:
        'If only one person has the ledger, they could secretly change it.\nSo thousands of computers worldwide keep **identical copies**.\nThis is called a "distributed ledger".',
      mission: 'Watch your chain replicate across the network',
      nodeLabel: 'Node',
      yourNode: 'Your Node',
      networkNodes: 'Network Nodes',
      synced: 'Synced',
      consensus: 'Consensus Reached',
      rejected: 'Rejected',
      explanation2:
        "If one node's data is tampered,\nother honest nodes detect and reject it.\nThe majority's consensus becomes truth.",
      tryTamper: "Try tampering Node A's data",
      success: "Congratulations! You've mastered blockchain basics!",
    },

    completion: {
      title: '🎉 Learning Complete!',
      summary: 'Core Blockchain Concepts',
      point1: 'Blocks are containers for data',
      point2: 'Hashes link blocks together like a chain',
      point3: 'Changing one block breaks all following links',
      point4: 'Distributed storage prevents tampering',
      restartButton: 'Learn Again',
      nextSteps: 'Learn More',
      advancedMode: 'Go to Advanced Simulator',
    },

    block: {
      genesis: 'Genesis',
      block: 'Block',
      hash: 'Hash',
      prevHash: 'Prev Hash',
      data: 'Data',
      timestamp: 'Time',
    },
  },
} as const;

export type TranslationsKo = (typeof translations)['ko'];
export type TranslationsEn = (typeof translations)['en'];
export type Translations = TranslationsKo | TranslationsEn;

export function getTranslations(
  locale: string,
): TranslationsKo | TranslationsEn {
  return locale === 'en' ? translations.en : translations.ko;
}
