"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import { useMemo } from "react";

export function ProductivitySection() {
  const data = useMemo(
    () => [
      { name: "Jan", actual: 89, plan: 200 },
      { name: "Feb", actual: 120, plan: 210 },
      { name: "Mar", actual: 140, plan: 230 },
      { name: "Apr", actual: 150, plan: 220 },
      { name: "May", actual: 170, plan: 240 },
      { name: "Jun", actual: 130, plan: 210 },
      { name: "Jul", actual: 160, plan: 230 },
      { name: "Aug", actual: 150, plan: 225 },
      { name: "Sep", actual: 145, plan: 215 },
      { name: "Oct", actual: 160, plan: 220 },
      { name: "Nov", actual: 130, plan: 200 },
      { name: "Dec", actual: 140, plan: 210 },
    ],
    []
  );

  // 🎨 Warna bold dan enak dilihat
  const barColors = {
    actual: "#F9D67A", // warm yellow
    plan: "#C9A4F7", // rich lavender purple
  };

  return (
    <div className="border rounded-xl bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Productivity Overview
      </h2>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          barGap={8}
          barCategoryGap="20%"
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4B5563", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              backgroundColor: "#FFFFFF",
            }}
            labelStyle={{ color: "#374151", fontWeight: 500 }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "13px",
              paddingTop: "12px",
              color: "#4B5563",
            }}
            iconType="circle"
            verticalAlign="bottom"
          />

          {/* Total Actual */}
          <Bar
            dataKey="actual"
            name="Total Actual"
            fill={barColors.actual}
            radius={[6, 6, 0, 0]}
            isAnimationActive={true}
            animationDuration={700}
            animationEasing="ease-in-out"
          >
            <LabelList
              dataKey="actual"
              position="top"
              fill="#374151"
              fontSize={12}
            />
          </Bar>

          {/* Total SA Plan */}
          <Bar
            dataKey="plan"
            name="Total SA Plan"
            fill={barColors.plan}
            radius={[6, 6, 0, 0]}
            isAnimationActive={true}
            animationDuration={700}
            animationEasing="ease-in-out"
          >
            <LabelList
              dataKey="plan"
              position="top"
              fill="#1F2937"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
