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
    단계별 설명으로 초보자도 이해할 수 있게 작성해주세요.
    꼭 코드 예제를 포함하여 작성해주시고, 새롭거나 어려운 개념에 대해서는 추가 설명이나 코드 주석을 넣어주세요.

    독자는 해당 기술을 처음 접하는 주니어 개발자입니다.

    아래 흐름을 참고하여 글을 구성하되, 각 단계의 흐름이나 제목은 내용에 맞게 자유롭게 작성해주세요(아래 참고 내용의 제목을 그대로 쓰지 마세요):

    1. 개요: 배울 내용에 대한 소개 및 개요 설명
    2. Step 1, 2, 3...: 단계별 설명 (코드 예시 포함)
    3. 주의: 주의할 점, 고려해야할 점 설명
    4. 확장: 이후에 심화적으로 공부할 수 있는 개념 소개
    5. 요약: 마무리 간단 요약 
  `,
  til: `
    TIL 형식으로 새로 학습하는 입장에서 더 와닿게 이해되도록 작성해주세요.

    독자는 오늘 막 이해한 내용을 정리하는 개발 학습자입니다.
    
    아래 흐름을 참고하여 글을 구성하되, 각 단계의 흐름이나 제목은 내용에 맞게 자유롭게 작성해주세요(아래 참고 내용의 제목을 그대로 쓰지 마세요):

    1. 개념 소개: 오늘 배운 개념 소개 (왜 이걸 배우게 됐는지 배경 포함)
    2. 개념 설명: 핵심 개념 설명
    3. 상세 내용: 실제 코드나 사용 예시 (간단한 예제로 직접 확인)
    4. 어려웠던 점: 학습 과정에서의 시행착오가 있었던 부분 설명
    5. 느낀 점: 오늘의 핵심 정리 및 소감
    `,
  troubleshooting: `
    trouble shooting 관점에서 작성해주세요.
    실제로 일어날 수 있는 실수나 오류들 관점에서 작성해주시고, 더 개선할 수 있는 방법들을 작성해주세요.

    독자는 지금 당장 오류를 해결해야 하는 개발자입니다.

    아래 흐름을 참고하여 글을 구성하되, 각 단계의 흐름이나 제목은 내용에 맞게 자유롭게 작성해주세요(아래 참고 내용의 제목을 그대로 쓰지 마세요):

    1. 문제 상황: 발생한 에러/오류 설명
    2. 원인 분석: 에러/오류가 발생한 이유, 에러/오류가 미치는 영향
    3. 해결 방법: 에러/오류 해결 방법 및 예방법 설명
    4. 개선 결과: 적용 이후 개선된 상황 및 내용 설명
    5. 결론: 해결을 통해 배운점
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
        당신은 개발 기술 전문 블로거입니다.
        
        아래 정보를 바탕으로 개발자가 검색했을 때 클릭하고 싶을 만한 구체적이고 명확한 블로그 제목(topic)을 한 줄로 생성해주세요.
        제목 외의 문장은 절대 출력하지 마세요. ''나 ""로 감싸지도 마세요.

        - 제목: ${title}
        - 키워드: ${keyword}
        - 글 유형: ${type}
      `,
      max_output_tokens: 100,
      temperature: 0.5,
    });

    const topic = topicRes.output_text.trim().replace(/^["'`]|["'`]$/g, '');

    const res = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: `
        당신은 실무 경험을 바탕으로 글을 쓰는 개발 기술 블로거입니다.
        비전공자나 주니어 개발자부터 숙련자까지 아울러 이해할 수 있도록 설명합니다.

        ${topic}을 기반으로 ${title}에 관한 개발자 기술 블로그를 작성해주세요.
        ${keyword} 내용이 반드시 포함되어야 합니다.
        ${topic}으로 만들어진 제목(h1)은 넣지 말고 본문 내용만 작성해주세요.
        본문 내용의 소주제는 h2부터 사용해주면 됩니다.

        ${postType}

        ${postToken}토큰 분량 안에서 글이 서론부터 결론까지 모두 끝나도록 작성해주세요.
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
