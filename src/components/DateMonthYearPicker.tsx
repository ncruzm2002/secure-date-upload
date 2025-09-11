import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface DateMonthYearPickerProps {
  label: string;
  value?: { month: number; year: number };
  onChange: (date: { month: number; year: number }) => void;
  error?: string;
}

const months = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export function DateMonthYearPicker({ label, value, onChange, error }: DateMonthYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleMonthChange = (monthStr: string) => {
    const month = parseInt(monthStr);
    if (value?.year) {
      onChange({ month, year: value.year });
    }
  };

  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr);
    if (value?.month) {
      onChange({ month: value.month, year });
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-foreground font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {label}
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Mes</Label>
          <Select value={value?.month?.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="border-input focus:ring-2 focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Año</Label>
          <Select value={value?.year?.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="border-input focus:ring-2 focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}