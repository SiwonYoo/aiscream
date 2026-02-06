import BrandHeader from '@/components/login/BrandHeader';
import DemoModeNotice from '@/components/login/DemoModeNotice';
import LoginForm from '@/components/login/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-90 px-5 md:max-w-115 md:px-0">
        <BrandHeader />
        <LoginForm />
        <DemoModeNotice />
      </div>
    </main>
  );
}
