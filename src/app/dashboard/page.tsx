"use client";

import { useState, useEffect } from "react";
import { FilterSelect } from "./components/FilterSelect";
import { ChartSection } from "./components/ChartSection";
import { ProductivitySection } from "./components/ProductivitySection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { API_CONFIG } from "@/lib/api";

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    person: null,
    project: null,
    sprint: null,
    year: null,
  });

  interface ChartData {
    name: string;
    plan: number;
    capacity: number;
  }

  interface ProductivityData {
    name: string;
    plan: number;
    actual: number;
  }

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [productivityData, setProductivityData] = useState<ProductivityData[]>([]);
  const [loading, setLoading] = useState(false);

  // Save token dari URL params ke localStorage saat component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    
    if (token) {
      // Simpan token ke localStorage dengan format yang sama
      const auth = {
        authToken: token,
      };
      localStorage.setItem("auth", JSON.stringify(auth));
      
      // Optional: Remove token dari URL untuk keamanan
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // Update state ketika filter berubah
  const handleFilterChange = (
    key: string,
    value: { id: string; name: string | number } | null
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch data setelah klik Apply
  const handleApplyFilters = async () => {
    setLoading(true);
    console.log("Applying filters:", filters);

    try {
      // Validasi minimal filter yang dibutuhkan
      if (!filters.year ) {
        alert("Please select Year");
        setLoading(false);
        return;
      }

      // TODO: Replace dengan API call yang sebenarnya
      // const response = await fetch(`${API_CONFIG.baseUrl}/${API_CONFIG.companyId}/your-endpoint`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': localStorage.getItem('auth_token') || '',
      //   },
      //   body: JSON.stringify({
      //     person_id: filters.person.id,
      //     project_id: filters.project.id,
      //     sprint_id: filters.sprint.id,
      //     year_id: filters.year?.id,
      //   }),
      // });
      // const data = await response.json();

      // Simulasi API delay
      await new Promise((r) => setTimeout(r, 1200));

      // Mock data response
      const mockChartData: ChartData[] = [
        { name: "Week 1", plan: 40, capacity: 35 },
        { name: "Week 2", plan: 45, capacity: 42 },
        { name: "Week 3", plan: 38, capacity: 40 },
        { name: "Week 4", plan: 50, capacity: 48 },
      ];

      const mockProductivityData: ProductivityData[] = [
        { name: "Task 1", plan: 8, actual: 7 },
        { name: "Task 2", plan: 6, actual: 8 },
        { name: "Task 3", plan: 10, actual: 9 },
      ];

      setChartData(mockChartData);
      setProductivityData(mockProductivityData);

      console.log("Data loaded successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please try again.");
      setChartData([]);
      setProductivityData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* <ExportButton /> */}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border">
        <FilterSelect
          label="Select Person"
          endpoint={API_CONFIG.endpoints.employee}
          onChange={(val) => handleFilterChange("person", val)}
        />
        <FilterSelect
          label="Select Project"
          endpoint={API_CONFIG.endpoints.project}
          onChange={(val) => handleFilterChange("project", val)}
        />
        <FilterSelect
          label="Select Sprint"
          endpoint={API_CONFIG.endpoints.sprint}
          onChange={(val) => handleFilterChange("sprint", val)}
        />
        <FilterSelect
          label="Select Year"
          endpoint={API_CONFIG.endpoints.year}
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

      <ChartSection data={chartData} />
      <ProductivitySection data={productivityData} />
    </div>
  );
}