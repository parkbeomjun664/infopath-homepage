// 크몽 서비스 등록용 판매 썸네일 이미지 생성 스크립트
// main.png(652x488, 목록 썸네일) + detail-01~05.png(상세 이미지, 각 상단 큰 제목)
// 04·05는 캡처가 아니라 HTML/CSS로 직접 그린다.

import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'service-images');
const BASE_URL = 'http://localhost:3000';

const NAVY = '#1B3A6B';
const NAVY_DARK = '#0F274D';
const GREEN = '#48A830';
const BG = '#F7F8FA';

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const fontPath = path.join(ROOT, 'public', 'fonts', 'PretendardVariable.woff2');
const FONT_B64 = readFileSync(fontPath).toString('base64');
const FONT_FACE = `
  @font-face {
    font-family: 'Pretendard';
    src: url(data:font/woff2;base64,${FONT_B64}) format('woff2');
    font-weight: 100 900;
  }
  * { font-family: 'Pretendard', 'Malgun Gothic', sans-serif; }
`;

async function frame(buffer, { pad = 18, radius = 10 } = {}) {
  const meta = await sharp(buffer).metadata();
  const w = meta.width;
  const h = meta.height;
  const canvasW = w + pad * 2;
  const canvasH = h + pad * 2;
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${radius}" fill="#fff"/></svg>`
  );
  const rounded = await sharp(buffer).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const shadowSvg = Buffer.from(`
    <svg width="${canvasW}" height="${canvasH}" xmlns="http://www.w3.org/2000/svg">
      <defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#0F274D" flood-opacity="0.22"/>
      </filter></defs>
      <rect x="${pad}" y="${pad}" width="${w}" height="${h}" rx="${radius}" fill="#fff" filter="url(#s)"/>
    </svg>`);
  return sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: shadowSvg }, { input: rounded, left: pad, top: pad }])
    .png()
    .toBuffer();
}

async function resizeToSpec(buffer, { width = 1200, maxHeight = 3000 } = {}) {
  let out = await sharp(buffer).resize({ width }).png().toBuffer();
  const meta = await sharp(out).metadata();
  if (meta.height > maxHeight) {
    out = await sharp(out).extract({ left: 0, top: 0, width: meta.width, height: maxHeight }).png().toBuffer();
  }
  return out;
}

// 상세 이미지 공통 틀: 상단 큰 제목 + 본문(HTML 조각). 5장 모두 이 틀을 공유해 톤을 통일한다.
function detailShell(eyebrow, title, bodyHtml, { bodyMaxWidth = 1120 } = {}) {
  return `
  <!doctype html><html><head><meta charset="utf-8"><style>
    ${FONT_FACE}
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:1200px;background:${BG};}
    .titlebar{padding:56px 60px 40px;background:linear-gradient(180deg,#ffffff 0%,${BG} 100%);}
    .eyebrow{display:inline-block;font-size:14px;font-weight:700;letter-spacing:0.12em;color:${GREEN};
      background:rgba(72,168,48,0.1);padding:5px 12px;border-radius:999px;margin-bottom:16px;}
    h1{font-size:44px;font-weight:800;color:${NAVY_DARK};letter-spacing:-0.02em;line-height:1.25;}
    .rule{width:64px;height:5px;background:${GREEN};border-radius:3px;margin-top:20px;}
    .body{padding:8px 60px 64px;display:flex;flex-direction:column;align-items:center;}
    .bodyInner{width:100%;max-width:${bodyMaxWidth}px;}
  </style></head>
  <body>
    <div class="titlebar">
      <span class="eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      <div class="rule"></div>
    </div>
    <div class="body"><div class="bodyInner">${bodyHtml}</div></div>
  </body></html>`;
}

async function renderHtmlToPng(browser, html, { width = 1200 } = {}) {
  const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(150);
  const buf = await page.screenshot({ fullPage: true });
  await page.close();
  return buf;
}

function imgTag(buffer, extraStyle = '') {
  return `<img src="data:image/png;base64,${buffer.toString('base64')}" style="width:100%;display:block;${extraStyle}"/>`;
}

async function main() {
  const browser = await chromium.launch();

  // ── 데스크톱 캡처 ─────────────────────────────
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await desktop.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  const heroShot = await page.screenshot(); // main.png 우측 패널 + detail-01 공용

  // 1) 이런 홈페이지를 만듭니다
  const d1Html = detailShell(
    'PORTFOLIO',
    '이런 홈페이지를 만듭니다',
    imgTag(await frame(await resizeToSpec(heroShot, { width: 1080 })))
  );
  const d1 = await renderHtmlToPng(browser, d1Html);
  await sharp(await resizeToSpec(d1, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'detail-01.png'));
  console.log('detail-01.png 완료');

  // 3) 문의 폼까지 동작합니다 — 검증 에러 상태
  await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '문의 보내기' }).click();
  await page.waitForTimeout(400);
  const contactMain = page.locator('main#main');
  const contactShot = await contactMain.screenshot();
  const d3Html = detailShell(
    'CONTACT',
    '문의 폼까지 동작합니다',
    imgTag(await frame(await resizeToSpec(contactShot, { width: 900 })))
  );
  const d3 = await renderHtmlToPng(browser, d3Html);
  await sharp(await resizeToSpec(d3, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'detail-03.png'));
  console.log('detail-03.png 완료');

  await page.close();
  await desktop.close();

  // ── 모바일 캡처 (2 · 모바일에서도 그대로) ─────────────────────────────
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
    isMobile: true,
    hasTouch: true,
  });
  const mobileShots = [];
  let mobileHeroShot = null;
  for (const url of ['/', '/infolink', '/contact']) {
    const p = await mobile.newPage();
    await p.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle' });
    const shot = await p.screenshot();
    if (url === '/') mobileHeroShot = shot;
    mobileShots.push(await frame(shot, { pad: 12 }));
    await p.close();
  }
  await mobile.close();

  const metas = await Promise.all(mobileShots.map((b) => sharp(b).metadata()));
  const gap = 22;
  const totalW = metas.reduce((s, m) => s + m.width, 0) + gap * (metas.length - 1);
  const maxH = Math.max(...metas.map((m) => m.height));
  const composites = [];
  let x = 0;
  for (let i = 0; i < mobileShots.length; i++) {
    composites.push({ input: mobileShots[i], left: x, top: 0 });
    x += metas[i].width + gap;
  }
  const mobileComposite = await sharp({ create: { width: totalW, height: maxH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites)
    .png()
    .toBuffer();
  const d2Html = detailShell('RESPONSIVE', '모바일에서도 그대로', imgTag(mobileComposite), { bodyMaxWidth: 1150 });
  const d2 = await renderHtmlToPng(browser, d2Html);
  await sharp(await resizeToSpec(d2, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'detail-02.png'));
  console.log('detail-02.png 완료');

  // ── 4) 작업 진행 방식 — 코드로 직접 그리는 인포그래픽 ─────────────────────────────
  const STEPS = [
    { day: 'Day 1', title: '상담', desc: '요구사항·레퍼런스 확인', icon: '💬' },
    { day: 'Day 1-2', title: '구조 확정', desc: '메뉴·페이지 구조 합의', icon: '🗂️' },
    { day: 'Day 3-8', title: '개발', desc: '디자인 반영 + 기능 구현', icon: '💻' },
    { day: 'Day 9', title: '중간 점검', desc: '피드백 반영·수정', icon: '🔍' },
    { day: 'Day 10', title: '배포', desc: '도메인 연결·최종 전달', icon: '🚀' },
  ];
  const stepCards = STEPS.map(
    (s, i) => `
    <div style="display:flex;align-items:center;">
      <div style="width:196px;background:#fff;border:1.5px solid #E4E8EF;border-radius:16px;padding:24px 18px;text-align:center;box-shadow:0 6px 16px rgba(15,39,77,0.06);">
        <div style="font-size:32px;">${s.icon}</div>
        <div style="margin-top:10px;font-size:12px;font-weight:700;color:${GREEN};letter-spacing:0.04em;">${s.day}</div>
        <div style="margin-top:6px;font-size:19px;font-weight:800;color:${NAVY_DARK};">${s.title}</div>
        <div style="margin-top:8px;font-size:13px;color:#5b6472;line-height:1.5;">${s.desc}</div>
      </div>
      ${i < STEPS.length - 1 ? `<div style="width:36px;height:3px;background:${GREEN};margin:0 6px;border-radius:2px;"></div>` : ''}
    </div>`
  ).join('');
  const d4Body = `<div style="display:flex;align-items:center;justify-content:center;flex-wrap:nowrap;">${stepCards}</div>`;
  const d4Html = detailShell('PROCESS', '작업 진행 방식', d4Body, { bodyMaxWidth: 1150 });
  const d4 = await renderHtmlToPng(browser, d4Html, { width: 1200 });
  await sharp(await resizeToSpec(d4, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'detail-04.png'));
  console.log('detail-04.png 완료');

  // ── 5) 패키지 비교 — 코드로 직접 그리는 표 ─────────────────────────────
  const PLANS = [
    { name: 'BASIC', highlight: false, rows: ['5페이지 이내', '반응형(PC·모바일)\n기본 문의폼', '2회', '7일'] },
    { name: 'STANDARD', highlight: true, rows: ['10페이지 이내', '반응형 + 한/영 다국어\n문의폼 이메일 연동', '3회', '10일'] },
    { name: 'DELUXE', highlight: false, rows: ['15페이지 이내', '반응형 + 한/영 다국어\n문의폼·관리자 알림\n인터랙션 애니메이션', '5회', '14일'] },
  ];
  const LABELS = ['페이지 수', '포함 기능', '수정 횟수', '작업 기간'];
  const planCols = PLANS.map(
    (p) => `
    <div style="flex:1;background:${p.highlight ? NAVY : '#fff'};border:1.5px solid ${p.highlight ? NAVY : '#E4E8EF'};
      border-radius:18px;overflow:hidden;${p.highlight ? 'transform:translateY(-10px);box-shadow:0 16px 34px rgba(27,58,107,0.28);' : 'box-shadow:0 6px 16px rgba(15,39,77,0.06);'}">
      <div style="padding:22px 20px;text-align:center;border-bottom:1.5px solid ${p.highlight ? 'rgba(255,255,255,0.18)' : '#E4E8EF'};">
        ${p.highlight ? `<div style="font-size:11px;font-weight:800;color:${GREEN};letter-spacing:0.08em;margin-bottom:6px;">★ 추천</div>` : ''}
        <div style="font-size:22px;font-weight:800;letter-spacing:0.02em;color:${p.highlight ? '#fff' : NAVY_DARK};">${p.name}</div>
      </div>
      ${LABELS.map(
        (label, i) => `
        <div style="padding:18px 20px;border-bottom:${i < LABELS.length - 1 ? `1px solid ${p.highlight ? 'rgba(255,255,255,0.14)' : '#EEF0F4'}` : 'none'};">
          <div style="font-size:12px;font-weight:700;color:${p.highlight ? 'rgba(255,255,255,0.65)' : '#8891A0'};margin-bottom:6px;">${label}</div>
          <div style="font-size:14px;font-weight:600;line-height:1.6;color:${p.highlight ? '#fff' : '#2b3444'};white-space:pre-line;">${p.rows[i]}</div>
        </div>`
      ).join('')}
    </div>`
  ).join('');
  const d5Body = `<div style="display:flex;gap:22px;align-items:flex-start;">${planCols}</div>
    <p style="text-align:center;margin-top:28px;font-size:13px;color:#8891A0;">* 가격 및 옵션은 하단 크몽 견적 정보를 확인해 주세요</p>`;
  const d5Html = detailShell('PACKAGE', '패키지 비교', d5Body, { bodyMaxWidth: 1120 });
  const d5 = await renderHtmlToPng(browser, d5Html, { width: 1200 });
  await sharp(await resizeToSpec(d5, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'detail-05.png'));
  console.log('detail-05.png 완료');

  // ── main.png (652x488, 목록 썸네일) ─────────────────────────────
  const mobileFramed = await frame(mobileHeroShot, { pad: 10, radius: 22 });
  const mobileMeta = await sharp(mobileFramed).metadata();
  const desktopFramed = await frame(heroShot, { pad: 10, radius: 10 });
  const desktopMeta = await sharp(desktopFramed).metadata();

  const W = 652 * 2; // 2x 렌더 후 최종 리사이즈
  const H = 488 * 2;
  const rightW = W * 0.45;
  const dtScale = (rightW * 1.05) / desktopMeta.width; // 우측 영역에 여유 있게, 잘림 최소화
  const dtW = desktopMeta.width * dtScale;
  const dtH = desktopMeta.height * dtScale;
  const mbScale = (rightW * 0.32) / mobileMeta.width; // 데스크톱보다 확연히 작게 — "겹친 기기" 구도
  const mbW = mobileMeta.width * mbScale;
  const mbH = mobileMeta.height * mbScale;

  const mainHtml = `
  <!doctype html><html><head><meta charset="utf-8"><style>
    ${FONT_FACE}
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:${W}px;height:${H}px;overflow:hidden;background:linear-gradient(135deg,#ffffff 0%,#EEF1F6 60%,#E4E9F2 100%);position:relative;}
    .accent{position:absolute;top:0;left:0;width:14px;height:100%;background:linear-gradient(180deg,${NAVY} 0%,${GREEN} 100%);}
    .left{position:absolute;left:64px;top:0;width:${W * 0.55 - 64}px;height:100%;display:flex;flex-direction:column;justify-content:center;gap:22px;}
    .kicker{font-size:22px;font-weight:700;color:${GREEN};letter-spacing:-0.01em;}
    .headline{font-size:58px;font-weight:800;line-height:1.28;color:${NAVY_DARK};letter-spacing:-0.02em;}
    .badge{display:inline-flex;align-items:center;gap:10px;background:${NAVY};color:#fff;font-size:20px;font-weight:700;
      padding:12px 22px;border-radius:999px;width:fit-content;box-shadow:0 10px 22px rgba(27,58,107,0.28);}
    .badge .dot{width:8px;height:8px;border-radius:50%;background:${GREEN};}
    .right{position:absolute;right:0;top:0;width:${W * 0.45}px;height:100%;overflow:visible;}
    .desktop-shot{position:absolute;right:-30px;top:${H * 0.5 - dtH * 0.42}px;width:${dtW}px;
      transform:rotate(-6deg);border-radius:14px;overflow:hidden;}
    .mobile-shot{position:absolute;left:-6px;bottom:-16px;width:${mbW}px;
      transform:rotate(6deg);z-index:5;filter:drop-shadow(0 14px 22px rgba(15,39,77,0.32));}
  </style></head>
  <body>
    <div class="accent"></div>
    <div class="left">
      <div class="kicker">기획부터 배포까지</div>
      <div class="headline">반응형 기업<br/>홈페이지 제작</div>
      <div class="badge"><span class="dot"></span>Next.js · TypeScript</div>
    </div>
    <div class="right">
      <img class="desktop-shot" src="data:image/png;base64,${desktopFramed.toString('base64')}"/>
      <img class="mobile-shot" src="data:image/png;base64,${mobileFramed.toString('base64')}"/>
    </div>
  </body></html>`;

  const mainPage = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await mainPage.setContent(mainHtml, { waitUntil: 'networkidle' });
  await mainPage.waitForTimeout(150);
  const mainBuf = await mainPage.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
  await mainPage.close();
  await sharp(mainBuf).resize(652, 488).png().toFile(path.join(OUT_DIR, 'main.png'));
  console.log('main.png 완료');

  await browser.close();
  console.log('전체 완료 →', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
