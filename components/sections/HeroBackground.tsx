
/**
 * 히어로 배경 레이어 — 임시(CSS 전용)
 *
 * 이미지·영상으로 교체할 때 이 파일만 바꾸면 됩니다.
 * Hero.tsx는 배경의 구현을 알지 못하고, 이 컴포넌트를 절대 위치로 깔기만 합니다.
 *
 * 구성 (아래에서 위로)
 *   1. 베이스     #FAFBFC
 *   2. 대각 흐름   우상단 그린 → 중앙 투명 → 좌하단 네이비. 각 정지점 0.05 이하
 *   3. 소프트 번짐  넓게 퍼지는 원형 그라데이션 2개 (blur 대신 falloff로 처리 — 훨씬 가볍습니다)
 *   4. 그리드      네이비 64px, opacity 0.013
 *   5. 하단 페이드  다음 섹션으로 이어지도록
 */

// 거의 보이지 않는 정도. 구조감만 남기고 시선을 뺏지 않습니다.
const GRID = 'rgba(0, 48, 96, 0.013)';

export default function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1. 베이스 */}
      <div className="absolute inset-0 bg-[#FAFBFC]" />

      {/* 2. 대각 흐름 — 우상단(그린)에서 좌하단(네이비)으로, 가운데는 완전히 비웁니다 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(225deg,' +
            ' rgba(72, 168, 48, 0.05) 0%,' +
            ' rgba(72, 168, 48, 0.022) 20%,' +
            ' rgba(250, 251, 252, 0) 46%,' +
            ' rgba(250, 251, 252, 0) 58%,' +
            ' rgba(0, 48, 96, 0.022) 80%,' +
            ' rgba(0, 48, 96, 0.05) 100%)',
        }}
      />

      {/* 3. 소프트 번짐 — 경계가 보이지 않도록 falloff를 아주 길게 잡았습니다.
             스크롤보다 15% 느리게 따라와 깊이감을 만들고,
             두 덩어리가 20s / 28s 주기로 40px 이내에서 아주 천천히 떠다닙니다.
             주기를 어긋나게 둔 이유는 같이 움직이면 패턴이 눈에 띄기 때문입니다. */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 -top-[10%] h-[120%]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(46% 44% at 80% 10%, rgba(72, 168, 48, 0.05), rgba(72, 168, 48, 0) 72%)',
              animation: 'hero-blob-a 20s ease-in-out infinite',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(52% 46% at 14% 92%, rgba(0, 48, 96, 0.045), rgba(0, 48, 96, 0) 74%)',
              animation: 'hero-blob-b 28s ease-in-out infinite',
            }}
          />
          {/* 가운데 애저는 고정 — 셋 다 움직이면 산만해집니다 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(40% 36% at 62% 34%, rgba(24, 120, 192, 0.028), rgba(24, 120, 192, 0) 76%)',
            }}
          />
        </div>
      </div>

      {/* 4. 그리드 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(to right, ${GRID} 0 1px, transparent 1px 64px)`,
            `repeating-linear-gradient(to bottom, ${GRID} 0 1px, transparent 1px 64px)`,
          ].join(', '),
          // 우상단에서 가장 선명하고 좌하단으로 사라집니다 — 카피가 놓이는 좌측을 비워둡니다.
          maskImage: 'radial-gradient(125% 105% at 88% 4%, #000 20%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(125% 105% at 88% 4%, #000 20%, transparent 82%)',
        }}
      />

      {/* 5. 하단 페이드 */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#FAFBFC]" />
    </div>
  );
}
