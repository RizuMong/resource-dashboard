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

export function ChartSection() {
  // Data 12 bulan
  const data = useMemo(
    () => [
      { name: "Jan", plan: 100, capacity: 220 },
      { name: "Feb", plan: 120, capacity: 210 },
      { name: "Mar", plan: 150, capacity: 230 },
      { name: "Apr", plan: 130, capacity: 200 },
      { name: "May", plan: 160, capacity: 240 },
      { name: "Jun", plan: 140, capacity: 230 },
      { name: "Jul", plan: 170, capacity: 250 },
      { name: "Aug", plan: 150, capacity: 240 },
      { name: "Sep", plan: 130, capacity: 220 },
      { name: "Oct", plan: 160, capacity: 230 },
      { name: "Nov", plan: 140, capacity: 210 },
      { name: "Dec", plan: 155, capacity: 235 },
    ],
    []
  );

  // Warna pastel terang & profesional
  const barColors = {
    plan: "#F9D67A", // warm yellow - lebih kuat dari pastel
    capacity: "#8EC5FC", // bright corporate blue
  };

  return (
    <div className="border rounded-xl bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recource Planning
      </h2>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          barGap={6}
          barCategoryGap="18%"
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          {/* Grid minimalis */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F3F4F6"
            vertical={false}
          />
          {/* Axis clean */}
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
          {/* Tooltip lembut */}
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.02)" }}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              backgroundColor: "#FFFFFF",
            }}
            labelStyle={{ color: "#4B5563", fontWeight: 500 }}
          />
          {/* Legend bersih */}
          <Legend
            wrapperStyle={{
              fontSize: "13px",
              paddingTop: "12px",
              color: "#4B5563",
            }}
            iconType="circle"
            verticalAlign="bottom"
          />
          {/* Bar Total Plan */}
          <Bar
            dataKey="plan"
            name="Total Plan"
            fill={barColors.plan}
            radius={[6, 6, 0, 0]}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          >
            <LabelList
              dataKey="plan"
              position="top"
              fill="#4B5563"
              fontSize={12}
              formatter={(value: number) => `${value}`}
            />
          </Bar>

          {/* Bar Total Capacity */}
          <Bar
            dataKey="capacity"
            name="Total Capacity"
            fill={barColors.capacity}
            radius={[6, 6, 0, 0]}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          >
            <LabelList
              dataKey="capacity"
              position="top"
              fill="#374151"
              fontSize={12}
              formatter={(value: number) => `${value}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
