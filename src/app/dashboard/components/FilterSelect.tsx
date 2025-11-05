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

interface FilterSelectProps {
  label: string;
  mockData: { id: string; name: string }[];
  onChange?: (value: { id: string; name: string } | null) => void;
}

export function FilterSelect({ label, mockData, onChange }: FilterSelectProps) {
  const [selected, setSelected] = React.useState<string>("");

  const handleSelect = (value: string) => {
    setSelected(value);
    const item = mockData.find((opt) => opt.id === value) || null;
    if (onChange) onChange(item);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected("");
    if (onChange) onChange(null);
  };

  return (
    <div className="relative">
      <Select value={selected} onValueChange={handleSelect}>
        <SelectTrigger
          className={`w-[200px] bg-white  text-gray-500 flex items-center justify-between ${
            selected ? "font-medium" : "text-gray-200"
          }`}
        >
          {/* ✅ tampilkan value / placeholder */}
          <SelectValue placeholder={label} />

          {/* ❌ tombol clear — tidak menumpuk dropdown */}
          {selected && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-8 text-gray-400 transition-colors pointer-events-auto"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </SelectTrigger>

        <SelectContent>
          {mockData.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
