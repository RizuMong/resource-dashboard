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


interface ProductivityData {
  name: string;
  actual: number;
  plan: number;
  month?: number;
  year?: number;
  id?: string;
}


interface ProductivitySectionProps {
  data?: ProductivityData[];
  onBarClick?: (payload: ProductivityData) => void;
}


export function ProductivitySection({ data, onBarClick }: ProductivitySectionProps) {
  // Mock data bawaan (Jan - Dec)
  const mockData = useMemo(
    () => [
      { name: "January", actual: 0, plan: 0, month: 1, id:"" },
      { name: "February", actual: 0, plan: 0, month: 2, id:""  },
      { name: "March", actual: 0, plan: 0, month: 3, id:""  },
      { name: "April", actual: 0, plan: 0, month: 4, id:""  },
      { name: "May", actual: 0, plan: 0, month: 5, id:""  },
      { name: "June", actual: 0, plan: 0, month: 6, id:""  },
      { name: "July", actual: 0, plan: 0, month: 7, id:""  },
      { name: "August", actual: 0, plan: 0, month: 8, id:""  },
      { name: "September", actual: 0, plan: 0, month: 9, id:""  },
      { name: "October", actual: 0, plan: 0, month: 10, id:""  },
      { name: "November", actual: 0, plan: 0, month: 11, id:""  },
      { name: "December", actual: 0, plan: 0, month: 12, id:""  },
    ],
    []
  );


  // Gunakan data dari props, kalau kosong fallback ke mockData
  const chartData = data && data.length > 0 ? data : mockData;


  // Warna bold dan tetap nyaman di mata
  const barColors = {
    actual: "#FACC15", // amber-400 (lebih natural dari kuning pastel)
    plan: "#A78BFA", // purple-400 (lebih kontras tapi kalem)
  };


  const hasData = Array.isArray(chartData) && chartData.length > 0;


  // recharts onClick handler sends (data, index). We pick data.payload.
  const handleBarClick = (event: any) => {
    const payload: ProductivityData | undefined = event?.payload;
    if (!payload) return;
    if (onBarClick) onBarClick(payload);
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
                name="Total Actual (MD)"
                fill={barColors.actual}
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={700}
                animationEasing="ease-in-out"
                onClick={handleBarClick}
              >
                <LabelList
                  dataKey="actual"
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


              {/* Total SA Plan */}
              <Bar
                dataKey="plan"
                name="Total SA Plan (MD)"
                fill={barColors.plan}
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={700}
                animationEasing="ease-in-out"
                onClick={handleBarClick}
              >
                <LabelList
                  dataKey="plan"
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">
              No data available. Please apply filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



