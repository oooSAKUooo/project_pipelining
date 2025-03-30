import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function StatsPanel({ hits, misses }) {
  const total = hits + misses;
  const data = [
    { name: "Hit", value: hits, color: "#10b981" },
    { name: "Miss", value: misses, color: "#ef4444" },
  ];

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-indigo-600 mb-2">Hazard Analysis</h3>
      <div className="flex gap-4">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 mr-2"></div>
              <span>Hit: {hits} ({(total > 0 ? (hits / total * 100).toFixed(1) : 0)}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 mr-2"></div>
              <span>Miss: {misses} ({(total > 0 ? (misses / total * 100).toFixed(1) : 0)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;