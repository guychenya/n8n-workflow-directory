
import React from 'react';

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

export const N8nLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="currentColor"
        {...props}
    >
        <path d="M12 0L2.296 5.62v12.76L12 24l9.704-5.62V5.62L12 0zm7.278 17.15L12 20.84l-7.278-3.69V6.85L12 3.16l7.278 3.69v10.3zM8.36 9.42l-.634.34v4.48l.634.34 3.64-2.24-3.64-2.24zm7.28 0l-3.64 2.24 3.64 2.24.634-.34V9.76l-.634-.34z"></path>
    </svg>
);
