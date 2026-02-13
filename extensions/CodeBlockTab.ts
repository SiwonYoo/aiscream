import { Extension } from '@tiptap/core';

export const CodeBlockTabExtension = Extension.create({
  name: 'codeBlockTab',

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // 1. 코드블록 안인지 확인
        if (editor.isActive('codeBlock')) {
          // 2. 현재 상태 가져오기
          // state: 에디터의 현재 상태
          // view: 에디터의 화면 표시 담당 (DOM 업데이트)
          const { state, view } = editor;
          // from: 선택 영역의 시작 위치
          // to: 선택 영역의 끝 위치
          const { from, to } = state.selection;

          // 3. 현재 줄 시작 위치 찾기
          // resolve: 절대 위치를 상대적 맥락으로 변환
          // $pos: 현재 노드의 위치와 주변 정보를 담은 객체
          const $pos = state.doc.resolve(from);
          // $pos.start(): 현재 노드(코드블록)의 시작 위치
          const codeBlockStart = $pos.start();

          const textBeforCursor = state.doc.textBetween(codeBlockStart, from);
          const lastNewline = textBeforCursor.lastIndexOf('\n');
          const lineStart = lastNewline === -1 ? codeBlockStart : codeBlockStart + lastNewline + 1;

          // 4. 선택된 텍스트 가져오기 (from이 있는 줄의 첫부분부터 to까지)
          const selectedText = state.doc.textBetween(lineStart, to);

          // 5. 각 줄에 탭 추가
          // 여러 줄 잡힐 경우, 각 줄의 맨 앞에 탭 삽입
          const indented = selectedText
            .split('\n')
            .map(line => '\t' + line)
            .join('\n');

          // 6. transaction 생성 및 실행
          // transaction: 문서 변경 작업들의 묶음
          // state.schema.text(): 텍스트 노드 생성
          const tr = state.tr.replaceWith(lineStart, to, state.schema.text(indented));
          // view.dispatch(): transaction을 실제로 실행해서 화면에 반영
          view.dispatch(tr);

          return true; // 처리 완료, 기본 Tab 동작(포커스 이동) 차단
        }
        return false; // 코드블록 밖: 기본 Tab 동작 허용
      },

      'Shift-Tab': ({ editor }) => {
        if (editor.isActive('codeBlock')) {
          const { state, view } = editor;
          const { from, to } = state.selection;
          const $pos = state.doc.resolve(from);

          const codeBlockStart = $pos.start();
          const textBeforCursor = state.doc.textBetween(codeBlockStart, from);
          const lastNewline = textBeforCursor.lastIndexOf('\n');

          const lineStart = lastNewline === -1 ? codeBlockStart : codeBlockStart + lastNewline + 1;

          const selectedText = state.doc.textBetween(lineStart, to);

          // 각 줄에서 탭 제거
          const outdented = selectedText
            .split('\n')
            .map(line => {
              if (line.startsWith('\t')) {
                return line.slice(1);
              } else if (line.startsWith('    ')) {
                return line.slice(4);
              }

              return line;
            })
            .join('\n');

          // 빈 문자열이면 에러 발생(state.schema.text('')는 불가)하므로 delete 사용
          if (outdented === '') {
            const tr = state.tr.delete(lineStart, to);
            view.dispatch(tr);
          } else {
            const tr = state.tr.replaceWith(lineStart, to, state.schema.text(outdented));
            view.dispatch(tr);
          }

          return true;
        }
        return false;
      },
    };
  },
});
