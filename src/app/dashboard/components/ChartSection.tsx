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
}

export function ChartSection({ data }: ChartSectionProps) {
  // Mock data kalau tidak ada data dari props
  const mockData = [
    { name: "Jan", plan: 90, capacity: 120 },
    { name: "Feb", plan: 100, capacity: 130 },
    { name: "Mar", plan: 150, capacity: 180 },
    { name: "Apr", plan: 130, capacity: 150 },
    { name: "May", plan: 160, capacity: 200 },
    { name: "Jun", plan: 140, capacity: 190 },
    { name: "Jul", plan: 120, capacity: 160 },
    { name: "Aug", plan: 180, capacity: 210 },
    { name: "Sep", plan: 170, capacity: 200 },
    { name: "Oct", plan: 190, capacity: 220 },
    { name: "Nov", plan: 175, capacity: 210 },
    { name: "Dec", plan: 200, capacity: 240 },
  ];

  const chartData = data && data.length > 0 ? data : mockData;

  const barColors = {
    plan: "#FACC15", // warm natural yellow (amber-400)
    capacity: "#60A5FA", // soft corporate blue (blue-400)
  };

  return (
    <div className="border rounded-xl bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Resource Planning
      </h2>

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

            {/* Total Plan Bar */}
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

            {/* Total Capacity Bar */}
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

      {chartData.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm">
            No data available. Please apply filters.
          </p>
        </div>
      )}
    </div>
  );
}
