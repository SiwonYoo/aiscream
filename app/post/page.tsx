import Base from '@/components/editor/Base';
import UserPrompt from '@/components/userinput/UserPrompt';

export default function PostPage() {
  return (
    <div className="flex min-h-[93vh] flex-col pc:min-h-screen">
      <Base />
      <UserPrompt />
    </div>
  );
}
