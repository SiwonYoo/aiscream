import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { Client } from '@notionhq/client';

function isDemoUser(email?: string | null) {
  return email === 'demo@aiscream.com';
}

/**
 * Notion page 객체에서 제목을 뽑아오는 함수
 * - Notion page는 title이 properties 안에 들어있어서 직접 찾아야 함
 */
function getPageTitle(page: any) {
  const props = page?.properties;
  if (!props) return 'Untitled';

  // properties 중에서 type이 'title'인 항목을 찾아서 텍스트를 합친다
  for (const key of Object.keys(props)) {
    const p = props[key];
    if (p?.type === 'title' && Array.isArray(p?.title)) {
      const title = p.title.map((t: any) => t?.plain_text ?? '').join('');
      if (title.trim()) return title;
    }
  }

  return 'Untitled';
}

export async function GET(req: Request) {
  /**
   * 쿼리 파라미터 읽기
   * - /api/notion/pages?q=키워드 형태로 검색 지원
   */
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() ?? '';

  /**
   * 서버에서 로그인 유저 확인
   */
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 로그인 안 되어 있을 시 에러처리
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const demo = isDemoUser(user.email);
  const installId = req.headers.get('x-install-id') ?? '';
  if (demo && !installId) {
    return NextResponse.json({ error: 'MISSING_INSTALL_ID' }, { status: 400 });
  }

  let qb = supabase.from('notion_connections').select('access_token').eq('user_id', user.id);

  if (demo) qb = qb.eq('demo_install_id', installId);
  else qb = qb.is('demo_install_id', '');

  /**
   * DB에서 해당 유저의 Notion access_token 가져오기
   */
  const { data: conn, error: connErr } = await qb.maybeSingle();

  if (connErr) {
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }

  if (!conn?.access_token) {
    return NextResponse.json({ error: 'NOT_CONNECTED' }, { status: 404 });
  }

  const notion = new Client({ auth: conn.access_token });

  /**
   * Notion API
   * - Notion은 "페이지 목록 API"가 따로 없어서 /v1/search를 사용
   * - 여기서 integration이 접근 가능한 page들만 결과로 나옴
   */
  const notionBody: any = {
    page_size: 20,
    filter: { property: 'object', value: 'page' },
    sort: { timestamp: 'last_edited_time', direction: 'descending' },
  };

  // 검색어가 있을 때만 query를 넣기
  if (q) notionBody.query = q;

  let data;
  try {
    data = await notion.search(notionBody);
  } catch (e: any) {
    // Notion 쪽 에러 원인 확인용
    return NextResponse.json({ error: 'NOTION_API_ERROR', detail: e?.message ?? String(e) }, { status: 502 });
  }

  /**
   * 모달에서 바로 뿌릴 수 있도록 id/title/url만 추리기
   */
  const pages = (data.results ?? [])
    .filter((r: any) => r?.object === 'page')
    .map((page: any) => ({
      id: page.id,
      title: getPageTitle(page),
      url: page.url,
      lastEditedTime: page.last_edited_time,
    }));

  return NextResponse.json({ pages });
}
