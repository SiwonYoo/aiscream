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
  troubleshooting: `
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

    const topicRes = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: `
      너는 개발 기술 전문 블로거야.
      
      아래 정보를 바탕으로 블로그 글 전체의 주제를 담은 제목(topic)을 한 줄로만 생성해줘.
      제목 외에 다른 설명은 절대 붙이지 마. ''나 ""로 감싸지도 말아줘.

      - 제목: ${title}
      - 키워드: ${keyword}
      - 글 유형: ${type}
      `,
      max_output_tokens: 100,
      temperature: 0.5,
    });

    const topic = topicRes.output_text.trim();

    const res = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: `
      너는 개발 기술 전문 블로거야.

      ${topic}을 기반으로 ${title}에 관한 개발자 기술 블로그를 작성해줘.
      ${keyword} 내용이 반드시 포함되어야 해.

	    ${postType}

      ${topic}으로 만들어진 제목(h1)은 넣지 말고 본문 내용만 작성해줘.
      본문 내용의 소주제는 h2부터 사용해주면 돼.
      ${postToken}토큰 분량 안에서 글이 다 끝나도록 작성해줘.
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
        'X-Topic': encodeURIComponent(topic),
      },
    });
  } catch (err) {
    console.error('요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.', err);
    return NextResponse.json({ error: '요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
