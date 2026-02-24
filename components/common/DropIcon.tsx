export default function DropIcon({ className }: { className?: string }) {
  return (
    <svg width="60" height="29" viewBox="0 0 60 29" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g>
        <path d="M6 4L54 4L45.7935 20.8L14.2065 20.8L6 4Z" fill="var(--color-muted)" />
        <path
          d="M35.2414 9.56046C35.1912 9.50968 35.1316 9.4694 35.066 9.44191C35.0004 9.41442 34.9301 9.40027 34.8591 9.40027C34.7881 9.40027 34.7178 9.41442 34.6522 9.44191C34.5866 9.4694 34.527 9.50968 34.4768 9.56046L29.9999 14.083L25.5229 9.56046C25.4215 9.45808 25.284 9.40055 25.1406 9.40055C24.9972 9.40055 24.8597 9.45808 24.7583 9.56046C24.6569 9.66285 24.6 9.80172 24.6 9.94652C24.6 10.0913 24.6569 10.2302 24.7583 10.3326L29.6176 15.2401C29.6677 15.2909 29.7273 15.3311 29.7929 15.3586C29.8585 15.3861 29.9288 15.4003 29.9999 15.4003C30.0709 15.4003 30.1412 15.3861 30.2068 15.3586C30.2724 15.3311 30.332 15.2909 30.3821 15.2401L35.2414 10.3326C35.2917 10.2819 35.3315 10.2218 35.3588 10.1555C35.386 10.0893 35.4 10.0182 35.4 9.94652C35.4 9.8748 35.386 9.80378 35.3588 9.73753C35.3315 9.67129 35.2917 9.61111 35.2414 9.56046Z"
          fill="var(--color-primary)"
        />
      </g>
      <defs>
        <filter id="filter0_d_1_77" x="0" y="0" width="60" height="28.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_77" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_77" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
