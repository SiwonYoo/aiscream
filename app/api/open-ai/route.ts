export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { title, keyword } = await request.json();

    const res = await openai.responses.stream({
      model: 'gpt-4o-mini',
      input: `
      너는 개발 기술 전문 블로거야.

      ${title}에 관한 개발자 기술 블로그를 작성해줘.
      ${keyword} 내용이 반드시 포함되어야 해.
      2000토큰 내에서 글을 마무리 해줘!
      `,
      max_output_tokens: 2000,
      temperature: 0.5,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of res) {
            if (event.type === 'response.output_text.delta') {
              controller.enqueue(encoder.encode(event.delta));
            }
          }
          controller.close();
        } catch (err) {
          console.error('생성 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', err);
          controller.error(err);
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.', err);
    return NextResponse.json({ error: '요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
