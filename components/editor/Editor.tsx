export default function Editor() {
  return (
    <>
      {/* 임시로 높이 125 줬어요 */}
      <div className="editor flex px-4 pt-3 pb-5 pc:border-b pc:border-base-stroke pc:px-30 pc:py-5">
        <div className="view-btns inline-flex w-fit gap-1 overflow-hidden rounded-sm border border-secondary text-xs pc:text-sm">
          <button type="button" className="cursor-pointer rounded-xs bg-black px-1.5 py-0.5 text-white pc:px-2 pc:py-1">
            Preview
          </button>
          <button type="button" className="cursor-pointer rounded-xs bg-white px-1.5 py-0.5 text-primary pc:px-2 pc:py-1">
            Edit
          </button>
        </div>
      </div>
      {/* 에디터 들어갈 영역 입니다. */}
      <div className="editor-wrap h-125">editor 영역입니다.</div>
    </>
  );
}
