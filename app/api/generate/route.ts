import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * [GET] 내 글 목록 가져오기
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { data, error } = await supabase.from('posts').select('id, title, content, created_at').eq('author_id', user.id).order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: data ?? [] });
}

/**
 * [POST] AI 글 생성 + DB 저장
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const topic = body.topic ?? 'Next.js 글 생성 테스트';
    const keywords: string[] = Array.isArray(body.keywords) ? body.keywords : ['Next.js', 'OpenAI'];

    // 프롬프트
    const system = '너는 개발자 블로그 작성자다. 반드시 JSON만 출력해라.';
    const prompt = `
topic: ${topic}
keywords: ${keywords.join(', ')}

아주 짧게 작성해줘:
- title: 1줄
- content: 3~6줄 (마크다운 가능)
`.trim();

    // OpenAI 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
      temperature: 0.5,
    });

    const raw = completion.choices?.[0]?.message?.content ?? '{}';

    let ai;
    try {
      ai = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'AI 응답 파싱 실패', raw }, { status: 500 });
    }

    const title = typeof ai.title === 'string' ? ai.title : `${topic} (임시 제목)`;
    const content = typeof ai.content === 'string' ? ai.content : '내용 생성 실패';

    // DB 저장
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          author_id: user.id,
          topic,
          keywords,
          title,
          content,
          type: 'til',
        },
      ])
      .select('id, title, content')
      .single();

    if (error) {
      return NextResponse.json({ error: 'DB 저장 실패', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch (e) {
    console.error('[api/generate]', e);
    return NextResponse.json({ error: '글 생성에 실패했습니다.' }, { status: 500 });
  }
}
