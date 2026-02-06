import Image from 'next/image';

export default function BrandHeader() {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <div className="relative h-15 w-15">
        <Image src="/assets/images/Aiscream_logo.svg" alt="AiScReam 로고" fill className="object-contain" priority />
      </div>

      <h1 className="text-[28px] font-bold tracking-tight md:text-4xl">AiScReam</h1>
      <p className="text-sm text-secondary md:text-base md:text-secondary">AI가 당신의 아이디어를 멋진 블로그 글로 만들어드립니다.</p>
    </header>
  );
}
