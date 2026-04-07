"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

type Contribution = { date: string; level: number };

const LEVEL_COLORS = [
  "bg-[#161b22]",
  "bg-accent-cyan/20",
  "bg-accent-cyan/40",
  "bg-accent-cyan/70",
  "bg-accent-cyan",
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function GitHubGraph() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [data, setData] = useState<Contribution[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isInView) return;
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        setData(d.contributions);
        setTotal(d.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isInView]);

  // Organize into weeks (columns of 7 days)
  const weeks: Contribution[][] = [];
  if (data.length > 0) {
    let currentWeek: Contribution[] = [];
    const firstDate = new Date(data[0].date + "T00:00:00");
    const startDay = firstDate.getDay();

    // Pad the first week with empty cells
    for (let i = 0; i < startDay; i++) {
      currentWeek.push({ date: "", level: -1 });
    }

    for (const c of data) {
      currentWeek.push(c);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  }

  // Build month labels with column positions
  const monthLabels: { label: string; year: number; col: number }[] = [];
  if (weeks.length > 0) {
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      for (const day of week) {
        if (!day.date) continue;
        const d = new Date(day.date + "T00:00:00");
        const month = d.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({
            label: MONTHS[month],
            year: d.getFullYear(),
            col: wi,
          });
          lastMonth = month;
        }
        break;
      }
    });
  }

  // Determine year range for display
  const yearRange =
    data.length > 0
      ? (() => {
          const first = new Date(data[0].date + "T00:00:00").getFullYear();
          const last = new Date(
            data[data.length - 1].date + "T00:00:00"
          ).getFullYear();
          return first === last ? `${first}` : `${first} – ${last}`;
        })()
      : "";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="glass-card rounded-xl p-6"
    >
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-accent-cyan"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <a
            href="https://github.com/Brovinchess"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-foreground transition-colors hover:text-accent-cyan"
          >
            @Brovinchess
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-accent-cyan">
            {yearRange}
          </span>
          <span className="font-mono text-xs text-text-muted">
            {total.toLocaleString()} contributions in the last year
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <span className="animate-pulse font-mono text-xs text-text-muted">
            Loading contributions...
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto" data-lenis-prevent>
          {/* Month + Year labels */}
          <div className="relative mb-1 h-5" style={{ marginLeft: 32 }}>
            {monthLabels.map((m, i) => (
              <span
                key={`${m.label}-${m.year}-${i}`}
                className="absolute font-mono text-[10px] text-text-muted"
                style={{ left: m.col * 13 }}
              >
                {m.label}
                {/* Show year on Jan or first label */}
                {(m.label === "Jan" || i === 0) && (
                  <span className="ml-0.5 text-accent-cyan/60">
                    {String(m.year).slice(2)}
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] pr-1">
              {DAYS.map((d, i) => (
                <span
                  key={i}
                  className="flex h-[10px] w-6 items-center justify-end font-mono text-[9px] leading-none text-text-muted"
                >
                  {i % 2 === 1 ? d : ""}
                </span>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`h-[10px] w-[10px] rounded-sm transition-colors ${
                      day.level === -1
                        ? "bg-transparent"
                        : LEVEL_COLORS[day.level]
                    }`}
                    title={
                      day.date
                        ? `${day.date} — Level ${day.level}`
                        : undefined
                    }
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-end gap-1.5">
            <span className="mr-1 font-mono text-[9px] text-text-muted">
              Less
            </span>
            {LEVEL_COLORS.map((color, i) => (
              <div
                key={i}
                className={`h-[10px] w-[10px] rounded-sm ${color}`}
              />
            ))}
            <span className="ml-1 font-mono text-[9px] text-text-muted">
              More
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
