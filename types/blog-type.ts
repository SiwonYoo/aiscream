export type BlogLength = 'short' | 'normal' | 'long';

export type BlogType = 'tutorial' | 'til' | 'trouble';

export type UserPromptType = {
  blogTitle: string, 
  blogKeyword: string[], 
  blogType: BlogType, 
  blogLength: BlogLength
}