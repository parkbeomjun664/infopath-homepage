import { cleanEnv } from './env';

/**
 * 검색엔진 색인 모드
 *
 * 세 단계로 나눈 이유 — 「검색에서 내린다」는 한 가지 동작이 아닙니다.
 * 크롤링 차단과 색인 제외는 반대로 움직입니다.
 *
 *   public  정식 공개. 크롤링 허용 + index,follow
 *
 *   hidden  검색에서 빼는 중. 크롤링은 **허용**하고 noindex 로 빼라고 지시합니다.
 *           여기서 robots.txt 로 크롤링을 막으면 크롤러가 페이지를 가져올 수 없어
 *           noindex 를 읽지 못합니다. 그러면 이미 등록된 주소가 색인에 그대로 남아
 *           제목·설명만 사라진 「이 페이지에 관한 정보가 없습니다」 상태로 굳습니다.
 *           빼려면 먼저 읽히게 해야 합니다.
 *
 *   blocked 완전 차단. robots.txt 로 전체 거부.
 *           검색 결과에서 **다 빠진 것을 확인한 뒤** 쓰십시오.
 *           아직 색인에 남아 있는 동안 이걸 켜면 위의 유령 항목이 생깁니다.
 *
 * 전환 순서: public → hidden → (색인에서 소멸 확인) → blocked
 *
 * 기본값은 blocked 입니다. 환경변수가 없는 곳은 로컬과 프리뷰 배포인데,
 * 그곳은 애초에 크롤러가 들어올 이유가 없습니다.
 * 실수로 공개되는 쪽보다 실수로 막히는 쪽이 회복이 쉽습니다.
 */
export type IndexingMode = 'public' | 'hidden' | 'blocked';

export const INDEXING_MODE: IndexingMode = ((): IndexingMode => {
  const mode = cleanEnv(process.env.NEXT_PUBLIC_INDEXING_MODE).toLowerCase();

  if (mode === 'public' || mode === 'hidden' || mode === 'blocked') {
    return mode;
  }

  /**
   * 레거시 플래그 호환.
   *
   * 2026-10-01 공개 때 Vercel에 NEXT_PUBLIC_ALLOW_INDEXING=true 를 넣었습니다.
   * 새 변수로 갈아타는 중에 이 분기가 없으면, 환경변수를 바꾸기 전에 배포된
   * 빌드가 blocked 로 떨어져 의도치 않게 전체 차단이 됩니다.
   */
  if (cleanEnv(process.env.NEXT_PUBLIC_ALLOW_INDEXING) === 'true') {
    return 'public';
  }

  return 'blocked';
})();

/** 크롤러의 접근을 허용하는지 — hidden 에서도 허용입니다(noindex 를 읽혀야 하므로). */
export const ALLOW_CRAWLING = INDEXING_MODE !== 'blocked';

/** 검색 결과에 올라가도 되는지. */
export const ALLOW_INDEXING = INDEXING_MODE === 'public';
