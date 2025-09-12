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
  minDate?: { month: number; year: number };
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

export function DateMonthYearPicker({ label, value, onChange, error, minDate }: DateMonthYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const isYearDisabled = (year: number) => {
    if (!minDate) return false;
    return year < minDate.year;
  };

  const isMonthDisabled = (month: number) => {
    if (!minDate || !value?.year) return false;
    if (value.year > minDate.year) return false;
    if (value.year < minDate.year) return true;
    return month < minDate.month;
  };

  const getAvailableYears = () => {
    if (!minDate) return years;
    return years.filter(year => year >= minDate.year);
  };

  const getAvailableMonths = () => {
    if (!minDate || !value?.year) return months;
    if (value.year > minDate.year) return months;
    if (value.year < minDate.year) return [];
    return months.filter(month => month.value >= minDate.month);
  };

  const handleMonthChange = (monthStr: string) => {
    const month = parseInt(monthStr);
    if (value?.year && !isMonthDisabled(month)) {
      onChange({ month, year: value.year });
    }
  };

  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr);
    if (!isYearDisabled(year)) {
      // Si cambiamos el año, verificar si el mes actual sigue siendo válido
      if (value?.month && !isMonthDisabled(value.month)) {
        onChange({ month: value.month, year });
      } else {
        // Si el mes no es válido, seleccionar el primer mes disponible
        const availableMonths = months.filter(m => {
          if (!minDate) return true;
          if (year > minDate.year) return true;
          if (year < minDate.year) return false;
          return m.value >= minDate.month;
        });
        if (availableMonths.length > 0) {
          onChange({ month: availableMonths[0].value, year });
        }
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-foreground font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4 text-accent-foreground animate-pulse" />
        {label}
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Mes</Label>
          <Select value={value?.month?.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="border-border/50 bg-gradient-card focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:shadow-soft backdrop-blur-sm">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-card backdrop-blur-lg border-border/50">
              {getAvailableMonths().map((month) => (
                <SelectItem 
                  key={month.value} 
                  value={month.value.toString()}
                  className="hover:bg-accent/20 focus:bg-accent/30 transition-colors"
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Año</Label>
          <Select value={value?.year?.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="border-border/50 bg-gradient-card focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:shadow-soft backdrop-blur-sm">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-card backdrop-blur-lg border-border/50">
              {getAvailableYears().map((year) => (
                <SelectItem 
                  key={year} 
                  value={year.toString()}
                  className="hover:bg-accent/20 focus:bg-accent/30 transition-colors"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {error && <p className="text-sm text-destructive flex items-center gap-2 animate-pulse">
        <Calendar className="w-3 h-3" />
        {error}
      </p>}
      {minDate && (
        <p className="text-xs text-muted-foreground">
          * La fecha debe ser posterior a {months.find(m => m.value === minDate.month)?.label} {minDate.year}
        </p>
      )}
    </div>
  );
}