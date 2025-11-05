"use client";

import { useState } from "react";
import { FilterSelect } from "./components/FilterSelect";
import { ChartSection } from "./components/ChartSection";
import { ProductivitySection } from "./components/ProductivitySection";
import { Button } from "@/components/ui/button";
// import { ExportButton } from "./components/ExportButton";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    person: null,
    project: null,
    sprint: null,
  });

  interface chartData {
    name: string;
    plan: number;
    capacity: number;
  }

  interface productivityData {
    name: string;
    plan: number;
    actual: number;
  }

  const [chartData, setChartData] = useState<chartData[]>([]);
  const [productivityData, setProductivityData] = useState<productivityData[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Mock Data
  const mockPersons = [
    { id: "1", name: "Rizki Haddi" },
    { id: "2", name: "Aria" },
    { id: "3", name: "Dimas" },
  ];

  const mockProjects = [
    { id: "p1", name: "Lexus" },
    { id: "p2", name: "BPJS" },
    { id: "p3", name: "Riung IMS" },
  ];

  const mockSprints = [
    { id: "s1", name: "Sprint 22 - 2025" },
    { id: "s2", name: "Sprint 23 - 2025" },
    { id: "s3", name: "Sprint 24 - 2025" },
  ];

  const mockYears = [
    { id: "s1", name: "2025" },
    { id: "s2", name: "2024" },
  ];

  // Update state ketika filter berubah
  const handleFilterChange = (
    key: string,
    value: { id: string; name: string } | null
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Simulasi fetch data setelah klik Apply
  const handleApplyFilters = async () => {
    setLoading(true);
    console.log("Applying filters:", filters);

    // Simulasi API delay
    await new Promise((r) => setTimeout(r, 1200));

    if (!filters.project || !filters.person || !filters.sprint) {
      setChartData([]);
      setProductivityData([]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* <ExportButton /> */}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border">
        <FilterSelect
          label="Select Person"
          mockData={mockPersons}
          onChange={(val) => handleFilterChange("person", val)}
        />
        <FilterSelect
          label="Select Project"
          mockData={mockProjects}
          onChange={(val) => handleFilterChange("project", val)}
        />
        <FilterSelect
          label="Select Sprint"
          mockData={mockSprints}
          onChange={(val) => handleFilterChange("sprint", val)}
        />
        <FilterSelect
          label="Select Year"
          mockData={mockYears}
          onChange={(val) => handleFilterChange("year", val)}
        />

        {/* Spacer biar tombol ke kanan */}
        <div className="flex-1"></div>

        {/* Apply Button */}
        <Button
          onClick={handleApplyFilters}
          disabled={loading}
          className={`
    relative flex items-center gap-2 px-5 py-2.5
    font-medium rounded-md transition-all duration-200
    ${loading ? "cursor-not-allowed opacity-80" : "hover:shadow-md"}
    ${
      loading
        ? "bg-blue-400 text-white"
        : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
    }
  `}
        >
          {loading && (
            <span className="absolute left-3 flex items-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </span>
          )}
          <span className={`${loading ? "pl-4" : ""}`}>
            {loading ? "Applying..." : "Apply Filters"}
          </span>
        </Button>

        {/* <ExportButton /> */}
      </div>

      {/* Chart Section */}
      <ChartSection data={chartData} />
      <ProductivitySection data={productivityData} />
    </div>
  );
}
