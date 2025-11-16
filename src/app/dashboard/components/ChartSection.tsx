// components/ChartSection.tsx
"use client";

import React from "react";
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

export interface ChartItem {
  id?: string;
  month?: number;
  name: string;
  plan: number;
  capacity: number;
}

interface ChartSectionProps {
  data?: ChartItem[];
  year?: number | string;
  onBarClick?: (payload: ChartItem) => void;
}

export function ChartSection({ data, year, onBarClick }: ChartSectionProps) {
  const displayYear = year ?? new Date().getFullYear();

  const mockData: ChartItem[] = [
    { name: "Jan", plan: 0, capacity: 0, month: 1 },
    { name: "Feb", plan: 0, capacity: 0, month: 2 },
    { name: "Mar", plan: 0, capacity: 0, month: 3 },
    { name: "Apr", plan: 0, capacity: 0, month: 4 },
    { name: "May", plan: 0, capacity: 0, month: 5 },
    { name: "Jun", plan: 0, capacity: 0, month: 6 },
    { name: "Jul", plan: 0, capacity: 0, month: 7 },
    { name: "Aug", plan: 0, capacity: 0, month: 8 },
    { name: "Sep", plan: 0, capacity: 0, month: 9 },
    { name: "Oct", plan: 0, capacity: 0, month: 10 },
    { name: "Nov", plan: 0, capacity: 0, month: 11 },
    { name: "Dec", plan: 0, capacity: 0, month: 12 },
  ];

  const chartData = data && data.length > 0 ? data : mockData;
  const hasRealData = Boolean(data && data.length > 0);

  const barColors = {
    plan: "#FACC15",
    capacity: "#60A5FA",
  };

  // recharts onClick handler sends (data, index). We pick data.payload.
  const handleBarClick = (event: any) => {
    // event might be undefined when clicking empty areas
    const payload: ChartItem | undefined = event?.payload;
    if (!payload) return;
    if (onBarClick) onBarClick(payload);
  };

  return (
    <div className="border rounded-xl bg-white p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Resource Planning{" "}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            {displayYear}
          </span>
        </h2>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={8}
            barCategoryGap="20%"
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 13 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "13px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={10}
            />

            <Bar
              dataKey="plan"
              name="Total Plan"
              fill={barColors.plan}
              radius={[6, 6, 0, 0]}
              onClick={handleBarClick}
            >
              <LabelList
                dataKey="plan"
                position="top"
                fill="#374151"
                fontSize={12}
                formatter={(label: unknown) =>
                  typeof label === "number" || typeof label === "string"
                    ? label.toString()
                    : ""
                }
              />
            </Bar>

            <Bar
              dataKey="capacity"
              name="Total Capacity"
              fill={barColors.capacity}
              radius={[6, 6, 0, 0]}
              onClick={handleBarClick}
            >
              <LabelList
                dataKey="capacity"
                position="top"
                fill="#1F2937"
                fontSize={12}
                formatter={(label: unknown) =>
                  typeof label === "number" || typeof label === "string"
                    ? label.toString()
                    : ""
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!hasRealData && (
        <div className="flex items-center justify-center h-20 mt-4">
          <p className="text-gray-400 text-sm">
            No data available for {displayYear}. Please apply filters.
          </p>
        </div>
      )}
    </div>
  );
}
