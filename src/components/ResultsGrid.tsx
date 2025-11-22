// ABOUTME: Grid container component for displaying search results
// ABOUTME: Renders multiple PaperCard components in responsive layout

"use client";

import { Paper } from "@/types";
import PaperCard from "./PaperCard";

interface ResultsGridProps {
  papers: Paper[];
  selectedPaper: Paper | null;
  onSelectPaper: (paper: Paper) => void;
}

export default function ResultsGrid({
  papers,
  selectedPaper,
  onSelectPaper,
}: ResultsGridProps) {
  if (papers.length === 0) return null;

  return (
    <div className="w-full mt-4">
      <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b-2 border-black pb-1 inline-block">
        Select Source Material ({papers.length})
      </h2>
      <div className="flex flex-col gap-3">
        {papers.map((paper, index) => (
          <PaperCard
            key={`${paper.link}-${index}`}
            paper={paper}
            onSelect={onSelectPaper}
            isSelected={selectedPaper?.link === paper.link}
          />
        ))}
      </div>
    </div>
  );
}
