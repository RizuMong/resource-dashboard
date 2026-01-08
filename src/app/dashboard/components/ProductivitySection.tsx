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

export interface ProductivityData {
  name: string;
  actual: number;
  plan: number;
  month?: number;
  year?: number;
  id?: string;
  summary: {
    solution_engineer?: { plan: number; actual: number };
    ui_solution_engineer?: { plan: number; actual: number };
    system_analyst?: { plan: number; actual: number };
    quality_assurance?: { plan: number; actual: number };
    devops?: { plan: number; actual: number };
    technical_writer?: { plan: number; actual: number };
  };
}

interface ProductivitySectionProps {
  data?: ProductivityData[];
  onBarClick?: (payload: ProductivityData) => void;
};

const ROLE_CONFIG = [
  { key: "solution_engineer", label: "Solution Engineer" },
  { key: "ui_solution_engineer", label: "UI Solution Engineer" },
  { key: "system_analyst", label: "System Analyst" },
  { key: "quality_assurance", label: "Quality Assurance" },
  { key: "devops", label: "DevOps" },
  { key: "technical_writer", label: "Technical Writer" },
];

const BAR_COLORS = {
  actual: "#FACC15",
  plan: "#A78BFA",
};

function hasMeaningfulData(item: ProductivityData) {
  if (item.actual > 0 || item.plan > 0) return true;

  if (item.summary) {
    return Object.values(item.summary).some(
      (role) => role && (role.plan > 0 || role.actual > 0)
    );
  }

  return false;
}

function mapSummaryToRoleData(summary: ProductivityData["summary"]) {
  return ROLE_CONFIG.map((role) => {
    const roleData = summary?.[role.key as keyof ProductivityData["summary"]];
    return {
      role: role.label,
      plan: roleData?.plan || 0,
      actual: roleData?.actual || 0,
    };
  });
}

export function ProductivitySection({
  data,
  onBarClick,
}: ProductivitySectionProps) {
  const mockData: ProductivityData[] = useMemo(
    () => [
      {
        name: "January",
        actual: 0,
        plan: 0,
        month: 1,
        summary: {},
      },
    ],
    []
  );

  const rawData = Array.isArray(data) && data.length > 0 ? data : mockData;

  const filteredChartData = useMemo(
    () => rawData.filter(hasMeaningfulData),
    [rawData]
  );

  const hasData = filteredChartData.length > 0;
  const isSingleMonth = filteredChartData.length === 1;

  const handleBarClick = (event: any) => {
    const payload: ProductivityData | undefined = event?.payload;
    if (!payload) return;
    onBarClick?.(payload);
  };

  return (
    <div className="border rounded-xl bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Productivity Overview
      </h2>

      <div className="h-[360px] w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredChartData}
              barGap={8}
              barCategoryGap="20%"
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis axisLine={false} tickLine={false} />

              <Tooltip />

              <Legend verticalAlign="bottom" iconType="circle" />

              <Bar
                dataKey="actual"
                name="Total Actual (MD)"
                fill={BAR_COLORS.actual}
                radius={[6, 6, 0, 0]}
                onClick={handleBarClick}
              >
                <LabelList dataKey="actual" position="top" fontSize={12} />
              </Bar>

              <Bar
                dataKey="plan"
                name="Total Plan (MD)"
                fill={BAR_COLORS.plan}
                radius={[6, 6, 0, 0]}
                onClick={handleBarClick}
              >
                <LabelList dataKey="plan" position="top" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data available
          </div>
        )}
      </div>

      {/* =========================
          Resource by Role
      ========================= */}
      {hasData && (
        <div className="mt-10">
          <div className="font-semibold text-gray-800 mb-4">
            Productivity by Role
          </div>

          <div
            className={
              isSingleMonth
                ? "flex flex-wrap gap-8"
                : "flex gap-8 overflow-x-auto pb-4"
            }
          >
            {filteredChartData.map((monthItem) => {
              const roleData = mapSummaryToRoleData(monthItem.summary);

              return (
                <div
                  key={monthItem.month}
                  className={isSingleMonth ? "w-full" : "min-w-[420px]"}
                >
                  <div className="text-center mb-2 text-sm font-medium">
                    {monthItem.name}
                  </div>

                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={roleData}
                        barGap={6}
                        barCategoryGap="25%"
                        margin={{ top: 24, right: 20, left: 10, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                        <XAxis
                          dataKey="role"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />

                        <YAxis axisLine={false} tickLine={false} />

                        <Tooltip />

                        <Bar
                          dataKey="plan"
                          name="Plan (MD)"
                          fill={BAR_COLORS.plan}
                          radius={[6, 6, 0, 0]}
                        >
                          <LabelList dataKey="plan" position="top" fontSize={11} />
                        </Bar>

                        <Bar
                          dataKey="actual"
                          name="Actual (MD)"
                          fill={BAR_COLORS.actual}
                          radius={[6, 6, 0, 0]}
                        >
                          <LabelList
                            dataKey="actual"
                            position="top"
                            fontSize={11}
                          />
                        </Bar>

                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
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
      )}
    </div>
  );
}