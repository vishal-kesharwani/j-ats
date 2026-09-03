"use client";

import { useState } from "react";

interface DayData {
  date: string;
  count: number;
}

interface ApplicationGraphProps {
  data: DayData[];
  target: number;
}

export function ApplicationGraph({ data, target }: ApplicationGraphProps) {
  const [range, setRange] = useState<7 | 14 | 30>(7);

  const sliced = data.slice(-range);
  const maxCount = Math.max(...sliced.map((d) => d.count), target);
  const barWidth = `${100 / sliced.length}%`;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="border border-[#EAEAEA] bg-white p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
          Applications
        </h2>
        <div className="flex gap-1">
          {[7, 14, 30].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as 7 | 14 | 30)}
              className={`px-2 py-1 text-[10px] font-medium uppercase tracking-widest transition-colors ${
                range === r
                  ? "bg-[#111111] text-white"
                  : "text-[#B0AEA8] hover:text-[#111111]"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="relative h-48 flex items-end gap-0">
        {/* Target line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-[#9F2F2D]/40 z-10"
          style={{ bottom: `${(target / maxCount) * 100}%` }}
        >
          <span className="absolute -top-4 right-0 text-[9px] font-medium text-[#9F2F2D]/60 uppercase tracking-widest">
            Target: {target}
          </span>
        </div>

        {sliced.map((day, i) => {
          const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
          const isToday = day.date === today;
          const metTarget = day.count >= target;

          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center justify-end h-full relative"
            >
              <div
                className="w-full max-w-[24px] transition-all duration-300 ease-out relative group"
                style={{ height: `${Math.max(height, 2)}%` }}
              >
                <div
                  className={`absolute inset-0 rounded-t-[2px] ${
                    metTarget
                      ? "bg-[#346538]"
                      : "bg-[#9F2F2D]"
                  } ${isToday ? "ring-1 ring-[#111111] ring-offset-1" : ""} hover:opacity-80 transition-opacity`}
                />
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-20">
                  <div className="bg-[#111111] text-white px-2 py-1 text-[9px] font-medium whitespace-nowrap">
                    {day.count} / {target}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Date labels */}
      <div className="flex gap-0 mt-2">
        {sliced.map((day) => (
          <div
            key={day.date}
            className="flex-1 text-center"
          >
            <span className="text-[8px] text-[#B0AEA8] font-medium">
              {day.date.slice(5)}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#EAEAEA]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[1px] bg-[#346538]" />
          <span className="text-[9px] text-[#B0AEA8]">Target met</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[1px] bg-[#9F2F2D]" />
          <span className="text-[9px] text-[#B0AEA8]">Below target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 border border-[#111111]" />
          <span className="text-[9px] text-[#B0AEA8]">Today</span>
        </div>
      </div>
    </div>
  );
}
