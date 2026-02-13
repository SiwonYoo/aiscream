export const runtime = 'nodejs';

import { BlogLength, BlogType } from '@/types/blog-type';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const lengthToken: Record<BlogLength, number> = {
  short: 1000,
  normal: 1500,
  long: 2000,
};

export const typePrompt: Record<BlogType, string> = {
  tutorial: `
단계별로 설명하고
코드 예제를 포함하며
초보자도 이해할 수 있게 작성해줘.
  `,
  til: `
TIL 형식으로 새로 학습하는 입장에서 더 와닿게 이해되도록 작성해줘.
비유나 비전공자의 관점에서 이해될 만한 비슷한 사례들을 넣어줘.
  `,
  trouble: `
	trouble shooting 관점에서 작성해줘.
	일어날 수 있는 실수나 오류들 관점에서 작성하거나,
	더 개선할 수 있는 방법들을 작성해서 trouble shooting에 알맞게 작성해줘.
  `,
};

export async function POST(request: NextRequest) {
  try {
    const { title, keyword, type, length } = await request.json();

    const postToken = lengthToken[length as BlogLength];

    const postType = typePrompt[type as BlogType];

    const res = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: `
      너는 개발 기술 전문 블로거야.

      ${title}에 관한 개발자 기술 블로그를 작성해줘.
      ${keyword} 내용이 반드시 포함되어야 해.

	  ${postType}

      ${postToken}토큰 분량으로 글을 마무리 해줘!
      `,
      stream: true,
      max_output_tokens: postToken,
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
