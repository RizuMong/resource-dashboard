import { useParams } from "next/navigation";

export default function DashboardDetailPage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Detail for ID: {id}</h1>
      <p>Here you can show breakdown, table, or charts related to this ID.</p>
    </div>
  );
}
