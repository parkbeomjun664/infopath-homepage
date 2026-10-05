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

`NEXT_PUBLIC_INDEXING_MODE` 하나로 세 단계를 전환합니다. 판단 로직은
[lib/indexing.ts](lib/indexing.ts)에 모여 있습니다.

| 모드 | robots.txt | 메타 · 헤더 | 쓰는 때 |
|---|---|---|---|
| `public` | 크롤링 허용 + sitemap | `index, follow` | 정식 공개 |
| `hidden` | **크롤링 허용** + sitemap | `noindex, nofollow` | 검색에서 빼는 중 |
| `blocked` | `Disallow: /` | `noindex, nofollow` | 색인에서 다 빠진 뒤 |

미설정 시 `blocked`입니다. 로컬과 프리뷰 배포를 보호하기 위한 기본값입니다.

> **`hidden`에서 크롤링을 허용하는 이유** — 색인에서 빼려면 크롤러가 페이지를 가져가
> `noindex`를 읽어야 합니다. `robots.txt`로 막으면 그걸 읽지 못해, 이미 등록된 주소가
> 색인에 그대로 남고 제목·설명만 사라진 「이 페이지에 관한 정보가 없습니다」 상태로 굳습니다.
> **빼려면 먼저 읽히게 해야 합니다.** 그래서 `blocked`는 소멸을 확인한 **뒤에** 씁니다.

HTML 밖의 파일(이미지·PDF)은 메타 태그를 달 수 없어 `public`이 아닌 모드에서는
`X-Robots-Tag` 응답 헤더로 함께 덮습니다 ([next.config.ts](next.config.ts)).
`sitemap.xml`·`robots.txt`는 그 헤더에서 제외합니다 — 크롤러를 빨리 불러들여야 하는
경로에 `noindex`를 붙이는 것은 목적과 어긋납니다.

**현재 상태: `hidden`** — INFOLINK가 마무리되지 않아 2026-10-05부터 검색에서 내리는 중입니다.
경위와 복귀 절차는 [docs/progress.md](docs/progress.md), 실행 순서는
[docs/deploy.md](docs/deploy.md) 9장을 보십시오.

> 이전 변수 `NEXT_PUBLIC_ALLOW_INDEXING=true`는 `public`으로 해석되도록 호환을 남겨
> 두었습니다. 새 변수를 등록한 뒤에는 지워도 됩니다.

## 저장소에 없는 것

`.gitignore`로 제외합니다.

- `node_modules/`, `.next/` — 빌드가 다시 만듭니다
- `assets-source/` — 원본 이미지. 배포에 쓰이는 것은 `public/images/`에만 둡니다
- `.env*.local` — 실제 키가 담긴 파일
