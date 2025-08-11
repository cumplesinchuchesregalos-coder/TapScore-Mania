
"use client";

export function Logo() {
  return (
    <svg 
      width="150" 
      height="150" 
      viewBox="0 0 150 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-48"
    >
      {/* Background */}
      <rect width="150" height="150" fill="#8B5CF6"/>
      
      {/* Icon Group */}
      <g transform="translate(0, -10)">
        {/* Outer Circle */}
        <circle cx="75" cy="75" r="45" stroke="black" strokeWidth="5" fill="transparent"/>
        
        {/* Target */}
        <g>
          <circle cx="75" cy="75" r="28" fill="white"/>
          <circle cx="75" cy="75" r="28" stroke="black" strokeWidth="4"/>
          <circle cx="75" cy="75" r="18" stroke="black" strokeWidth="4"/>
          <circle cx="75" cy="75" r="8" stroke="black" strokeWidth="4"/>
        </g>
        
        {/* Hand */}
        <g fill="#FFC107" stroke="black" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          {/* Main Palm and Fingers */}
          <path d="M91 115 C 85 122, 70 122, 64 115 L 58 95 C 57 90, 60 85, 65 85 L 85 85 C 90 85, 93 90, 92 95 Z" />
          {/* Index Finger */}
          <path d="M78 86 L 78 65 C 78 60, 72 60, 72 65 L 72 86 Z" />
          {/* Thumb */}
          <path d="M60 92 C 55 88, 55 80, 62 80" fill="none"/>
        </g>
      </g>

      {/* Text */}
      <text 
        x="50%" 
        y="135" 
        textAnchor="middle" 
        fill="white" 
        fontSize="24" 
        fontFamily="sans-serif"
        fontWeight="bold"
        letterSpacing="0.1em"
      >
        TAPSCORE
      </text>
    </svg>
  );
}
