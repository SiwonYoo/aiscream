'use client';

import { deletePost, createPost, updatePost } from '@/data/actions/post';
import { getPostById } from '@/data/functions/post';

/**
 * ‼️ DB 테스트용 페이지입니다.
 * 삭제하고 구현해 주세요.
 */
export default function Post() {
  // production 환경에서 실행되지 않도록 가드
  if (process.env.NODE_ENV === 'production') return null;

  // 테스트 postId : DB posts 테이블에서 id 확인 후 넣어서 조회/수정/삭제 테스트하시면 됩니다.
  const postId = 'bd827841-3797-4909-9ff8-eb2578396270';

  // [CREATE] 글 저장
  const handleSave = async () => {
    const res = await createPost({
      topic: '글쓰기 주제3',
      title: '글쓰기 제목3',
      keywords: ['글', '작업'],
      type: 'til',
      content: '이렇게 글 쓰면 됩니다.',
    });

    console.log('저장 완료:', res);
  };

  // [READ] 글 조회
  const handleGet = async () => {
    const post = await getPostById(postId);

    console.log('조회 결과:', post);
  };

  // [UPDATE] 글 수정
  const handleUpdate = async () => {
    const res = await updatePost(postId, {
      topic: '수정된 주제',
    });

    console.log('수정 결과:', res);
  };

  // [DELETE] 글 삭제
  const handleDelete = async () => {
    const res = await deletePost(postId);

    console.log('삭제 결과: ', res);
  };

  return (
    <div>
      <button onClick={handleSave}>글 저장</button>
      <br />
      <button onClick={handleGet}>글 조회</button>
      <br />
      <button onClick={handleUpdate}>글 수정</button>
      <br />
      <button onClick={handleDelete}>글 삭제</button>
    </div>
  );
}
