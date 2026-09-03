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

  const today = new Date().toISOString().split("T")[0];

  const totalApps = sliced.reduce((sum, d) => sum + d.count, 0);
  const avgApps = sliced.length > 0 ? (totalApps / sliced.length).toFixed(1) : "0";

  return (
    <div className="border border-[#EAEAEA] bg-white p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#B0AEA8] mb-1">
            Daily Applications
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-[#111111]">{totalApps}</span>
            <span className="text-[10px] text-[#B0AEA8]">total</span>
            <span className="text-[10px] text-[#EAEAEA]">|</span>
            <span className="text-lg font-semibold text-[#111111]">{avgApps}</span>
            <span className="text-[10px] text-[#B0AEA8]">avg/day</span>
          </div>
        </div>
        <div className="flex bg-[#FBFBFA] p-0.5">
          {[7, 14, 30].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as 7 | 14 | 30)}
              className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-all ${
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
      <div className="flex-1 relative">
        {/* Target line */}
        <div
          className="absolute left-0 right-0 z-10 flex items-center"
          style={{ bottom: `${(target / maxCount) * 100}%` }}
        >
          <div className="w-full border-t border-dashed border-[#9F2F2D]/30" />
        </div>

        {/* Bars */}
        <div className="h-48 flex items-end gap-1">
          {sliced.map((day) => {
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            const isToday = day.date === today;
            const metTarget = day.count >= target;

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center justify-end h-full relative group"
              >
                <div
                  className="w-full max-w-[28px] transition-all duration-300 ease-out relative"
                  style={{ height: `${Math.max(height, 3)}%` }}
                >
                  <div
                    className={`absolute inset-0 rounded-t-[3px] ${
                      metTarget
                        ? "bg-gradient-to-t from-[#346538] to-[#346538]/80"
                        : "bg-gradient-to-t from-[#9F2F2D] to-[#9F2F2D]/80"
                    } ${isToday ? "ring-2 ring-[#111111] ring-offset-1" : ""} hover:opacity-90 transition-opacity`}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block z-20">
                    <div className="bg-[#111111] text-white px-2.5 py-1.5 text-[10px] font-medium whitespace-nowrap shadow-lg">
                      {day.count} applied
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Date labels */}
        <div className="flex gap-1 mt-3 border-t border-[#EAEAEA] pt-3">
          {sliced.map((day, i) => {
            const showLabel = range === 7 || i % Math.ceil(range / 7) === 0;
            return (
              <div key={day.date} className="flex-1 text-center">
                <span className={`text-[9px] ${day.date === today ? "font-semibold text-[#111111]" : "text-[#B0AEA8]"}`}>
                  {showLabel ? day.date.slice(5) : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#EAEAEA]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-t from-[#346538] to-[#346538]/80" />
          <span className="text-[9px] text-[#787774]">Target met</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-t from-[#9F2F2D] to-[#9F2F2D]/80" />
          <span className="text-[9px] text-[#787774]">Below target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-0.5 border-t border-dashed border-[#9F2F2D]/40" />
          <span className="text-[9px] text-[#787774]">Target ({target})</span>
        </div>
      </div>
    </div>
  );
}
