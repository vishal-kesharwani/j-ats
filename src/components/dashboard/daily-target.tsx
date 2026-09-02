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
    <div className="border border-[#EAEAEA] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
          Daily Target
        </h2>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-16 border border-[#EAEAEA] px-2 py-1 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              min="1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTarget();
                if (e.key === "Escape") setEditing(false);
              }}
            />
            <button
              onClick={saveTarget}
              className="text-[10px] font-medium text-[#111111] hover:text-[#787774]"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-[10px] font-medium text-[#B0AEA8] hover:text-[#111111] transition-colors"
          >
            {target}/day
          </button>
        )}
      </div>

      <div className="flex items-end gap-3 mb-3">
        <span className="text-3xl font-semibold tracking-tight text-[#111111]">
          {todayCount}
        </span>
        <span className="text-sm text-[#B0AEA8] mb-1">/ {target}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#F7F6F3] rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: isMet ? "#346538" : "#111111",
          }}
        />
      </div>

      {isMet ? (
        <p className="text-xs font-medium text-[#346538]">
          Target achieved
        </p>
      ) : (
        <p className="text-xs text-[#9F2F2D]">
          {remaining} more to go today
        </p>
      )}
    </div>
  );
}
