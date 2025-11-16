"use client";

import { useState, useEffect, useCallback } from "react";
import { FilterSelect } from "./components/FilterSelect";
import { ChartSection } from "./components/ChartSection";
import { ProductivitySection } from "./components/ProductivitySection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { API_CONFIG } from "@/lib/api";

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    person: null as { id: string; name: string } | null,
    project: null as { id: string; name: string } | null,
    sprint: null as { id: string; name: string } | null,
    year: null as { id: string | number; name: string | number } | null,
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

  const chartYear = filters.year?.name ?? filters.year?.id ?? new Date().getFullYear();

  // Ambil token dari URL dan simpan ke localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("auth", JSON.stringify({ authToken: token }));

      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const getAuthToken = (): string => {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.authToken || "";
      }
    } catch (_) {}
    return "";
  };

  // Fetch API berdasarkan tahun & filters
  const fetchDataForYear = useCallback(
    async (yearValue: string | number) => {
      setLoading(true);
      try {
        const token = getAuthToken();
        if (!token) {
          alert("Token not found.");
          return;
        }

        const yearStr = String(yearValue);

        // Build Query Params
        const params = new URLSearchParams();
        params.append("year", yearStr);

        // OPTIONAL params → hanya dikirim jika ada value
        if (filters.person?.id) params.append("employee_id", filters.person.id);
        if (filters.project?.id) params.append("project_id", filters.project.id);
        if (filters.sprint?.id) params.append("sprint_id", filters.sprint.id);

        const finalUrl = `${API_CONFIG.baseUrl}/project-management/dashboard/resource-planning?${params.toString()}`;
        console.log("Final URL:", finalUrl);

        const response = await fetch(finalUrl, {
          method: "POST",
          headers: { Authorization: token },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Failed fetching data");
        }

        const apiData: Array<any> = result?.data ?? [];

        // ❗ Jika data kosong → return semuanya 0 saja (TANPA MOCK DATA)
        if (!apiData.length) {
          setChartData([]);
          setProductivityData([]);
          return;
        }

        // Map ke chart
        const formattedChart: ChartData[] = apiData.map((item: any) => ({
          name: item.name ?? `Month ${item.month ?? ""}`,
          plan: Number(item.plan ?? 0),
          capacity: Number(item.capacity ?? 0),
        }));

        // Productivity masih kosong → 0 semua
        const formattedProductivity: ProductivityData[] = apiData.map((item: any) => ({
          name: item.name ?? `Month ${item.month ?? ""}`,
          plan: 0,
          actual: 0,
        }));

        setChartData(formattedChart);
        setProductivityData(formattedProductivity);
      } catch (err) {
        console.error("Fetch Error:", err);
        setChartData([]);
        setProductivityData([]);
      } finally {
        setLoading(false);
      }
    },
    [filters.person, filters.project, filters.sprint]
  );

  // Saat page load → langsung auto fetch tahun berjalan
  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentYear = new Date().getFullYear();

    setFilters((prev) => ({
      ...prev,
      year: { id: String(currentYear), name: currentYear },
    }));

    fetchDataForYear(currentYear);
  }, []);

  // Update filter
  const handleFilterChange = (
    key: string,
    value: { id: string; name: string | number } | null
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply button
  const handleApplyFilters = async () => {
    if (!filters.year) {
      alert("Please select a year");
      return;
    }
    await fetchDataForYear(filters.year.name ?? filters.year.id);
  };

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border">
        <FilterSelect label="Select Person" endpoint={API_CONFIG.endpoints.employee} onChange={(v) => handleFilterChange("person", v)} />
        <FilterSelect label="Select Project" endpoint={API_CONFIG.endpoints.project} onChange={(v) => handleFilterChange("project", v)} />
        <FilterSelect label="Select Sprint" endpoint={API_CONFIG.endpoints.sprint} onChange={(v) => handleFilterChange("sprint", v)} />
        <FilterSelect label="Select Year" endpoint={API_CONFIG.endpoints.year} onChange={(v) => handleFilterChange("year", v)} />

        <div className="flex-1"></div>

        <Button
          onClick={handleApplyFilters}
          disabled={loading}
          className={`relative flex items-center gap-2 px-5 py-2.5 font-medium rounded-md transition-all duration-200 ${
            loading ? "cursor-not-allowed opacity-80" : "hover:shadow-md"
          } ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin absolute left-3" />}
          <span className={`${loading ? "pl-4" : ""}`}>
            {loading ? "Applying..." : "Apply Filters"}
          </span>
        </Button>
      </div>

    <ChartSection data={chartData} year={chartYear} />
      <ProductivitySection data={productivityData} />

    </div>
  );
}
