import Editor from '@/components/editor/Editor';
import UtilButtonList from '@/components/editor/UtilButtonList';
import Image from 'next/image';

export default function Base() {
  return (
    //  {/* 글 생성되기 전 상태 */}
    // {/* // 임시로 높이 min-h-screen 줬어요 */}
    <div className="base flex h-full w-full flex-1 flex-col items-center justify-center gap-6 px-4 pc:px-30">
      <div className="flex aspect-square w-15 items-center justify-center rounded-xl bg-keyword bg-[url('/assets/images/star-2x.png')] bg-size-[38px] bg-center bg-no-repeat pc:w-17.5 pc:bg-size-[44px]"></div>
      <h3 className="text-[28px] font-bold text-primary pc:text-[36px]">새로운 블로그 생성하기</h3>
      <p className="text-center text-sm text-secondary pc:text-base">
        아래에 블로그 글에 대한 설명과 키워드를 입력하면
        <br />
        AI가 멋진 블로그 글을 작성해드립니다.
      </p>
      {/* 글 생성 후 상태
      <Editor />
      <UtilButtonList /> */}
    </div>
  );
}
