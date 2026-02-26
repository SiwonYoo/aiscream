# 샤이닝라이언(인턴십) AiScReam

<a href="https://aiscream.vercel.app" target="_blank" title="AiScReam">
  <img src="./public/images/travel-banner.png" alt="프로젝트이미지" width=700/>
</a>

<br />

## 📃 프로젝트 서비스 소개

개발자를 위한 <b>기술 블로그 글 자동 생성 서비스</b>입니다.
사용자는 블로그 프롬프트와 키워드를 입력하여 원하는 주제를 질문할 수 있으며, AI가 이를 바탕으로 <b>서론–본문–결론 구조의 기술 블로그 글을 자동으로 생성합니다.</b>

튜토리얼, TIL(Today I Learned), 트러블슈팅 등 다양한 <b>블로그 템플릿 형식을 지원</b>하며, 코드 예시가 포함된 실용적인 기술 문서를 작성할 수 있습니다. 생성된 글은 <b>에디터 기능을 통해 자유롭게 스타일링 및 수정</b>할 수 있습니다.

또한 작성된 글은 기록으로 저장되어 <b>다시 조회할 수 있으며, 수정 및 삭제가 가능</b>합니다.

완성된 글은 <b>Markdown 또는 HTML 형식으로 다운로드</b>할 수 있으며, <b>Notion 외부 연동 기능</b>을 통해 손쉽게 개인 지식 관리 시스템으로 옮길 수 있습니다.

<br />

## 📅 프로젝트 기간

2026.02.02 ~ 2026.02.27

<br />

## 👥 팀원 소개

|             <img src="public/assets/images/teamprofile/oneway.jpg" width="100" height="100" style="object-fit:cover;" />             |             <img src="public/assets/images/teamprofile/siwon.jpg" width="100" height="100" style="object-fit:cover;" />              |            <img src="public/assets/images/teamprofile/youvin.png" width="100" height="100" style="object-fit:cover;" />            |           <img src="public/assets/images/teamprofile/seohyun.jpg" width="100" height="100" style="object-fit:cover;" />           |
| :----------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
|                                                              **임한길**                                                              |                                                              **유시원**                                                              |                                                             **황유빈**                                                             |                                                            **오서현**                                                             |
|                                                                  PM                                                                  |                                                                  PL                                                                  |                                                            FE Developer                                                            |                                                           FE Developer                                                            |
| [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/onewayay) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SiwonYoo) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YouVin) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/se5ri) |

<br />

## 🛠️ 프로젝트 개발도구

| 분류                  | 사용 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **언어 / 라이브러리** | ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=222) ![TS](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) ![React](https://img.shields.io/badge/React-20232a?style=flat&logo=react&logoColor=61DAFB) ![Zustand](https://img.shields.io/badge/Zustand-00C4B4?style=flat&logo=zustand&logoColor=white) ![Tiptap](https://img.shields.io/badge/Tiptap-000000?style=flat&logo=tiptap&logoColor=white) |
| **프레임워크**        | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **API**               | ![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=flat&logo=openapiinitiative&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **서버 / 배포**       | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                     |
| **협업**              | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white) ![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)                                                                                                                                                                                                                                                                                                           |
| **디자인**            | ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white) ![Lottie](https://img.shields.io/badge/Lottie-00DDB3?style=flat&logo=lottie&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                              |

<br />

## 📁 프로젝트 폴더 구조

```
📁 AISCREAM
┣ 📁 .github
┣ 📁 .next
┣ 📁 .vscode

┣ 📁 app
┃ ┣ 📁 (generate)
┃ ┃ ┗ 📁 auth
┃ ┃   ┗ 📁 callback
┃ ┃     ┗ route.ts
┃ ┃   hooks.ts
┃ ┃   useAuth.ts
┃
┃ ┣ 📁 login
┃ ┃ ┗ page.tsx
┃
┃ ┣ 📁 post
┃ ┃ ┗ 📁 [id]
┃ ┃   ┗ page.tsx
┃ ┃ PostDetailClient.tsx
┃
┃ ┣ error.tsx
┃ ┣ layout.tsx
┃ ┣ page.tsx
┃ ┣ favicon.ico
┃ ┣ globals.css
┃ ┗ not-found.tsx

┣ 📁 components
┃ ┣ 📁 common
┃ ┃ CreateIcon.tsx
┃ ┃ DropIcon.tsx
┃ ┃ Loading.tsx
┃ ┃ ModalInitializer.tsx
┃ ┃ PlusIcon.tsx
┃ ┃ StarIcon.tsx
┃ ┃ Toggle.tsx
┃ ┃ TypedownIcon.tsx
┃
┃ ┣ 📁 editor
┃ ┃ Base.tsx
┃ ┃ CustomCodeBlock.tsx
┃ ┃ EditorPlaceholder.tsx
┃ ┃ EditorToolbar.tsx
┃ ┃ MarkdownEditor.tsx
┃ ┃ UIIButtton.tsx
┃ ┃ UIIButttonList.tsx
┃
┃ ┣ 📁 layout
┃ ┃ Header.tsx
┃ ┃ Sidebar.tsx
┃
┃ ┣ 📁 login
┃ ┃ BrandHeader.tsx
┃ ┃ DemoModalIcon.tsx
┃ ┃ GoogleLoginButton.tsx
┃ ┃ LoginForm.tsx
┃
┃ ┣ 📁 modal
┃ ┃ BasicModal.tsx
┃ ┃ GlobalModalList.tsx
┃ ┃ UserPrompt.tsx
┃
┃ ┗ 📁 constants
┃   EditorContentList.tsx

┣ 📁 data
┃ ┣ 📁 actions
┃ ┃ posts.ts
┃ ┃ functions
┃
┃ ┗ 📁 customHooks
┃   useMarkdownEditor.ts

┣ 📁 lib
┃ ┣ 📁 auth.ts
┃ ┣ 📁 supabase
┃ ┃ supabaseClient.ts
┃ ┃ supabaseServer.ts
┃
┃ ┗ 📁 lottie
┃   icecream.json

┣ 📁 node_modules

┣ 📁 public
┃ ┗ 📁 assets
┃   ┗ 📁 images
┃     fonts
┃     file.svg
┃     globe.svg
┃     next.svg
┃     vercel.svg
┃     window.svg

┣ 📁 stores
┃ ┣ modal-store.ts
┃ ┣ post-store.ts
┃ ┗ ui-store.ts

┣ 📁 types
┃ blog-type.ts
┃ editor.ts
┃ modal-type.ts
┃ post.ts

┣ next-env.d.ts
┣ tiptap.d.ts
┣ .env.local
┣ .gitignore
┣ .gitmessage.txt
┣ buildver.json
┣ tsconfig.json
┣ eslint.config.mjs
┣ next.config.ts
┣ package-lock.json
┣ package.json
┣ postcss.config.mjs
┣ prettier.config.mjs
┗ README.md
```

## ⭐ 핵심 기능 및 페이지 구성

- **로그인 화면**
  - 데모버전 로그인
  - 구글 버전 로그인

- **블로그**
  - 블로그 프롬프트 작성
  - 키워드 입력 기반 AI 글 생성
  - 템플릿 선택 (튜토리얼 / TIL / 트러블슈팅)
  - 글 길이 선택 기능

<br />

## ✨ 주요 기능

- **블로그 생성**
  - 블로그 프롬프트 작성
  - 키워드 입력 기반 AI 글 생성
  - 템플릿 선택 (튜토리얼 / TIL / 트러블슈팅)
  - 글 길이 선택 기능

- **블로그 관리**
  - 사이드바 : 작성된 글 목록 저장
  - 블로그 조회 기능
  - 블로그 수정 및 삭제

- **에디터 기능**
  - Tiptap 기반 마크다운 에디터
  - 텍스트 스타일링 기능 (제목, 리스트, 코드블록 등)
  - 코드 하이라이팅 지원

- **다운로드 및 연동**
  - Markdown 다운로드
  - HTML 다운로드
  - Notion 연동 지원

- **로그인**
  - Google 소셜 로그인
  - 로그인 상태 유지

- **UI 기능**
  - 다크모드 지원
  - 로딩 애니메이션(Lottie)
  - 반응형 UI

## 👩‍💻 업무 분담

| 이름       | 담당 기능                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **임한길** | - GPT API 연동 구현<br>- AI 스트리밍 응답 처리 구현<br>- 에러 및 타임아웃 처리 로직 구현<br>- 주요 UI 디자인 및 구현<br>- 프로젝트 피그마 디자인 담당 <br>- AI 생성 결과 삽입 기능 구현                                                                             |
| **유시원** | - 텍스트 에디터 구조 및 데이터 모델 설계<br>- Preview ↔ Edit 변환 기능 구현 <br>- 자동 저장 및 복구 기능 구현<br>- Undo / Redo 스택 관리 구현<br>- Markdown / HTML Export 기능 구현<br>- 다운로드 시스템 구현<br>- 백엔드 개발 및 API 구현<br>- UI 및 기능 개발     |
| **황유빈** | - 글 생성 프롬프트 설계<br>- 요약 / 제목 추천 AI 기능 구현<br>- AI 옵션 UI 설계 및 구현<br>- AI 결과 검증 로직 구현<br>- Notion 등 외부 플랫폼 연동 구조 설계<br>- 백엔드 개발 및 API 구현<br>- UI 및 기능 개발<br>-AI 생성 결과 삽입 기능 구현                     |
| **오서현** | - UI 구현 및 사용자 인터페이스 개선<br>- 반응형 UI 구현 (Mobile / PC)<br>- UI 버튼 상태 관리<br>- 다크모드 설계 및 구현<br>- 테마 전환 기능 구현<br>- 공통 컴포넌트 구조 설계 및 구현<br>- 프로젝트 구조 정리 및 리팩토링<br>- README 및 프로젝트 문서 작성(NOTION) |

<br />
