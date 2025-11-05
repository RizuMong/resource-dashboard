"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react"; // Excel-like icon

export function ExportButton() {
  const handleExport = () => {
    const data = [
      { Month: "Jan", Total_Plan: 100, Total_Capacity: 220 },
      { Month: "Feb", Total_Plan: 120, Total_Capacity: 210 },
      { Month: "Mar", Total_Plan: 150, Total_Capacity: 230 },
      { Month: "Apr", Total_Plan: 130, Total_Capacity: 200 },
      { Month: "May", Total_Plan: 160, Total_Capacity: 240 },
      { Month: "Jun", Total_Plan: 140, Total_Capacity: 230 },
      { Month: "Jul", Total_Plan: 170, Total_Capacity: 250 },
      { Month: "Aug", Total_Plan: 150, Total_Capacity: 240 },
      { Month: "Sep", Total_Plan: 130, Total_Capacity: 220 },
      { Month: "Oct", Total_Plan: 160, Total_Capacity: 230 },
      { Month: "Nov", Total_Plan: 140, Total_Capacity: 210 },
      { Month: "Dec", Total_Plan: 155, Total_Capacity: 235 },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ResourceData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `Resource-Planning-${new Date().getFullYear()}.xlsx`);
  };

  return (
    <Button
      onClick={handleExport}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
    >
      <FileSpreadsheet className="w-4 h-4" />
      Export Excel
    </Button>
  );
}
