// ABOUTME: Card component for displaying individual ArXiv paper details
// ABOUTME: Shows title, authors, date, and abstract with select functionality

"use client";

import { Paper } from "@/types";
import { FileText } from "lucide-react";

interface PaperCardProps {
  paper: Paper;
  onSelect: (paper: Paper) => void;
  isSelected: boolean;
}

export default function PaperCard({ paper, onSelect, isSelected }: PaperCardProps) {
  const formattedDate = new Date(paper.published).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      onClick={() => onSelect(paper)}
      className={`p-6 border-2 border-black cursor-pointer transition-all hover:shadow-retro ${
        isSelected
          ? "bg-black text-white shadow-retro border-retro-red"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <FileText className={`w-6 h-6 flex-shrink-0 mt-1 ${isSelected ? "text-retro-red" : "text-retro-red"}`} />
        <h3 className="font-semibold text-lg leading-tight">{paper.title}</h3>
      </div>
      <p className={`text-sm mb-2 ${isSelected ? "text-gray-300" : "text-gray-600"}`}>
        <span className="font-medium">Authors:</span> {paper.authors}
      </p>
      <p className={`text-sm mb-3 ${isSelected ? "text-gray-400" : "text-gray-500"}`}>
        <span className="font-medium">Published:</span> {formattedDate}
      </p>
      <p className={`text-sm line-clamp-4 ${isSelected ? "text-gray-200" : "text-gray-700"}`}>{paper.summary}</p>
    </div>
  );
}
