"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { week: "W1", score: 62 },
  { week: "W2", score: 68 },
  { week: "W3", score: 71 },
  { week: "W4", score: 75 },
  { week: "W5", score: 79 },
  { week: "W6", score: 83 },
];

export function PipelineChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="pipelineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#50E6FF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#50E6FF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="week" tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e5e5e5" }} />
          <Area type="monotone" dataKey="score" stroke="#50E6FF" fillOpacity={1} fill="url(#pipelineGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
