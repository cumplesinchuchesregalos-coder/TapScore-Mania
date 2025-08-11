
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
      <rect width="150" height="150" fill="#8B5CF6"/>
      <g filter="url(#filter0_d_1_1)">
        <circle cx="75" cy="65" r="45" fill="white"/>
        <circle cx="75" cy="65" r="42.5" stroke="black" strokeWidth="5"/>
      </g>
      <g filter="url(#filter1_d_1_1)">
        <path d="M75 35C91.5685 35 105 48.4315 105 65C105 81.5685 91.5685 95 75 95C58.4315 95 45 81.5685 45 65C45 48.4315 58.4315 35 75 35Z" fill="white"/>
      </g>
      <circle cx="75" cy="65" r="42.5" stroke="black" strokeWidth="5"/>
      <path d="M75 60C77.7614 60 80 57.7614 80 55C80 52.2386 77.7614 50 75 50C72.2386 50 70 52.2386 70 55C70 57.7614 72.2386 60 75 60Z" fill="black"/>
      <path d="M72.5 60C72.5 58.6193 73.6193 57.5 75 57.5C76.3807 57.5 77.5 58.6193 77.5 60C77.5 61.3807 76.3807 62.5 75 62.5C73.6193 62.5 72.5 61.3807 72.5 60Z" fill="white"/>
      <path d="M83.9999 87.5C83.9999 88.5 83.4999 89 82.9999 89C82.4999 89 81.9999 88.5 81.9999 88.5L81.4999 83C81.4999 82 80.4999 81.5 79.9999 81.5H70.4999C69.9999 81.5 68.9999 82 68.9999 83L68.4999 88.5C68.4999 89 67.9999 89.5 67.4999 89.5C66.9999 89.5 66.4999 89 66.4999 88.5L67.4999 78.5C67.4999 77.5 68.4999 76.5 69.4999 76.5H80.9999C81.9999 76.5 82.9999 77.5 82.9999 78.5L83.9999 87.5Z" fill="#FFC107"/>
      <path d="M78.5 72.5C78.5 74.1569 77.1569 75.5 75.5 75.5V78.5C78.8137 78.5 81.5 75.8137 81.5 72.5H78.5ZM75.5 75.5C73.8431 75.5 72.5 74.1569 72.5 72.5H69.5C69.5 75.8137 72.1863 78.5 75.5 78.5V75.5ZM72.5 72.5C72.5 70.8431 73.8431 69.5 75.5 69.5V66.5C72.1863 66.5 69.5 69.1863 69.5 72.5H72.5ZM75.5 69.5C77.1569 69.5 78.5 70.8431 78.5 72.5H81.5C81.5 69.1863 78.8137 66.5 75.5 66.5V69.5Z" fill="#FFC107"/>
      <text fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Fredoka One" fontSize="16" fontWeight="bold" letterSpacing="0.1em">
        <tspan x="25" y="125">TAPSCORE</tspan>
      </text>
      <defs>
        <filter id="filter0_d_1_1" x="26" y="20" width="98" height="98" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_1"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_1" result="shape"/>
        </filter>
        <filter id="filter1_d_1_1" x="43.5" y="34" width="63" height="63" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_1"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_1" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
}
