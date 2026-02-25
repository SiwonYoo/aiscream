'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
  onResume: () => void;
};

export default function NotionAutoResume({ onResume }: Props) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;

    const notion = sp.get('notion');
    const resume = sp.get('resume');

    if (notion !== 'connected' || resume !== 'notion_pick') return;

    ran.current = true;

    onResume();

    const next = new URLSearchParams(sp.toString());
    next.delete('notion');
    next.delete('resume');
    next.delete('openNotion');

    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [sp, pathname, router, onResume]);

  return null;
}
