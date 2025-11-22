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
      className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-300 hover:border-blue-400"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <h3 className="font-semibold text-lg leading-tight">{paper.title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Authors:</span> {paper.authors}
      </p>
      <p className="text-sm text-gray-500 mb-3">
        <span className="font-medium">Published:</span> {formattedDate}
      </p>
      <p className="text-sm text-gray-700 line-clamp-4">{paper.summary}</p>
    </div>
  );
}
