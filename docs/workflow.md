# 아티클 프리뷰 에디터 사용 가이드

**배포 URL:** https://article-preview-gold.vercel.app  
**Confluence 사이트:** https://ihunet.atlassian.net

---

## 전체 워크플로우

```
[편집자] Confluence에 Word/HWP 원고 업로드
    ↓
[담당자] Claude Code에서 아래 프롬프트 실행 → 프리뷰 URL 생성
    ↓
[검토자] URL 접속 → 브라우저에서 텍스트 직접 수정 → 승인 완료
    ↓
[담당자] CMS HTML 복사 → CMS Source 모드에 붙여넣기 완료
```

---

## Step 1. Confluence 페이지 ID 확인

Confluence 페이지 URL에서 ID를 확인한다:

```
https://ttalkkak.atlassian.net/wiki/spaces/SPACE/pages/123456789/페이지제목
                                                          ↑
                                                       이 숫자가 PAGE_ID
```

---

## Step 2. Claude Code에서 아래 프롬프트 실행

아래 프롬프트를 Claude Code에 붙여넣고 `[PAGE_ID]`와 `[아티클 제목]`만 교체한다:

```
다음 작업을 순서대로 진행해줘:

1. Atlassian MCP로 Confluence 페이지 [PAGE_ID]를 읽어줘.
   cloudId: 43e6771e-52d2-4834-9dc3-cdf7f4975abb

2. 읽은 내용을 hunet CMS 형식 HTML로 변환해줘:
   - 전체를 <article class="hunet_osmu_article ck-content">로 감싸기
   - 제목(h1급) → <h2 class="title">
   - 소제목(h2급) → <h4 class="title">
   - 본문 단락 → <p style="text-align:justify;">
   - 인용구 → <blockquote><p style="line-height:36px;">
   - 강조 리스트 → <div class="articleDiv01"><ul><li><span style="line-height:36px;">
   - 이미지 → <figure class="image"><img src="[원본URL]"></figure>

3. 변환된 HTML을 아래 API에 POST로 전송해줘:
   URL: https://article-preview-gold.vercel.app/api/article
   Body:
   {
     "title": "[아티클 제목]",
     "html": "[변환된 HTML]",
     "confluencePageId": "[PAGE_ID]"
   }

4. 응답으로 받은 editorUrl을 알려줘.
```

**예시 결과:**
```
editorUrl: https://article-preview-gold.vercel.app/editor/abc-123-def-456
```

---

## Step 3. 검토자에게 URL 공유

반환된 URL을 검토자에게 슬랙 또는 메신저로 공유한다.

---

## Step 4. 검토자 — 브라우저에서 편집 및 승인

1. URL 접속 → 실제 hunet.co.kr 아티클과 동일한 레이아웃으로 렌더링됨
2. **편집 모드 ON** 클릭 → 텍스트 요소를 클릭해 바로 수정
3. 이미지 클릭 → URL 입력 프롬프트 → 이미지 교체
4. 수정 완료 후 **승인 완료** 클릭 → 버튼이 "✓ 승인 완료됨"으로 변경

---

## Step 5. 담당자 — CMS 업로드

1. 같은 URL에서 **CMS HTML 복사** 클릭
2. CMS 에디터 접속 → **Source** 모드 전환
3. 복사된 HTML 붙여넣기 → 저장 완료

---

## 참고: HTML 컴포넌트 변환 규칙

| 원고 요소 | CMS HTML |
|---|---|
| 제목 | `<h2 class="title">` |
| 소제목 | `<h4 class="title">` |
| 본문 | `<p style="text-align:justify;">` |
| 인용구 | `<blockquote><p>` |
| 강조 박스 | `<div class="articleDiv01"><ul><li>` |
| TIP 박스 | `<div class="articleDiv01">💡<ol><li>` |
| 이미지 | `<figure class="image"><img src="...">` |
| 띠배너 | `<figure class="table"><table style="background:#F2F4F6">` |
| CTA 버튼 | `<div style="text-align:center;"><a style="background-color:#000000;...">` |

---

## 문제 해결

**에디터 URL이 열리지 않을 때**  
→ `https://article-preview-gold.vercel.app` 접속해 사이트가 정상 동작하는지 확인

**승인 완료 후 데이터가 저장되지 않을 때**  
→ Vercel 대시보드 → Functions 탭에서 PATCH `/api/article/[id]` 로그 확인

**Confluence 페이지를 읽지 못할 때**  
→ Claude Code에서 Atlassian MCP 재인증 필요: `Settings → MCP → claude_ai_Atlassian`
