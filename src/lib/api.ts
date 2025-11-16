// src/lib/api-config.ts atau src/config/api.ts

/**
 * API Configuration
 * Centralized configuration untuk semua API endpoints
 */

export const API_CONFIG = {
  // Base URL dari API (sudah include company ID)
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-oos.jojonomic.com/14",
  
  // Timeout untuk request (dalam milliseconds)
  timeout: 10000,
  
  // Semua endpoints API
  endpoints: {
    // Project Management endpoints
    project: "/project-management/project/index",
    sprint: "/project-management/sprint/index",
    employee: "/project-management/employee/index",
    year: "/project-management/year/index",
    
    // Bisa tambahkan endpoints lain
    // dashboard: "/dashboard/overview",
    // tasks: "/project-management/tasks/index",
    // reports: "/project-management/reports/index",
  },
} as const;

// Type helper untuk endpoint keys
export type EndpointKey = keyof typeof API_CONFIG.endpoints;

// Helper function untuk build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Export untuk digunakan di komponen
export default API_CONFIG;