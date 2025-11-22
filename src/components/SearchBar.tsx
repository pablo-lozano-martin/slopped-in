// ABOUTME: Search input component for entering research topics
// ABOUTME: Handles query submission, loading states, and year filtering

"use client";

import { Search } from "lucide-react";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, yearFilter: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  const yearOptions = [
    { value: "all", label: "All Years" },
    { value: "year", label: "Last Year" },
    { value: "month", label: "Last Month" },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), selectedYear);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a technical topic (e.g., 'Optimizing LLM inference')"
          disabled={isLoading}
          className="retro-input w-full px-6 py-4 pr-14 text-lg disabled:bg-dither disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 border-2 border-black bg-retro-red text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        {yearOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedYear(option.value)}
            disabled={isLoading}
            className={`px-4 py-2 border-2 border-black font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedYear === option.value
                ? "bg-retro-red text-white shadow-retro"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </form>
  );
}
