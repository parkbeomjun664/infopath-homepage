import HeroBackground from './HeroBackground';
import HeroMotionGate from './HeroMotionGate';
import HeroScrollCue from './HeroScrollCue';
import HeroSlider from './HeroSlider';

/**
 * S1 — 히어로
 *
 * 배경·모션 게이트·스크롤 유도는 여기서, 슬라이드 내용과 전환은 HeroSlider에서.
 * 슬라이더만 클라이언트 컴포넌트이고 나머지는 서버에서 렌더됩니다.
 */

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <HeroMotionGate />
      <HeroBackground />
      <HeroSlider />
      <HeroScrollCue />
    </section>
  );
}
