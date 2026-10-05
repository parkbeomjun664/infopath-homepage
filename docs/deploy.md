# INFOPATH 웹사이트 배포 가이드

Vercel 배포 + 아이네임즈(inames) DNS 연결 절차입니다.

> ## ⚠️ 가장 먼저 읽을 것 — MX 레코드는 절대 건드리지 마십시오
>
> `infopath.co.kr`의 **MX 레코드는 그룹웨어(회사 메일) 용도**입니다.
> 웹사이트 연결은 **A / CNAME 레코드**만 바꾸면 되고, MX는 아무 관련이 없습니다.
>
> MX를 수정·삭제하면 **회사 메일 수·발신이 즉시 중단**됩니다.
> 아이네임즈 DNS 화면에서 A/CNAME만 수정하고, MX 행은 그대로 두십시오.
>
> Resend 도메인 인증에서 요구하는 레코드도 **TXT와 (선택)CNAME 뿐**입니다.
> 다만 SPF(TXT)는 기존 그룹웨어 설정과 충돌할 수 있으므로 4장을 반드시 확인하십시오.

---

## 1. 사전 준비

| 항목 | 내용 |
|---|---|
| Git 저장소 | GitHub / GitLab / Bitbucket 중 하나에 소스 푸시 |
| Vercel 계정 | https://vercel.com — 저장소 연동 권한 필요 |
| Resend 계정 | https://resend.com — 문의 폼 메일 발송용 |
| 아이네임즈 계정 | https://www.inames.co.kr — DNS 레코드 관리 권한 |

로컬에서 빌드가 통과하는지 먼저 확인합니다.

```bash
npm ci
npm run typecheck
npm run build
```

---

## 2. Vercel 프로젝트 생성

1. Vercel 대시보드 → **Add New → Project**
2. 저장소 선택 → **Import**
3. 빌드 설정은 **기본값 그대로** 둡니다. Next.js가 자동 감지됩니다.

   | 항목 | 값 |
   |---|---|
   | Framework Preset | Next.js |
   | Build Command | `next build` (자동) |
   | Output Directory | (자동) |
   | Install Command | `npm install` (자동) |
   | Node.js Version | 20.x 이상 |

4. **Deploy** — 첫 배포 후 `xxx.vercel.app` 주소가 발급됩니다.

> `next.config.ts`에서 `output`을 지정하지 않습니다. Vercel이 알아서 처리하며,
> `output: 'export'`(정적 export)로 바꾸면 **문의 폼 API와 next/image 최적화가 모두 동작하지 않습니다.**

---

## 3. 환경변수 등록

Vercel → **Settings → Environment Variables** 에서 등록합니다.
`.env.local`은 배포에 포함되지 않으므로 반드시 여기에도 넣어야 합니다.

| 키 | 필수 | 값 | 적용 환경 |
|---|---|---|---|
| `RESEND_API_KEY` | ✅ | Resend에서 발급한 API 키 | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | | `https://infopath.co.kr` | Production |
| `INQUIRY_TO` | | `gepark@infopath.co.kr` | Production, Preview |
| `INQUIRY_FROM` | | `INFOPATH 문의 <noreply@infopath.co.kr>` | Production |
| `NEXT_PUBLIC_INDEXING_MODE` | | `public` · `hidden` · `blocked` (9장) | Production |

> 환경변수를 추가·수정한 뒤에는 **재배포해야 반영됩니다.**
> Deployments → 최신 배포 → ⋯ → **Redeploy**

---

## 4. Resend 도메인 인증 (문의 폼 발송)

인증 전에는 Resend 테스트 발신 주소만 동작하고, 그마저도 **계정 소유자 본인에게만** 전달됩니다.
실제 운영을 위해 `infopath.co.kr` 도메인을 인증해야 합니다.

1. Resend → **Domains → Add Domain** → `infopath.co.kr` 입력
2. 화면에 표시되는 DNS 레코드를 아이네임즈에 등록 (보통 3건)

| 유형 | 호스트 예시 | 용도 |
|---|---|---|
| TXT | `resend._domainkey` | DKIM 서명 |
| TXT | `send` 또는 루트 | SPF |
| MX | `send` (서브도메인) | 반송 처리 — **루트 MX가 아님** |

### ⚠️ 4-1. MX 레코드 주의

Resend가 요구하는 MX는 **`send.infopath.co.kr` 같은 서브도메인용**입니다.
**루트 도메인(`infopath.co.kr`)의 기존 MX는 그룹웨어용이므로 그대로 두십시오.**
호스트 칸이 비어 있거나 `@`인 MX 행은 건드리지 않습니다.

### ⚠️ 4-2. SPF 레코드 주의 — 가장 사고가 잦은 지점

**SPF(TXT) 레코드는 도메인당 하나만 존재해야 합니다.** 두 개가 있으면 `permerror`가 발생해
**기존 그룹웨어 메일까지 스팸 처리될 수 있습니다.**

기존에 이런 레코드가 있다면:

```
v=spf1 include:기존그룹웨어도메인 ~all
```

새 레코드를 추가하지 말고 **기존 행에 Resend를 합쳐서** 수정합니다:

```
v=spf1 include:기존그룹웨어도메인 include:amazonses.com ~all
```

> `include:` 값은 Resend 화면에 표시된 것을 그대로 쓰십시오.
> 변경 전 기존 TXT 값을 반드시 메모해두고, 확신이 서지 않으면 그룹웨어 업체에 문의하십시오.

3. 등록 후 Resend에서 **Verify** — 전파까지 보통 수 분 ~ 최대 48시간

---

## 5. 아이네임즈 DNS — 도메인 연결

1. Vercel → **Settings → Domains** → `infopath.co.kr` 과 `www.infopath.co.kr` 추가
2. Vercel이 표시하는 값을 아이네임즈 → **DNS 관리**에서 등록

| 유형 | 호스트 | 값 | 비고 |
|---|---|---|---|
| A | `@` (또는 공백) | `76.76.21.21` | 루트 도메인 |
| CNAME | `www` | `cname.vercel-dns.com` | www 서브도메인 |

> 실제 값은 **Vercel 화면에 표시된 것을 그대로** 쓰십시오. 위 값은 참고용이며 변경될 수 있습니다.

### 손대지 말아야 할 행

| 유형 | 이유 |
|---|---|
| **MX** | 그룹웨어 메일 수신. 삭제·수정 시 메일 즉시 중단 |
| **SPF TXT** | 4-2 절차대로 *합쳐서* 수정. 새로 추가하지 말 것 |
| **DKIM TXT** | 그룹웨어가 이미 쓰고 있다면 유지 |

### 기존 주차(parking) 설정 해제

현재 `infopath.co.kr`은 아이네임즈 **주차 페이지**로 연결되어 있습니다.
A 레코드를 Vercel 값으로 바꾸기 전에, 아이네임즈의 **웹 포워딩 / 주차 서비스**를 먼저 해제해야 합니다.
해제하지 않으면 포워딩이 우선 적용되어 DNS를 바꿔도 주차 페이지가 계속 뜹니다.

### HTTPS

Vercel이 도메인 연결을 확인하면 **SSL 인증서를 자동 발급·갱신**합니다. 별도 작업이 없습니다.
현재 도메인은 443 연결이 거부되는 상태이므로, 연결 완료 후 `https://infopath.co.kr` 접속을 반드시 확인하십시오.

---

## 6. 재배포

기본 브랜치에 푸시하면 자동 배포됩니다.

```bash
git push origin main        # → Production 자동 배포
```

- **Pull Request** 를 열면 Preview 배포가 따로 생성되어, 운영에 영향 없이 검토할 수 있습니다.
- 문제가 생기면 Vercel → Deployments → 이전 배포 → **Promote to Production** 으로 즉시 롤백됩니다.

---

## 7. 오픈 전 점검

- [ ] `RESEND_API_KEY`가 Production 환경에 등록되어 있는가
- [ ] Resend 도메인 인증이 **Verified** 상태인가
- [ ] 문의 폼 테스트 발송이 `gepark@infopath.co.kr`로 실제 수신되는가
- [ ] **회사 그룹웨어 메일 수·발신이 정상인가** (DNS 변경 직후 반드시 확인)
- [ ] SPF TXT 레코드가 **하나만** 존재하는가
- [ ] 아이네임즈 주차/포워딩이 해제되었는가
- [ ] `https://infopath.co.kr` 인증서 경고 없이 열리는가
- [ ] `www` 유무 양쪽 모두 접속되는가
- [ ] 개인정보처리방침 페이지와 문의 폼 수집 동의 절차가 있는가 — **법적 필수**
- [ ] 푸터 사업자 정보(상호·대표자·사업자등록번호·주소·연락처)가 채워졌는가 — **법적 필수**
- [ ] Google Search Console · 네이버 서치어드바이저 등록 및 sitemap 제출

---

## 8. 문제 해결

| 증상 | 원인 | 조치 |
|---|---|---|
| DNS를 바꿨는데 주차 페이지가 뜸 | 아이네임즈 웹 포워딩이 살아 있음 | 포워딩/주차 서비스 해제 후 전파 대기 |
| 문의 폼 500 오류 | `RESEND_API_KEY` 미등록 | Vercel 환경변수 등록 후 **Redeploy** |
| 문의 메일 미수신 | 도메인 미인증 | Resend Domains에서 Verified 확인 |
| 문의는 오는데 회사 메일이 안 옴 | SPF 레코드 중복 | TXT의 `v=spf1` 행이 하나인지 확인 (4-2) |
| 이미지가 최적화되지 않음 | `output: 'export'`로 변경됨 | `next.config.ts`에서 `output` 제거 |
| 빌드 실패 | 타입 오류 | 로컬에서 `npm run typecheck` 후 수정 |

DNS 전파 확인:

```bash
nslookup infopath.co.kr
nslookup -type=MX infopath.co.kr     # 그룹웨어 MX가 그대로인지 확인
nslookup -type=TXT infopath.co.kr    # SPF가 하나인지 확인
```

---

## 9. 검색 노출 전환 (색인 모드)

`NEXT_PUBLIC_INDEXING_MODE` 하나로 세 단계를 전환합니다.
판단 로직은 [../lib/indexing.ts](../lib/indexing.ts) 한 곳에 있습니다.

| 모드 | robots.txt | 메타 태그 | X-Robots-Tag | 쓰는 때 |
|---|---|---|---|---|
| `public` | 허용 + sitemap | `index, follow` | 없음 | 정식 공개 |
| `hidden` | **허용** + sitemap | `noindex, nofollow` | `noindex, nofollow` | 검색에서 빼는 중 |
| `blocked` | `Disallow: /` | `noindex, nofollow` | `noindex, nofollow` | 색인에서 다 빠진 뒤 |

미설정 시 `blocked`입니다 (로컬·프리뷰 배포 보호).

### ⚠️ 9-1. 순서를 지켜야 하는 이유

**`hidden`을 건너뛰고 바로 `blocked`로 가면 검색에서 빠지지 않습니다.**

색인에서 빼려면 크롤러가 페이지를 가져가서 `noindex`를 읽어야 합니다.
`robots.txt`로 크롤링을 막으면 그걸 읽을 수 없고, 이미 등록된 주소는 색인에 그대로
남아 제목·설명만 사라진 「이 페이지에 관한 정보가 없습니다」 상태로 굳습니다.

구글도 같은 말을 합니다 — robots.txt 차단은 색인 삭제 수단이 **아니고**, 영구적으로
빼는 방법은 `noindex`입니다.

> **빼려면 먼저 읽히게 해야 합니다.**
> `public` → `hidden` → (검색 결과에서 소멸 확인) → `blocked`

`hidden`에서 `sitemap.xml`을 유지하는 것도 같은 이유입니다. 크롤러가 빨리 다시 와서
`noindex`를 읽고 가는 편이 색인 소멸이 빠릅니다. 수집 목록을 치우는 것은
`blocked`로 넘어갈 때 함께 합니다.

### 9-2. 전환 절차 — 검색에서 내리기 (`hidden`)

**1단계 · 환경변수**

Vercel → Settings → Environment Variables

| 키 | 값 | 적용 환경 |
|---|---|---|
| `NEXT_PUBLIC_INDEXING_MODE` | `hidden` | Production |

기존 `NEXT_PUBLIC_ALLOW_INDEXING`은 지워도 되고 둬도 됩니다.
새 변수가 있으면 그쪽이 먼저 읽힙니다 (없을 때만 `true` → `public`으로 해석).

**2단계 · 재배포**

환경변수만 바꿔도 **재배포해야 반영됩니다.** 빌드 시점에 값이 박히기 때문입니다.
`main`에 푸시할 코드 변경이 함께 있으면 그 배포로 같이 반영됩니다.
없으면 Deployments → 최신 배포 → ⋯ → **Redeploy**.

**3단계 · 배포본 검증** — 넷 다 맞아야 합니다.

```bash
# robots.txt — "Allow: /" 여야 합니다 (Disallow 가 아님)
curl -s https://infopath.co.kr/robots.txt

# 메타 태그 — noindex
curl -s https://infopath.co.kr/ | grep -o '<meta name="robots"[^>]*>'

# 응답 헤더 — 페이지와 이미지 모두 noindex
curl -sI https://infopath.co.kr/ | grep -i x-robots-tag
curl -sI https://infopath.co.kr/images/architecture-solution.png | grep -i x-robots-tag

# sitemap 은 유지 — 헤더가 붙지 않아야 하고, URL 8개가 나와야 합니다
curl -sI https://infopath.co.kr/sitemap.xml | grep -i x-robots-tag   # 출력 없음이 정상
curl -s https://infopath.co.kr/sitemap.xml | grep -c "<url>"
```

**4단계 · Google Search Console**

1. **URL 검사**에 `https://infopath.co.kr/` 입력 → **실시간 테스트**
   → 「색인 생성이 허용됨: 아니요 (`noindex` 감지됨)」가 나오는지 확인.
   이게 확인되면 재수집될 때마다 자동으로 빠집니다.
2. **색인 생성 → 삭제**(Removals) → **임시 삭제** → 주요 URL을 넣어
   즉시 검색 결과에서 가립니다.
3. **사이트맵은 제출 상태로 둡니다.** 지금은 크롤러를 빨리 불러들여야 합니다.

> ⚠️ **임시 삭제는 약 6개월 뒤 자동으로 풀립니다.** 가리는 것일 뿐 빼는 것이 아닙니다.
> 실제로 빼는 일은 `noindex`가 합니다. 그 안에 `public` 복귀든 `blocked` 전환이든
> 결론을 내야 합니다. 방치하면 6개월 뒤 조용히 다시 나타납니다.

**5단계 · 네이버 서치어드바이저**

네이버에는 Search Console의 임시 삭제에 해당하는 도구가 없습니다.
웹마스터도구에서 재수집을 유도하고 현황을 지켜보는 방식입니다.

1. **요청 → 웹페이지 수집**에 주요 URL을 넣어 재수집을 요청합니다.
   Yeti가 다시 가져가면서 `noindex`를 읽습니다.
2. **요청 → robots.txt**에서 수집 허용 상태를 확인합니다 (`hidden`이므로 허용이 맞습니다).
3. **리포트 → 사이트 진단 · 수집 현황**에서 색인 수가 줄어드는지 관찰합니다.
4. 급하면 네이버 고객센터로 검색 제외를 따로 요청합니다.

> 네이버 콘솔 메뉴 이름은 개편이 잦습니다. 위 경로가 보이지 않으면
> searchadvisor.naver.com 의 현재 메뉴에서 「수집」·「robots.txt」 항목을 찾으십시오.

**6단계 · 관찰**

```bash
# 주기적으로 (주 1회) 확인
# site: 검색으로 남은 색인 수를 봅니다
#   구글: https://www.google.com/search?q=site:infopath.co.kr
#   네이버: https://search.naver.com/search.naver?query=site:infopath.co.kr
```

색인에서 **다 빠진 것을 확인한 뒤**에야 `blocked`를 검토합니다.
그 전에 `blocked`로 가면 9-1의 유령 항목이 생깁니다.

### 9-3. 다시 공개하기 (`public`)

1. `NEXT_PUBLIC_INDEXING_MODE` → `public` → **Redeploy**
2. 9-2의 3단계 검증을 반대로 확인 (`index, follow`, `X-Robots-Tag` 없음)
3. Search Console → **삭제 → 임시 삭제** 목록에 남아 있는 요청을 **취소**합니다.
   이걸 안 하면 코드가 공개로 돌아와도 최대 6개월간 계속 가려집니다.
4. Search Console → 사이트맵 **재제출**, 주요 URL **색인 요청**
5. 네이버 → **요청 → 웹페이지 수집**으로 재수집 요청

> 재수집에는 **2~4주**가 걸립니다. 공개 즉시 검색에 다시 뜨지 않습니다.

### 9-4. 건드리면 안 되는 것

| 대상 | 이유 |
|---|---|
| `public/google*.html` · `public/naver*.html` | 검색엔진 소유권 확인 파일. 지우면 소유권이 풀려 삭제 요청·재등록을 다시 해야 합니다. `noindex`가 걸려도 확인 기능은 그대로 작동합니다 |
| `app/[locale]/layout.tsx`의 `verification` 설정 | 위와 같은 이유 |
| `sitemap.xml` (`hidden` 동안) | 크롤러를 빨리 불러들여야 색인이 빨리 빠집니다 |

---

## 부록 · 알려진 최적화 여지

**폰트 용량** — `public/fonts/PretendardVariable.woff2`는 **약 2MB**입니다.
`next/font/local`이 해시를 붙여 1년 캐시되므로 재방문 비용은 없지만, 첫 방문 비용이 큽니다.
Phase 4에서 다음을 검토하십시오.

1. **동적 서브셋** (권장) — Pretendard 공식 `pretendardvariable-dynamic-subset.css`는 `unicode-range` 기준 **92개 조각**으로 나뉘어 실제 사용된 글자 범위만 내려받습니다.
2. **사이트 전용 서브셋** — `pyftsubset`으로 실사용 글자만 추출. 가장 가볍지만 콘텐츠에 새 글자가 들어올 때마다 재생성이 필요합니다.

현 단계에서는 단일 파일 유지가 관리상 안전합니다. 실제 트래픽을 보고 판단하는 것을 권장합니다.
