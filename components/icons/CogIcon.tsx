import React from 'react';

export const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        d="M9.594 3.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.19-.218 1.74 0 .55.218 1.02.684 1.11 1.226l.092.548a5.204 5.204 0 013.36 3.018l.42.728c.297.514.42 1.09.324 1.648-.096.558-.45 1.04-.9 1.368l-.72.522a5.18 5.18 0 01-2.09 1.336l-.6.2a5.18 5.18 0 01-2.18 0l-.6-.2a5.18 5.18 0 01-2.09-1.336l-.72-.522c-.45-.328-.804-.81-.9-1.368-.096-.558.027-1.134.323-1.648l.42-.728A5.204 5.204 0 019.502 4.49l.092-.548z" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 15a3 3 0 100-6 3 3 0 000 6z" 
    />
  </svg>
);
