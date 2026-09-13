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

## 부록 · 알려진 최적화 여지

**폰트 용량** — `public/fonts/PretendardVariable.woff2`는 **약 2MB**입니다.
`next/font/local`이 해시를 붙여 1년 캐시되므로 재방문 비용은 없지만, 첫 방문 비용이 큽니다.
Phase 4에서 다음을 검토하십시오.

1. **동적 서브셋** (권장) — Pretendard 공식 `pretendardvariable-dynamic-subset.css`는 `unicode-range` 기준 **92개 조각**으로 나뉘어 실제 사용된 글자 범위만 내려받습니다.
2. **사이트 전용 서브셋** — `pyftsubset`으로 실사용 글자만 추출. 가장 가볍지만 콘텐츠에 새 글자가 들어올 때마다 재생성이 필요합니다.

현 단계에서는 단일 파일 유지가 관리상 안전합니다. 실제 트래픽을 보고 판단하는 것을 권장합니다.
