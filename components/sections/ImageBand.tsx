import Image from 'next/image';

import Container from '@/components/layout/Container';

/**
 * 이미지 밴드
 *
 * 긴 텍스트 구간 사이에 시각적 쉼표를 넣습니다.
 * 글이 계속 이어지면 읽는 사람이 「문서」로 인식하고 훑기를 포기합니다.
 *
 * caption을 주면 사진 위에 한 줄을 얹습니다.
 * 이때는 장식이 아니라 그 구간의 결론을 크게 못박는 자리입니다 —
 * 본문 안에 묻혀 있던 핵심 문장을 여기로 올리면 텍스트도 줄고 기억에도 남습니다.
 */

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** 사진 위에 얹을 한 줄. 없으면 사진만 놓습니다. */
  caption?: string;
  captionSub?: string;
  /** 화면 폭을 꽉 채울지, 컨테이너 안에 둘지 */
  bleed?: boolean;
  priority?: boolean;
};

export default function ImageBand({
  src,
  alt,
  width,
  height,
  caption,
  captionSub,
  bleed = false,
  priority = false,
}: Props) {
  const media = (
    <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[3/1]">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="100vw"
        priority={priority}
        className="h-full w-full object-cover"
      />

      {caption && (
        <>
          {/* 글자가 사진 위에서 읽히려면 바탕이 필요합니다. 아래로 갈수록 짙어지게 깔았습니다 */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/45 to-navy-900/15"
          />
          <div className="absolute inset-0 flex items-end">
            <Container className="pb-8 lg:pb-12">
              <p className="max-w-[36ch] text-[clamp(1.125rem,2.4vw,1.75rem)] font-medium leading-snug tracking-[-0.02em] text-white">
                {caption}
              </p>
              {captionSub && (
                <p className="mt-2 text-caption text-white/70">{captionSub}</p>
              )}
            </Container>
          </div>
        </>
      )}
    </div>
  );

  if (bleed) return <section className="bg-navy-900">{media}</section>;

  return (
    <section className="bg-white py-4">
      <Container>
        <div className="overflow-hidden rounded-lg">{media}</div>
      </Container>
    </section>
  );
}
