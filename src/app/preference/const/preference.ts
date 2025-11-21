export interface Link {
  title: string;
  link: string;
}

export interface InterestItem {
  title: string;
  link?: string;
  linkText?: string;
}

export interface Book {
  title: string;
  author: string;
  link: string;
}

export const CONCERTS: Link[] = [
  {
    title: '백예린 2025 단독 콘서트 〈Flash and Core〉',
    link: 'https://tickets.interpark.com/goods/25013780',
  },
  {
    title: '2024 Wave to Earth 단독공연 [play with earth! Seoul]',
    link: 'https://tickets.interpark.com/goods/24015393',
  },
  {
    title: 'THE VOLUNTEERS ASIA TOUR 2024 - SEOUL',
    link: 'https://tickets.interpark.com/goods/24010553',
  },
  {
    title: "Noel Gallagher's High Flying Birds",
    link: 'https://tickets.interpark.com/goods/24003561',
  },
  {
    title: "한로로 2nd EP 발매기념 단독콘서트 '집'",
    link: 'https://ticket.melon.com/performance/index.htm?prodId=209915',
  },
  {
    title: '2024 실리카겔 단독공연 〈Syn.THE.Size Ⅲ〉',
    link: 'https://tickets.interpark.com/goods/24004957',
  },
  {
    title: '2024 윤하 20주년 기념 콘서트 〈스물〉',
    link: 'https://tickets.interpark.com/goods/23018640',
  },
  {
    title: "10CM WINTER CONCERT '9+1'",
    link: 'https://tickets.interpark.com/goods/23015862',
  },
  {
    title: '2023 검정치마 연말공연 [201 DAYS OF HOLIDAY]',
    link: 'https://ticket.yes24.com/Perf/47823',
  },
  {
    title: "한로로 1st 단독콘서트 '이상비행'",
    link: 'https://ticket.melon.com/performance/index.htm?prodId=208666',
  },
];

export const INTERESTS: InterestItem[] = [
  {
    title: 'Chess',
    link: 'https://www.chess.com/member/wookhyungx',
    linkText: '(Chess.com)',
  },
  {
    title: 'Electric Guitar',
  },
];

export const BOOKS_BY_YEAR: Record<number, Book[]> = {
  2025: [
    {
      title: '결혼ㆍ여름',
      author: '알베르 카뮈',
      link: 'https://product.kyobobook.co.kr/detail/S000203197818',
    },
    {
      title: '동물 농장',
      author: '조지 오웰',
      link: 'https://product.kyobobook.co.kr/detail/S000000620142',
    },
    {
      title: '어떤 비밀',
      author: '최진영',
      link: 'https://product.kyobobook.co.kr/detail/S000214526764',
    },
    {
      title: '미키 7',
      author: '에드워드 애슈턴',
      link: 'https://product.kyobobook.co.kr/detail/S000061532777',
    },
  ],
  2024: [
    {
      title: '지구 끝의 온실',
      author: '김초엽',
      link: 'https://product.kyobobook.co.kr/detail/S000001953324',
    },
    {
      title: '이중 하나는 거짓말',
      author: '김애란',
      link: 'https://product.kyobobook.co.kr/detail/S000214032055',
    },
    {
      title: '쓰게 될 것',
      author: '최진영',
      link: 'https://product.kyobobook.co.kr/detail/S000213546473',
    },
    {
      title: '급류',
      author: '정대건',
      link: 'https://product.kyobobook.co.kr/detail/S000200550189',
    },
    {
      title: '밝은 밤',
      author: '최은영',
      link: 'https://product.kyobobook.co.kr/detail/S000000781066',
    },
    {
      title: '백의 그림자',
      author: '황정은',
      link: 'https://product.kyobobook.co.kr/detail/S000000610837',
    },
    {
      title: '원도',
      author: '최진영',
      link: 'https://product.kyobobook.co.kr/detail/S000212754943',
    },
    {
      title: '참을 수 없는 존재의 가벼움',
      author: '밀란 쿤데라',
      link: 'https://product.kyobobook.co.kr/detail/S000000619722',
    },
    {
      title: '모순',
      author: '양귀자',
      link: 'https://product.kyobobook.co.kr/detail/S000001632467',
    },
    {
      title: '홍학의 자리',
      author: '정해연',
      link: 'https://product.kyobobook.co.kr/detail/S000000781065',
    },
    {
      title: '눈부신 안부',
      author: '백수린',
      link: 'https://product.kyobobook.co.kr/detail/S000202230179',
    },
    {
      title: '이방인',
      author: '알베르 카뮈',
      link: 'https://product.kyobobook.co.kr/detail/S000000619973',
    },
    {
      title: '천 개의 파랑',
      author: '천선란',
      link: 'https://product.kyobobook.co.kr/detail/S000001935255',
    },
    {
      title: '살인자의 기억법',
      author: '김영하',
      link: 'https://product.kyobobook.co.kr/detail/S000001982913',
    },
    {
      title: '1984',
      author: '조지 오웰',
      link: 'https://product.kyobobook.co.kr/detail/S000000620214',
    },
    {
      title: '해가 지는 곳으로',
      author: '최진영',
      link: 'https://product.kyobobook.co.kr/detail/S000000620599',
    },
    {
      title: '종의 기원',
      author: '정유정',
      link: 'https://product.kyobobook.co.kr/detail/S000000828491',
    },
  ],
  2023: [
    {
      title: '칵테일, 러브, 좀비',
      author: '조예은',
      link: 'https://product.kyobobook.co.kr/detail/S000001936854',
    },
    {
      title: '단 한 사람',
      author: '최진영',
      link: 'https://product.kyobobook.co.kr/detail/S000209209050',
    },
    {
      title: '미드나잇 라이브러리',
      author: '매트 헤이그',
      link: 'https://product.kyobobook.co.kr/detail/S000001947560',
    },
    {
      title: '아주 희미한 빛으로도',
      author: '최은영',
      link: 'https://product.kyobobook.co.kr/detail/S000203331812',
    },
    {
      title: '인간 실격',
      author: '다자이 오사무',
      link: 'https://product.kyobobook.co.kr/detail/S000000620240',
    },
    {
      title: '구의 증명',
      author: '최진영',
      link: 'https://product.kyobobook.co.kr/detail/S000201621499',
    },
    {
      title: '애쓰지 않아도',
      author: '최은영',
      link: 'https://product.kyobobook.co.kr/detail/S000000939081',
    },
    {
      title: '쇼코의 미소',
      author: '최은영',
      link: 'https://product.kyobobook.co.kr/detail/S000000779649',
    },
    {
      title: '내게 무해한 사람',
      author: '최은영',
      link: 'https://product.kyobobook.co.kr/detail/S000000780120',
    },
  ],
};

export const MOVIES = {
  2025: [
    {
      title: '명탐정 코난: 척안의 잔상',
      director: '시게하라 카츠야',
    },
    {
      title: '그을린 사랑',
      director: '드니 빌뇌브',
    },
    {
      title: '미션 임파서블: 파이널 레코닝',
      director: '크리스토퍼 맥쿼리',
    },
    {
      title: '콘클라베',
      director: '에드워드 버거',
    },
    {
      title: '미키 17',
      director: '봉준호',
    },
    {
      title: '말할 수 없는 비밀',
      director: '서유민',
    },
    {
      title: '러브레터',
      director: '이와이 슌지',
    },
    {
      title: '더 폴: 디렉터스 컷',
      director: '타셈 싱',
    },
  ],
  2024: [
    {
      title: '중경삼림',
      director: '왕가위',
    },
    {
      title: '조커2',
      director: '토드 필립스',
    },
    {
      title: '와일드 로봇',
      director: '크리스 샌더스',
    },
    {
      title: '보통의 가족',
      director: '허진호',
    },
    {
      title: '혐오스런 마츠코의 일생',
      director: '나카시마 테츠야',
    },
    {
      title: '로봇 드림',
      director: '파블로 베르헤르',
    },
    {
      title: '모노노케 히메',
      director: '미야자키 하야오',
    },
    {
      title: '장손',
      director: '오정민',
    },
    {
      title: '소년 시절의 너',
      director: '증국상',
    },
    {
      title: '룩백',
      director: '오시야마 키요타카',
    },
    {
      title: '아메리칸 셰프',
      director: '존 파브로',
    },
    {
      title: '친절한 금자씨',
      director: '박찬욱',
    },
    {
      title: '조제, 호랑이 그리고 물고기들',
      director: '이누도 잇신',
    },
    {
      title: '에일리언: 로물루스',
      director: '페데 알바레즈',
    },
    {
      title: '파일럿',
      director: '김한결',
    },
    {
      title: '퍼펙트 데이즈',
      director: '빔 벤더스',
    },
    {
      title: '데드풀과 울버린',
      director: '숀 리비',
    },
    {
      title: '탈주',
      director: '이종필',
    },
    {
      title: '하이재킹',
      director: '김성한',
    },
    {
      title: '인사이드 아웃 2',
      director: '켈시 맨',
    },
    {
      title: '존 오브 인터레스트',
      director: '조나단 글래이저',
    },
    {
      title: '퓨리오사: 매드맥스 사가',
      director: '조지 밀러',
    },
    {
      title: '악마와의 토크쇼',
      director: '캐머런 카이네스',
    },
    {
      title: '리멤버',
      director: '이일형',
    },
    {
      title: '봄날은 간다',
      director: '허진호',
    },
    {
      title: '댓글부대',
      director: '안국진',
    },
    {
      title: '악은 존재하지 않는다',
      director: '하마구치 류스케',
    },
    {
      title: '범죄도시4',
      director: '허명행',
    },
    {
      title: '파묘',
      director: '장재현',
    },
    {
      title: '비긴 어게인',
      director: '존 카니',
    },
    {
      title: '듄: 파트2',
      director: '드니 빌뇌브',
    },
    {
      title: '조 블랙의 사랑',
      director: '마틴 브레스트',
    },
    {
      title: '괴물',
      director: '고레에다 히로카즈',
    },
  ],
} as const;
