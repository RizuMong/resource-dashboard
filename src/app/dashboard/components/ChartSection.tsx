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

export interface ChartItem {
  id?: string;
  month?: number;
  name: string;
  plan: number;
  capacity: number;
  summary: {
    solution_engineer?: { plan: number; capacity: number };
    ui_solution_engineer?: { plan: number; capacity: number };
    system_analyst?: { plan: number; capacity: number };
    quality_assurance?: { plan: number; capacity: number };
    devops?: { plan: number; capacity: number };
    technical_writer?: { plan: number; capacity: number };
  };
};

interface ChartSectionProps {
  data?: ChartItem[];
  year?: number | string;
  onBarClick?: (payload: ChartItem) => void;
};

const ROLE_CONFIG = [
  { key: "solution_engineer", label: "SE" },
  { key: "ui_solution_engineer", label: "UI SE" },
  { key: "system_analyst", label: "SA" },
  { key: "quality_assurance", label: "QA" },
  { key: "devops", label: "DevOps" },
  { key: "technical_writer", label: "TW" },
];

export function ChartSection({ data, year, onBarClick }: ChartSectionProps) {
  const displayYear = year ?? new Date().getFullYear();
  const mockData: ChartItem[] = [
    {
      name: "Jan",
      month: 1,
      plan: 0,
      capacity: 0,
      summary: {
        solution_engineer: { plan: 0, capacity: 0 },
        ui_solution_engineer: { plan: 0, capacity: 0 },
        system_analyst: { plan: 0, capacity: 0 },
        quality_assurance: { plan: 0, capacity: 0 },
        devops: { plan: 0, capacity: 0 },
        technical_writer: { plan: 0, capacity: 0 },
      },
    },
  ];

  const chartData = Array.isArray(data) && data.length > 0 ? data : mockData;
  const hasRealData = Array.isArray(data) && data.length > 0;
  const isSingleMonth = chartData.length === 1;

  const handleBarClick = (event: any) => {
    const payload: ChartItem | undefined = event?.payload;
    if (!payload) return;
    onBarClick?.(payload);
  };

  function mapSummaryToRoleData(summary: any) {
    return ROLE_CONFIG.map(function (role) {
      const roleData = summary?.[role.key] || {};
      return {
        role: role.label,
        plan: roleData.plan || 0,
        capacity: roleData.capacity || 0,
      };
    });
  };

  const barColors = {
    plan: "#FACC15",     // 🟡 Plan
    capacity: "#60A5FA", // 🔵 Capacity
  };

  return (
    <div className="border rounded-xl bg-white p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Resource Planning{" "}
          <span className="ml-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
            {displayYear}
          </span>
        </h2>
      </div>


      {/* Resource Planning */}
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={8}
            barCategoryGap="20%"
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />

            <Bar
              dataKey="plan"
              name="Total Plan (MD)"
              fill={barColors.plan}
              radius={[6, 6, 0, 0]}
              onClick={handleBarClick}
            >
              <LabelList dataKey="plan" position="top" />
            </Bar>

            <Bar
              dataKey="capacity"
              name="Total Capacity (MD)"
              fill={barColors.capacity}
              radius={[6, 6, 0, 0]}
              onClick={handleBarClick}
            >
              <LabelList dataKey="capacity" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!hasRealData && (
        <p className="text-center text-gray-400 mt-4 text-sm">
          No data available for {displayYear}
        </p>
      )}

      {/* Resource By Role */}
      <div className="mt-12">
        <div className="font-semibold text-gray-800 mb-6">
          Resource Planning by Role
        </div>

        <div
          className={
            isSingleMonth
              ? "flex flex-wrap gap-8"
              : "flex gap-8 overflow-x-auto pb-4"
          }
        >
          {chartData.map(function (monthItem) {
            const roleSummaryData = mapSummaryToRoleData(
              monthItem.summary
            );

            return (
              <div
                key={monthItem.month}
                className={
                  isSingleMonth
                    ? "w-full"
                    : "min-w-[420px]"
                }
              >
                {/* Month Label */}
                <div className="text-center mb-2 text-sm font-medium text-gray-700">
                  {monthItem.name}
                </div>

                {/* Chart */}
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roleSummaryData}
                      barCategoryGap="25%"
                      barGap={6}
                      margin={{ top: 24, right: 20, left: 10, bottom: 40 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="role"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#374151", fontSize: 12 }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 11 }}
                      />

                      <Tooltip
                        formatter={(value: number, _name: string, payload: any) => [
                          value,
                          payload?.dataKey === "plan"
                            ? "Plan (MD)"
                            : "Capacity (MD)",
                        ]}
                      />

                      {/* 🟡 PLAN */}
                      <Bar
                        dataKey="plan"
                        name="Plan (MD)"
                        fill="#FACC15"
                        radius={[6, 6, 0, 0]}
                      >
                        <LabelList
                          dataKey="plan"
                          position="top"
                          fontSize={11}
                        />
                      </Bar>

                      {/* 🔵 CAPACITY */}
                      <Bar
                        dataKey="capacity"
                        name="Capacity (MD)"
                        fill="#60A5FA"
                        radius={[6, 6, 0, 0]}
                      >
                        <LabelList
                          dataKey="capacity"
                          position="top"
                          fontSize={11}
                        />
                      </Bar>

                      {/* ✅ LEGEND DI BAWAH */}
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ paddingTop: 12 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}