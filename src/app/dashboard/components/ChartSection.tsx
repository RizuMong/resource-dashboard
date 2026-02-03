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
import { useEffect, useMemo, useState } from "react";

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
}

interface ChartSectionProps {
  data?: ChartItem[];
  year?: number | string;
  onBarClick?: (payload: ChartItem) => void;
}

const ROLE_CONFIG = [
  { key: "solution_engineer", label: "SE" },
  { key: "ui_solution_engineer", label: "UI SE" },
  { key: "system_analyst", label: "SA" },
  { key: "quality_assurance", label: "QA" },
  { key: "devops", label: "DevOps" },
  { key: "technical_writer", label: "TW" },
];

const BAR_COLORS = {
  plan: "#FACC15",
  capacity: "#60A5FA",
};

export function ChartSection({ data, year, onBarClick }: ChartSectionProps) {
  const displayYear = year ?? new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const mockData: ChartItem[] = useMemo(
    () => [
      {
        name: "Jan",
        month: 1,
        plan: 0,
        capacity: 0,
        summary: {},
      },
    ],
    []
  );

  const chartData =
    Array.isArray(data) && data.length > 0 ? data : mockData;

  const hasRealData = Array.isArray(data) && data.length > 0;

  const handleBarClick = (event: any) => {
    const payload: ChartItem | undefined = event?.payload;
    if (payload) onBarClick?.(payload);
  };

  const mapSummaryToRoleData = (summary: ChartItem["summary"]) =>
    ROLE_CONFIG.map((role) => {
      const roleData = summary?.[role.key as keyof ChartItem["summary"]];
      return {
        role: role.label,
        plan: roleData?.plan || 0,
        capacity: roleData?.capacity || 0,
      };
    });

  return (
    <div className="border rounded-xl bg-white p-4 sm:p-6">
      {/* =========================
          HEADER
      ========================= */}
      <div className="flex items-center mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Resource Planning
          <span className="ml-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
            {displayYear}
          </span>
        </h2>
      </div>

      {/* =========================
          MAIN CHART
      ========================= */}
      <div className="h-[260px] sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={6}
            barCategoryGap={isMobile ? "15%" : "20%"}
            margin={{
              top: isMobile ? 12 : 20,
              right: 16,
              left: 0,
              bottom: isMobile ? 20 : 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />

            {!isMobile && (
              <Legend verticalAlign="bottom" iconType="circle" />
            )}

            <Bar
              dataKey="plan"
              name="Total Plan (MD)"
              fill={BAR_COLORS.plan}
              radius={[6, 6, 0, 0]}
              onClick={handleBarClick}
            >
              {!isMobile && (
                <LabelList dataKey="plan" position="top" fontSize={12} />
              )}
            </Bar>

            <Bar
              dataKey="capacity"
              name="Total Capacity (MD)"
              fill={BAR_COLORS.capacity}
              radius={[6, 6, 0, 0]}
              onClick={handleBarClick}
            >
              {!isMobile && (
                <LabelList
                  dataKey="capacity"
                  position="top"
                  fontSize={12}
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!hasRealData && (
        <p className="text-center text-gray-400 mt-4 text-sm">
          No data available for {displayYear}
        </p>
      )}

      {/* =========================
          RESOURCE BY ROLE
      ========================= */}
      <div className="mt-8">
        <div className="font-semibold text-gray-800 mb-4">
          Resource Planning by Role
        </div>
        
        <div className="flex flex-nowrap gap-6 overflow-x-auto pb-4">
          {chartData.map((monthItem) => {
            const roleData = mapSummaryToRoleData(monthItem.summary);

            return (
              <div
                key={monthItem.month}
                className="min-w-[320px] sm:min-w-[380px] lg:min-w-[420px]"
              >
                <div className="text-center mb-2 text-sm font-medium text-gray-700">
                  {monthItem.name}
                </div>

                <div className="h-[220px] sm:h-60 lg:h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roleData}
                      barGap={6}
                      barCategoryGap={isMobile ? "15%" : "25%"}
                      margin={{
                        top: isMobile ? 12 : 24,
                        right: 16,
                        left: 0,
                        bottom: isMobile ? 24 : 40,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="role"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />

                      <YAxis axisLine={false} tickLine={false} />

                      <Tooltip
                        formatter={(
                          value: number,
                          _,
                          payload: any
                        ) => [
                          value,
                          payload?.dataKey === "plan"
                            ? "Plan (MD)"
                            : "Capacity (MD)",
                        ]}
                      />

                      <Bar
                        dataKey="plan"
                        name="Plan (MD)"
                        fill={BAR_COLORS.plan}
                        radius={[6, 6, 0, 0]}
                      >
                        {!isMobile && (
                          <LabelList
                            dataKey="plan"
                            position="top"
                            fontSize={11}
                          />
                        )}
                      </Bar>

                      <Bar
                        dataKey="capacity"
                        name="Capacity (MD)"
                        fill={BAR_COLORS.capacity}
                        radius={[6, 6, 0, 0]}
                      >
                        {!isMobile && (
                          <LabelList
                            dataKey="capacity"
                            position="top"
                            fontSize={11}
                          />
                        )}
                      </Bar>

                      {!isMobile && (
                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          wrapperStyle={{ paddingTop: 12 }}
                        />
                      )}
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