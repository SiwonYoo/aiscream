'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 px-4 pc:gap-15 pc:px-0">
      <div className="relative aspect-square w-25 pc:w-37.5">
        <Image src="/assets/images/Aiscream_logo.svg" alt="AiScReam 로고" fill sizes="(min-width: 768px) 150px, 100px" />
      </div>
      <div className="flex flex-col gap-4 text-center pc:gap-5">
        <h2 className="text-[22px] font-bold text-primary pc:text-4xl">요청하신 페이지가 존재하지 않습니다.</h2>
        <p className="text-sm text-secondary pc:text-lg">
          입력하신 주소를 다시 확인해 주세요. <br />
          문제가 계속되면 홈에서 다시 시작해 보세요.
        </p>
      </div>
      <button type="button" className="mt-2 cursor-pointer rounded-sm bg-active px-4 py-2 text-sm text-white hover:bg-hover pc:mt-3 pc:px-5 pc:py-2 pc:text-lg" onClick={() => router.push('/')}>
        홈으로 이동
      </button>
    </div>
  );
}
