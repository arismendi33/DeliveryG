import React from 'react';

interface IconProps {
  className?: string;
}

export const GoogleLogoSvg: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.97Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
    />
  </svg>
);

export const GmailLogoSvg: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M2.25 19.5h3v-8.25L1.5 8.44v9.31c0 .97.78 1.75 1.75 1.75Z"
    />
    <path
      fill="#34A853"
      d="M18.75 19.5h3c.97 0 1.75-.78 1.75-1.75V8.44l-3.75 2.81v8.25Z"
    />
    <path
      fill="#FBBC04"
      d="M18.75 5.25v6l3.75-2.81V6.19c0-2.16-2.47-3.4-4.2-2.1l-.55.41 1 .75Z"
    />
    <path
      fill="#EA4335"
      d="M5.25 11.25v-6L12 10.31l6.75-5.06v6L12 16.31l-6.75-5.06Z"
    />
    <path
      fill="#C5221F"
      d="M1.5 6.19v2.25l3.75 2.81v-6L4.2 4.44C2.47 3.14 0 4.38 0 6.54l1.5-.35Z"
    />
  </svg>
);

export const OutlookLogoSvg: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect x="7" y="3.5" width="15" height="17" rx="2" fill="#0364B8" />
    <path fill="#28A8EA" d="M7 10.5h15V20c0 .83-.67 1.5-1.5 1.5H8.5C7.67 21.5 7 20.83 7 20v-9.5Z" />
    <path fill="#0078D4" d="M7 3.5h13.5c.83 0 1.5.67 1.5 1.5v5.5L14.5 15 7 10.5v-7Z" />
    <path fill="#50D9FF" d="M22 5.2v5.3l-7.5 4.5V9.5L22 5.2Z" opacity="0.55" />
    <rect x="2" y="6.5" width="11" height="11" rx="2" fill="#0078D4" />
    <path
      fill="#FFFFFF"
      d="M7.5 9.1c-1.66 0-2.85 1.24-2.85 2.9 0 1.66 1.19 2.9 2.85 2.9 1.66 0 2.85-1.24 2.85-2.9 0-1.66-1.19-2.9-2.85-2.9Zm0 4.65c-.86 0-1.45-.73-1.45-1.75s.59-1.75 1.45-1.75 1.45.73 1.45 1.75-.59 1.75-1.45 1.75Z"
    />
  </svg>
);

export const YahooLogoSvg: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect width="24" height="24" rx="6" fill="#5F01D1" />
    <path
      fill="#FFFFFF"
      d="M6.2 7.2h2.7l2.5 5.4 2.5-5.4h2.6l-3.9 7.8v3.8h-2.5V15L6.2 7.2Zm11.1 7.6a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9Zm1.2-7.6-1.1 6.2h-1.8l.4-6.2h2.5Z"
    />
  </svg>
);

export const OtherMailLogoSvg: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" stroke="currentColor" strokeWidth="1.9" />
    <path
      d="M3.5 6.5 11.1 12.2a1.5 1.5 0 0 0 1.8 0L20.5 6.5"
      stroke="#FF6A00"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
