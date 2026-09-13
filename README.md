# INFOPATH 홈페이지

주식회사 인포패스 회사 홈페이지. 국문·영문 이중 언어.

운영: <https://infopath.co.kr>

## 스택

| | |
|---|---|
| 프레임워크 | Next.js 15 (App Router) · React 19 |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS 3 |
| 다국어 | next-intl — `ko` (기본) · `en` |
| 문의 메일 | Resend |
| 호스팅 | Vercel |

전 페이지 정적 생성(SSG)입니다. 서버 함수는 문의 폼 처리용 `/api/inquiry` 하나뿐입니다.

## 페이지

| 경로 | 내용 |
|---|---|
| `/` | 메인 |
| `/infolink` | 자체 MES 플랫폼 INFOLINK |
| `/about` | 회사 소개 · 회사 개요 · 수행 실적 · 사업자 정보 |
| `/contact` | 도입 문의 폼 |
| `/privacy` | 개인정보처리방침 |

각 경로 앞에 로케일이 붙습니다 (`/ko/about`, `/en/about`).

## 개발

```bash
npm install
cp .env.example .env.local   # 값을 채웁니다
npm run dev
```

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run typecheck` | 타입 검사 (`tsc --noEmit`) |
| `npm run lint` | 린트 |

개발 모드에서는 **아직 자료가 채워지지 않은 자리**가 점선 상자로 표시됩니다. 운영 빌드에서는
그 자리들이 렌더링되지 않습니다 — 빈 「대표자 —」는 정보가 아니라 미완성 신호이기 때문입니다.

## 콘텐츠 수정

화면에 나가는 값은 대부분 두 곳에 모여 있습니다.

| 파일 | 담는 것 |
|---|---|
| `content/site.ts` | 회사 정보, 섹션 on/off 플래그, 자산 경로 |
| `content/messages/{ko,en}.ts` | 모든 문구 |

`ko.ts`와 `en.ts`는 구조가 같아야 합니다. 한쪽에만 키를 추가하면 타입 검사에서 걸립니다.

### 자료가 오면 켜지는 자리

값을 채우고 플래그를 바꾸면 관련 섹션이 함께 나타납니다.

| 자리 | 켜는 법 |
|---|---|
| 대표자 소개 | `CEO_PROFILE`에 값을 넣고 `pending: false` |
| 구축 방식 | `BUILD_STEPS`를 채우고 `SECTIONS.buildProcess: true` |
| 적용 사례 | `CASE_STUDIES`를 채우고 `SECTIONS.cases: true` |
| 제품 화면 캡처 | `PRODUCT_SHOT`에 경로를 넣고 `pending: false` |

## 배포

`main`에 푸시하면 Vercel이 빌드·배포합니다.

환경변수는 Vercel 대시보드(Settings → Environment Variables)에서 관리합니다. 필요한 키는
`.env.example`에 정리돼 있습니다. DNS·도메인·메일 발송 설정은 [docs/deploy.md](docs/deploy.md)를
참고하십시오.

> **주의** — 같은 DNS에 회사 그룹웨어 메일이 걸려 있습니다. MX·SPF 레코드를 건드리면
> 홈페이지가 아니라 회사 메일이 멈춥니다. `docs/deploy.md` 4장과 5장을 먼저 읽으십시오.

## 검색 노출

현재 **의도적으로 차단**되어 있습니다 (`robots.txt`가 `Disallow: /`). 개인정보처리방침이
법무 검토 전 초안이기 때문입니다. 확정 후 Vercel에 `NEXT_PUBLIC_ALLOW_INDEXING=true`를
등록하고 재배포하면 열립니다.

## 저장소에 없는 것

`.gitignore`로 제외합니다.

- `node_modules/`, `.next/` — 빌드가 다시 만듭니다
- `assets-source/` — 원본 이미지. 배포에 쓰이는 것은 `public/images/`에만 둡니다
- `.env*.local` — 실제 키가 담긴 파일
