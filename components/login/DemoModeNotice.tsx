import Image from 'next/image';

export default function DemoModeNotice() {
  return (
    <section className="mt-4 rounded-lg border border-base-stroke bg-info p-3 md:p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center space-x-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-black text-xs" aria-hidden="true">
            i
          </div>
          <p className="text-sm text-black md:text-base">로그인 안내</p>
        </div>
        <p className="text-xs leading-5 text-secondary md:text-[14px]">
          데모 계정으로도 블로그 생성 및 개인 노션 발행이 가능합니다.
          <br />
          개인 구글 계정으로 로그인하면 작성한 블로그 내역을 관리할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
