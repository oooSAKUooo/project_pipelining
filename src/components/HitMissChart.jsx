// components/HitMissChart.js
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

function HitMissChart({ data }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600">Hit/Miss Rate Comparison</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mode" />
          <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="hitRate" fill="#10B981" name="Hit Rate" />
          <Bar dataKey="missRate" fill="#EF4444" name="Miss Rate" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HitMissChart;