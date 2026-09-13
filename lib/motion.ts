/**
 * 스크롤 모션 기반 모듈 (라이브러리 없음)
 *
 * 원칙
 *  - 스크롤 리스너는 앱 전체에서 하나만 둡니다. 요소마다 붙이면 스크롤이 무거워집니다.
 *  - 갱신은 requestAnimationFrame으로 프레임당 1회로 제한합니다.
 *  - will-change는 실제로 움직이는 동안에만 켜고, 멈추면 즉시 끕니다.
 *    계속 켜두면 브라우저가 레이어를 놓지 못해 메모리를 잡아먹습니다.
 */

export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── 패럴랙스 ─────────────────────────────────────────────── */

type Target = { el: HTMLElement; speed: number };

/** 동시에 움직이는 요소가 많아지면 스크롤이 끊깁니다. 3개로 제한합니다. */
const MAX_TARGETS = 3;
const WILL_CHANGE_IDLE_MS = 180;

const targets = new Set<Target>();
let rafId = 0;
let idleTimer = 0;
let listening = false;
let willChangeOn = false;

function setWillChange(on: boolean) {
  if (willChangeOn === on) return;
  willChangeOn = on;
  for (const t of targets) {
    t.el.style.willChange = on ? 'transform' : '';
  }
}

function update() {
  rafId = 0;
  const y = window.scrollY;
  // 히어로를 지나면 더 이상 움직일 필요가 없습니다. 값이 무한히 커지는 것을 막습니다.
  const cap = window.innerHeight * 1.5;
  const scrolled = Math.min(y, cap);

  for (const t of targets) {
    // speed가 음수면 스크롤보다 느리게(뒤처져) 움직입니다.
    const offset = -t.speed * scrolled;
    t.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  }
}

function onScroll() {
  setWillChange(true);
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => setWillChange(false), WILL_CHANGE_IDLE_MS);

  if (rafId) return;
  rafId = window.requestAnimationFrame(update);
}

/** 요소를 패럴랙스 대상으로 등록합니다. 반환된 함수를 호출하면 해제됩니다. */
export function registerParallax(el: HTMLElement, speed: number): () => void {
  if (prefersReducedMotion() || targets.size >= MAX_TARGETS) {
    return () => {};
  }

  const target: Target = { el, speed };
  targets.add(target);

  if (!listening) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    listening = true;
  }

  update(); // 새로고침으로 중간 위치에서 시작한 경우 대비

  return () => {
    targets.delete(target);
    el.style.willChange = '';
    el.style.transform = '';

    if (targets.size === 0 && listening) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(idleTimer);
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      listening = false;
      willChangeOn = false;
    }
  };
}

/* ── 뷰포트 진입 감지 ──────────────────────────────────────── */

/**
 * 요소가 뷰포트에 들어오면 콜백을 한 번만 실행하고 관찰을 끊습니다.
 * 재진입 시 다시 재생하지 않습니다.
 */
export function observeOnce(
  el: Element,
  onEnter: () => void,
  /**
   * 화면에 닿기 전에 미리 시작합니다.
   *
   * 전에는 threshold 0.15에 아래쪽을 8% 더 들여봐서, 섹션이 이미 화면에 다 들어온
   * 뒤에야 애니메이션이 시작됐습니다. 스크롤하는 동안 빈 자리를 보다가
   * 갑자기 전부 나타나는 것처럼 느껴진 원인입니다.
   *
   * 아래 여백을 +20%로 두면 뷰포트 바닥에서 한 화면의 20% 아래에 있을 때
   * 이미 관찰되어, 눈에 들어올 즈음에는 전환이 거의 끝나 있습니다.
   */
  options: IntersectionObserverInit = { threshold: 0, rootMargin: '0px 0px 20% 0px' },
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    onEnter();
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      observer.disconnect();
      onEnter();
    }
  }, options);

  observer.observe(el);
  return () => observer.disconnect();
}
