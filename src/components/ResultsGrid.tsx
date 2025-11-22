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
    <div className="w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Top 3 Papers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
