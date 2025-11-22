// ABOUTME: Search input component for entering research topics
// ABOUTME: Handles query submission, loading states, and year filtering

"use client";

import { Search, ChevronDown } from "lucide-react";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, yearFilter: string) => void;
  onHover?: (text: string | null) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, onHover, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  const yearOptions = [
    { value: "all", label: "All Years", tooltip: "SEARCH ALL TIME" },
    { value: "year", label: "Last Year", tooltip: "SEARCH PAST 12 MONTHS" },
    { value: "month", label: "Last Month", tooltip: "SEARCH PAST 30 DAYS" },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), selectedYear);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onMouseEnter={() => onHover?.("ENTER RESEARCH TOPIC")}
          onMouseLeave={() => onHover?.(null)}
          placeholder="Enter a technical topic (e.g., 'LLM inference')"
          disabled={isLoading}
          className="retro-input w-full px-4 py-2 pr-12 text-base disabled:bg-dither disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          onMouseEnter={() => onHover?.("EXECUTE SEARCH QUERY")}
          onMouseLeave={() => onHover?.(null)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border-2 border-black bg-retro-red text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
      
      <div className="relative w-28 shrink-0">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          onMouseEnter={() => onHover?.("FILTER BY DATE")}
          onMouseLeave={() => onHover?.(null)}
          disabled={isLoading}
          className="w-full h-full appearance-none border-2 border-black bg-white px-3 pr-8 text-sm font-bold uppercase focus:outline-none cursor-pointer disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </form>
  );
}
