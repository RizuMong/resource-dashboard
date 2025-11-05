import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterBar() {
  return (
    <div className="flex gap-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Person" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Rizki Haddi</SelectItem>
          <SelectItem value="2">Faris</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Lexus</SelectItem>
          <SelectItem value="2">BPJS</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Sprint" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">SPRINT 23 - 2025</SelectItem>
          <SelectItem value="2">SPRINT 23 - 2025</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2025">2025</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
