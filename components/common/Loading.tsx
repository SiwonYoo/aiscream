'use client';

import Lottie from 'lottie-react';
import icecream from '@/lottie/icecream.json';

type Props = {
  autoplay?: boolean;
  loop?: boolean;
};

export default function Loading({ autoplay = true, loop = true }: Props) {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex flex-col items-center justify-center gap-6 bg-[rgba(0,0,0,0.5)]">
      <div className="aspect-square w-20 overflow-hidden rounded-xl pc:w-30 pc:rounded-2xl">
        <Lottie animationData={icecream} autoplay={autoplay} loop={loop} />
      </div>
      <p className="animate-pulse text-center text-sm text-white pc:text-base">
        블로그를 작성중입니다.
        <br />
        조금만 기다려주세요.
      </p>
    </div>
  );
}
