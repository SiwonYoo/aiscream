import BrandHeader from './BrandHeader';
import DemoModeNotice from './DemoModeNotice';
import LoginForm from './LoginForm';

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
