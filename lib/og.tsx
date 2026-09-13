import { ImageResponse } from 'next/og';

/**
 * OG 카드 공통 렌더러 (1200×630)
 *
 * 별도 이미지 파일을 두지 않고 런타임에 그립니다 — 문구가 바뀌어도
 * 디자인 툴을 열 필요가 없습니다.
 *
 * ⚠ 글자는 라틴 문자만 씁니다.
 *   ImageResponse의 기본 폰트가 라틴만 커버해서 한글을 넣으려면 폰트 데이터를
 *   직접 실어야 하는데, Pretendard 원본이 2MB라 카드 한 장 때문에 싣기에는 무겁습니다.
 *   한글이 들어가면 글자가 통째로 사라집니다 — 넣지 마십시오.
 *
 * 페이지마다 다른 카드를 쓰는 이유
 *   전에는 모든 페이지가 같은 카드를 썼습니다. 카카오톡·슬랙에 /infolink 링크를
 *   보내도 회사 대문 카드가 나갔습니다. 지금 이 사이트에서 링크 공유는
 *   사실상 유일한 유입 경로라, 어느 페이지를 보냈는지가 카드에 보여야 합니다.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

type Props = {
  /** 상단 작은 라벨. 어느 구역의 페이지인지 */
  eyebrow: string;
  /** 카드에서 가장 큰 글자 */
  title: string;
  /** 제목 아래 한 줄 */
  subtitle: string;
};

export function renderOgCard({ eyebrow, title, subtitle }: Props) {
  // 제목이 길면 한 줄에 안 들어갑니다. 글자 수에 따라 크기를 낮춥니다.
  const titleSize = title.length > 16 ? 76 : title.length > 11 ? 92 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '96px',
          background: 'linear-gradient(135deg, #001830 0%, #003060 55%, #0B3A6A 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 그린 액센트 바 — 로고 인피니티 마크의 색 */}
        <div style={{ display: 'flex', width: 72, height: 6, background: '#48A830' }} />

        <div
          style={{
            display: 'flex',
            marginTop: 36,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: '#8BCC77',
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 18,
            fontSize: titleSize,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#FFFFFF',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 38,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 56,
            paddingTop: 32,
            borderTop: '1px solid rgba(255,255,255,0.18)',
            fontSize: 26,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          Start Small, Run Smart
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 14,
            fontSize: 23,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          infopath.co.kr
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
