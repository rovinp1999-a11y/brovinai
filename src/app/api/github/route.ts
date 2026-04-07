import { NextResponse } from "next/server";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  try {
    const res = await fetch(
      "https://github.com/users/Brovinchess/contributions",
      { cache: "no-store" }
    );
    const html = await res.text();

    // Parse contribution data from td elements
    const contributions: { date: string; level: number }[] = [];
    const regex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      contributions.push({
        date: match[1],
        level: parseInt(match[2], 10),
      });
    }

    // Extract total contributions count (handles commas like "1,060")
    const totalMatch = html.match(
      /([\d,]+)\s*\n\s*contributions?\s*\n\s*in the last year/
    );
    const total = totalMatch
      ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
      : 0;

    return NextResponse.json({ contributions, total });
  } catch {
    return NextResponse.json(
      { contributions: [], total: 0 },
      { status: 500 }
    );
  }
}
