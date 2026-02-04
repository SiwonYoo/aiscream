'use client';

type GoogleLoginButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function GoogleLoginButton({ onClick, disabled = false }: GoogleLoginButtonProps) {
  return (
    <button className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} type="button" onClick={onClick} disabled={disabled} aria-label="Sign in with Google">
      <img src="/web_neutral_sq_SI.svg" alt="google login" className="h-20 w-50" aria-hidden="true" />
      <span className="sr-only">Sign in with Google</span>
    </button>
  );
}
