
"use client";

import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/images/logo.png"
      alt="TapScore Mania Logo"
      width={192}
      height={192}
      className="w-48 h-48"
      priority
    />
  );
}
