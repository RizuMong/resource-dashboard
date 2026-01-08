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

/* =========================
   Types
========================= */
interface RoleSummary {
  plan: number;
  capacity: number;
}

interface SummaryData {
  solution_engineer?: RoleSummary;
  ui_solution_engineer?: RoleSummary;
  system_analyst?: RoleSummary;
  quality_assurance?: RoleSummary;
  devops?: RoleSummary;
  technical_writer?: RoleSummary;
}

export interface ProductivityData {
  name: string;
  actual: number;
  plan: number;
  month?: number;
  year?: number;
  id?: string;
  summary: SummaryData; // ⬅️ WAJIB
}

interface ProductivitySectionProps {
  data?: ProductivityData[];
  onBarClick?: (payload: ProductivityData) => void;
}

/* =========================
   Constants
========================= */
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

/* =========================
   Component
========================= */
export function ProductivitySection({
  data,
  onBarClick,
}: ProductivitySectionProps) {
  /* =========================
     Mock (fallback)
  ========================= */
  const mockData: ProductivityData[] = useMemo(
    () => [
      {
        name: "January",
        actual: 0,
        plan: 0,
        month: 1,
        summary: {
          solution_engineer: { plan: 0, capacity: 0 },
          ui_solution_engineer: { plan: 0, capacity: 0 },
          system_analyst: { plan: 0, capacity: 0 },
          quality_assurance: { plan: 0, capacity: 0 },
          devops: { plan: 0, capacity: 0 },
          technical_writer: { plan: 0, capacity: 0 },
        },
      },
    ],
    []
  );

  /* =========================
     Safe Chart Data
  ========================= */
  const chartData = useMemo<ProductivityData[]>(() => {
    if (!Array.isArray(data) || data.length === 0) return mockData;

    // pastikan summary selalu ada
    return data.map((item) => ({
      ...item,
      summary: item.summary || {},
    }));
  }, [data, mockData]);

  const hasData = chartData.length > 0;

  /* =========================
     Helpers
  ========================= */
  const handleBarClick = (event: any) => {
    const payload: ProductivityData | undefined = event?.payload;
    if (!payload) return;
    onBarClick?.(payload);
  };

  const mapSummaryToRoleData = (summary: SummaryData) =>
    ROLE_CONFIG.map((role) => {
      const roleData = summary?.[role.key as keyof SummaryData];
      return {
        role: role.label,
        plan: roleData?.plan || 0,
        capacity: roleData?.capacity || 0,
      };
    });

  /* =========================
     Debug (optional)
  ========================= */
  console.log("PRODUCTIVITY DATA", chartData);

  /* =========================
     Render
  ========================= */
  return (
    <div className="border rounded-xl bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Productivity Overview
      </h2>

      <div className="h-[360px] w-full">
        {hasData ? (
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
                  backgroundColor: "#FFFFFF",
                }}
              />

              <Legend
                wrapperStyle={{ fontSize: 13 }}
                iconType="circle"
                verticalAlign="bottom"
              />

              {/* ACTUAL */}
              <Bar
                dataKey="actual"
                name="Total Actual (MD)"
                fill={BAR_COLORS.actual}
                radius={[6, 6, 0, 0]}
                onClick={handleBarClick}
              >
                <LabelList dataKey="actual" position="top" fontSize={12} />
              </Bar>

              {/* PLAN */}
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
      <div className="mt-10">
        <div className="font-semibold text-gray-800 mb-4">
          Resource Planning by Role
        </div>

        
      </div>
    </div>
  );
}