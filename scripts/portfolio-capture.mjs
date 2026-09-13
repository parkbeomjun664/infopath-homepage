// 크몽 포트폴리오용 이미지 캡처 + 가공 스크립트
// 사용법: node scripts/portfolio-capture.mjs  (로컬 dev 서버가 http://localhost:3000 에 떠 있어야 함)

import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'portfolio-images');
const BASE_URL = 'http://localhost:3000';
const BRAND_NAVY = '#003060'; // navy-700, 로고 코어
const BG = '#FAFBFC';

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// 화면 경계용 얇은 그림자+테두리 프레임을 씌운다
async function frame(buffer, { pad = 20 } = {}) {
  const img = sharp(buffer);
  const meta = await img.metadata();
  const w = meta.width;
  const h = meta.height;
  const canvasW = w + pad * 2;
  const canvasH = h + pad * 2;

  const shadowSvg = Buffer.from(`
    <svg width="${canvasW}" height="${canvasH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0B1F3A" flood-opacity="0.18"/>
        </filter>
      </defs>
      <rect x="${pad}" y="${pad}" width="${w}" height="${h}" fill="#ffffff" filter="url(#s)"/>
      <rect x="${pad + 0.5}" y="${pad + 0.5}" width="${w - 1}" height="${h - 1}" fill="none" stroke="#E2E6EC" stroke-width="1"/>
    </svg>
  `);

  return sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: BG } })
    .composite([
      { input: shadowSvg, left: 0, top: 0 },
      { input: buffer, left: pad, top: pad },
    ])
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

async function main() {
  const browser = await chromium.launch();

  // ── 데스크톱 컨텍스트 ─────────────────────────────
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce', // Reveal.tsx가 이걸 감지하면 등장 애니메이션 없이 즉시 최종 상태로 렌더
  });

  const home = await desktop.newPage();
  await home.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  // 1) 데스크톱 히어로 전체 화면
  const heroEl = home.locator('main#main section').first();
  await heroEl.waitFor({ state: 'visible' });
  const heroRaw = await heroEl.screenshot();
  await sharp(await resizeToSpec(await frame(heroRaw), { width: 1200 })).toFile(path.join(OUT_DIR, 'detail-01.png'));
  console.log('detail-01.png (히어로) 완료');

  // 표지용 히어로 원본(프레임 없이, 작게) 따로 확보
  const heroForCover = await heroEl.screenshot();

  const infolink = await desktop.newPage();
  await infolink.goto(`${BASE_URL}/infolink`, { waitUntil: 'networkidle' });

  // 전역 헤더(fixed)가 섹션 단독 캡처 위에 겹쳐 보이는 것을 방지
  await infolink.addStyleTag({ content: 'header{display:none!important} nav.sticky{top:0!important}' });

  // 2) 솔루션 섹션 (텍스트-이미지 교차 배치) — SolutionFeature.tsx, id="how"
  const howEl = infolink.locator('section#how');
  await howEl.scrollIntoViewIfNeeded();
  await howEl.waitFor({ state: 'visible' });
  await infolink.waitForTimeout(200);
  const howRaw = await howEl.screenshot();
  await sharp(await resizeToSpec(await frame(howRaw), { width: 1200 })).toFile(path.join(OUT_DIR, 'detail-02.png'));
  console.log('detail-02.png (솔루션 섹션) 완료');

  // 3) INFOLINK 아키텍처 섹션 — Architecture.tsx, id="architecture"
  const archEl = infolink.locator('section#architecture');
  await archEl.scrollIntoViewIfNeeded();
  await archEl.waitFor({ state: 'visible' });
  // 다이어그램 이미지가 지연 로딩되므로 실제로 다 그려질 때까지 대기
  await archEl.locator('img').first().waitFor({ state: 'visible' });
  await infolink.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const imgs = [...el.querySelectorAll('img')];
      return imgs.length > 0 && imgs.every((img) => img.complete && img.naturalWidth > 0);
    },
    'section#architecture',
    { timeout: 15000 },
  );
  await infolink.waitForTimeout(200);
  const archRaw = await archEl.screenshot();
  // 계층 아코디언(6개)까지 펼치면 세로로 너무 길어지므로, 제목+설명+다이어그램까지만 담는다
  await sharp(await resizeToSpec(await frame(archRaw), { width: 1200, maxHeight: 1500 })).toFile(path.join(OUT_DIR, 'detail-03.png'));
  console.log('detail-03.png (아키텍처 섹션) 완료');

  // 4) 문의 폼 페이지
  const contact = await desktop.newPage();
  await contact.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' });
  const contactMain = contact.locator('main#main');
  await contactMain.waitFor({ state: 'visible' });
  const contactRaw = await contactMain.screenshot();
  await sharp(await resizeToSpec(await frame(contactRaw), { width: 1200 })).toFile(path.join(OUT_DIR, 'detail-04.png'));
  console.log('detail-04.png (문의 폼) 완료');

  await home.close();
  await infolink.close();
  await contact.close();
  await desktop.close();

  // ── 모바일 컨텍스트 ─────────────────────────────
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
    isMobile: true,
    hasTouch: true,
  });

  const mobileShots = [];
  for (const url of ['/', '/infolink', '/contact']) {
    const p = await mobile.newPage();
    await p.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle' });
    const shot = await p.screenshot(); // 뷰포트 첫 화면만
    mobileShots.push(await frame(shot, { pad: 14 }));
    await p.close();
  }
  await mobile.close();

  // 5) 모바일 화면 3종 가로 합성
  const metas = await Promise.all(mobileShots.map((b) => sharp(b).metadata()));
  const gap = 24;
  const totalW = metas.reduce((s, m) => s + m.width, 0) + gap * (metas.length - 1);
  const maxH = Math.max(...metas.map((m) => m.height));
  let x = 0;
  const composites = [];
  for (let i = 0; i < mobileShots.length; i++) {
    composites.push({ input: mobileShots[i], left: x, top: Math.round((maxH - metas[i].height) / 2) });
    x += metas[i].width + gap;
  }
  const mobileComposite = await sharp({ create: { width: totalW, height: maxH, channels: 4, background: BG } })
    .composite(composites)
    .png()
    .toBuffer();
  await sharp(await resizeToSpec(mobileComposite, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'detail-05.png'));
  console.log('detail-05.png (모바일 3종) 완료');

  // ── 대표 이미지 (cover.png) ─────────────────────────────
  const fontPath = path.join(ROOT, 'public', 'fonts', 'PretendardVariable.woff2');
  const fontBase64 = readFileSync(fontPath).toString('base64');
  const heroPng = await sharp(heroForCover).png().toBuffer();
  const heroMeta = await sharp(heroPng).metadata();

  const CANVAS = 1200;
  const PAD_TOP = 190;
  const PAD_BOTTOM = 150;
  const imgAreaW = CANVAS - 120;
  const imgAreaH = CANVAS - PAD_TOP - PAD_BOTTOM;
  const scale = Math.min(imgAreaW / heroMeta.width, imgAreaH / heroMeta.height);
  const drawW = Math.round(heroMeta.width * scale);
  const drawH = Math.round(heroMeta.height * scale);
  const heroDataUri = `data:image/png;base64,${heroPng.toString('base64')}`;

  const coverHtml = `
  <!doctype html><html><head><meta charset="utf-8">
  <style>
    @font-face {
      font-family: 'Pretendard';
      src: url(data:font/woff2;base64,${fontBase64}) format('woff2');
      font-weight: 400 900;
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { width:${CANVAS}px; height:${CANVAS}px; background:${BG}; font-family:'Pretendard', sans-serif; }
    .wrap { position:relative; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:space-between; }
    .top { padding-top:64px; text-align:center; }
    .eyebrow { font-size:22px; font-weight:600; letter-spacing:-0.01em; color:${BRAND_NAVY}; }
    .shot-wrap { display:flex; align-items:center; justify-content:center; }
    .shot { width:${drawW}px; height:${drawH}px; border-radius:14px; overflow:hidden; box-shadow:0 20px 44px rgba(11,31,58,0.16); border:1px solid #E2E6EC; }
    .shot img { width:100%; height:100%; object-fit:cover; display:block; }
    .bottom { padding-bottom:56px; text-align:center; }
    .stack { font-size:17px; font-weight:500; letter-spacing:0.02em; color:${BRAND_NAVY}; opacity:0.82; }
  </style></head>
  <body>
    <div class="wrap">
      <div class="top"><div class="eyebrow">제조 IT 기업 홈페이지</div></div>
      <div class="shot-wrap"><div class="shot"><img src="${heroDataUri}"/></div></div>
      <div class="bottom"><div class="stack">Next.js · TypeScript</div></div>
    </div>
  </body></html>`;

  const composePage = await browser.newPage({ viewport: { width: CANVAS, height: CANVAS }, deviceScaleFactor: 1 });
  await composePage.setContent(coverHtml, { waitUntil: 'networkidle' });
  await composePage.waitForTimeout(150); // 폰트 적용 대기
  const coverBuf = await composePage.screenshot({ clip: { x: 0, y: 0, width: CANVAS, height: CANVAS } });
  await sharp(coverBuf).png().toFile(path.join(OUT_DIR, 'cover.png'));
  await composePage.close();
  console.log('cover.png 완료');

  await browser.close();
  console.log('전체 완료 →', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
