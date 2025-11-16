"use client";

<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> 60052d16d2ee93edf5589b8cb7b1e3f12aa62af9
import { FilterSelect } from "./components/FilterSelect";
import { ChartSection } from "./components/ChartSection";
import { ProductivitySection } from "./components/ProductivitySection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { API_CONFIG } from "@/lib/api";

export default function DashboardPage() {
  const [filters, setFilters] = useState({
<<<<<<< HEAD
    person: null as { id: string; name: string } | null,
    project: null as { id: string; name: string } | null,
    sprint: null as { id: string; name: string } | null,
    year: null as { id: string | number; name: string | number } | null,
=======
    person: null,
    project: null,
    sprint: null,
    year: null,
>>>>>>> 60052d16d2ee93edf5589b8cb7b1e3f12aa62af9
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

<<<<<<< HEAD
  // Ambil token dari URL dan simpan ke localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("auth", JSON.stringify({ authToken: token }));

=======
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
>>>>>>> 60052d16d2ee93edf5589b8cb7b1e3f12aa62af9
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);
<<<<<<< HEAD

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
=======
>>>>>>> 60052d16d2ee93edf5589b8cb7b1e3f12aa62af9

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

<<<<<<< HEAD
  // Apply button
  const handleApplyFilters = async () => {
    if (!filters.year) {
      alert("Please select a year");
      return;
    }
    await fetchDataForYear(filters.year.name ?? filters.year.id);
=======
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
>>>>>>> 60052d16d2ee93edf5589b8cb7b1e3f12aa62af9
  };

  return (
    <div className="min-h-screen space-y-8">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
<<<<<<< HEAD
=======
        {/* <ExportButton /> */}
>>>>>>> 60052d16d2ee93edf5589b8cb7b1e3f12aa62af9
      </div>

      <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border">
<<<<<<< HEAD
        <FilterSelect label="Select Person" endpoint={API_CONFIG.endpoints.employee} onChange={(v) => handleFilterChange("person", v)} />
        <FilterSelect label="Select Project" endpoint={API_CONFIG.endpoints.project} onChange={(v) => handleFilterChange("project", v)} />
        <FilterSelect label="Select Sprint" endpoint={API_CONFIG.endpoints.sprint} onChange={(v) => handleFilterChange("sprint", v)} />
        <FilterSelect label="Select Year" endpoint={API_CONFIG.endpoints.year} onChange={(v) => handleFilterChange("year", v)} />
=======
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
>>>>>>> 60052d16d2ee93edf5589b8cb7b1e3f12aa62af9

        <div className="flex-1"></div>

        <Button
          onClick={handleApplyFilters}
          disabled={loading}
<<<<<<< HEAD
          className={`relative flex items-center gap-2 px-5 py-2.5 font-medium rounded-md transition-all duration-200 ${
            loading ? "cursor-not-allowed opacity-80" : "hover:shadow-md"
          } ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
=======
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
>>>>>>> 60052d16d2ee93edf5589b8cb7b1e3f12aa62af9
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin absolute left-3" />}
          <span className={`${loading ? "pl-4" : ""}`}>
            {loading ? "Applying..." : "Apply Filters"}
          </span>
        </Button>
      </div>

      <ChartSection data={chartData} />
      <ProductivitySection data={productivityData} />

    </div>
  );
}