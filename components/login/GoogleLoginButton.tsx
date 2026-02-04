'use client';

type GoogleLoginButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export default function GoogleLoginButton({ onClick, disabled = false, className = '' }: GoogleLoginButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label="Sign in with Google" className={`inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}>
      <img src="/web_neutral_sq_SI.svg" alt="" aria-hidden="true" />
      <span className="sr-only">Sign in with Google</span>
    </button>
  );
}
