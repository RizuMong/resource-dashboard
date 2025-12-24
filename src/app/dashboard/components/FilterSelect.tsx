"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ==================== API Configuration ====================
// SECURE: Base URL sudah include company ID, tidak di-expose ke props
const API_CONFIG = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-oos.jojonomic.com/14",
  endpoints: {
    project: "/project-management/project/index",
    sprint: "/project-management/sprint/index",
    role: "/project-management/role/index",
    employee: "/project-management/employee/index",
    year: "/project-management/year/index",
  },
} as const;

// ==================== Token Management ====================
const getTokenFromUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return params.get("token");
};

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  // Cek token dari URL params terlebih dahulu
  let token = getTokenFromUrl();

  // Jika tidak ada di URL, cek di localStorage
  if (!token) {
    const auth = localStorage.getItem("auth");
    const tokens = auth ? JSON.parse(auth) : null;
    token = tokens?.authToken;
  }

  return token;
};

// ==================== API Service ====================
class ApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = getAuthToken();

    console.log("🔐 Getting Auth Token...");
    console.log(
      "  - Token from URL:",
      getTokenFromUrl()?.substring(0, 20) + "..."
    );

    const authFromStorage = localStorage.getItem("auth");
    console.log(
      "  - Auth from localStorage:",
      authFromStorage ? "Found" : "Not found"
    );

    if (token) {
      headers["Authorization"] = token;
      console.log(
        "  - ✅ Token added to headers:",
        token.substring(0, 20) + "..."
      );
    } else {
      console.log("  - ⚠️ No token found!");
    }

    return headers;
  }

  async fetch<T>(endpoint: string): Promise<T> {
    // Build full URL: baseUrl sudah include company ID
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const headers = this.getHeaders();

    console.group(`🔵 API Request: ${endpoint}`);
    console.log("📍 Full URL:", url);
    console.log("🔑 Headers:", headers);
    console.log("⏰ Timestamp:", new Date().toISOString());
    console.groupEnd();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      console.group(`🟢 API Response: ${endpoint}`);
      console.log("📊 Status:", response.status, response.statusText);
      console.log("📄 Response OK:", response.ok);
      console.groupEnd();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.group(`✅ API Data: ${endpoint}`);
      console.log("📦 Data:", data);
      console.log("📝 Data Count:", data.data?.length || 0);
      console.groupEnd();

      if (data.error) {
        throw new Error(data.message || "API returned an error");
      }

      return data;
    } catch (error) {
      console.group(`🔴 API Error: ${endpoint}`);
      console.error("❌ Error Details:", error);
      console.error("🔗 Failed URL:", url);
      console.error("🔑 Used Headers:", headers);
      console.groupEnd();
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

// ==================== API Response Types ====================
interface ApiResponse<T> {
  code: number;
  data: T[];
  error: boolean;
  message: string;
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
}

interface RoleData {
  id: string;
  name: string;
  code: string;
}

interface SprintData {
  id: string;
  name: string;
  start_date: number;
  end_date: number;
}

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  role_id: {
    id: string;
    name: string;
  };
}

interface YearData {
  id: string;
  name: number;
  status: string;
}

type FilterData = ProjectData | SprintData | EmployeeData | YearData | RoleData;

// ==================== Custom Hook for API Data ====================
function useApiData(endpoint: string) {
  const [data, setData] = React.useState<
    { id: string; name: string | number }[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      console.log(`\n🚀 [useApiData] Starting fetch for: ${endpoint}`);

      setLoading(true);
      setError(null);

      try {
        const response = await apiService.fetch<ApiResponse<FilterData>>(
          endpoint
        );

        if (isMounted) {
          const transformedData = response.data.map((item) => ({
            id: item.id,
            name: item.name,
          }));

          console.log(`✅ [useApiData] Data transformed:`, transformedData);
          setData(transformedData);
        }
      } catch (err) {
        console.error(`❌ [useApiData] Fetch failed:`, err);

        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch data";
          setError(errorMessage);
          console.error(`🔴 [useApiData] Error message:`, errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log(`🏁 [useApiData] Fetch completed for: ${endpoint}`);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      console.log(`🧹 [useApiData] Cleanup for: ${endpoint}`);
    };
  }, [endpoint]);

  return { data, loading, error };
}

// ==================== FilterSelect Component ====================
interface FilterSelectProps {
  label: string;
  endpoint: string;
  onChange?: (value: { id: string; name: string | number } | null) => void;
  disabled?: boolean;
}

export function FilterSelect({
  label,
  endpoint,
  onChange,
  disabled = false,
}: FilterSelectProps) {
  const [selected, setSelected] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const { data, loading, error } = useApiData(endpoint);

  // Filter data berdasarkan search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      const name = String(item.name).toLowerCase();
      const id = item.id.toLowerCase();
      return name.includes(query) || id.includes(query);
    });
  }, [data, searchQuery]);

  const handleSelect = (value: string) => {
    setSelected(value);
    const item = data.find((opt) => opt.id === value) || null;
    if (onChange) onChange(item);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected("");
    setSearchQuery("");
    if (onChange) onChange(null);
  };

  const isDisabled = disabled || loading;

  return (
    <div className="relative">
      <Select
        value={selected}
        onValueChange={handleSelect}
        disabled={isDisabled}
      >
        <SelectTrigger
          className={`w-[250px] bg-white text-gray-500 flex items-center justify-between ${
            selected ? "font-medium" : "text-gray-400"
          }`}
        >
          <SelectValue
            placeholder={
              loading ? "Loading..." : error ? "Error loading data" : label
            }
          />
          {selected && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </SelectTrigger>

        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : error ? (
            <SelectItem value="error" disabled>
              {error}
            </SelectItem>
          ) : (
            <>
              {/* Search Input */}
              {data.length > 5 && (
                <div className="px-2 py-2 border-b sticky top-0 bg-white z-10">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Filtered Results */}
              <div className="max-h-[200px] overflow-y-auto">
                {filteredData.length === 0 ? (
                  <SelectItem value="no-results" disabled>
                    {searchQuery ? "No results found" : "No data available"}
                  </SelectItem>
                ) : (
                  filteredData.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))
                )}
              </div>

              {/* Result Count */}
              {searchQuery && filteredData.length > 0 && (
                <div className="px-2 py-2 text-xs text-gray-500 border-t bg-gray-50 sticky bottom-0">
                  Showing {filteredData.length} of {data.length} results
                </div>
              )}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// ==================== Export ====================
export { API_CONFIG, apiService, useApiData };
