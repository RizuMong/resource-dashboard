// components/ChartSection.tsx
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

interface ChartSectionProps {
  data?: {
    name: string;
    plan: number;
    capacity: number;
  }[];
  year?: number | string;
}

export function ChartSection({ data, year }: ChartSectionProps) {
  // If year prop not provided, fallback ke current year
  const displayYear = year ?? new Date().getFullYear();

  // Mock data kalau tidak ada data dari props
  const mockData = [
    { name: "Jan", plan: 0, capacity: 0 },
    { name: "Feb", plan: 0, capacity: 0 },
    { name: "Mar", plan: 0, capacity: 0 },
    { name: "Apr", plan: 0, capacity: 0 },
    { name: "May", plan: 0, capacity: 0 },
    { name: "Jun", plan: 0, capacity: 0 },
    { name: "Jul", plan: 0, capacity: 0 },
    { name: "Aug", plan: 0, capacity: 0 },
    { name: "Sep", plan: 0, capacity: 0 },
    { name: "Oct", plan: 0, capacity: 0 },
    { name: "Nov", plan: 0, capacity: 0 },
    { name: "Dec", plan: 0, capacity: 0 },
  ];

  const chartData = data && data.length > 0 ? data : mockData;

  const barColors = {
    plan: "#FACC15", // amber
    capacity: "#60A5FA", // blue
  };

  // Determine whether real data exists (not just mock)
  const hasRealData = Boolean(data && data.length > 0);

  return (
    <div className="border rounded-xl bg-white p-6">
      <div className="flex items-center justify-between mb-4">
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
