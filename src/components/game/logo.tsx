
"use client";

export function Logo() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-24 h-24"
    >
      <circle cx="50" cy="50" r="48" className="fill-primary/10 stroke-primary/20" strokeWidth="4" />
      <path
        d="M35 30 H 65"
        className="stroke-primary"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M50 30 V 70"
        className="stroke-primary"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M65 55 L 75 45"
        className="stroke-accent"
        strokeWidth="8"
        strokeLinecap="round"
      />
       <path
        d="M72 65 L 82 75"
        className="stroke-accent"
        strokeWidth="8"
        strokeLinecap="round"
      />
       <path
        d="M60 75 L 70 85"
        className="stroke-accent"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
