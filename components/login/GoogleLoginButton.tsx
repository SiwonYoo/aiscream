'use client';

type GoogleLoginButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export default function GoogleLoginButton({ onClick, disabled = false, className = '' }: GoogleLoginButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label="Sign in with Google" className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
      <img src="/assets/images/web_neutral_sq_SI.svg" alt="Google 로그인" className="block dark:hidden" aria-hidden="true" />
      <img src="/assets/images/web_dark_sq_SI.svg" alt="Google 로그인" className="hidden dark:block" aria-hidden="true" />
      <span className="sr-only">Sign in with Google</span>
    </button>
  );
}
