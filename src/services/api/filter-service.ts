// src/services/api/filter-service.ts
import { apiClient } from "@/services/api/api-client";

const GET_PROJECTS = "/project-management/project/index";
const GET_SPRINTS = "/project-management/sprint/index";
const GET_EMPLOYEES = "/project-management/employee/index";
const GET_YEARS = "/project-management/year/index";

const { get } = apiClient;

const filterService = {
  async getProjects(): Promise<IDName[]> {
    const res = await get<GlobalResponse<IDName[]>>(GET_PROJECTS);
    const { data, error, message } = res.data;
    if (error) throw new Error(message || "Failed to fetch projects");
    return data;
  },

  async getSprints(): Promise<IDName[]> {
    const res = await get<GlobalResponse<IDName[]>>(GET_SPRINTS);
    const { data, error, message } = res.data;
    if (error) throw new Error(message || "Failed to fetch sprints");
    return data;
  },

  async getEmployees(): Promise<IDName[]> {
    const res = await get<GlobalResponse<IDName[]>>(GET_EMPLOYEES);
    const { data, error, message } = res.data;
    if (error) throw new Error(message || "Failed to fetch employees");
    return data;
  },

  async getYears(): Promise<IDName[]> {
    const res = await get<GlobalResponse<IDName[]>>(GET_YEARS);
    const { data, error, message } = res.data;
    if (error) throw new Error(message || "Failed to fetch years");
    return data;
  },
};

export default filterService;
