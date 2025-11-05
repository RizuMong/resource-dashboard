"use client";

import { useParams } from "next/navigation";

export default function DashboardDetailPage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard Detail</h1>
      <p className="text-gray-600 mt-2">Showing details for: {id}</p>
    </div>
  );
}
