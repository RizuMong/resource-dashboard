"use client";

import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { FilterSelect } from "./components/FilterSelect";
import { ChartSection } from "./components/ChartSection";
import { ProductivitySection } from "./components/ProductivitySection";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { API_CONFIG } from "@/lib/api";

interface ChartData {
  id?: string;
  month?: number;
  name: string;
  plan: number;
  capacity: number;
}

interface ProjectPlan {
  plan: number;
  project_id: {
    id: string;
    name: string;
  };
}

interface DetailResponseItem {
  capacity?: number;
  employee_email?: string;
  employee_name?: string;
  id?: string;
  month_name?: string;
  month_number?: number;
  plan?: number;
  project_plans?: ProjectPlan[];
  role?: string;
  status?: string;
  year?: number;
}

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    person: null as { id: string; name: string } | null,
    project: null as { id: string; name: string } | null,
    sprint: null as { id: string; name: string } | null,
    year: null as { id: string | number; name: string | number } | null,
  });

  // keep ref to avoid stale closure when building params
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [productivityData, setProductivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // modal + detail states
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<DetailResponseItem[] | null>(
    null
  );
  const [selectedContext, setSelectedContext] = useState<{
    id?: string;
    month?: number;
    month_name?: string;
    year?: number;
  } | null>(null);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [sortKey, setSortKey] = useState<
    "employee_name" | "employee_email" | "role" | "plan" | "capacity" | "status"
  >("employee_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const chartYear =
    filters.year?.name ?? filters.year?.id ?? new Date().getFullYear();

  const toggleRow = (id?: string) => {
    if (!id) return;
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sortedDetailData = useMemo(() => {
    if (!detailData) return [];
    const copy = [...detailData];
    copy.sort((a: any, b: any) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      // numeric fields
      if (sortKey === "plan" || sortKey === "capacity") {
        const na = Number(aVal || 0),
          nb = Number(bVal || 0);
        return sortDir === "asc" ? na - nb : nb - na;
      }
      // string compare
      const sa = String(aVal).toLowerCase();
      const sb = String(bVal).toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [detailData, sortKey, sortDir]);

  // helper to get token (localStorage or url)
  const getAuthToken = (): string => {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.authToken) return parsed.authToken;
      }
    } catch {}
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get("token") || "";
    } catch {
      return "";
    }
  };

  // unified mount: save token (if any), set default year, fetch data AFTER token saved
  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");
      if (tokenFromUrl) {
        try {
          localStorage.setItem(
            "auth",
            JSON.stringify({ authToken: tokenFromUrl })
          );
        } catch (e) {
          console.warn("save auth failed", e);
        }
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState({}, "", url.toString());
      }

      const currentYear = new Date().getFullYear();
      setFilters((p) => ({
        ...p,
        year: { id: String(currentYear), name: currentYear },
      }));
      await fetchDataForYear(currentYear);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch list (resource-planning)
  async function fetchDataForYear(yearValue: string | number) {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn("Token missing - abort fetch");
        setChartData([]);
        setProductivityData([]);
        return;
      }

      const yearStr = String(yearValue);
      const params = new URLSearchParams();
      params.append("year", yearStr);

      const f = filtersRef.current;
      if (f.person?.id) params.append("employee_id", f.person.id);
      if (f.project?.id) params.append("project_id", f.project.id);
      if (f.sprint?.id) params.append("sprint_id", f.sprint.id);

      const finalUrl = `${API_CONFIG.baseUrl.replace(
        /\/+$/,
        ""
      )}/project-management/dashboard/resource-planning?${params.toString()}`;
      console.log("Fetching list:", finalUrl);

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { Authorization: token },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch list");
      }

      const apiData: any[] = result?.data ?? [];

      if (!apiData.length) {
        setChartData([]);
        setProductivityData([]);
        return;
      }

      const formatted: ChartData[] = apiData.map((it: any) => ({
        id: it.id,
        month: it.month,
        name: it.name ?? `Month ${it.month ?? ""}`,
        plan: Number(it.plan ?? 0),
        capacity: Number(it.capacity ?? 0),
      }));

      setChartData(formatted);

      const prod = apiData.map((it: any) => ({
        name: it.name ?? `Month ${it.month ?? ""}`,
        plan: 0,
        actual: 0,
      }));
      setProductivityData(prod);
    } catch (err) {
      console.error("Fetch list error:", err);
      setChartData([]);
      setProductivityData([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (
    key: string,
    value: { id: string; name: string | number } | null
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    if (!filters.year) {
      alert("Please select Year");
      return;
    }
    await fetchDataForYear(filters.year.name ?? filters.year.id);
  };

  // fetch detail when a chart bar clicked
  async function fetchDetail(id?: string, month?: number) {
    if (!id || typeof month === "undefined") {
      setDetailError("Missing id or month");
      setDetailData(null);
      return;
    }

    setDetailLoading(true);
    setDetailError(null);
    setDetailData(null);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token not found");

      const params = new URLSearchParams();
      params.append("id", id);
      params.append("month", String(month));

      const f = filtersRef.current;
      if (f.person?.id) params.append("employee_id", f.person.id);
      if (f.project?.id) params.append("project_id", f.project.id);
      if (f.sprint?.id) params.append("sprint_id", f.sprint.id);

      const url = `${API_CONFIG.baseUrl.replace(
        /\/+$/,
        ""
      )}/project-management/dashboard/resource-planning/details?${params.toString()}`;
      console.log("Fetching detail:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: token },
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result?.message || "Failed to fetch details");

      const d: DetailResponseItem[] = result?.data ?? [];
      setDetailData(d);

      if (d && d.length > 0) {
        setSelectedContext({
          id,
          month,
          month_name: d[0]?.month_name,
          year: d[0]?.year,
        });
      }
    } catch (err: any) {
      console.error("Detail fetch error:", err);
      setDetailError(err?.message ?? "Failed to fetch details");
    } finally {
      setDetailLoading(false);
    }
  }

  // called by ChartSection when a bar is clicked
  const onChartBarClick = (payload: ChartData) => {
    // require id & month from payload
    setSelectedContext({ id: payload.id, month: payload.month });
    setModalOpen(true);
    fetchDetail(payload.id, payload.month);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDetailData(null);
    setDetailError(null);
    setSelectedContext(null);
  };

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border">
        <FilterSelect
          label="Select Person"
          endpoint={API_CONFIG.endpoints.employee}
          onChange={(v) => handleFilterChange("person", v)}
        />

        <FilterSelect
          label="Select Project"
          endpoint={API_CONFIG.endpoints.project}
          onChange={(v) => handleFilterChange("project", v)}
        />

        <FilterSelect
          label="Select Sprint"
          endpoint={API_CONFIG.endpoints.sprint}
          onChange={(v) => handleFilterChange("sprint", v)}
        />

        <FilterSelect
          label="Select Year"
          endpoint={API_CONFIG.endpoints.year}
          onChange={(v) => handleFilterChange("year", v)}
        />

        <div className="flex-1"></div>

        <Button
          onClick={handleApplyFilters}
          disabled={loading}
          className={`relative flex items-center gap-2 px-5 py-2.5 font-medium rounded-md transition-all duration-200 ${
            loading ? "cursor-not-allowed opacity-80" : "hover:shadow-md"
          } ${
            loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin absolute left-3" />
          )}
          <span className={`${loading ? "pl-4" : ""}`}>
            {loading ? "Applying..." : "Apply Filters"}
          </span>
        </Button>
      </div>

      {/* IMPORTANT: pass onBarClick so ChartSection can notify page */}
      <ChartSection
        data={chartData}
        year={chartYear}
        onBarClick={onChartBarClick}
      />
      <ProductivitySection data={productivityData} />

      {/* Modal (simple, no shadcn required) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-10">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative z-50 w-full max-w-7xl bg-white rounded-lg shadow-2xl p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Detail Resource
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  {selectedContext?.month_name
                    ? `${selectedContext.month_name} ${
                        selectedContext.year ?? ""
                      }`
                    : `Month ${selectedContext?.month ?? "-"}`}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={closeModal}
                  className="ml-3 p-2 rounded hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div>
              {detailLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-600 py-6">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading details...</span>
                </div>
              )}
              {detailError && (
                <div className="text-sm text-red-600 py-4">
                  Error: {detailError}
                </div>
              )}
              {!detailLoading &&
                !detailError &&
                detailData &&
                detailData.length === 0 && (
                  <div className="text-sm text-gray-600 py-6">
                    No detail data available for this month.
                  </div>
                )}
            </div>

            {/* Main table */}
            {!detailLoading &&
              !detailError &&
              detailData &&
              detailData.length > 0 && (
                <div className="mt-4 border rounded-lg overflow-auto max-h-[72vh]">
                  <table className="w-full min-w-[980px] table-auto">
                    <thead className="sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                      <tr className="text-sm text-gray-700 border-b">
                        <th className="px-6 py-3 w-12"></th>

                        {/* Full Name */}
                        <th
                          className="px-6 py-3 text-left cursor-pointer select-none"
                          onClick={() => {
                            setSortKey("employee_name");
                            setSortDir(
                              sortKey === "employee_name" && sortDir === "asc"
                                ? "desc"
                                : "asc"
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Full Name</span>
                            {sortKey === "employee_name" &&
                              (sortDir === "asc" ? (
                                <span>▲</span>
                              ) : (
                                <span>▼</span>
                              ))}
                          </div>
                        </th>

                        {/* Email */}
                        <th
                          className="px-6 py-3 text-left cursor-pointer"
                          onClick={() => {
                            setSortKey("employee_email");
                            setSortDir(
                              sortKey === "employee_email" && sortDir === "asc"
                                ? "desc"
                                : "asc"
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Email</span>
                            {sortKey === "employee_email" &&
                              (sortDir === "asc" ? (
                                <span>▲</span>
                              ) : (
                                <span>▼</span>
                              ))}
                          </div>
                        </th>

                        {/* Role */}
                        <th
                          className="px-6 py-3 text-left cursor-pointer w-56"
                          onClick={() => {
                            setSortKey("role");
                            setSortDir(
                              sortKey === "role" && sortDir === "asc"
                                ? "desc"
                                : "asc"
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Role</span>
                            {sortKey === "role" &&
                              (sortDir === "asc" ? (
                                <span>▲</span>
                              ) : (
                                <span>▼</span>
                              ))}
                          </div>
                        </th>

                        {/* Capacity */}
                        <th
                          className="px-6 py-3 text-right cursor-pointer w-32"
                          onClick={() => {
                            setSortKey("capacity");
                            setSortDir(
                              sortKey === "capacity" && sortDir === "asc"
                                ? "desc"
                                : "asc"
                            );
                          }}
                        >
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-semibold">
                              Total Capacity
                            </span>
                            {sortKey === "capacity" &&
                              (sortDir === "asc" ? (
                                <span>▲</span>
                              ) : (
                                <span>▼</span>
                              ))}
                          </div>
                        </th>

                        {/* Plan */}
                        <th
                          className="px-6 py-3 text-right cursor-pointer w-32"
                          onClick={() => {
                            setSortKey("plan");
                            setSortDir(
                              sortKey === "plan" && sortDir === "asc"
                                ? "desc"
                                : "asc"
                            );
                          }}
                        >
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-semibold">Total Plan</span>
                            {sortKey === "plan" &&
                              (sortDir === "asc" ? (
                                <span>▲</span>
                              ) : (
                                <span>▼</span>
                              ))}
                          </div>
                        </th>

                        {/* Status */}
                        <th
                          className="px-6 py-3 text-left cursor-pointer w-44"
                          onClick={() => {
                            setSortKey("status");
                            setSortDir(
                              sortKey === "status" && sortDir === "asc"
                                ? "desc"
                                : "asc"
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Status</span>
                            {sortKey === "status" &&
                              (sortDir === "asc" ? (
                                <span>▲</span>
                              ) : (
                                <span>▼</span>
                              ))}
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sortedDetailData.map((row, idx) => {
                        const rowId = row.id ?? String(idx);
                        const isOpen = expandedRows.has(rowId);
                        const status = (row.status ?? "").toUpperCase();
                        const statusClasses =
                          status === "OVER CAPACITY"
                            ? "bg-red-100 text-red-700"
                            : status === "ON CAPACITY"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700";

                        return (
                          <React.Fragment key={rowId}>
                            <tr className="odd:bg-white even:bg-gray-50">
                              <td className="px-6 py-4 align-top">
                                {row.project_plans &&
                                row.project_plans.length > 0 ? (
                                  <button
                                    onClick={() => toggleRow(rowId)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded border text-gray-700 hover:bg-gray-100"
                                  >
                                    {isOpen ? "−" : "+"}
                                  </button>
                                ) : (
                                  <span className="inline-block w-8 h-8" />
                                )}
                              </td>

                              <td className="px-6 py-4 align-top">
                                <div className="text-sm font-medium text-gray-900">
                                  {row.employee_name ?? "-"}
                                </div>
                              </td>

                              <td className="px-6 py-4 align-top">
                                <div className="text-sm text-gray-600 break-all">
                                  {row.employee_email ?? "-"}
                                </div>
                              </td>

                              <td className="px-6 py-4 align-top">
                                <div className="text-sm text-gray-700">
                                  {row.role ?? "-"}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-right align-top">
                                <div className="text-sm font-medium text-gray-900">
                                  {row.capacity ?? 0}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-right align-top">
                                <div className="text-sm font-medium text-gray-900">
                                  {row.plan ?? 0}
                                </div>
                              </td>

                              <td className="px-6 py-4 align-top">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClasses}`}
                                >
                                  {status || "-"}
                                </span>
                              </td>
                            </tr>

                            {/* Expanded project plans (tidy UI) */}
                            {isOpen && (
                              <tr className="bg-gray-50">
                                <td colSpan={7} className="px-6 py-3">
                                  <div className="p-0 border rounded">
                                    <div className="overflow-x-auto">
                                      <table className="w-full table-auto">
                                        <thead>
                                          <tr className="bg-white/50">
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                              Project Name
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 w-36">
                                              Total Plan
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {row.project_plans &&
                                          row.project_plans.length > 0 ? (
                                            row.project_plans.map(
                                              (pp: any, i: number) => (
                                                <tr
                                                  key={i}
                                                  className={
                                                    i % 2 === 0
                                                      ? "bg-white"
                                                      : "bg-gray-50"
                                                  }
                                                >
                                                  <td className="px-4 py-3 text-gray-800">
                                                    {pp.project_id?.name ?? "-"}
                                                  </td>
                                                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                    {pp.plan ?? 0}
                                                  </td>
                                                </tr>
                                              )
                                            )
                                          ) : (
                                            <tr>
                                              <td
                                                colSpan={2}
                                                className="px-4 py-3 text-gray-500"
                                              >
                                                No project plans
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            <div className="h-3" />
          </div>
        </div>
      )}
    </div>
  );
}
