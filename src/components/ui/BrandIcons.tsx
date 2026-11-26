type P = { className?: string };

export function FacebookIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z" />
    </svg>
  );
}

export function ZaloIcon({ className }: P) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M24 4C12.4 4 3 12.1 3 22.1c0 5.6 2.9 10.6 7.5 13.9-.3 2.2-1.4 4.6-3.3 6.3 3.6.2 7.1-1 9.6-2.8 2.2.6 4.7 1 7.2 1 11.6 0 21-8.1 21-18.1S35.6 4 24 4z"
      />
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
        fill="#fff"
      >
        Zalo
      </text>
    </svg>
  );
}
