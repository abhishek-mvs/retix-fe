import type React from "react";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FilterBar() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-green-700 text-white hover:bg-green-800 border-none"
      >
        <MapPin className="h-4 w-4" />
        <span>Use my location</span>
      </Button>

      <FilterButton text="Mumbai">
        <MapPin className="h-4 w-4" />
      </FilterButton>

      <FilterButton text="All dates">
        <Calendar className="h-4 w-4" />
      </FilterButton>

      <div className="flex-grow"></div>

      <CategoryButton text="All types" active={true} />
      <CategoryButton text="Sports" active={false} />
      <CategoryButton text="Concerts" active={false} />
      <CategoryButton text="Theater & Comedy" active={false} />
    </div>
  );
}

function FilterButton({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 border-gray-300"
    >
      {children}
      <span>{text}</span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
}

function CategoryButton({ text, active }: { text: string; active: boolean }) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      className={`rounded-full px-4 ${
        active
          ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
          : "border-gray-300"
      }`}
    >
      {text}
    </Button>
  );
}
