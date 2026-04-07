"use client";

import dynamic from "next/dynamic";

const AsciiAvatar = dynamic(
  () =>
    import("./AsciiAvatar").then((m) => ({
      default: m.AsciiAvatar,
    })),
  { ssr: false }
);

export function AsciiBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <AsciiAvatar className="h-full w-full opacity-80" />
    </div>
  );
}
