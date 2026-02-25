import Image from 'next/image';

export default function DemoModeNotice() {
  return (
    <section className="mt-4 rounded-lg border border-base-stroke bg-info p-3 md:p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center space-x-1">
          <div className="relative flex h-4 w-4">
            <Image src="/assets/images/info.svg" alt="demomode info" fill className="object-contain dark:invert" priority />
          </div>
          <p className="text-sm text-black md:text-base">데모 모드</p>
        </div>

        <p className="text-xs leading-5 text-secondary md:text-[14px]">
          ID : demo@aiscream.com
          <br />
          PW : rkskekfk12
        </p>
      </div>
    </section>
  );
}
