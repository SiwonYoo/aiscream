import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { Client } from '@notionhq/client';
import { markdownToNotionBlocks } from '@/lib/markdownToNotionBlocks';

type PublishBody = {
  title: string;
  markdown: string;
  parent_page_id: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function isPublishBody(v: unknown): v is PublishBody {
  if (!isRecord(v)) return false;
  return typeof v.title === 'string' && typeof v.markdown === 'string' && typeof v.parent_page_id === 'string' && v.parent_page_id.length > 0;
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (!isPublishBody(body)) {
      return NextResponse.json({ ok: false, message: 'Invalid body' }, { status: 400 });
    }

    const { title, markdown, parent_page_id } = body;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ ok: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { data: conn } = await supabase.from('notion_connections').select('access_token').eq('user_id', user.id).maybeSingle();

    if (!conn?.access_token) {
      return NextResponse.json({ ok: false, message: 'NOT_CONNECTED' }, { status: 404 });
    }

    const notion = new Client({ auth: conn.access_token });

    const children = markdownToNotionBlocks(markdown);

    const page = await notion.pages.create({
      parent: { page_id: parent_page_id },
      properties: {
        title: { title: [{ type: 'text', text: { content: title } }] },
      },
      children: children as unknown as Parameters<typeof notion.pages.create>[0]['children'],
    });

    return NextResponse.json({ ok: true, page: { id: page.id, url: (page as any).url ?? null } });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
