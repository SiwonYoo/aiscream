'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Error({ reset }: { reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex h-[calc(100vh-57px)] w-full flex-col items-center justify-center gap-8 pc:min-h-screen pc:gap-10">
      <div className="-mt-5 flex flex-col items-center gap-2 pc:gap-5">
        <div className="relative aspect-square w-32.5 pc:w-45">
          <Image src="/assets/images/error-img.png" alt="에러 이미지" fill sizes="180px, (min-width: 768px) 130px" />
        </div>
        <h3 className="text-[22px] font-bold text-primary pc:text-[28px]">예기치 않은 오류가 발생했습니다.</h3>
        <p className="text-sm text-secondary pc:text-base">불편을 드려 죄송합니다. 잠시 후 다시 시도해 주세요.</p>
      </div>
      {/* 여기 router.push 부분 경로에 맞게 바꿔주세요! */}
      <button type="button" className="cursor-pointer rounded-sm bg-active px-3 py-1.5 text-sm text-white hover:bg-hover pc:px-4 pc:py-2 pc:text-base" onClick={() => reset()}>
        다시 시도
      </button>
    </div>
  );
}
