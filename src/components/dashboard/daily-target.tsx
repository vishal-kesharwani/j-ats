"use client";

import { useEffect, useState } from "react";

interface DailyTargetProps {
  todayCount: number;
}

export function DailyTarget({ todayCount }: DailyTargetProps) {
  const [target, setTarget] = useState(15);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("15");

  useEffect(() => {
    const stored = localStorage.getItem("jats-daily-target");
    if (stored) {
      setTarget(parseInt(stored));
      setInputVal(stored);
    }
  }, []);

  function saveTarget() {
    const val = parseInt(inputVal);
    if (val > 0) {
      setTarget(val);
      localStorage.setItem("jats-daily-target", val.toString());
    }
    setEditing(false);
  }

  const progress = Math.min((todayCount / target) * 100, 100);
  const remaining = Math.max(target - todayCount, 0);
  const isMet = todayCount >= target;

  return (
    <div className="border border-[#EAEAEA] bg-white p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#B0AEA8]">
          Today&apos;s Progress
        </h2>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-14 border border-[#EAEAEA] px-2 py-1 text-xs text-[#111111] text-center focus:outline-none focus:border-[#111111]"
              min="1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTarget();
                if (e.key === "Escape") setEditing(false);
              }}
              onBlur={saveTarget}
            />
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-[10px] font-medium text-[#B0AEA8] hover:text-[#111111] transition-colors border border-[#EAEAEA] px-2 py-0.5"
          >
            target: {target}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Circular progress */}
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#F7F6F3"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={isMet ? "#346538" : "#111111"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-[#111111]">
              {todayCount}
            </span>
            <span className="text-[10px] text-[#B0AEA8] uppercase tracking-widest">
              of {target}
            </span>
          </div>
        </div>

        {isMet ? (
          <div className="flex items-center gap-1.5 bg-[#EDF3EC] px-3 py-1.5">
            <svg className="w-3 h-3 text-[#346538]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-medium text-[#346538] uppercase tracking-widest">
              Target achieved
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-[#FDEBEC] px-3 py-1.5">
            <span className="text-[10px] font-medium text-[#9F2F2D] uppercase tracking-widest">
              {remaining} more to go
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
