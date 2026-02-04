export type PostType = 'tutorial' | 'til' | 'troubleshooting';

// DB에 저장된 완전한 Post (조회용)
export interface Post {
  id: string;
  authorId: string;
  topic: string;
  keywords: string[];
  type: PostType;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Post 생성 요청 (authorId, id 제외)
export interface CreatePostData {
  topic: string;
  keywords: string[];
  type: PostType;
  title: string;
  content: string;
}

// Post 수정 요청 (authorId, id 제외, 옵셔널)
export interface UpdatePostData {
  topic?: string;
  keywords?: string[];
  type?: PostType;
  title?: string;
  content?: string;
}
