import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function CPIChart({ data }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-indigo-600"> CPI Comparison</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mode" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cpi" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CPIChart;