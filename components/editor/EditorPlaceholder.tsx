import StarIcon from '../common/StarIcon';

export default function EditorPlaceholder() {
  return (
    <div className="base flex h-full w-full flex-1 flex-col items-center justify-center gap-6 px-4 pc:px-30">
      <StarIcon className="w-15 text-black pc:w-17.5 dark:text-white" />
      <h3 className="text-[28px] font-bold text-primary pc:text-[36px]">새로운 블로그 생성하기</h3>
      <p className="text-center text-sm text-secondary pc:text-base">
        아래에 블로그 글에 대한 설명과 키워드를 입력하면
        <br />
        AI가 멋진 블로그 글을 작성해드립니다.
      </p>
    </div>
  );
}
