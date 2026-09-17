/**
 * 사이트 전역 설정 — 텍스트가 아닌 "구조·플래그·사실 정보"만 둡니다.
 * 노출 문구는 content/messages/{ko,en}.ts에 있습니다.
 */

/* ────────────────────────────────────────────────────────────
   1. 히어로 카피 변형
   확정된 3개 안을 모두 messages에 넣어두고 여기서 전환합니다.
     a — MES 도입에 필요한 건 예산이 아니라 순서입니다
     b — 스마트팩토리는 대기업의 것이라는 말, 이제 맞지 않습니다
     c — 전 공정을 덮는 MES를 지금 필요한 만큼만
   ──────────────────────────────────────────────────────────── */
export type HeroVariant = 'a';
export const HERO_VARIANT: HeroVariant = 'a';

/* ────────────────────────────────────────────────────────────
   1-1. 히어로 슬라이드
   primary는 카피를 messages의 hero.variants[HERO_VARIANT]에서 가져옵니다.
   덕분에 위 HERO_VARIANT 플래그가 계속 첫 슬라이드의 헤드라인을 결정합니다.
   ──────────────────────────────────────────────────────────── */
export type HeroSlideId = 'primary' | 'layered' | 'connect';

export const HERO_SLIDES: ReadonlyArray<{
  id: HeroSlideId;
  image: string;
  /** true면 카피를 hero.variants에서, false면 hero.slides.{id}에서 */
  useVariantCopy?: boolean;
}> = [
  { id: 'primary', image: '/images/hero-robot.jpg', useVariantCopy: true },
  { id: 'layered', image: '/images/ai-layers.jpg' },
  { id: 'connect', image: '/images/factory-line.jpg' },
];

/* ────────────────────────────────────────────────────────────
   1-2. 제품 화면 캡처 (히어로 우측)

   ⚠ 현재 사이트의 이미지는 전부 Unsplash 스톡 사진입니다.
     dashboard.jpg조차 남의 화면을 찍은 사진이지 INFOLINK 화면이 아닙니다.
     제품 화면을 보여주는 것이 신뢰 요소로는 가장 강하지만,
     스톡 사진을 제품이라고 말하면 그 순간 신뢰가 아니라 거짓이 됩니다.

   TODO(제품 화면): 실제 INFOLINK 화면 캡처를 받으면
     ① public/images/infolink-screen.png 로 저장
     ② 아래 src·alt를 채우고 pending을 false로

   필요한 사양
     크기    가로 1600px 이상 (2배 밀도 대응). 비율 16:10 권장
     형식    PNG (화면 캡처는 JPG보다 글자가 덜 뭉갭니다)
     내용    현장에서 실제로 자주 쓰는 화면 1장
             — LOT 추적 결과 / 재고 현황 / 작업지시 목록 중 하나
     주의    거래처명 · 담당자명 · 단가가 화면에 보이면 안 됩니다.
             데모 데이터로 다시 캡처하거나 해당 열을 가려서 주십시오.
   ──────────────────────────────────────────────────────────── */
export const PRODUCT_SHOT: { src: string; pending: boolean } = {
  src: '', // 예: '/images/infolink-screen.png'
  pending: true,
};

/** 자동 전환 간격 · 페이드 시간 (ms) */
export const HERO_SLIDE_INTERVAL_MS = 8000;
export const HERO_SLIDE_FADE_MS = 800;

/* ────────────────────────────────────────────────────────────
   2. CTA 색상 변형 — 비교 검토용
   green : 로고 인피니티 마크의 그린 #48A830 (브랜드 일치도 최상)
   azure : INFOLINK 배경·언더라인의 애저 #1878C0 (네이비와 동계열, 차분함)
   amber : 보색 대비 최대 #C87A14 (유도력은 높으나 브랜드 자산에 없는 색)

   ※ 기획서 초안의 "앰버/페트롤" 2안 중 페트롤은 폐기했습니다.
     실제 로고를 확인한 결과 브랜드가 네이비+그린+애저 체계이고,
     페트롤(청록)은 어느 자산에도 없어 비교 대상으로서 의미가 없습니다.
     대신 브랜드에서 실제로 뽑은 green/azure를 주 후보로, amber를 대조군으로 둡니다.
   ──────────────────────────────────────────────────────────── */
export type CtaVariant = 'green' | 'azure' | 'amber';
export const CTA_VARIANT: CtaVariant = 'green';

/* ────────────────────────────────────────────────────────────
   3. 섹션 활성화 플래그
   실제 데이터가 없는 섹션은 컴포넌트만 두고 렌더링하지 않습니다.
   빈 숫자나 미승인 로고 노출은 이 업계에서 즉시 신뢰를 잃습니다.
   ──────────────────────────────────────────────────────────── */
export const SECTIONS = {
  hero: true,
  /** 도입의 벽과 그 답 — Approach */
  approach: true,
  /** INFOLINK로 들어가는 문 — ProductTeaser */
  productTeaser: true,
  faq: true,
  cta: true,

  /** 대표자 소개 — CEO_PROFILE.pending이 false가 되면 자동으로 나타납니다 */
  ceo: true,
  /** 구축 방식 — 실제 절차를 확인해 BUILD_STEPS에 넣으면 true로 */
  buildProcess: false,
  /** 적용 사례 — 실제 사례가 CASE_STUDIES에 들어오면 true로 */
  cases: false,
  /** 고객사 로고 띠 — 대표 확인(2026-09-17)으로 켰습니다 */
  clients: true,
} as const;

/* ────────────────────────────────────────────────────────────
   3-0. 고객사 로고 띠 (메인)

   가로로 끊기지 않고 흐르는 로고 띠입니다. 대기업 사이트가 공통으로 쓰는
   신뢰 장치이고, 실적 문장 열 줄보다 로고 한 줄이 먼저 읽힙니다.

   ⚠ 켜기 전에 반드시 확인해야 하는 것 — 로고는 상표입니다.
     회사명을 글로 적는 것과 로고를 게재하는 것은 법적으로 다릅니다.
     고객사별 서면 사용 동의 없이 올리면 실제 분쟁 사유가 됩니다.
     계약서에 비밀유지 조항이 있으면 회사명 자체도 공개할 수 없습니다.

   TODO(고객사 로고): 동의를 받은 건만
     ① public/images/clients/ 에 로고 저장
        - 배경 투명 PNG 또는 SVG
        - 가로 기준 최소 480px (띠에서는 높이 32px로 축소해 씁니다)
        - 여백이 제각각이면 크기가 들쭉날쭉해 보이므로 상하 여백을 맞춰 주십시오
     ② 아래 배열에 추가
     ③ SECTIONS.clients를 true로
     세 가지를 모두 해야 노출됩니다.

   name은 로고의 대체 텍스트로 쓰입니다. 이미지가 뜨지 않거나 화면을 읽어주는
   환경에서 이 값이 읽히므로, 파일명이 아니라 실제 회사명을 적습니다.
   ──────────────────────────────────────────────────────────── */
export type ClientLogo = {
  id: string;
  /** 회사명 — 로고 이미지의 대체 텍스트가 됩니다 */
  name: string;
  src: string;
  width: number;
  height: number;
};

export const CLIENT_LOGOS: ReadonlyArray<ClientLogo> = [
  { id: 'dongwoo', name: '동우화인켐', src: '/images/clients/dongwoo.png', width: 420, height: 96 },
  { id: 'tunghsu', name: 'TUNGHSU GROUP', src: '/images/clients/tunghsu.png', width: 316, height: 96 },
  { id: 'semv', name: 'SEMV', src: '/images/clients/semv.png', width: 335, height: 96 },
  { id: 'semb', name: 'SEMB', src: '/images/clients/semb.png', width: 672, height: 96 },
];

/* ────────────────────────────────────────────────────────────
   3-0-1. 로고가 오기 전까지 띠에 싣는 사진

   로고 게재 동의를 받기 전에도 띠 자리가 비어 보이지 않도록 사진을 흘립니다.
   CLIENT_LOGOS가 채워지고 SECTIONS.clients가 켜지면 이 사진들은 자동으로 물러납니다.

   ⚠ 전부 무료 스톡 사진(Unsplash)이고 인포패스가 구축한 현장이 아닙니다.
     그래서 제목에 「우리 고객사」나 「우리가 지은 공장」이라고 쓰지 않았습니다.
     사진은 분야를 보여주는 삽화이고, 사실은 옆의 업종 문구가 담습니다.

   고유한 사진이 4장뿐이라 띠에서 눈에 띄게 반복됩니다.
   docs/자료요청.md 4-2에 요청해 둔 실제 현장 사진이 오면 먼저 교체하십시오.
   ──────────────────────────────────────────────────────────── */
export const STRIP_IMAGES: ReadonlyArray<{ id: string; src: string; alt: string }> = [
  { id: 'line', src: '/images/strip/line.webp', alt: '컨베이어가 이어진 생산 라인 전경' },
  { id: 'robot', src: '/images/strip/robot.webp', alt: '흰색 공간에 놓인 산업용 로봇 팔' },
  {
    id: 'dashboard',
    src: '/images/strip/dashboard.webp',
    alt: '지표와 추이 그래프가 표시된 대시보드 화면',
  },
  { id: 'layers', src: '/images/strip/layers.webp', alt: '데이터가 흘러드는 반투명 패널' },
];

/* ────────────────────────────────────────────────────────────
   3-1. 아키텍처 다이어그램
   회사에서 제공한 원본 3종. 모두 1536×1024 (3:2).
   문구는 messages의 architecture.views.{id}에 있습니다.
   ──────────────────────────────────────────────────────────── */
/**
 * ⚠️ 공개 사이트에는 '솔루션' 도면만 싣습니다.
 *
 * 소프트웨어·개발환경 도면에는 GitLab 저장소명, 브랜치 전략, CI/CD 구성 등
 * 사내 인프라 정보가 들어 있어 외부에 노출해서는 안 됩니다.
 * 목록에서 빼는 것만으로는 부족해 public/images/의 파일도 삭제했습니다
 * (public에 남겨두면 URL로 직접 접근됩니다). 원본은 저장소 루트에만 보관합니다.
 */
export type ArchitectureViewId = 'solution';

export const ARCHITECTURE_VIEWS: ReadonlyArray<{
  id: ArchitectureViewId;
  src: string;
  width: number;
  height: number;
}> = [{ id: 'solution', src: '/images/architecture-solution.png', width: 1536, height: 1024 }];

/* ────────────────────────────────────────────────────────────
   4. 회사 정보
   ※ pending: true 인 항목은 아직 확인되지 않은 값입니다.
     푸터에서는 pending 항목을 렌더링하지 않습니다(빈 값 노출 방지).
   ──────────────────────────────────────────────────────────── */
export const COMPANY = {
  nameKo: '인포패스',
  nameEn: 'INFOPATH',
  /** 자체 MES 플랫폼 / 진행 프로젝트명 */
  platform: 'INFOLINK',
  domain: 'infopath.co.kr',
  email: 'gepark@infopath.co.kr',

  /** 설립일 — 사업자등록증 개업연월일. JSON-LD foundingDate에 씁니다 */
  foundingDate: '2022-03-31',

  // 출처: 사업자등록증(화성세무서, 2024-07-29 발급)
  ceo: { value: '박경은', pending: false },
  bizNo: { value: '652-87-02324', pending: false },

  /*
     등록 주소는 아파트 세대(202동 904호)라 동·호수까지 적으면 사실상 거주지가
     공개됩니다. 회사소개서(2025.04)가 대외 자료에서 이미 도로명까지만 쓰고 있어
     같은 형식을 따릅니다. 동·호수 표기가 필요하면 여기만 고치면 됩니다.
  */
  address: { value: '경기도 화성시 수노을1로 191', pending: false },

  /*
     표기는 하이픈으로 통일합니다 — 문의 폼의 연락처 placeholder와 같은 형식이고,
     화면에 나가는 번호와 입력 예시가 다르면 어느 쪽이 맞는지 되묻게 됩니다.
     tel: 링크는 숫자만 남기고 거므로 표기 형식과 무관합니다.
  */
  tel: { value: '031-682-9062', pending: false },
} as const;

/* ────────────────────────────────────────────────────────────
   4-0-1. 개인정보 보호책임자 (/privacy)

   개인정보 보호법 제31조에 따라 지정하고 방침에 공개해야 하는 항목입니다.
   문의 폼이 성명·연락처·이메일을 받으므로 지정 의무가 생깁니다.

   담당자가 바뀌면 이 블록만 고치면 됩니다.
   ──────────────────────────────────────────────────────────── */
export const PRIVACY_OFFICER = {
  name: '박경은',
  role: '대표이사',
  /* 연락처는 대표 창구를 그대로 씁니다. 전용 번호를 따로 두면
     한쪽만 바뀌었을 때 방침에 죽은 번호가 남습니다. */
  tel: COMPANY.tel,
  email: COMPANY.email,
} as const;

/* ────────────────────────────────────────────────────────────
   4-1. 대표자 소개 (/about)

   TODO(대표자): 아래 값을 받아 채우고 pending을 false로 바꾸면 노출됩니다.
     name   대표자 성명
     role   직함 (예: 대표이사)
     career 한 줄 경력 — 제조·IT 업력이 드러나는 문장 하나
     why    왜 이 제품을 만들었는지. 현장에서 무엇을 보고 시작했는지가 들어가야
            「구축을 파는 회사」라는 포지션과 이어집니다.
     photo  선택. 없으면 사진 없이 텍스트만 나갑니다.

   ⚠ 이름·경력을 지어내지 않습니다. 확인 전까지 비어 있는 편이 낫습니다.
   ──────────────────────────────────────────────────────────── */
export const CEO_PROFILE: {
  name: string;
  role: string;
  career: string;
  why: string;
  photo: string;
  pending: boolean;
} = {
  name: '',
  role: '',
  career: '',
  why: '',
  photo: '',
  pending: true,
};

/* ────────────────────────────────────────────────────────────
   4-0. 구축 방식 (메인)

   ⚠ 지금 사이트에서 가장 큰 공백입니다.
     이 회사가 파는 것은 제품이 아니라 「구축」인데, 그 과정이 한 줄도 없습니다.
     도입 검토자의 가장 큰 불안은 "얼마나 걸리나, 우리가 뭘 해야 하나"이고,
     과정이 보이면 견적을 묻기 전에 마음이 정해집니다.

   TODO(구축 방식): 회사 확인 후 아래 배열을 채우고 SECTIONS.buildProcess를 true로.
     추측으로 쓰면 그 자체가 약속이 되므로 비워 두었습니다.

   owner가 이 섹션의 값어치입니다.
     검토자의 진짜 질문은 "얼마나 걸리나"보다 "우리가 뭘 해야 하나"입니다.
     기준정보(품목·BOM·검사기준)는 고객사 데이터라 대신 만들어줄 수 없습니다.
     그걸 'together'로 정직하게 밝히면 착수 후의 갈등을 미리 막습니다.

   ── 확인용 초안 (실제 절차가 아닙니다. 회사 확인 후 교체) ──
     01 현황 진단      공정 흐름과 지금 무엇을 어떻게 기록하는지 확인    infopath
     02 범위 결정      8단계 중 어디부터 시작할지 정함                 together
     03 기준정보 정리   품목·BOM·라우팅·검사기준·창고·거래처 등록        together
     04 시범 운영      한 라인·한 품목으로 먼저 돌려봄                 together
     05 확대          운영하면서 다음 모듈로 넓힘                     infopath

   ⚠ 각 단계의 소요 기간은 확인 전까지 쓰지 마십시오.
     기간을 적는 순간 약속이 됩니다.
   ──────────────────────────────────────────────────────────── */
export type BuildStepOwner = 'infopath' | 'together' | 'client';

export type BuildStep = {
  id: string;
  /** 01 · 02 … */
  no: string;
  title: string;
  body: string;
  /** 누가 하는 일인지. 이 열이 없으면 섹션의 값어치가 절반으로 줄어듭니다 */
  owner: BuildStepOwner;
};

export const BUILD_STEPS: ReadonlyArray<BuildStep> = [];

/* ────────────────────────────────────────────────────────────
   4-2. 적용 사례 (/infolink)

   TODO(적용 사례): 실제 구축 건이 생기면 아래 배열에 넣고
     SECTIONS.cases를 true로 바꾸면 섹션이 나타납니다.

   ⚠ 가짜 회사명·성과 수치를 넣지 않습니다.
     고객사명을 밝힐 수 없는 경우 client를 업종으로 대체하십시오
     (예: '자동차 부품 제조'). 그것도 어려우면 이 섹션은 계속 비워 둡니다.
   ⚠ result에 "30% 개선" 같은 수치를 쓰려면 근거가 있어야 합니다.
     측정하지 않은 값은 쓰지 말고, 무엇이 가능해졌는지를 문장으로 적으십시오.

   예시(형식 참고용 — 실제 사례 아님):
     { id: 'case-01', client: '자동차 부품 제조', period: '2026.03 – 2026.06',
       scope: '입고 · 수입검사 · 재고',
       problem: '자재 LOT이 종이 장부로만 관리되어 불량 원인 추적에 며칠이 걸렸습니다.',
       result: '완제품에서 투입 자재까지 화면에서 되짚을 수 있게 됐습니다.' }
   ──────────────────────────────────────────────────────────── */
export type CaseStudy = {
  id: string;
  /** 고객사명 또는 업종. 공개 동의를 받은 경우에만 실명 */
  client: string;
  /** 구축 기간 */
  period: string;
  /** 적용 범위 — 8단계 중 어디까지인지 */
  scope: string;
  /** 어떤 문제가 있었는가 */
  problem: string;
  /** 무엇이 가능해졌는가. 측정하지 않은 수치는 쓰지 않습니다 */
  result: string;
};

export const CASE_STUDIES: ReadonlyArray<CaseStudy> = [];

/* ────────────────────────────────────────────────────────────
   5. 네비게이션 — 1차 범위 5페이지
   산업별 개별 페이지(6종)는 제거하고 /solution 내 섹션으로 통합했습니다.
   GNB 최상위는 INDUSTRY가 아닌 SOLUTION 중심입니다.
   ──────────────────────────────────────────────────────────── */
export type NavKey = 'infolink' | 'about' | 'contact';

export const NAV: ReadonlyArray<{ key: NavKey; href: string }> = [
  { key: 'infolink', href: '/infolink' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

/* ────────────────────────────────────────────────────────────
   6. 브랜드 자산 경로
   ※ 로고는 제공된 파일만 사용합니다. 임의 생성·변형 금지.
   ──────────────────────────────────────────────────────────── */
export const ASSETS = {
  logo: '/images/infopath-logo.png',
  /** 흰 배경 로봇 팔 — 히어로 우측 (Unsplash) */
  heroRobot: '/images/hero-robot.jpg',
  /** 컨베이어 생산 라인 — 솔루션 블록 1 · CTA 배너 (Unsplash) */
  factoryLine: '/images/factory-line.jpg',
  /** 어두운 대시보드 화면 — 솔루션 블록 2 (Unsplash) */
  dashboard: '/images/dashboard.jpg',
  /** 층층이 쌓인 반투명 패널 — 히어로 슬라이드 2 (Unsplash) */
  aiLayers: '/images/ai-layers.jpg',
} as const;

/** 원본 비율 (next/image 레이아웃 시프트 방지용) */
export const ASSET_DIMENSIONS = {
  logo: { width: 460, height: 378 },
  heroRobot: { width: 4928, height: 3264 },
  factoryLine: { width: 4000, height: 2247 },
  dashboard: { width: 2947, height: 2121 },
  aiLayers: { width: 7680, height: 4320 },
} as const;
