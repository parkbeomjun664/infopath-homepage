/**
 * 국문 메시지 — 사이트 문구의 원본(source of truth)
 *
 * 규칙
 *  - 컴포넌트에 텍스트를 하드코딩하지 않습니다. 모든 노출 문구는 여기에 있습니다.
 *  - en.ts는 이 파일의 구조를 그대로 따릅니다(타입으로 강제).
 *  - [초안] 표기가 붙은 문구는 회사 확인 전 임시 카피입니다.
 */

const ko = {
  meta: {
    siteName: 'INFOPATH',
    titleDefault: 'INFOPATH — 스마트팩토리 MES 구축',
    titleTemplate: '%s | INFOPATH',
    description:
      '검증된 MES 플랫폼 INFOLINK로 스마트팩토리 도입 부담을 낮춥니다. 수주부터 마감까지 8단계 전 공정을 데이터로 연결합니다.',
  },

  nav: {
    home: '홈',
    infolink: 'INFOLINK',
    about: '회사소개',
    contact: '문의',
    privacy: '개인정보처리방침',
    menu: '메뉴',
    close: '닫기',
    language: '언어 선택',
    skipToContent: '본문으로 건너뛰기',
  },

  common: {
    inquire: '도입 문의',
    learnMore: '자세히 보기',
    viewSolution: 'INFOLINK 보기',
    goHome: '홈으로',
    required: '필수',
    optional: '선택',
  },

  /**
   * S1 — 히어로
   * 3개 안을 모두 보유하고 content/site.ts의 heroVariant 플래그로 전환합니다.
   * 영문 서브 슬로건은 3개 안 공통으로 사용합니다.
   */
  hero: {
    sloganEn: 'Start Small, Run Smart',
    /** 제품 화면 캡처가 들어왔을 때 쓰는 대체 텍스트 (site.ts · PRODUCT_SHOT) */
    productShotAlt: 'INFOLINK 화면 — 실제 운영 화면 캡처',

    /**
     * 슬라이드 3장.
     * primary는 카피를 아래 variants[HERO_VARIANT]에서 가져오므로 alt만 둡니다.
     * headline의 \n은 줄바꿈 지점이고, highlight는 그 줄 전체와 일치해야
     * 언더라인이 문장 전체에 걸립니다.
     */
    slides: {
      primary: {
        alt: '흰색 전시 공간에 놓인 산업용 로봇 팔',
      },
      layered: {
        headline: '전부 바꿀 필요 없습니다\n급한 곳부터 시작합니다',
        highlight: '급한 곳부터 시작합니다',
        sub: '생산실적 · 품질 · 재고 중 지금 가장 급한 곳을 먼저 넣고, 운영하면서 넓힙니다',
        alt: '데이터가 흘러드는 반투명 패널이 층층이 쌓인 3D 렌더 이미지',
      },
      connect: {
        headline: '수주부터 마감까지\n끊기지 않고 이어집니다',
        highlight: '끊기지 않고 이어집니다',
        sub: '앞 단계가 끝나야 뒤 단계가 열립니다. 그 제약이 곧 품질 통제입니다',
        alt: '컨베이어가 이어진 생산 라인 전경',
      },
    },
    /**
     * headline의 줄바꿈(\n)은 렌더링 시 행 단위로 나뉘어 순차 등장합니다.
     * highlight는 headline 안에 그대로 들어 있는 문자열이어야 합니다 —
     * 그 부분만 늦게 나타나고 초록 언더라인이 그려집니다.
     */
    variants: {
      a: {
        headline: 'MES 도입에 필요한 건\n예산이 아니라 순서입니다',
        highlight: '예산이 아니라 순서입니다',
        sub: '이미 검증된 플랫폼 위에서, 지금 필요한 것부터 시작합니다',
      },
    },
    ctaPrimary: '도입 문의하기',
    ctaSecondary: 'INFOLINK 살펴보기',
    slideNav: '히어로 슬라이드 선택',
    scrollHint: '아래로 스크롤',
  },

  /**
   * S2 — Challenge : MES 도입의 3가지 벽
   * 회사 자랑이 아니라 방문자가 실제로 겪는 장벽에서 출발합니다.
   */
  /**
   * 숫자 띠 — 히어로 직후
   *
   * 캡션이 핵심입니다. 이 숫자가 「회사가 이미 가진 것」임을 밝혀야
   * 스크롤하기 전에 백지에서 시작하지 않는다는 주장이 증명됩니다.
   * 값은 코드·DB로 확인된 것만 씁니다.
   */
  statsBand: {
    /* 숫자보다 먼저 읽혀야 하는 한 줄. 무엇의 숫자인지를 여기서 정합니다. */
    caption: '인포패스가 이미 가지고 있는 것',
    captionSub: '자체 MES 플랫폼 INFOLINK 기준',
    items: [
      { id: 'flow', value: '8단계', name: '수주부터 마감까지 전 공정' },
      { id: 'modules', value: '11개', name: '업무 모듈' },
      { id: 'screens', value: '128종', name: '업무 화면' },
    ],
  },



  /**
   * S3 — 텍스트·이미지 좌우 교차 블록
   * 좌우 배치와 이미지는 컴포넌트가 결정하고, 여기에는 문구만 둡니다.
   */
  /**
   * 도입의 벽과 그 답 — 한 섹션
   *
   * 전에는 challenge(문제 3개)와 why(답 4개)가 따로 있어 짝이 맞지 않았습니다.
   * 「비용의 벽」이 답변에 두 번 나왔고, 읽는 사람은 두 섹션을 오가며 대응을 스스로 맞춰야 했습니다.
   * 카드 하나에 문제와 답을 위아래로 붙여 3:3으로 맞췄습니다.
   * (운영 부담은 구축비와 같은 「비용」이므로 01번 답변에 흡수했습니다)
   *
   * 제목의 주어는 제품이 아니라 회사입니다.
   */
  approach: {
    label: 'WHY INFOPATH',
    heading: 'INFOPATH가 다른 이유',
    lead: '스마트팩토리가 필요하다는 건 이미 알고 계십니다. 문제는 늘 그다음에서 막힙니다. 자체 MES 플랫폼을 가지고 있다는 점이 그 지점을 바꿉니다.',
    items: [
      {
        id: 'cost',
        no: '01',
        wall: '비용의 벽',
        problem: '견적을 받아보면 예산 밖입니다',
        problemBody: '지금 당장 필요한 건 일부인데, 전부 새로 만드는 값을 치러야 합니다.',
        answer: '필요한 만큼만 값을 치릅니다',
        answerBody: '8단계 전 공정이 이미 구현된 플랫폼 위에서 시작하므로 요구사항 정의와 개발을 처음부터 반복하지 않습니다. 급한 모듈 하나로 시작하면 그만큼만 듭니다.',
      },
      {
        id: 'time',
        no: '02',
        wall: '시간의 벽',
        problem: '도입에 1년, 그사이 현장은 그대로입니다',
        problemBody: '요구사항 정의부터 검증까지 기다리는 동안 개선은 멈춰 있습니다.',
        answer: '기다리지 않고 먼저 씁니다',
        answerBody: '전 공정을 한 번에 덮지 않습니다. 급한 모듈 하나를 먼저 넣어 운영을 시작하고, 쓰면서 다음 모듈로 넓힙니다.',
      },
      {
        id: 'fit',
        no: '03',
        wall: '맞춤의 벽',
        problem: '우리 공정에 맞추려면 처음부터 다시 만들어야 한다고 합니다',
        problemBody: '공정은 회사마다 다릅니다. 그런데 표준 패키지는 그 차이를 담지 못합니다.',
        answer: '화면에서 설정합니다. 개발이 아닙니다',
        answerBody: '품목 · BOM · 검사기준 · 창고 · 권한을 화면에서 등록해 맞춥니다. 코드를 다시 쓰지 않으므로, 공정이 바뀌어도 개발 일정을 기다리지 않습니다.',
      },
    ],
  },

  /**
   * 구축 방식 — 실제 단계는 content/site.ts의 BUILD_STEPS에 있습니다.
   * 여기에는 라벨만 둡니다.
   */
  buildProcess: {
    label: 'HOW WE WORK',
    heading: '어떻게 진행되나요',
    lead: '계약부터 운영까지 어떤 순서로 진행하는지, 그리고 각 단계에서 누가 무엇을 하는지 적었습니다.',
    owner: {
      infopath: '인포패스',
      together: '함께',
      client: '고객사',
    },
    note: '※ 시작 범위와 현장 여건에 따라 단계가 달라질 수 있습니다. 현황을 알려주시면 맞춰 정리해 드립니다.',
  },

  solutionFeature: {
    label: 'HOW IT WORKS',
    heading: '기록에서 관리까지',
    lead: '현장에서 입력된 값이 그대로 관리 화면이 됩니다. 옮겨 적거나 다시 집계하지 않습니다.',
    /** 섹션 도입부 가로 흐름 다이어그램 — 라벨이 실제로 읽히는 콘텐츠라 여기에 둡니다 */
    flow: {
      title: '현장에서 대시보드까지, 데이터가 흐르는 경로',
      desc: '현장에서 입력된 실적과 검사 결과가 하나로 모여 MES를 거치고, 다시 여러 화면으로 나뉘어 전달됩니다.',
      equipment: '현장',
      collect: '기록',
      mes: 'MES',
      dashboard: '대시보드',
    },
    collect: {
      label: 'DATA COLLECTION',
      title: '발생한 자리에서 기록',
      body: '실적 · 검사 · 입출고를 발생한 자리에서 기록합니다. 현장 단말(POP)에서 작업자가 직접 입력하고, 입력된 값은 공정별로 정리되어 그다음 단계의 입력이 됩니다.',
      link: '기록 방식 자세히 보기',
      imageAlt: '컨베이어가 이어진 생산 라인 전경',
    },
    monitor: {
      label: 'MONITORING',
      title: '생산관리 · 모니터링',
      body: '생산 실적, 불량률, 재고 현황을 한 화면에서 봅니다. 현장 단말부터 경영 대시보드까지 같은 데이터를 보기 때문에, 숫자를 다시 맞추는 회의가 사라집니다.',
      link: '관리 기능 자세히 보기',
      imageAlt: '지표와 추이 그래프가 표시된 대시보드 화면',
    },
  },

  /**
   * 아키텍처 — 회사 제공 다이어그램 3종
   * 이미지만 두면 검색엔진과 스크린리더가 읽을 수 없으므로,
   * 다이어그램에 실제로 그려진 내용을 텍스트로도 함께 싣습니다.
   */
  architecture: {
    label: 'ARCHITECTURE',
    heading: 'INFOLINK 플랫폼 구조',
    lead: '사용자 화면부터 데이터 계층까지 층으로 나눈 구조입니다. 어디까지가 현재 구현인지 아래에 밝혔습니다.',
    /* 도면은 지향하는 전체 구조입니다. 현재 구현과 다른 부분을 먼저 밝히고 시작합니다. */
    note: '※ 위 구조도는 INFOLINK가 지향하는 전체 구조입니다. 현재 구현은 PostgreSQL 기반 운영 DB와 FastAPI 서비스 계층을 중심으로 하며, 시계열 · 분석 저장소와 컨테이너 기반 배포는 아직 포함되어 있지 않습니다.',
    zoom: '크게 보기',
    zoomHint: '확대',
    close: '닫기',
    openOriginal: '원본 이미지 새 탭으로 열기',
    scrollHint: '좌우로 밀어서 볼 수 있습니다',
    views: {
      solution: {
        tab: '솔루션',
        title: '솔루션 아키텍처',
        caption: '데이터 기반의 통합 제조 운영 플랫폼',
        alt: 'INFOLINK 목표 구조도(To-Be) — 사용자 · 채널, 업무 모듈, 분석 지원, 데이터, 인프라, 외부 시스템 연계 계층으로 나뉜 제조 운영 플랫폼 구조도',
      },
    },
    more: '구조 자세히 보기',
    layersHeading: '계층 구성 (목표 구조 기준)',
    layers: [
      {
        id: 'channel',
        name: '사용자 · 채널',
        body: '경영진 · 관리자 · 현장관리자 · 작업자 · 품질담당자 · 협력사 · 고객이 각자의 화면으로 접근합니다. Web, Mobile App, 현장 PDA/스캐너, 대시보드를 지원합니다.',
      },
      {
        id: 'app',
        name: '플랫폼 · 서비스 레이어',
        body: '영업/수주 · 생산계획 · 구매/자재 · 생산실행(WIP) · 품질관리 · 설비관리 · 출하/물류 · 추적/분석 8개 모듈. 워크플로우, 결재, 알림, 권한, 감사로그, 다국어는 공통 기능으로 제공되고, API Gateway와 마스터 데이터 서비스가 그 아래를 받칩니다.',
      },
      {
        id: 'ai',
        name: '분석 지원',
        body: '품질 이상 분석, 설비 · 재고 · 계획 등 영역별 분석 화면, 분석 결과 문서 출력(Excel · Word · PDF), 분석 이력 감사 기록. 조회 · 분석 전용이며 자동 조치를 하지 않습니다.',
      },
      {
        id: 'data',
        name: '데이터 레이어',
        body: '운영 DB(PostgreSQL) · 시계열 DB(InfluxDB) · 데이터 웨어하우스(DuckDB) · 파일 스토리지(MinIO/NAS/S3)를 목적별로 나누고, 실시간(Stream)·배치(Batch) 수집 파이프라인으로 연결합니다.',
      },
      {
        id: 'infra',
        name: '인프라',
        body: 'On-Premise와 Private Cloud 모두 지원합니다. Docker/Kubernetes 기반 배포, Prometheus·Grafana·ELK 모니터링, 백업/DR, 방화벽·SSL·VPN 보안.',
      },
      {
        id: 'integration',
        name: '외부 시스템 연계',
        body: 'ERP(회계·구매·인사) · PLM(설계·BOM) · SCM(공급망) · 고객사 시스템(EDI)과 연결됩니다.',
      },
    ],
    valuesHeading: '이 구조가 만드는 것',
    values: [
      { id: 'visibility', name: '같은 데이터', body: '현장 단말과 경영 대시보드가 같은 원본을 읽습니다' },
      { id: 'decision', name: '남는 근거', body: '집계와 이력이 남아 판단의 근거가 됩니다' },
      { id: 'efficiency', name: '정해진 순서', body: '앞 단계가 끝나야 뒤 단계가 열립니다' },
      { id: 'quality', name: '흔들리지 않는 판정', body: '등록된 검사기준으로 판정하고 이력을 남깁니다' },
      { id: 'scalability', name: '단계적 확장', body: '모듈 단위로 도입하고 필요할 때 넓힙니다' },
    ],
  },



  /**
   * 기술 사양
   * 삼성SDS가 OS·DB·미들웨어 호환성 표를 싣는 것을 참고했습니다.
   * 실적 자료 없이도 "제품이 실제로 존재한다"를 보여주는 장치입니다.
   * 값은 회사에서 받은 아키텍처 도면에 실제로 그려진 것만 옮겼습니다.
   */
  spec: {
    label: 'SPECIFICATIONS',
    heading: '기술 구성',
    lead: '도입 검토 시 전산 담당자가 가장 먼저 확인하는 항목입니다. 현재 구현된 구성만 적었습니다.',
    groups: [
      { id: 'backend', name: '서버', items: ['Python 3.12', 'FastAPI', 'uvicorn'] },
      { id: 'database', name: '데이터베이스', items: ['PostgreSQL 17', 'psycopg3'] },
      { id: 'frontend', name: '화면', items: ['HTML + Alpine.js', '별도 빌드 과정 없음'] },
      {
        id: 'auth',
        name: '인증 · 권한',
        items: ['JWT 토큰', '역할 기반 권한(RBAC)', '요청 단위 권한 검증'],
      },
      { id: 'docs', name: '문서 출력', items: ['Excel', 'Word', 'PDF'] },
      { id: 'api', name: 'API', items: ['REST — 전 기능 제공'] },
      { id: 'deploy', name: '배포 환경', items: ['On-Premise', 'Private Cloud'] },
    ],
    /* 메인용 축약 — 전산 담당자가 첫 화면에서 확인하는 네 가지만 남깁니다. */
    summary: [
      'PostgreSQL 하나로 운영',
      '프론트엔드 빌드 과정 없음',
      'REST API 전 기능 제공',
      'On-Premise · Private Cloud',
    ],
    more: '기술 구성 자세히 보기',
    note: '※ 현재 구현된 구성입니다. 실제 적용 범위는 현장 여건에 따라 달라집니다.',
  },

  /**
   * 자주 묻는 질문
   * LG CNS가 솔루션마다 FAQ를 붙이는 구조를 참고했습니다.
   * 우리 포지셔닝(도입 장벽 낮추기)과 맞아 실적 자료 없이도 신뢰를 만들 수 있습니다.
   *
   * ⚠️ 답변은 확인 전 초안입니다. 회사 확인 후 확정해야 합니다 (자료요청 2-5).
   */
  /**
   * 고객사 로고 띠 — 실제 로고는 content/site.ts의 CLIENT_LOGOS에 있습니다.
   * 여기에는 제목만 둡니다.
   */
  clients: {
    /* 사진 모드 — 사진은 삽화이고, 사실은 이 업종 문구가 담습니다 */
    heading: '우리가 일해 온 분야',
    lead: '광학필름 · 케미칼 · 자동차 부품 · 전자 부품 · LCD 부품',
    /* 로고 모드 — 서면 동의를 받은 고객사 로고가 들어왔을 때 */
    logoHeading: '함께한 기업',
    logoLead: '제조 현장의 MES를 맡아 구축하고 운영해 왔습니다.',
  },

  faq: {
    label: 'FAQ',
    heading: '자주 묻는 질문',
    lead: '도입을 검토하며 가장 많이 받는 질문들입니다.',
    items: [
      {
        id: 'legacy',
        q: '기존 설비와 연동할 수 있나요?',
        a: '현재는 REST API를 통한 연계를 제공합니다. ERP · 회계 시스템, 바코드 · 라벨 장비, 자체 수집 프로그램 등 API를 호출할 수 있는 시스템과는 데이터를 주고받을 수 있습니다. 설비 프로토콜(OPC UA 등) 직접 연동은 설비 구성에 따라 방식이 크게 달라지므로 개별 협의로 진행합니다. 많은 현장이 설비 연동보다 자재 · 품질 · 재고 기록을 먼저 정리하는 것에서 더 큰 효과를 봅니다. 설비 데이터는 그다음 단계로도 늦지 않습니다.',
      },
      {
        id: 'scope',
        q: '어디서부터 시작할 수 있나요?',
        a: '전 공정을 한 번에 덮지 않아도 됩니다. 생산실적 · 설비 · 품질 중 지금 가장 급한 한 곳부터 시작하고, 운영하면서 다음 모듈로 넓히는 방식을 권합니다. 검증된 플랫폼 위에서 시작하므로 처음부터 새로 만드는 것보다 훨씬 작은 단위로 착수할 수 있습니다.',
      },
      {
        id: 'erp',
        q: 'ERP를 이미 쓰고 있는데 중복 아닌가요?',
        a: '역할이 다릅니다. ERP는 수주 · 자재 · 회계 같은 경영 정보를 다루고, MES는 현장에서 실제로 무엇이 언제 얼마나 만들어졌는지를 다룹니다. INFOLINK는 ERP를 대체하지 않습니다. 생산 실적과 재고 정보를 REST API로 제공하므로, ERP 쪽에서 받아가도록 연계하면 같은 내용을 두 번 입력할 일이 줄어듭니다.',
      },
      {
        id: 'data',
        q: '데이터는 어디에 저장되나요?',
        a: '자사 서버(On-Premise)와 Private Cloud 모두 지원합니다. 공정 데이터를 외부에 두기 어려운 경우 사내 서버에 설치해 운영할 수 있습니다. 어느 쪽이든 접근 권한 관리와 감사 로그가 기본으로 들어갑니다.',
      },
      {
        id: 'support',
        q: '구축 후 유지보수는 어떻게 되나요?',
        a: '구축으로 끝나지 않습니다. 운영 중 발생하는 문의 대응과 시스템 점검을 이어가며, 공정이나 제품이 바뀔 때 설정 수준에서 맞출 수 있도록 설계되어 있습니다. 구체적인 지원 범위와 조건은 문의 주시면 안내해 드립니다.',
      },
    ],
    ctaText: '더 궁금한 점이 있으신가요?',
    ctaLink: '직접 문의하기',
  },



  /** S8 — CTA */
  cta: {
    heading: '우리 공장에는 무엇이 필요할까요?',
    body: '무엇을 만드는지, 지금 무엇으로 관리하시는지만 알려주세요. 3일 안에 적용 가능한 범위를 정리해 회신드립니다. (주말 · 공휴일 제외)',
    button: '도입 문의하기',
    /* 대표전화(COMPANY.tel)가 확보되면 자동으로 나타납니다 */
    phoneButton: '전화 상담',
    mailLabel: '이메일로 문의',
  },

  about: {
    label: 'ABOUT',
    heading: '검증된 플랫폼 위에서,\n제조 현장의 도입 장벽을 낮춥니다',
    imageAlt: '흰색 전시 공간에 놓인 산업용 로봇 팔',
    platformLabel: '플랫폼',
    ceo: {
      label: 'LEADERSHIP',
      whyLabel: '왜 만들었나',
    },
    bizHeading: '사업자 정보',
    domainLabel: '도메인',
    lead: '인포패스는 제조 현장의 실행 시스템을 만듭니다. 자체 MES 플랫폼 INFOLINK를 보유하고 있어 백지에서 시작하지 않고, 그 위에서 현장에 맞춰 구축합니다.',

    /**
     * 숫자 띠 — 메인의 statsBand와 같은 장치입니다.
     * 값은 회사소개서 III장(조직 및 인력 구성)에서만 가져옵니다.
     *   전문 인력 10명 / 특급 2 + 고급 5 = 7명 / 수행 업종 5개
     * ⚠ 근거 없는 수치는 넣지 않습니다. 이 업계는 문의 단계에서 바로 검증됩니다.
     */
    stats: {
      caption: '회사 개요',
      items: [
        {
          id: 'founded',
          value: '2022',
          unit: '년',
          name: '설립',
        },
        {
          id: 'people',
          value: '10',
          unit: '명',
          name: '전문 인력',
        },
        {
          id: 'fields',
          value: '5',
          unit: '개',
          name: '수행 업종',
        },
      ],
    },

    /** 회사 소개 본문 — 회사소개서 I장(회사개요) */
    story: {
      label: 'COMPANY',
      heading: '구축에서 끝내지 않습니다',
      body: '인포패스는 제조 기업에 MES 솔루션과 서비스를 제공하는 전문기업입니다.\n시스템을 넘기고 떠나는 대신 운영과 유지보수까지 이어가며, 고객의 전략적 동반자로 함께 성장하는 것을 목표로 합니다.',

      /* 회사소개서 II장의 네 단계. 순서가 실제 진행 순서라 번호를 붙입니다. */
      servicesLabel: '사업분야',
      services: [
        'MES 솔루션 공급',
        '스마트팩토리 컨설팅',
        '시스템 구축',
        '운영 관리',
      ],
    },

    /**
     * 수행 실적 — 출처: INFOPATH 회사소개서(2025.04) IV장
     *
     * ⚠ 고객사명과 공장 소재지는 넣지 않습니다. 서면 공개 동의를 받지 못했고,
     *   업종에 지역이 붙으면 사실상 특정됩니다.
     * ⚠ 「30% 개선」 같은 수치는 회사소개서에 근거가 없어 쓰지 않았습니다.
     *   측정하지 않은 값을 적으면 문의 단계에서 바로 검증됩니다.
     */
    record: {
      heading: '수행 실적',
      lead: 'INFOLINK 이전부터 제조 현장의 MES를 구축하고 운영해 왔습니다.',
      fieldLabel: '업종',
      items: [
        {
          id: 'ops',
          field: '광학필름 · 케미칼',
          title: 'MES 운영 서비스',
          body: '생산라인 MES의 운영과 기능 개발을 맡아 수행했습니다.',
        },
        {
          id: 'overseas-build',
          field: 'LCD 부품',
          title: '해외 생산라인 MES 구축 참여',
          body: '해외 공장 세 곳의 생산관리 MES 구축 프로젝트에 참여했습니다.',
        },
        {
          id: 'overseas-maint',
          field: 'LCD 부품',
          title: '생산관리 MES 유지보수',
          body: '해외 법인의 MES 운영을 지원했습니다.',
        },
        {
          id: 'plant-maint',
          field: '광학필름 · 케미칼',
          title: '공장 MES 유지보수',
          body: 'TD · MD 라인 MES의 운영 관리와 개발을 담당했습니다.',
        },
        {
          id: 'web',
          field: '광학필름 · 케미칼',
          title: '웹 시스템 유지보수',
          body: '그룹웨어와 사내 포털 시스템의 운영 · 관리를 수행했습니다.',
        },
        {
          id: 'ai-quality',
          field: '케미칼',
          title: '품질 AI 솔루션 구축',
          body: 'AI 기반 품질데이터 분석 시스템을 구축했습니다.',
        },
      ],
    },
  },

  contact: {
    label: 'CONTACT',
    heading: '도입 문의',
    lead: '공정 현황과 고민을 남겨주시면 담당자가 확인 후 회신드립니다.',
    /** ⚠ 실제 회신 기준 확인 후 확정 — 이 한 줄만 바꾸면 폼 상단과 완료 화면에 함께 반영됩니다. */
    responseNote: '보내주시면 3일 안에 회신드립니다. (주말 · 공휴일 제외)',
    /* 폼 옆 안내 — 「뭘 써야 할지 몰라서」가 문의를 멈추는 가장 큰 이유입니다 */
    channelHeading: '바로 연락',
    flow: {
      heading: '보내신 뒤',
      steps: [
        { id: 'receive', title: '접수', body: '담당자 메일로 바로 전달됩니다.' },
        { id: 'review', title: '검토', body: '적어주신 공정과 범위를 확인합니다.' },
        {
          id: 'reply',
          title: '회신',
          body: '남겨주신 이메일로 답을 드립니다. 접수 확인 메일은 따로 가지 않습니다.',
        },
      ],
    },
    phoneLabel: '전화 문의',
    form: {
      /* 입력란을 클릭하면 라벨 줄 오른쪽에 뜹니다. 빈 값은 그리지 않습니다. */
      hints: {
        name: '',
        company: '',
        position: '',
        phone: '연락 가능한 번호',
        email: '회신받으실 주소',
        inquiryType: '가장 가까운 것으로',
        message: '제품 · 공정 수 · 지금 관리 방식 · 먼저 해결하고 싶은 것',
      },
      name: '성명',
      company: '회사명',
      position: '직책',
      phone: '연락처',
      email: '이메일',
      inquiryType: '문의 유형',
      message: '문의 내용',
      messagePlaceholder:
        '현재 공정 현황, 도입을 검토 중인 범위, 희망 일정 등을 자유롭게 적어주세요. (10자 이상)',
      phonePlaceholder: '010-0000-0000',
      selectPlaceholder: '선택해주세요',
      consent: '개인정보 수집·이용에 동의합니다',
      consentDetail:
        '수집 항목: 성명, 회사명, 직책, 연락처, 이메일, 문의 내용 · 이용 목적: 문의 회신 및 상담 · 보유 기간: 회신 완료 후 1년',
      consentLink: '개인정보처리방침 전문 보기',
      submit: '문의 보내기',
      submitting: '전송 중…',
      successTitle: '문의가 접수되었습니다',
      successBody: '담당자가 확인 후 회신드리겠습니다. 감사합니다.',
      successNote: '3일 안에 회신드립니다. (주말 · 공휴일 제외)',
      successAgain: '새 문의 작성하기',
      errorTitle: '전송에 실패했습니다',
      errorBody: '잠시 후 다시 시도해주세요. 계속 실패하면 아래 이메일로 직접 보내주시기 바랍니다.',
      rateLimitTitle: '잠시 후 다시 시도해주세요',
      rateLimitBody: '짧은 시간에 여러 건이 접수되었습니다. 잠시 뒤 다시 보내주시기 바랍니다.',
      required: '필수',
      optional: '선택',
      types: {
        consult: '도입 상담',
        quote: '견적 문의',
        demo: '데모 요청',
        partnership: '협력 제안',
        etc: '기타',
      },
      validation: {
        required: '필수 항목입니다',
        email: '올바른 이메일 주소를 입력해주세요',
        phone: '올바른 연락처를 입력해주세요',
        consent: '개인정보 수집·이용에 동의해주세요',
        tooShort: '10자 이상 입력해주세요',
        tooLong: '입력 가능한 길이를 초과했습니다',
      },
    },
  },

  /**
   * 개인정보처리방침
   * 표준 양식 기반 초안입니다. 회사 정보가 들어갈 자리는 {회사명} 같은 표시로 두었고,
   * 법무 검토 후 확정본으로 교체해야 합니다.
   */
  privacy: {
    label: 'PRIVACY',
    heading: '개인정보처리방침',
    lead: 'INFOPATH는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수합니다.',
    tocLabel: '조항 목차',
    draftTitle: '검토 전 초안입니다',
    draftBody: '표준 양식을 기준으로 작성했습니다. 법무 검토를 거쳐 확정본으로 교체해야 합니다.',
    effectiveLabel: '시행일',
    effectivePending: '확정 후 기재',
    sections: [
      {
        id: 'items',
        title: '1. 수집하는 개인정보 항목',
        body: '회사는 도입 문의 접수를 위해 아래 항목을 수집합니다.\n\n· 필수: 성명, 회사명, 연락처, 이메일, 문의 유형, 문의 내용\n· 선택: 직책\n· 자동 수집: 접속 IP (스팸·부정 이용 차단 목적)',
      },
      {
        id: 'purpose',
        title: '2. 개인정보의 수집 및 이용 목적',
        body: '· 문의 사항에 대한 확인 및 회신\n· 도입 상담, 견적 산출, 데모 일정 조율\n· 부정 이용 및 반복 발송 차단\n\n수집된 정보는 위 목적 외의 용도로 이용하지 않습니다.',
      },
      {
        id: 'retention',
        title: '3. 개인정보의 보유 및 이용 기간',
        body: '회신 완료 후 1년간 보관하며, 기간이 지나면 지체 없이 파기합니다.\n다만 관련 법령에 따라 보존할 필요가 있는 경우에는 해당 기간 동안 보관합니다.\n\n이용자가 삭제를 요청하는 경우 보유 기간 내라도 즉시 파기합니다.',
      },
      {
        id: 'destroy',
        title: '4. 개인정보의 파기 절차 및 방법',
        body: '· 절차: 보유 기간이 만료되거나 처리 목적이 달성되면 지체 없이 파기합니다.\n· 방법: 전자적 파일은 복구할 수 없는 방법으로 영구 삭제하고, 출력물은 분쇄하거나 소각합니다.',
      },
      {
        id: 'thirdParty',
        title: '5. 개인정보의 제3자 제공',
        body: '회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다.\n다만 법령에 근거하거나 수사기관의 적법한 요구가 있는 경우는 예외로 합니다.',
      },
      {
        id: 'consign',
        title: '6. 개인정보 처리의 위탁',
        body: '문의 메일 발송을 위해 아래 업체에 처리를 위탁하고 있습니다.\n\n· 수탁 업체: Resend (메일 발송 대행)\n· 위탁 업무: 문의 내용의 메일 전달\n\n위탁 계약 시 개인정보가 안전하게 관리되도록 필요한 사항을 규정하고 있습니다.',
      },
      {
        id: 'rights',
        title: '7. 이용자의 권리와 행사 방법',
        body: '이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요구할 수 있습니다.\n아래 문의처로 연락하시면 지체 없이 조치합니다.\n\n개인정보 수집·이용에 동의하지 않을 권리가 있으며, 이 경우 문의 접수가 제한됩니다.',
      },
      {
        id: 'safety',
        title: '8. 개인정보의 안전성 확보 조치',
        body: '· 전송 구간 암호화(HTTPS) 적용\n· 접근 권한 최소화 및 관리\n· 스팸·자동 제출 차단 조치',
      },
      {
        id: 'manager',
        title: '9. 개인정보 보호책임자 및 문의처',
        body: '개인정보 처리에 관한 문의, 불만 처리, 피해 구제는 아래로 연락해 주십시오.',
      },
      {
        id: 'change',
        title: '10. 개인정보처리방침의 변경',
        body: '이 방침의 내용이 추가·삭제·수정될 경우 시행 7일 전부터 홈페이지를 통해 공지합니다.',
      },
    ],
    remedyTitle: '권익침해 구제 방법',
    remedyBody:
      '개인정보 침해로 인한 상담·신고가 필요한 경우 아래 기관에 문의하실 수 있습니다.\n\n· 개인정보침해신고센터 (privacy.kisa.or.kr / 118)\n· 개인정보 분쟁조정위원회 (kopico.go.kr / 1833-6972)\n· 대검찰청 사이버수사과 (spo.go.kr / 1301)\n· 경찰청 사이버수사국 (ecrm.police.go.kr / 182)',
  },

  footer: {
    tagline: 'Connecting Manufacturing Intelligence',
    platformNote: 'INFOLINK — INFOPATH의 스마트팩토리 MES 플랫폼',
    company: '상호',
    ceo: '대표자',
    bizNo: '사업자등록번호',
    address: '주소',
    tel: '대표전화',
    email: '이메일',
    copyright: '© {year} INFOPATH. All rights reserved.',
    pendingNote: '사업자 정보는 확인 후 게재 예정입니다.',
  },

  /**
   * INFOLINK MES 제품 소개 — /solution 페이지 전용
   *
   * 모든 문구는 코드·DB 실측으로 검증된 내용입니다.
   *
   * 쓸 수 있는 숫자 (이 목록 밖의 숫자는 넣지 않습니다)
   *   업무 8단계 · 모듈 11개 · 화면 128종 · 창고 7종
   *   WIP 트랜잭션 28종 · 자재 불출 2종 · 완료 검증 12가지
   *   ※ 메뉴 수·테이블 수·API 경로 수는 쓰지 않습니다. 양은 많으나
   *     전부 사용 중인 것이 아니라 오해를 부릅니다.
   *   ※ 최상위 메뉴는 13개지만 그중 2개(자재소요량 검토·생산실적 등록)는
   *     하위 메뉴가 0개인 단일 화면입니다. 모듈로 세지 않고 소속 모듈에 넣었습니다.
   *
   * 절대 쓰지 않는 것 (코드에 없거나 꺼져 있음을 확인)
   *   OPC UA · Modbus · MQTT / InfluxDB · DuckDB · MinIO · S3 · NAS
   *   Docker · Kubernetes / Prometheus · Grafana · ELK · SSO · VPN
   *   AI 예측 · 자동 감지 · 자율 운영 · 무인화
   */
  product: {
    /* 페이지 안 구간 이동 바. id는 각 섹션의 앵커와 일치해야 합니다. */
    nav: {
      label: '페이지 구간 이동',
      items: [
        { id: 'why', label: '현장 문제' },
        { id: 'process', label: '8단계 공정' },
        { id: 'how', label: '기록과 관리' },
        { id: 'features', label: '핵심 기능' },
        { id: 'tech', label: '기술 구성' },
        { id: 'architecture', label: '플랫폼 구조' },
      ],
    },

    hero: {
      label: 'INFOLINK MES',
      imageAlt: '데이터가 흘러드는 반투명 패널이 층층이 쌓인 이미지',
      heading: '자재가 들어온 순간부터 제품이 나가는 순간까지,\n모든 과정을 데이터로 연결합니다',
      lead: 'INFOLINK는 제조실행시스템(MES, Manufacturing Execution System)입니다.',
      values: [
        {
          id: 'traceability',
          name: '추적성',
          body: '완제품 하나에서 투입 자재까지 되짚을 수 있습니다.',
        },
        {
          id: 'control',
          name: '통제',
          body: '앞 단계를 건너뛰면 뒤 단계가 진행되지 않습니다.',
        },
      ],
    },

    why: {
      label: 'WHY INFOLINK',
      heading: '현장에서 실제로 막히는 세 가지',
      lead: 'MES 없이 돌아가는 현장에서 실제로 나오는 이야기 세 가지입니다. 각각에 INFOLINK이 어떻게 답하는지 함께 적었습니다.',
      problemLabel: '현장',
      answerLabel: 'INFOLINK',
      items: [
        {
          id: 'trace',
          no: '01',
          title: '불량이 접수됐는데 원인을 찾을 수 없습니다',
          problem:
            '고객사에서 불량 연락이 옵니다. 어느 자재로 언제 만들었는지 답하려면 종이 장부와 담당자 기억을 뒤져야 합니다. 회수 범위를 정하지 못해 필요 이상으로 넓게 잡습니다.',
          answer:
            '입고 시점에 LOT(같은 조건에서 만들어진 자재 묶음) 번호를 붙이고, 검사와 생산 투입을 거쳐 완제품까지 계보를 잇습니다. 자재 LOT과 생산 LOT을 잇는 계보는 생산실적을 올릴 때 자동으로 기록되므로, 되짚기 위해 따로 정리해 둘 필요가 없습니다.',
        },
        {
          id: 'stock',
          no: '02',
          title: '장부 재고와 실제 재고가 맞지 않습니다',
          problem:
            '월말에 세어보면 숫자가 다릅니다. 어디서 어긋났는지 되짚을 방법이 없어 그냥 맞춰 넣습니다.',
          answer:
            '재고를 바꾸는 모든 행위가 한 함수를 통과하고, 그 함수가 재고 갱신과 원장 기록을 같은 트랜잭션에서 처리합니다. 그래서 「수불 합계 = 현재고」가 항상 성립합니다. 어긋나면 어느 거래에서 어긋났는지 짚을 수 있습니다.',
        },
        {
          id: 'gate',
          no: '03',
          title: '검사를 통과하지 않은 자재가 라인에 들어갑니다',
          problem:
            '검사 결과가 시스템 밖(엑셀·종이)에 있으면, 불합격 자재가 생산에 투입되는 것을 막을 방법이 없습니다. 규정으로 정해두어도 바쁘면 넘어갑니다.',
          answer:
            '검사에 합격하지 않은 자재는 생산 투입 후보 조회에서 아예 제외됩니다. 규정으로 막는 것이 아니라, 조회 결과에 나오지 않습니다.',
        },
      ],
    },

    flow: {
      label: 'PROCESS',
      heading: '8단계 전 공정',
      lead: '화면이 나열된 것이 아닙니다. 앞 단계의 결과가 뒤 단계의 입력이 되고, 조건을 만족하지 않으면 진행이 막힙니다.',
      steps: [
        { id: 'sales', no: '01', name: '영업', sub: '수주' },
        { id: 'purchase', no: '02', name: '구매', sub: '발주' },
        { id: 'receipt', no: '03', name: '입고', sub: 'LOT 부여' },
        { id: 'inspection', no: '04', name: '검사', sub: '합격 판정' },
        { id: 'production', no: '05', name: '생산', sub: '작업지시 · 실적' },
        { id: 'quality', no: '06', name: '품질', sub: '공정 · 최종검사' },
        { id: 'shipping', no: '07', name: '출하', sub: '제품 출고' },
        { id: 'closing', no: '08', name: '마감', sub: '수불 정산' },
      ],
      gateHeading: '진행이 막히는 예',
      gates: [
        '검사에 합격하지 않은 자재는 생산 투입 후보 조회에서 제외됩니다',
        '검사기준이 등록되지 않은 품목은 발주 확정 자체가 되지 않습니다',
        '자재가 예약되지 않은 작업지시는 「작업 시작」으로 넘어가지 않습니다',
      ],
      thesis: '할 수 있는데 안 하는 것이 아니라, 조건이 안 되면 못 하게 되어 있습니다.',
      thesisSub: '이 제약이 곧 품질 통제입니다.',

      /**
       * 모듈 11개를 8단계에 매핑합니다.
       * 「모듈이 많다」가 아니라 「8단계를 이 모듈들이 덮는다」로 읽히게 하는 배치입니다.
       * AI 지능화는 하위 메뉴가 가장 많지만 조회·분석 보조이므로 마지막 지원 행에 둡니다.
       */
      modulesHeading: '업무 모듈 11개',
      modulesLead: '8단계를 어느 모듈이 덮는지 나란히 두었습니다.',
      modules: [
        { id: 'sales', names: '영업관리', stages: '① 영업' },
        { id: 'purchase', names: '구매 / 외주', stages: '② 구매 · ③ 입고' },
        { id: 'quality', names: '품질관리', stages: '④ 검사 · ⑥ 품질' },
        { id: 'production', names: '생산계획 · 생산관리 · WIP(재공)관리', stages: '⑤ 생산' },
        { id: 'inventory', names: '재고관리', stages: '⑦ 출하 · ⑧ 마감' },
        { id: 'support', names: '기준정보 · 설비관리 · 시스템관리 · AI 지능화', stages: '전 구간 지원' },
      ],
      bandAlt: '컨베이어가 이어진 생산 라인 전경',
      modulesNote: '※ 자재소요량(MRP — 생산계획에 맞춰 언제 무엇을 얼마나 사야 하는지 계산) 검토는 생산계획에, 생산실적 등록은 생산관리에 포함됩니다.',
    },

    features: {
      label: 'FEATURES',
      heading: '핵심 기능 여섯 가지',
      lead: '각 기능이 무엇을 해결하는지 먼저 적고, 세부 항목과 근거를 그 아래에 두었습니다.',
      items: [
        {
          id: 'traceability',
          icon: 'route',
          tone: 'default',
          title: 'LOT 추적성',
          summary: '불량이 접수됐을 때 "어느 자재로 언제 만들었나"에 즉시 답합니다.',
          points: [
            '입고 시 LOT 번호 부여 → 검사 → 생산 투입 → 완제품까지 계보 연결',
            '역방향 추적 — 이 제품에 무엇이 들어갔나',
            '정방향 추적 — 이 자재가 어느 제품으로 갔나',
            '공정별 투입 이력, 설비 · 작업자 기록',
          ],
          evidence:
            '자재 LOT과 생산 LOT을 잇는 계보 테이블이 별도로 있고, 생산실적을 올릴 때 자동으로 기록됩니다.',
        },
        {
          id: 'inventory',
          icon: 'boxes',
          tone: 'default',
          title: '재고 관리',
          summary: '장부 재고와 실제 재고가 왜 다른지 되짚을 수 있게 합니다.',
          points: [
            '창고 7종 — 자재 · 재공 · 제품 · 불량 · 폐기 · 격리 · 출하대기',
            '로케이션(선반 위치) 단위 적치 관리',
            '선입선출(FIFO — 먼저 들어온 것을 먼저 내보내는 방식) 자동 출고 — 유효일자 · 입고일 기준',
            '재고 예약 — 작업지시별로 자재를 미리 확보',
            '수불 원장 — 모든 재고 변동을 빠짐없이 기록',
          ],
          evidence:
            '재고를 바꾸는 모든 행위는 한 함수를 통과합니다. 그 함수가 재고 갱신과 원장 기록을 같은 트랜잭션에서 처리하므로 「수불 합계 = 현재고」가 항상 성립합니다.',
        },
        {
          id: 'quality',
          icon: 'shield',
          tone: 'default',
          title: '품질 관리',
          summary: '합격 · 불합격 판정을 사람의 기억이 아니라 등록된 기준으로 내립니다.',
          points: [
            '검사 구분별 관리 — 수입 · 공정 · 최종 등',
            '검사기준 등록 — 검사항목별 목표값 · 상한 · 하한',
            '규격 기반 자동 판정 — 측정값을 서버가 기준과 대조',
            '샘플링 계획 — 전수 · 구간 · 비율 · AQL',
            '불합격 시 부적합(NCR — 불합격 발생 시 발행하는 처리 문서) 자동 발행 + 불량창고 자동 격리',
            '검사 측정값 이력 보관',
          ],
          evidence:
            '판정 기준은 서버가 가진 검사기준에서 읽습니다. 화면이 보낸 값으로 판정하지 않습니다.',
        },
        {
          id: 'production',
          icon: 'factory',
          tone: 'default',
          title: '생산 관리',
          summary: '지시부터 완료까지 한 흐름으로 잇고, 중간에 빠지는 단계가 없게 합니다.',
          points: [
            'BOM(제품 1개에 필요한 자재 목록) · 라우팅(공정 순서) 전개',
            '작업지시 → 자재예약 → 작업시작 → 실적등록 → 완료',
            '자재 불출 2종 — 선불출(PICK) / 역산차감(BACKFLUSH)',
            '공정별 실적 · 불량 집계',
            'POP(현장단말) — 작업자가 현장에서 직접 실적 입력',
            '생산 완료 시 12가지 항목 자동 검증',
          ],
          evidence:
            'BOM · 라우팅은 작업지시를 낼 때 그 시점 값으로 복사해 굳힙니다. 나중에 BOM이 바뀌어도 이미 나간 지시의 소요자재는 바뀌지 않습니다.',
        },
        {
          id: 'wip',
          icon: 'split',
          tone: 'default',
          title: '재공(WIP) LOT 트랜잭션',
          summary: '현장에서 LOT을 쪼개고 합치는 일이 기록 없이 일어나지 않게 합니다.',
          points: [
            'LOT 단위 트랜잭션 28종',
            '생성 · 분할 · 병합 · 부분병합 · 조립 · 분해 · 재분류',
            '공정 착수 · 완료 / 일시정지 · 재개 / 보류 · 해제',
            '창고 이송 · 2단계 이송(발송 · 수령) · 손실 · 폐기 · 역분개',
            '전용 Workbench 화면에서 통합 수행',
            '모든 트랜잭션이 수량 보존과 계보 기록을 지킴',
          ],
          evidence:
            '취소해도 기록은 지워지지 않습니다. 역분개는 이력을 지우지 않고 반대 거래를 새로 남기므로, 무엇을 왜 취소했는지가 남습니다.',
        },
        {
          /**
           * AI 카드만 톤을 낮춥니다.
           * 내용의 절반이 「하지 않는 것」인데 다른 카드와 같은 모양이면
           * 기능 자랑으로 읽힙니다. 보조 도구라는 성격이 형태로 드러나야 합니다.
           */
          id: 'ai',
          icon: 'search',
          tone: 'muted',
          title: 'AI 분석 지원',
          summary: '데이터는 쌓여 있는데 무엇부터 봐야 할지 모르는 상황을 돕습니다.',
          points: [
            '품질 이상 분석 — 원인 후보와 조사 우선순위 제시',
            '설비 · 재고 · 계획 등 영역별 분석 화면',
            '분석 결과 파일 출력 (Excel · Word · PDF)',
            '분석 이력 감사 기록',
          ],
          evidence:
            '통계 · 집계는 시스템이 하고 AI는 그 결과를 설명합니다. 원인을 확정하지 않고 조사 우선순위 「후보」만 제시하며, 순위를 AI가 바꾸지 않습니다. 조회 · 분석 전용이라 설비 정지 · 재고 보류 · 부적합 발행 같은 자동 조치를 하지 않습니다.',
          callout:
            'AI가 대신 결정하지 않습니다. 어디를 먼저 봐야 할지 알려줄 뿐입니다. 판단과 조치는 담당자가 합니다.',
        },
      ],
      /** 카드 기본 상태는 요약 한 줄. 기능 목록과 근거는 이 라벨을 눌러야 열립니다 */
      detailLabel: '자세히 보기',
      evidenceLabel: '근거',
    },

    tech: {
      label: 'TECHNOLOGY',
      heading: '기술 구성',
      lead: '현재 구현된 구성입니다.',
      rows: [
        { id: 'backend', name: 'Backend', value: 'Python 3.12 · FastAPI · uvicorn' },
        { id: 'database', name: 'Database', value: 'PostgreSQL 17 (psycopg3)' },
        { id: 'frontend', name: 'Frontend', value: 'HTML + Alpine.js' },
        { id: 'auth', name: '인증 · 권한', value: 'JWT 토큰 · 역할 기반 권한(RBAC)' },
        { id: 'docs', name: '문서 출력', value: 'Excel · Word · PDF' },
        { id: 'api', name: 'API', value: 'REST — 전 기능 제공' },
        { id: 'deploy', name: '배포', value: 'On-Premise · Private Cloud' },
      ],
      strengthsHeading: '이 구성의 강점',
      strengths: [
        {
          id: 'single-db',
          title: '데이터베이스가 PostgreSQL 하나입니다',
          body: '여러 저장소를 붙여 운영하는 부담이 없습니다.',
        },
        {
          id: 'no-build',
          title: '프론트엔드에 별도 빌드 과정이 없습니다',
          body: '파일을 바꾸면 바로 반영됩니다. 배포가 단순합니다.',
        },
        {
          id: 'light-ops',
          title: '도입 · 운영 인력 부담이 낮습니다',
          body: '도입할 때도, 쓰면서도 손이 적게 갑니다.',
        },
      ],
      slogan: '인포패스가 말하는 Start Small은 기능을 덜어낸다는 뜻이 아니라, 이런 구성으로 만들었다는 뜻입니다.',
      accessHeading: '권한 관리',
      access: '권한은 화면을 숨기는 방식이 아닙니다. 요청이 들어올 때마다 서버가 확인합니다. 권한을 회수하면 그 즉시 차단됩니다.',
    },

    teaser: {
      label: 'OUR PLATFORM',
      heading: '빠른 이유는 여기 있습니다',
      /* 푸터에 이미 쓰고 있는 표기 그대로. 회사-제품 관계를 사이트 전체에서 한 문장으로 통일합니다. */
      kicker: '자체 MES 플랫폼 INFOLINK를 가지고 있습니다.',
      lead: '8단계 전 공정과 공통 기능이 이미 만들어져 있어, 귀사 공정에 맞추는 일부터 시작합니다. 그래서 구축 기간과 비용이 줄어듭니다.',
      imageAlt: '지표와 추이 그래프가 표시된 관제 화면',
      cta: 'INFOLINK 자세히 보기',
    },
  },

  /**
   * 적용 사례 (/infolink)
   * 실제 사례는 content/site.ts의 CASE_STUDIES에 들어갑니다. 여기에는 라벨만 둡니다.
   */
  cases: {
    label: 'CASE STUDIES',
    heading: '적용 사례',
    lead: '어떤 현장에서 무엇이 막혀 있었고, 무엇이 가능해졌는지 적었습니다.',
    problemLabel: '문제',
    resultLabel: '결과',
  },

  notFound: {
    heading: '페이지를 찾을 수 없습니다',
    body: '주소가 변경되었거나 삭제된 페이지입니다.',
  },
};

export default ko;

/**
 * en.ts가 따라야 할 구조 타입.
 * ko에 `as const`를 붙이지 않는 이유: 리터럴 타입이 고정되면
 * en에서 다른 문자열을 넣을 때 타입 에러가 납니다. 구조만 강제하고 값은 자유롭게 둡니다.
 */
export type Messages = typeof ko;
