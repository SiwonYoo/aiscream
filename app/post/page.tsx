import Base from '@/components/editor/Base';
import UserPrompt from '@/components/userinput/UserPrompt';

export default function PostPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Base />
      <UserPrompt />
    </div>
  );
}
