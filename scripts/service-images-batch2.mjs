// 크몽 서비스 상세 이미지 추가 4장: process.png, package.png, meet-here-01/02.png
// 1·2는 순수 HTML/CSS로 그리고, 3·4는 meet-here-kr.vercel.app을 실제 조작해 캡처한다.
// 기존 detail-01~03(인포패스)과 같은 "제목바 + 본문" 톤을 그대로 이어간다.

import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'service-images');

const NAVY = '#1B3A6B';
const NAVY_DARK = '#122a52';
const GREEN = '#4A9B5E';
const BG = '#F7F8FA';
const GRAY = '#9AA3B2';

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const fontPath = path.join(ROOT, 'public', 'fonts', 'PretendardVariable.woff2');
const FONT_B64 = readFileSync(fontPath).toString('base64');
const FONT_FACE = `
  @font-face { font-family: 'Pretendard'; src: url(data:font/woff2;base64,${FONT_B64}) format('woff2'); font-weight: 100 900; }
  * { font-family: 'Pretendard', 'Malgun Gothic', sans-serif; }
`;

function shell(eyebrow, title, bodyHtml, { bodyMaxWidth = 1120 } = {}) {
  return `
  <!doctype html><html><head><meta charset="utf-8"><style>
    ${FONT_FACE}
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:1200px;background:${BG};}
    .titlebar{padding:56px 60px 40px;background:linear-gradient(180deg,#ffffff 0%,${BG} 100%);}
    .eyebrow{display:inline-block;font-size:14px;font-weight:700;letter-spacing:0.12em;color:${GREEN};
      background:rgba(74,155,94,0.1);padding:5px 12px;border-radius:999px;margin-bottom:16px;}
    h1{font-size:48px;font-weight:800;color:${NAVY_DARK};letter-spacing:-0.02em;line-height:1.25;}
    .rule{width:64px;height:5px;background:${GREEN};border-radius:3px;margin-top:20px;}
    .body{padding:8px 60px 64px;display:flex;flex-direction:column;align-items:center;}
    .bodyInner{width:100%;max-width:${bodyMaxWidth}px;}
  </style></head>
  <body>
    <div class="titlebar"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><div class="rule"></div></div>
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

async function resizeToSpec(buffer, { width = 1200, maxHeight = 3000 } = {}) {
  let out = await sharp(buffer).resize({ width }).png().toBuffer();
  const meta = await sharp(out).metadata();
  if (meta.height > maxHeight) {
    out = await sharp(out).extract({ left: 0, top: 0, width: meta.width, height: maxHeight }).png().toBuffer();
  }
  return out;
}

async function frame(buffer, { pad = 18, radius = 10 } = {}) {
  const meta = await sharp(buffer).metadata();
  const w = meta.width, h = meta.height;
  const canvasW = w + pad * 2, canvasH = h + pad * 2;
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${radius}" fill="#fff"/></svg>`);
  const rounded = await sharp(buffer).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const shadowSvg = Buffer.from(`
    <svg width="${canvasW}" height="${canvasH}" xmlns="http://www.w3.org/2000/svg">
      <defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#122a52" flood-opacity="0.22"/>
      </filter></defs>
      <rect x="${pad}" y="${pad}" width="${w}" height="${h}" rx="${radius}" fill="#fff" filter="url(#s)"/>
    </svg>`);
  return sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: shadowSvg }, { input: rounded, left: pad, top: pad }])
    .png()
    .toBuffer();
}

function imgTag(buffer) {
  return `<img src="data:image/png;base64,${buffer.toString('base64')}" style="width:100%;display:block;"/>`;
}

async function main() {
  const browser = await chromium.launch();

  // ── 1) process.png — 진행 방식 인포그래픽 (세로 흐름) ─────────────────────────────
  const STEPS = [
    { title: '상담 및 견적', period: '1일', desc: '필요한 내용을 듣고 구성·비용·기간을 정리해 드립니다' },
    { title: '구조 설계 및 확정', period: '2~3일', desc: '어떤 내용을 어떤 순서로 보여줄지 문서로 정리' },
    { title: '디자인 및 개발', period: null, desc: '작업 중인 화면을 링크로 공유, 과정을 직접 확인' },
    { title: '중간 점검', period: null, desc: '전체 화면 확인 후 수정 요청 반영' },
    { title: '최종 확인 및 배포', period: null, desc: '도메인 연결, SSL 적용' },
    { title: '납품 및 사후 지원', period: null, desc: '30일간 오류 무상 수정' },
  ];
  const stepRows = STEPS.map((s, i) => `
    <div style="display:flex;gap:28px;">
      <div style="display:flex;flex-direction:column;align-items:center;width:56px;flex-shrink:0;">
        <div style="width:56px;height:56px;border-radius:50%;background:${NAVY};color:#fff;
          display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;flex-shrink:0;">${i + 1}</div>
        ${i < STEPS.length - 1 ? `<div style="width:3px;flex:1;background:#DCE1EA;margin-top:6px;min-height:52px;"></div>` : ''}
      </div>
      <div style="padding-bottom:${i < STEPS.length - 1 ? 44 : 0}px;padding-top:8px;">
        <div style="font-size:24px;font-weight:800;color:${NAVY_DARK};">
          ${s.title}${s.period ? `<span style="font-size:16px;font-weight:700;color:${GREEN};margin-left:10px;">(${s.period})</span>` : ''}
        </div>
        <div style="margin-top:8px;font-size:16px;color:${GRAY};line-height:1.6;">${s.desc}</div>
      </div>
    </div>`).join('');
  const processHtml = shell('PROCESS', '이렇게 진행됩니다', stepRows, { bodyMaxWidth: 760 });
  const processBuf = await renderHtmlToPng(browser, processHtml);
  await sharp(await resizeToSpec(processBuf, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'process.png'));
  console.log('process.png 완료');

  // ── 2) package.png — 패키지 비교표 ─────────────────────────────
  const CHECK = `<span style="color:${GREEN};font-size:20px;font-weight:800;">&#10003;</span>`;
  const DASH = `<span style="color:${GRAY};font-size:18px;">&mdash;</span>`;
  const PLANS = [
    { name: 'STANDARD', highlight: false },
    { name: 'DELUXE', highlight: true },
    { name: 'PREMIUM', highlight: false },
  ];
  const ROWS = [
    { label: '페이지 수', values: ['1p', '3~4p', '5~6p'] },
    { label: '반응형 대응', values: [CHECK, CHECK, CHECK] },
    { label: '문의 폼', values: [CHECK, CHECK, CHECK] },
    { label: '검색 최적화', values: [CHECK, CHECK, CHECK] },
    { label: '화면설계서', values: [DASH, CHECK, CHECK] },
    { label: '요건정의서', values: [DASH, DASH, CHECK] },
    { label: '다국어 지원', values: [DASH, DASH, CHECK] },
    { label: '소스 코드 제공', values: [CHECK, CHECK, CHECK] },
    { label: '수정 횟수', values: ['2회', '2회', '3회'] },
    { label: '작업 기간', values: ['7일', '14일', '21일'] },
  ];
  const planCols = PLANS.map((p, colIdx) => `
    <div style="flex:1;background:${p.highlight ? NAVY : '#fff'};border:1.5px solid ${p.highlight ? NAVY : '#E4E8EF'};
      border-radius:18px;overflow:hidden;${p.highlight ? 'transform:translateY(-10px);box-shadow:0 16px 34px rgba(27,58,107,0.28);' : 'box-shadow:0 6px 16px rgba(15,39,77,0.06);'}">
      <div style="padding:22px 20px;text-align:center;border-bottom:1.5px solid ${p.highlight ? 'rgba(255,255,255,0.18)' : '#E4E8EF'};">
        ${p.highlight ? `<div style="font-size:11px;font-weight:800;color:#8FE0A6;letter-spacing:0.06em;margin-bottom:6px;">★ 가장 많이 선택</div>` : ''}
        <div style="font-size:21px;font-weight:800;letter-spacing:0.02em;color:${p.highlight ? '#fff' : NAVY_DARK};">${p.name}</div>
      </div>
      ${ROWS.map((row, i) => `
        <div style="padding:16px 20px;border-bottom:${i < ROWS.length - 1 ? `1px solid ${p.highlight ? 'rgba(255,255,255,0.14)' : '#EEF0F4'}` : 'none'};text-align:center;">
          <div style="font-size:11.5px;font-weight:700;color:${p.highlight ? 'rgba(255,255,255,0.6)' : '#8891A0'};margin-bottom:6px;">${row.label}</div>
          <div style="font-size:15px;font-weight:700;color:${p.highlight ? '#fff' : '#2b3444'};">${row.values[colIdx]}</div>
        </div>`).join('')}
    </div>`).join('');
  const packageBody = `<div style="display:flex;gap:20px;align-items:flex-start;">${planCols}</div>
    <p style="text-align:center;margin-top:26px;font-size:13px;color:${GRAY};">* 가격 및 옵션은 하단 크몽 견적 정보를 확인해 주세요</p>`;
  const packageHtml = shell('PACKAGE', '패키지 비교', packageBody, { bodyMaxWidth: 1100 });
  const packageBuf = await renderHtmlToPng(browser, packageHtml);
  await sharp(await resizeToSpec(packageBuf, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'package.png'));
  console.log('package.png 완료');

  // ── 3·4) 여기서 만나! 캡처 ─────────────────────────────
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await desktop.newPage();
  await page.goto('https://meet-here-kr.vercel.app', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const PARTICIPANTS = [
    { name: '철수', query: '강남역' },
    { name: '영희', query: '홍대입구역' },
    { name: '민수', query: '잠실역' },
  ];
  for (const p of PARTICIPANTS) {
    await page.getByPlaceholder("이름 (예: '김철수')").fill(p.name);
    const departureInput = page.getByPlaceholder('출발 역 또는 주소 검색');
    await departureInput.fill(p.query);
    await page.waitForTimeout(600);
    const suggestion = page.locator('li', { hasText: p.query }).first();
    await suggestion.waitFor({ state: 'visible', timeout: 8000 });
    await suggestion.click();
    await page.getByRole('button', { name: '🚗 자동차' }).click();
    await page.getByRole('button', { name: '참여자 추가하기' }).click();
    await page.waitForTimeout(300);
  }

  await page.getByRole('button', { name: /날짜 선택|^\d{4}년/ }).first().click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: String(new Date().getDate()), exact: true }).first().click();
  await page.locator('input[type="time"]').fill('18:00');
  await page.getByRole('button', { name: '약속 시간 확인' }).click();
  await page.waitForTimeout(300);

  console.log('중간지점 계산 중 (실제 경로 API 호출)...');
  await page.getByRole('button', { name: /가장 공평한 중간지점 찾기/ }).click();
  await page.getByRole('button', { name: '멤버별 경로 자세히 보기 →' }).waitFor({ state: 'visible', timeout: 45000 });
  await page.waitForTimeout(2000); // 지도 타일·경로선 완전히 그려질 시간

  // meet-here-01: 메인 화면(참여자 입력 + 지도), 계산 완료 상태
  const shot1 = await page.screenshot();
  const html1 = shell('PORTFOLIO', '개인 프로젝트 — 지도 연동 웹 서비스', imgTag(await frame(await resizeToSpec(shot1, { width: 1080 }))));
  const buf1 = await renderHtmlToPng(browser, html1);
  await sharp(await resizeToSpec(buf1, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'meet-here-01.png'));
  console.log('meet-here-01.png 완료');

  // meet-here-02: 최적경로 탭 — 결과 화면
  await page.getByRole('button', { name: '최적경로' }).click();
  await page.waitForTimeout(2000);
  const shot2 = await page.screenshot();
  const html2 = shell('PORTFOLIO', '지도 API 연동 및 경로 계산 구현', imgTag(await frame(await resizeToSpec(shot2, { width: 1080 }))));
  const buf2 = await renderHtmlToPng(browser, html2);
  await sharp(await resizeToSpec(buf2, { width: 1200, maxHeight: 3000 })).toFile(path.join(OUT_DIR, 'meet-here-02.png'));
  console.log('meet-here-02.png 완료');

  await desktop.close();
  await browser.close();
  console.log('전체 완료 →', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
